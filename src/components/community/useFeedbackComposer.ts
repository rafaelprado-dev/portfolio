"use client";

import { useCallback, useState, type FormEvent } from "react";
import { useCommunity } from "@/components/community/CommunityProvider";
import { feedbackInputSchema } from "@/lib/community/contracts";

export type FeedbackComposerStatus =
  | { type: "idle" }
  | { type: "submitting" }
  | { type: "success"; message: string }
  | { type: "error"; message: string };

export function useFeedbackComposer() {
  const {
    changeDisplayAvatar,
    displayAvatarId,
    displayName,
    setDisplayName,
    submitFeedback,
  } = useCommunity();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<FeedbackComposerStatus>({
    type: "idle",
  });

  const appendToMessage = useCallback((value: string) => {
    setMessage((current) =>
      `${current}${current && !current.endsWith(" ") ? " " : ""}${value}`.slice(
        0,
        500,
      ),
    );
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      const parsed = feedbackInputSchema.safeParse({
        avatarId: displayAvatarId,
        name: displayName,
        message,
      });

      if (!parsed.success) {
        setStatus({
          type: "error",
          message:
            parsed.error.issues[0]?.message ?? "Confira os dados informados",
        });
        return;
      }

      setStatus({ type: "submitting" });

      try {
        await submitFeedback(parsed.data);
        setMessage("");
        setStatus({
          type: "success",
          message: "Mensagem enviada para análise e salva neste dispositivo.",
        });
      } catch (error) {
        setStatus({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "Não foi possível enviar a mensagem",
        });
      }
    },
    [displayAvatarId, displayName, message, submitFeedback],
  );

  return {
    appendToMessage,
    changeDisplayAvatar,
    displayAvatarId,
    displayName,
    handleSubmit,
    message,
    setDisplayName,
    setMessage,
    status,
  };
}
