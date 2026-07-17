import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import {
  feedbackInputSchema,
  type CommunityMessage,
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
      verifyCommunityMutation(request, "feedback"),
      parseCommunityRequest(request, feedbackInputSchema),
    ]);
    const db = getFirebaseAdminFirestore();
    const identityHash = hashCommunityIdentity(uid);
    const feedbackReference = db.collection("feedback").doc();
    const now = Timestamp.now();

    await db.runTransaction(async (transaction) => {
      await applyMutationRateLimits(
        transaction,
        "feedback",
        now,
        sourceHash,
        identityHash,
      );
      transaction.create(feedbackReference, {
        authorIdHash: identityHash,
        avatarId: input.avatarId,
        createdAt: now,
        message: input.message,
        name: input.name,
        visible: false,
      });
    });

    const feedback: CommunityMessage = {
      id: feedbackReference.id,
      avatarId: input.avatarId,
      name: input.name,
      message: input.message,
      createdAt: now.toDate().toISOString(),
      status: "pending",
    };

    return NextResponse.json(
      { feedback },
      { status: 201, headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    return communityApiErrorResponse(error);
  }
}
