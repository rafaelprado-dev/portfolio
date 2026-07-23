import assert from "node:assert/strict";
import { describe, test } from "node:test";
import {
  evaluateRateLimit,
  mutationRateLimitPolicies,
} from "../src/lib/community/rate-limit.ts";
import {
  hashRequestSource,
  resolveRequestSource,
} from "../src/lib/community/request-source.ts";

const minute = 60_000;

describe("community mutation rate limits", () => {
  test("define a source limit for every mutation route", () => {
    assert.deepEqual(Object.keys(mutationRateLimitPolicies).sort(), [
      "contact",
      "doom",
      "feedback",
      "snake",
      "visit",
    ]);

    for (const policy of Object.values(mutationRateLimitPolicies)) {
      assert.ok(policy.source.limit > 0);
      assert.ok(policy.source.windowMs > 0);
    }
  });

  test("protect contact delivery by identity and request source", () => {
    const policy = mutationRateLimitPolicies.contact;

    assert.deepEqual(policy.identity, {
      limit: 3,
      windowMs: 24 * 60 * minute,
      minimumIntervalMs: 2 * minute,
    });
    assert.deepEqual(policy.source, {
      limit: 10,
      windowMs: 24 * 60 * minute,
      minimumIntervalMs: 10_000,
    });
  });

  test("allow the first request and persist the next state", () => {
    const result = evaluateRateLimit(
      mutationRateLimitPolicies.feedback.identity,
      {},
      minute,
    );

    assert.equal(result.allowed, true);
    assert.deepEqual(result.nextState, {
      attempts: 1,
      expiresAtMs:
        minute + mutationRateLimitPolicies.feedback.identity.windowMs,
      lastAttemptAtMs: minute,
      windowStartedAtMs: minute,
    });
  });

  test("throttle a fresh identity when the source interval is still active", () => {
    const policy = mutationRateLimitPolicies.feedback.source;
    const firstRequest = evaluateRateLimit(policy, {}, minute);

    assert.equal(firstRequest.allowed, true);

    const secondRequest = evaluateRateLimit(
      policy,
      firstRequest.nextState,
      minute + 1_000,
    );

    assert.deepEqual(secondRequest, {
      allowed: false,
      reason: "minimum-interval",
      retryAfterSeconds: 9,
    });
  });

  test("return the remaining window when the request limit is reached", () => {
    const policy = {
      limit: 2,
      minimumIntervalMs: 0,
      windowMs: minute,
    };
    const result = evaluateRateLimit(
      policy,
      {
        attempts: 2,
        lastAttemptAtMs: minute + 20_000,
        windowStartedAtMs: minute,
      },
      minute + 30_000,
    );

    assert.deepEqual(result, {
      allowed: false,
      reason: "window-limit",
      retryAfterSeconds: 30,
    });
  });

  test("reset attempts after the rate-limit window expires", () => {
    const policy = {
      limit: 2,
      minimumIntervalMs: 0,
      windowMs: minute,
    };
    const now = 2 * minute;
    const result = evaluateRateLimit(
      policy,
      {
        attempts: 2,
        lastAttemptAtMs: minute,
        windowStartedAtMs: minute,
      },
      now,
    );

    assert.equal(result.allowed, true);
    assert.deepEqual(result.nextState, {
      attempts: 1,
      expiresAtMs: now + minute,
      lastAttemptAtMs: now,
      windowStartedAtMs: now,
    });
  });

  test("preserve the expiration of an active window", () => {
    const policy = {
      limit: 3,
      minimumIntervalMs: 0,
      windowMs: minute,
    };
    const windowStartedAtMs = minute;
    const result = evaluateRateLimit(
      policy,
      {
        attempts: 1,
        lastAttemptAtMs: minute + 5_000,
        windowStartedAtMs,
      },
      minute + 30_000,
    );

    assert.equal(result.allowed, true);
    assert.equal(
      result.nextState.expiresAtMs,
      windowStartedAtMs + policy.windowMs,
    );
  });
});

describe("community request source", () => {
  test("prefer the Vercel-provided address over forwarded fallbacks", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.20",
      "x-vercel-forwarded-for": "2001:db8::1",
    });

    assert.equal(resolveRequestSource(headers), "2001:db8::1");
  });

  test("reject a missing production source and allow a local fallback", () => {
    const headers = new Headers();

    assert.equal(resolveRequestSource(headers), null);
    assert.equal(resolveRequestSource(headers, true), "local-development");
  });

  test("hash the source without retaining the raw address", () => {
    const address = "203.0.113.10";
    const feedbackHash = hashRequestSource(address, "feedback", "test-salt");
    const visitHash = hashRequestSource(address, "visit", "test-salt");

    assert.equal(feedbackHash.length, 64);
    assert.equal(feedbackHash.includes(address), false);
    assert.notEqual(feedbackHash, visitHash);
    assert.equal(
      feedbackHash,
      hashRequestSource(address, "feedback", "test-salt"),
    );
  });
});
