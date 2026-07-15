import { NextResponse } from "next/server";
import {
  communityApiErrorResponse,
  readCommunitySnapshot,
} from "@/lib/community/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const snapshot = await readCommunitySnapshot();

    return NextResponse.json(snapshot, {
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=30, stale-while-revalidate=120",
      },
    });
  } catch (error) {
    return communityApiErrorResponse(error);
  }
}
