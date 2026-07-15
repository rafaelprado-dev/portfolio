import "server-only";

import { createHmac } from "node:crypto";
import {
  FieldValue,
  Timestamp,
  type DocumentData,
  type Transaction,
} from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { ZodError, type ZodType } from "zod";
import {
  type CommunityMessage,
  type CommunitySnapshot,
  type LeaderboardEntry,
} from "@/lib/community/contracts";
import { normalizeCommunityAvatarId } from "@/lib/community/avatars";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";
import {
  FirebaseRequestVerificationError,
  verifyFirebaseRequest,
} from "@/lib/firebase/verify-request";

const maxRequestBodyBytes = 8_192;

type RateLimitConfig = {
  limit: number;
  windowMs: number;
  minimumIntervalMs: number;
};

export const rateLimits = {
  feedback: {
    limit: 3,
    windowMs: 24 * 60 * 60 * 1_000,
    minimumIntervalMs: 2 * 60 * 1_000,
  },
  snake: {
    limit: 30,
    windowMs: 60 * 60 * 1_000,
    minimumIntervalMs: 2_000,
  },
  doom: {
    limit: 120,
    windowMs: 60 * 60 * 1_000,
    minimumIntervalMs: 10_000,
  },
} satisfies Record<string, RateLimitConfig>;

export class CommunityApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly retryAfterSeconds?: number,
  ) {
    super(message);
    this.name = "CommunityApiError";
  }
}

const getHashSalt = () => {
  const salt = process.env.COMMUNITY_HASH_SALT;

  if (salt) return salt;

  if (process.env.NODE_ENV !== "production") {
    return "rafael-portfolio-local-development";
  }

  throw new Error(
    "Missing required server environment variable: COMMUNITY_HASH_SALT",
  );
};

export const hashCommunityIdentity = (uid: string) =>
  createHmac("sha256", getHashSalt()).update(uid).digest("hex");

const asDate = (value: unknown) => {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;

  return new Date(0);
};

const serializeLeaderboardEntry = (
  id: string,
  data: DocumentData,
  valueField: "bestScore" | "totalSeconds",
): LeaderboardEntry => ({
  id,
  name: typeof data.name === "string" ? data.name : "Visitante",
  value: typeof data[valueField] === "number" ? data[valueField] : 0,
  updatedAt: asDate(data.updatedAt).toISOString(),
});

export async function readCommunitySnapshot(): Promise<CommunitySnapshot> {
  const db = getFirebaseAdminFirestore();
  const [feedbackSnapshot, statsSnapshot, snakeSnapshot, doomSnapshot] =
    await Promise.all([
      db.collection("feedback").where("visible", "==", true).limit(50).get(),
      db.collection("siteStats").doc("global").get(),
      db.collection("snakeScores").orderBy("bestScore", "desc").limit(10).get(),
      db
        .collection("doomPlaytime")
        .orderBy("totalSeconds", "desc")
        .limit(10)
        .get(),
    ]);

  const feedback = feedbackSnapshot.docs
    .map<CommunityMessage>((document) => {
      const data = document.data();

      return {
        id: document.id,
        avatarId: normalizeCommunityAvatarId(data.avatarId, document.id),
        name: typeof data.name === "string" ? data.name : "Visitante",
        message: typeof data.message === "string" ? data.message : "",
        createdAt: asDate(data.createdAt).toISOString(),
        status: "approved",
      };
    })
    .filter((item) => item.message)
    .sort((first, second) => second.createdAt.localeCompare(first.createdAt))
    .slice(0, 12);

  return {
    feedback,
    visitorCount: statsSnapshot.data()?.visitorCount ?? 0,
    snakeLeaderboard: snakeSnapshot.docs.map((document) =>
      serializeLeaderboardEntry(document.id, document.data(), "bestScore"),
    ),
    doomLeaderboard: doomSnapshot.docs.map((document) =>
      serializeLeaderboardEntry(document.id, document.data(), "totalSeconds"),
    ),
  };
}

