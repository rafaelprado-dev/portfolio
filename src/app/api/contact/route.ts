import { Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import {
  markContactCapacityUnavailable,
  readContactCapacity,
  releaseContactCapacity,
  reserveContactCapacity,
  synchronizeContactCapacity,
} from "@/lib/contact/capacity";
import { contactInputSchema } from "@/lib/contact/contracts";
import {
  ContactDeliveryError,
  createContactIdempotencyKey,
  deliverContactMessage,
  isContactDeliveryConfigured,
} from "@/lib/contact/delivery";
import {
  applyMutationRateLimits,
  CommunityApiError,
  communityApiErrorResponse,
  hashCommunityIdentity,
  parseCommunityRequest,
  verifyCommunityMutation,
} from "@/lib/community/server";
import { getFirebaseAdminFirestore } from "@/lib/firebase/admin";

export const runtime = "nodejs";

export async function GET() {
  try {
    const capacity = isContactDeliveryConfigured()
      ? await readContactCapacity()
      : { available: false };

    return NextResponse.json(capacity, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    console.error("Contact availability check failed", error);

    return NextResponse.json(
      { available: false },
      { status: 503, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}

export async function POST(request: Request) {
  try {
    const [{ sourceHash, uid }, input] = await Promise.all([
      verifyCommunityMutation(request, "contact"),
      parseCommunityRequest(request, contactInputSchema),
    ]);
    const identityHash = hashCommunityIdentity(uid);
    const now = Timestamp.now();

    if (!isContactDeliveryConfigured()) {
      throw new CommunityApiError(
        503,
        "O canal de contato está temporariamente indisponível",
      );
    }

    const currentCapacity = await readContactCapacity();

    if (!currentCapacity.available) {
      throw new CommunityApiError(
        503,
        "O limite diário de mensagens foi atingido. Tente novamente amanhã.",
      );
    }

    await getFirebaseAdminFirestore().runTransaction(async (transaction) => {
      await applyMutationRateLimits(
        transaction,
        "contact",
        now,
        sourceHash,
        identityHash,
      );
    });

    const reservation = await reserveContactCapacity();

    if (!reservation.available) {
      throw new CommunityApiError(
        503,
        "O limite diário de mensagens foi atingido. Tente novamente amanhã.",
      );
    }

    try {
      const delivery = await deliverContactMessage(
        input,
        createContactIdempotencyKey(uid, input),
      );
      const capacity = await synchronizeContactCapacity(
        delivery.dailyQuotaUsed,
      ).catch(() => ({ available: reservation.availableAfter ?? true }));

      return NextResponse.json(
        {
          available: capacity.available,
          message: "Mensagem enviada. Responderei pelo e-mail informado.",
        },
        { status: 201, headers: { "Cache-Control": "private, no-store" } },
      );
    } catch (error) {
      if (error instanceof ContactDeliveryError) {
        if (error.reason === "quota") {
          await markContactCapacityUnavailable().catch(() => undefined);

          throw new CommunityApiError(
            503,
            "O limite diário de mensagens foi atingido. Tente novamente amanhã.",
          );
        }

        await releaseContactCapacity().catch(() => undefined);

        throw new CommunityApiError(
          503,
          "O canal de contato está temporariamente indisponível",
        );
      }

      throw error;
    }
  } catch (error) {
    return communityApiErrorResponse(error);
  }
}
