import { NextResponse } from "next/server";
import { clearFlashMaxSessionCookie, revokeFlashMaxSession } from "@/lib/flashmax/auth";

export async function POST(request: Request) {
  try {
    await revokeFlashMaxSession(request);
  } catch {
    // The browser cookie must still be cleared if the database session is already gone.
  }

  const response = NextResponse.json({ loggedOut: true });
  clearFlashMaxSessionCookie(response);
  return response;
}
