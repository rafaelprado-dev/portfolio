import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { contactInputSchema } from "../src/lib/contact/contracts.ts";
import {
  contactDailyQuotaLimit,
  contactQuotaWindowMs,
  parseResendDailyQuota,
  readContactQuota,
  reserveContactQuota,
} from "../src/lib/contact/quota.ts";

const validContact = {
  name: "Rayssa",
  email: "rayssa@empresa.com",
  subject: "Padronização das validações do formulário de contato",
  message:
    "Olá, gostaria de sugerir a padronização das validações do formulário de contato para melhorar a experiência do usuário e a consistência do sistema.",
};

describe("contact form validation", () => {
  test("normalize valid contact data", () => {
    const result = contactInputSchema.parse({
      ...validContact,
      name: "  Rayssa  ",
      email: "  rayssa@empresa.com  ",
      message:
        "Olá, gostaria de sugerir a padronização das validações\r\n\r\n\r\ndo formulário de contato para melhorar a experiência do usuário e a consistência do sistema.",
    });

    assert.deepEqual(result, {
      ...validContact,
      message:
        "Olá, gostaria de sugerir a padronização das validações\n\ndo formulário de contato para melhorar a experiência do usuário e a consistência do sistema.",
    });
  });

  test("reject invalid email and short messages", () => {
    const result = contactInputSchema.safeParse({
      ...validContact,
      email: "email-invalido",
      message: "Muito curta",
    });

    assert.equal(result.success, false);
    assert.deepEqual(result.error.issues.map((issue) => issue.path[0]).sort(), [
      "email",
      "message",
    ]);
  });

  test("reject control characters in header-like fields", () => {
    const result = contactInputSchema.safeParse({
      ...validContact,
      subject: "Projeto\nBcc: terceiro@exemplo.com",
    });

    assert.equal(result.success, false);
    assert.equal(result.error.issues[0]?.path[0], "subject");
  });
});

describe("contact delivery quota", () => {
  const nowMs = Date.UTC(2026, 6, 22, 12);

  test("disable the channel after reserving the last daily delivery", () => {
    const result = reserveContactQuota(
      {
        attempts: contactDailyQuotaLimit - 1,
        windowStartedAtMs: nowMs - 60_000,
      },
      nowMs,
    );

    assert.equal(result?.used, contactDailyQuotaLimit);
    assert.equal(result?.available, false);
  });

  test("reject reservations while the daily quota is exhausted", () => {
    const result = reserveContactQuota(
      {
        attempts: contactDailyQuotaLimit,
        windowStartedAtMs: nowMs - 60_000,
      },
      nowMs,
    );

    assert.equal(result, null);
  });

  test("restore availability after the quota window expires", () => {
    const result = readContactQuota(
      {
        attempts: contactDailyQuotaLimit,
        windowStartedAtMs: nowMs - contactQuotaWindowMs,
      },
      nowMs,
    );

    assert.equal(result.available, true);
    assert.equal(result.used, 0);
  });

  test("read provider usage from the Resend quota header", () => {
    assert.equal(parseResendDailyQuota("87"), 87);
    assert.equal(parseResendDailyQuota("87/100"), 87);
    assert.equal(parseResendDailyQuota("invalid"), null);
  });
});
