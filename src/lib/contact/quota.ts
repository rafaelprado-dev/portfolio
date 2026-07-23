export const contactDailyQuotaLimit = 100;
export const contactQuotaWindowMs = 24 * 60 * 60 * 1_000;

export type ContactQuotaState = {
  attempts?: unknown;
  windowStartedAtMs?: unknown;
};

export type ContactQuotaSnapshot = {
  available: boolean;
  resetsAtMs: number | null;
  used: number;
  windowStartedAtMs: number;
};

const asNonNegativeInteger = (value: unknown) =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0
    ? value
    : 0;

export function readContactQuota(
  state: ContactQuotaState,
  nowMs: number,
): ContactQuotaSnapshot {
  const attempts = asNonNegativeInteger(state.attempts);
  const windowStartedAtMs = asNonNegativeInteger(state.windowStartedAtMs);
  const hasActiveWindow =
    windowStartedAtMs > 0 &&
    nowMs >= windowStartedAtMs &&
    nowMs - windowStartedAtMs < contactQuotaWindowMs;
  const used = hasActiveWindow ? attempts : 0;

  return {
    available: used < contactDailyQuotaLimit,
    resetsAtMs: hasActiveWindow
      ? windowStartedAtMs + contactQuotaWindowMs
      : null,
    used,
    windowStartedAtMs: hasActiveWindow ? windowStartedAtMs : nowMs,
  };
}

export function reserveContactQuota(state: ContactQuotaState, nowMs: number) {
  const current = readContactQuota(state, nowMs);

  if (!current.available) return null;

  const used = current.used + 1;

  return {
    available: used < contactDailyQuotaLimit,
    resetsAtMs: current.windowStartedAtMs + contactQuotaWindowMs,
    used,
    windowStartedAtMs: current.windowStartedAtMs,
  } satisfies ContactQuotaSnapshot;
}

export function parseResendDailyQuota(value: string | null) {
  if (!value) return null;

  const match = value.match(/\d+/);
  const used = match ? Number.parseInt(match[0], 10) : Number.NaN;

  return Number.isSafeInteger(used) && used >= 0 ? used : null;
}
