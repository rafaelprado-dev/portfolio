import { NextResponse } from "next/server";
import {
  communityApiErrorResponse,
  readCommunitySnapshot,
} from "@/lib/community/server";
import { verifyFirebaseRequest } from "@/lib/firebase/verify-request";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    await verifyFirebaseRequest(request);
    const snapshot = await readCommunitySnapshot();

    return NextResponse.json(snapshot, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch (error) {
    return communityApiErrorResponse(error);
  }
}
