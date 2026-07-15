import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import {
  snakeScoreInputSchema,
  type GameSubmissionResult,
} from "@/lib/community/contracts";
import {
  applyRateLimit,
  communityApiErrorResponse,
  hashCommunityIdentity,
  parseCommunityRequest,
  verifyCommunityMutation,
} from "@/lib/community/server";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const [{ uid }, input] = await Promise.all([
      verifyCommunityMutation(request),
      parseCommunityRequest(request, snakeScoreInputSchema),
    ]);
    const db = getFirebaseAdminFirestore();
    const identityHash = hashCommunityIdentity(uid);
    const scoreReference = db.collection("snakeScores").doc(identityHash);
    const now = Timestamp.now();

    const entry = await db.runTransaction(async (transaction) => {
      const scoreSnapshot = await transaction.get(scoreReference);
      await applyRateLimit(transaction, identityHash, "snake", now);
      const currentBest = scoreSnapshot.data()?.bestScore ?? 0;
      const bestScore = Math.max(currentBest, input.score);

      transaction.set(
        scoreReference,
        {
          bestScore,
          name: input.name,
          updatedAt: now,
        },
        { merge: true },
      );

      return {
        id: identityHash,
        name: input.name,
        value: bestScore,
        updatedAt: now.toDate().toISOString(),
      };
    });
    const response: GameSubmissionResult = { entry };

    return NextResponse.json(response, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    return communityApiErrorResponse(error);
  }
}
