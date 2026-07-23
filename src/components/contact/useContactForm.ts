"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  contactInputSchema,
  type ContactField,
  type ContactInput,
} from "@/lib/contact/contracts";
import { createFirebaseRequestHeaders } from "@/lib/firebase/client";

export type ContactFormStatus =
  | { type: "idle" }
  | { type: "submitting"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export type ContactChannelStatus = {
  state: "checking" | "available" | "unavailable";
  message: string;
};

type ContactApiPayload = {
  available?: unknown;
  error?: unknown;
  message?: unknown;
};

class ContactRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ContactRequestError";
  }
}

const initialValues: ContactInput = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const readResponsePayload = async (response: Response) =>
  (await response.json().catch(() => null)) as ContactApiPayload | null;

const readResponseMessage = (
  response: Response,
  payload: ContactApiPayload | null,
) => {
  const message = response.ok ? payload?.message : payload?.error;

  return typeof message === "string" ? message : null;
};

const sendContactMessage = async (input: ContactInput) => {
  const firebaseHeaders = await createFirebaseRequestHeaders({
    limitedUseAppCheckToken: true,
  });
  const headers = new Headers();

  for (const [name, value] of Object.entries(firebaseHeaders)) {
    if (value) headers.set(name, value);
  }

  headers.set("Content-Type", "application/json");

  const response = await fetch("/api/contact", {
    method: "POST",
    headers,
    body: JSON.stringify(input),
    cache: "no-store",
  });
  const payload = await readResponsePayload(response);
  const message = readResponseMessage(response, payload);

  if (!response.ok) {
    throw new ContactRequestError(
      message ?? "Não foi possível enviar a mensagem",
      response.status,
    );
  }

  return {
    available: payload?.available !== false,
    message: message ?? "Mensagem enviada com sucesso.",
  };
};

export function useContactForm() {
  const [values, setValues] = useState<ContactInput>(initialValues);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<ContactField, string>>
  >({});
  const [status, setStatus] = useState<ContactFormStatus>({ type: "idle" });
  const [channelStatus, setChannelStatus] = useState<ContactChannelStatus>({
    state: "checking",
    message: "Verificando disponibilidade...",
  });

  useEffect(() => {
    const controller = new AbortController();

    async function checkAvailability() {
      try {
        const response = await fetch("/api/contact", {
          cache: "no-store",
          signal: controller.signal,
        });
        const payload = await readResponsePayload(response);

        if (!response.ok) {
          setChannelStatus({
            state: "unavailable",
            message: "Canal temporariamente indisponível",
          });
          return;
        }

        if (payload?.available !== true) {
          setChannelStatus({
            state: "unavailable",
            message: "Limite diário atingido. Tente novamente amanhã.",
          });
          return;
        }

        setChannelStatus({
          state: "available",
          message: "Resposta pelo e-mail informado",
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;

        setChannelStatus({
          state: "unavailable",
          message: "Canal temporariamente indisponível",
        });
      }
    }

    void checkAvailability();

    return () => controller.abort();
  }, []);

  const setField = useCallback((field: ContactField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;

      const next = { ...current };
      delete next[field];
      return next;
    });
    setStatus((current) =>
      current.type === "submitting" ? current : { type: "idle" },
    );
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (channelStatus.state !== "available") return;

      const parsed = contactInputSchema.safeParse(values);

      if (!parsed.success) {
        const nextErrors: Partial<Record<ContactField, string>> = {};

        for (const issue of parsed.error.issues) {
          const field = issue.path[0];

          if (
            typeof field === "string" &&
            field in initialValues &&
            !nextErrors[field as ContactField]
          ) {
            nextErrors[field as ContactField] = issue.message;
          }
        }

        setFieldErrors(nextErrors);
        setStatus({
          type: "error",
          message: "Confira os campos destacados antes de enviar.",
        });
        return;
      }

      setFieldErrors({});
      setStatus({ type: "submitting", message: "Enviando mensagem..." });

      try {
        const result = await sendContactMessage(parsed.data);

        setValues((current) => ({
          ...current,
          subject: "",
          message: "",
        }));
        setStatus({ type: "success", message: result.message });

        if (!result.available) {
          setChannelStatus({
            state: "unavailable",
            message: "Limite diário atingido. Tente novamente amanhã.",
          });
        }
      } catch (error) {
        if (error instanceof ContactRequestError && error.status === 503) {
          setChannelStatus({
            state: "unavailable",
            message: error.message,
          });
        }

        setStatus({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Não foi possível enviar a mensagem",
        });
      }
    },
    [channelStatus.state, values],
  );

  return {
    channelStatus,
    fieldErrors,
    handleSubmit,
    setField,
    status,
    values,
  };
}
