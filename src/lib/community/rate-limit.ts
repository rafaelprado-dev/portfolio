export type CommunityMutationAction = "feedback" | "visit" | "snake" | "doom";

export type RateLimitScope = "identity" | "source";

export type RateLimitPolicy = {
  limit: number;
  windowMs: number;
  minimumIntervalMs: number;
};

type MutationRateLimitPolicy = {
  identity?: RateLimitPolicy;
  source: RateLimitPolicy;
};

export const mutationRateLimitPolicies: Record<
  CommunityMutationAction,
  MutationRateLimitPolicy
> = {
  feedback: {
    identity: {
      limit: 3,
      windowMs: 24 * 60 * 60 * 1_000,
      minimumIntervalMs: 2 * 60 * 1_000,
    },
    source: {
      limit: 10,
      windowMs: 24 * 60 * 60 * 1_000,
      minimumIntervalMs: 10_000,
    },
  },
  visit: {
    source: {
      limit: 25,
      windowMs: 24 * 60 * 60 * 1_000,
      minimumIntervalMs: 0,
    },
  },
  snake: {
    identity: {
      limit: 30,
      windowMs: 60 * 60 * 1_000,
      minimumIntervalMs: 2_000,
    },
    source: {
      limit: 120,
      windowMs: 60 * 60 * 1_000,
      minimumIntervalMs: 500,
    },
  },
  doom: {
    identity: {
      limit: 120,
      windowMs: 60 * 60 * 1_000,
      minimumIntervalMs: 10_000,
    },
    source: {
      limit: 240,
      windowMs: 60 * 60 * 1_000,
      minimumIntervalMs: 2_000,
    },
  },
};

export type StoredRateLimitState = {
  attempts?: unknown;
  lastAttemptAtMs?: unknown;
  windowStartedAtMs?: unknown;
};

export type RateLimitState = {
  attempts: number;
  expiresAtMs: number;
  lastAttemptAtMs: number;
  windowStartedAtMs: number;
};

export type RateLimitEvaluation =
  | {
      allowed: true;
      nextState: RateLimitState;
    }
  | {
      allowed: false;
      reason: "minimum-interval" | "window-limit";
      retryAfterSeconds: number;
    };

const asNonNegativeInteger = (value: unknown) =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0
    ? value
    : 0;

export function evaluateRateLimit(
  policy: RateLimitPolicy,
  storedState: StoredRateLimitState,
  nowMs: number,
): RateLimitEvaluation {
  const attempts = asNonNegativeInteger(storedState.attempts);
  const lastAttemptAtMs = asNonNegativeInteger(storedState.lastAttemptAtMs);
  const windowStartedAtMs = asNonNegativeInteger(storedState.windowStartedAtMs);
  const elapsedSinceLastAttempt = Math.max(0, nowMs - lastAttemptAtMs);

  if (
    lastAttemptAtMs > 0 &&
    elapsedSinceLastAttempt < policy.minimumIntervalMs
  ) {
    return {
      allowed: false,
      reason: "minimum-interval",
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((policy.minimumIntervalMs - elapsedSinceLastAttempt) / 1_000),
      ),
    };
  }

  const isCurrentWindow =
    windowStartedAtMs > 0 &&
    nowMs >= windowStartedAtMs &&
    nowMs - windowStartedAtMs < policy.windowMs;
  const currentAttempts = isCurrentWindow ? attempts : 0;

  if (currentAttempts >= policy.limit) {
    return {
      allowed: false,
      reason: "window-limit",
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((windowStartedAtMs + policy.windowMs - nowMs) / 1_000),
      ),
    };
  }

  return {
    allowed: true,
    nextState: {
      attempts: currentAttempts + 1,
      expiresAtMs:
        (isCurrentWindow ? windowStartedAtMs : nowMs) + policy.windowMs,
      lastAttemptAtMs: nowMs,
      windowStartedAtMs: isCurrentWindow ? windowStartedAtMs : nowMs,
    },
  };
}