export async function parseCommunityRequest<T>(
  request: Request,
  schema: ZodType<T>,
): Promise<T> {
  const contentType = request.headers.get("content-type") ?? "";
  const contentLength = Number(request.headers.get("content-length") ?? "0");

  if (!contentType.toLowerCase().startsWith("application/json")) {
    throw new CommunityApiError(415, "Envie os dados em formato JSON");
  }

  if (Number.isFinite(contentLength) && contentLength > maxRequestBodyBytes) {
    throw new CommunityApiError(
      413,
      "A solicitação excede o tamanho permitido",
    );
  }

  const rawBody = await request.text();

  if (new TextEncoder().encode(rawBody).byteLength > maxRequestBodyBytes) {
    throw new CommunityApiError(
      413,
      "A solicitação excede o tamanho permitido",
    );
  }

  let body: unknown;

  try {
    body = JSON.parse(rawBody);
  } catch {
    throw new CommunityApiError(
      400,
      "Não foi possível interpretar a solicitação",
    );
  }

  return schema.parse(body);
}

export async function verifyCommunityMutation(request: Request) {
  const origin = request.headers.get("origin");

  if (origin) {
    let requestOrigin: string;

    try {
      requestOrigin = new URL(origin).origin;
    } catch {
      throw new CommunityApiError(403, "Origem não permitida");
    }

    if (requestOrigin !== new URL(request.url).origin) {
      throw new CommunityApiError(403, "Origem não permitida");
    }
  }

  return verifyFirebaseRequest(request, { consumeAppCheckToken: true });
}

export async function applyRateLimit(
  transaction: Transaction,
  identityHash: string,
  action: keyof typeof rateLimits,
  now: Timestamp,
) {
  const config = rateLimits[action];
  const reference = getFirebaseAdminFirestore()
    .collection("rateLimits")
    .doc(`${action}_${identityHash}`);
  const snapshot = await transaction.get(reference);
  const data = snapshot.data();
  const nowMs = now.toMillis();
  const windowStartedAt = asDate(data?.windowStartedAt).getTime();
  const lastAttemptAt = asDate(data?.lastAttemptAt).getTime();
  const isCurrentWindow = nowMs - windowStartedAt < config.windowMs;
  const attempts =
    isCurrentWindow && typeof data?.attempts === "number" ? data.attempts : 0;

  if (lastAttemptAt > 0 && nowMs - lastAttemptAt < config.minimumIntervalMs) {
    const retryAfterSeconds = Math.ceil(
      (config.minimumIntervalMs - (nowMs - lastAttemptAt)) / 1_000,
    );

    throw new CommunityApiError(
      429,
      "Aguarde um pouco antes de tentar novamente",
      retryAfterSeconds,
    );
  }

  if (attempts >= config.limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((windowStartedAt + config.windowMs - nowMs) / 1_000),
    );

    throw new CommunityApiError(
      429,
      "Limite temporário de solicitações atingido",
      retryAfterSeconds,
    );
  }

  transaction.set(
    reference,
    {
      attempts: attempts + 1,
      lastAttemptAt: now,
      windowStartedAt: isCurrentWindow
        ? Timestamp.fromMillis(windowStartedAt)
        : now,
    },
    { merge: true },
  );
}

export function communityApiErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 },
    );
  }

  if (error instanceof CommunityApiError) {
    const headers = error.retryAfterSeconds
      ? { "Retry-After": String(error.retryAfterSeconds) }
      : undefined;

    return NextResponse.json(
      { error: error.message },
      { status: error.status, headers },
    );
  }

  if (error instanceof FirebaseRequestVerificationError) {
    return NextResponse.json(
      { error: "Solicitação não autorizada" },
      { status: 401 },
    );
  }

  console.error("Community API request failed", error);

  return NextResponse.json(
    { error: "Não foi possível concluir a solicitação" },
    { status: 500 },
  );
}

export const incrementVisitorCount = FieldValue.increment(1);
