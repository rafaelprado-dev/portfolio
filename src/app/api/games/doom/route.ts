import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import {
  doomPlaytimeInputSchema,
  type GameSubmissionResult,
} from "@/lib/community/contracts";
import {
  applyMutationRateLimits,
  communityApiErrorResponse,
  hashCommunityIdentity,
  parseCommunityRequest,
  verifyCommunityMutation,
} from "@/lib/community/server";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const [{ sourceHash, uid }, input] = await Promise.all([
      verifyCommunityMutation(request, "doom"),
      parseCommunityRequest(request, doomPlaytimeInputSchema),
    ]);
    const db = getFirebaseAdminFirestore();
    const identityHash = hashCommunityIdentity(uid);
    const playtimeReference = db.collection("doomPlaytime").doc(identityHash);
    const now = Timestamp.now();

    const entry = await db.runTransaction(async (transaction) => {
      const playtimeSnapshot = await transaction.get(playtimeReference);
      await applyMutationRateLimits(
        transaction,
        "doom",
        now,
        sourceHash,
        identityHash,
      );
      const currentData = playtimeSnapshot.data();
      const currentTotal = currentData?.totalSeconds ?? 0;
      const previousReportAt =
        currentData?.lastReportedAt instanceof Timestamp
          ? currentData.lastReportedAt
          : null;
      const elapsedSinceReport = previousReportAt
        ? Math.max(
            0,
            Math.floor((now.toMillis() - previousReportAt.toMillis()) / 1_000),
          )
        : 30;
      const creditedSeconds = Math.min(
        input.seconds,
        elapsedSinceReport + 5,
        60,
      );
      const totalSeconds = currentTotal + creditedSeconds;

      transaction.set(
        playtimeReference,
        {
          lastReportedAt: now,
          name: input.name,
          totalSeconds,
          updatedAt: now,
        },
        { merge: true },
      );

      return {
        id: identityHash,
        name: input.name,
        value: totalSeconds,
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
