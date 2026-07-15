import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import {
  communityApiErrorResponse,
  hashCommunityIdentity,
  incrementVisitorCount,
  verifyCommunityMutation,
} from "@/lib/community/server";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { uid } = await verifyCommunityMutation(request);
    const identityHash = hashCommunityIdentity(uid);
    const db = getFirebaseAdminFirestore();
    const visitorReference = db.collection("visitors").doc(identityHash);
    const statsReference = db.collection("siteStats").doc("global");
    const now = Timestamp.now();

    const visitorCount = await db.runTransaction(async (transaction) => {
      const [visitorSnapshot, statsSnapshot] = await Promise.all([
        transaction.get(visitorReference),
        transaction.get(statsReference),
      ]);
      const currentCount = statsSnapshot.data()?.visitorCount ?? 0;

      if (visitorSnapshot.exists) {
        transaction.set(visitorReference, { lastSeenAt: now }, { merge: true });
        return currentCount;
      }

      transaction.create(visitorReference, {
        firstSeenAt: now,
        lastSeenAt: now,
      });
      transaction.set(
        statsReference,
        {
          visitorCount: incrementVisitorCount,
          updatedAt: now,
        },
        { merge: true },
      );

      return currentCount + 1;
    });

    return NextResponse.json(
      { visitorCount },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    return communityApiErrorResponse(error);
  }
}
