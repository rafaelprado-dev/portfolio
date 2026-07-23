import "server-only";

import { createHash } from "node:crypto";
import type { ContactInput } from "@/lib/contact/contracts";
import { parseResendDailyQuota } from "@/lib/contact/quota";

const resendEndpoint = "https://api.resend.com/emails";

export class ContactDeliveryError extends Error {
  constructor(readonly reason: "quota" | "temporary" = "temporary") {
    super("Contact delivery failed");
    this.name = "ContactDeliveryError";
  }
}

const requireServerEnvironmentVariable = (name: string) => {
  const value = process.env[name]?.trim();

  if (!value || /[\r\n]/.test(value)) {
    throw new Error(`Missing or invalid server environment variable: ${name}`);
  }

  return value;
};

export const isContactDeliveryConfigured = () => {
  if (process.env.NODE_ENV !== "production") return true;

  return [
    "RESEND_API_KEY",
    "CONTACT_FROM_EMAIL",
    "CONTACT_DESTINATION_EMAIL",
  ].every((name) => {
    const value = process.env[name]?.trim();

    return Boolean(value && !/[\r\n]/.test(value));
  });
};

export const createContactIdempotencyKey = (
  uid: string,
  input: ContactInput,
) => {
  const digest = createHash("sha256")
    .update(uid)
    .update("\0")
    .update(JSON.stringify(input))
    .digest("hex");

  return `portfolio-contact/${digest}`;
};

const createContactEmailText = (input: ContactInput) =>
  [
    "Nova mensagem enviada pelo portfólio.",
    "",
    `Nome: ${input.name}`,
    `E-mail para resposta: ${input.email}`,
    `Assunto: ${input.subject}`,
    "",
    "Mensagem:",
    input.message,
  ].join("\n");

export async function deliverContactMessage(
  input: ContactInput,
  idempotencyKey: string,
) {
  if (process.env.NODE_ENV !== "production") {
    return { dailyQuotaUsed: null };
  }

  const apiKey = requireServerEnvironmentVariable("RESEND_API_KEY");
  const from = requireServerEnvironmentVariable("CONTACT_FROM_EMAIL");
  const destination = requireServerEnvironmentVariable(
    "CONTACT_DESTINATION_EMAIL",
  );

  let response: Response;

  try {
    response = await fetch(resendEndpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": idempotencyKey,
        "User-Agent": "rafaelprado.dev/1.0",
      },
      body: JSON.stringify({
        from,
        to: [destination],
        reply_to: input.email,
        subject: `[Portfólio] ${input.subject}`,
        text: createContactEmailText(input),
      }),
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    throw new ContactDeliveryError();
  }

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      name?: unknown;
    } | null;
    const isQuotaError =
      response.status === 429 &&
      (payload?.name === "daily_quota_exceeded" ||
        payload?.name === "monthly_quota_exceeded");

    throw new ContactDeliveryError(isQuotaError ? "quota" : "temporary");
  }

  return {
    dailyQuotaUsed: parseResendDailyQuota(
      response.headers.get("x-resend-daily-quota"),
    ),
  };
}
