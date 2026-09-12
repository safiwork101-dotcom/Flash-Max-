import { NextResponse } from "next/server";
import { createFlashMaxSession, setFlashMaxSessionCookie } from "@/lib/flashmax/auth";
import { flashMaxAuthRequest, flashMaxRest, hasFlashMaxDatabase } from "@/lib/flashmax/supabase";

type AuthSession = { user?: { id?: string; email?: string } };

export async function POST(request: Request) {
  if (!hasFlashMaxDatabase()) {
    return NextResponse.json({ error: "Customer accounts are not configured yet." }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  try {
    const auth = await flashMaxAuthRequest<AuthSession>("token?grant_type=password", { email, password });
    if (!auth.user?.id) throw new Error("Invalid email or password.");

    let profiles = await flashMaxRest<Array<{ id: string; email: string; role: "customer" | "admin" }>>("flashmax_profiles", {
      query: `?select=id,email,role&id=eq.${encodeURIComponent(auth.user.id)}&limit=1`,
    });
    if (!profiles[0]) {
      profiles = await flashMaxRest("flashmax_profiles", {
        method: "POST",
        body: [{ id: auth.user.id, email: auth.user.email ?? email, role: "customer" }],
      });
    }
    const user = profiles[0];
    const session = await createFlashMaxSession(auth.user.id);
    const response = NextResponse.json({ user });
    setFlashMaxSessionCookie(response, session);
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Login failed." }, { status: 401 });
  }
}
