import crypto from "node:crypto";
import type { NextResponse } from "next/server";
import { flashMaxRest } from "@/lib/flashmax/supabase";

const sessionCookie = "flashmax_session";
const sessionDays = 30;

export type FlashMaxUser = {
  id: string;
  email: string;
  role: "customer" | "admin";
};

type SessionRow = {
  user_id: string;
  expires_at: string;
};

export async function createFlashMaxSession(userId: string) {
  const token = crypto.randomBytes(32).toString("base64url");
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + sessionDays * 86_400_000).toISOString();

  await flashMaxRest("flashmax_sessions", {
    method: "POST",
    body: [{ user_id: userId, token_hash: tokenHash, expires_at: expiresAt }],
  });

  return { token, expiresAt };
}

export function setFlashMaxSessionCookie(
  response: NextResponse,
  session: { token: string; expiresAt: string },
) {
  response.cookies.set(sessionCookie, session.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(session.expiresAt),
  });
}

export function clearFlashMaxSessionCookie(response: NextResponse) {
  response.cookies.set(sessionCookie, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
  });
}

export async function getFlashMaxUser(request: Request): Promise<FlashMaxUser | null> {
  const token = readCookie(request, sessionCookie);
  if (!token) return null;

  const sessions = await flashMaxRest<SessionRow[]>("flashmax_sessions", {
    query: `?select=user_id,expires_at&token_hash=eq.${encodeURIComponent(hashSessionToken(token))}&expires_at=gt.${encodeURIComponent(new Date().toISOString())}&limit=1`,
  });
  const session = sessions[0];
  if (!session) return null;

  const profiles = await flashMaxRest<FlashMaxUser[]>("flashmax_profiles", {
    query: `?select=id,email,role&id=eq.${encodeURIComponent(session.user_id)}&limit=1`,
  });

  return profiles[0] ?? null;
}

export async function requireFlashMaxUser(request: Request) {
  const user = await getFlashMaxUser(request);
  if (!user) throw new Error("Login required.");
  return user;
}

export async function revokeFlashMaxSession(request: Request) {
  const token = readCookie(request, sessionCookie);
  if (!token) return;

  await flashMaxRest("flashmax_sessions", {
    method: "DELETE",
    query: `?token_hash=eq.${encodeURIComponent(hashSessionToken(token))}`,
    prefer: "return=minimal",
  });
}

export function isFlashMaxAdmin(request: Request) {
  const configured = process.env.FLASHMAX_ADMIN_KEY ?? process.env.REVIEWS_ADMIN_KEY;
  const provided = request.headers.get("x-admin-key") ?? "";
  if (!configured || !provided) return false;

  const configuredBuffer = Buffer.from(configured);
  const providedBuffer = Buffer.from(provided);
  return configuredBuffer.length === providedBuffer.length && crypto.timingSafeEqual(configuredBuffer, providedBuffer);
}

function hashSessionToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function readCookie(request: Request, name: string) {
  const cookie = request.headers.get("cookie") ?? "";
  for (const item of cookie.split(";")) {
    const [key, ...value] = item.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return null;
}
