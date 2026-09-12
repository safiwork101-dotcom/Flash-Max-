import { NextResponse } from "next/server";
import { createFlashMaxSession, setFlashMaxSessionCookie } from "@/lib/flashmax/auth";
import { flashMaxAuthRequest, flashMaxRest, hasFlashMaxDatabase } from "@/lib/flashmax/supabase";

type CreatedUser = { id?: string; email?: string; user?: { id?: string; email?: string } };

export async function POST(request: Request) {
  if (!hasFlashMaxDatabase()) {
    return NextResponse.json({ error: "Customer accounts are not configured yet." }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase() ?? "";
  const password = body.password ?? "";

  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 8) {
    return NextResponse.json({ error: "Enter a valid email and a password with at least 8 characters." }, { status: 400 });
  }

  try {
    const created = await flashMaxAuthRequest<CreatedUser>("admin/users", {
      email,
      password,
      email_confirm: true,
      user_metadata: { source: "flashmax" },
    });
    const user = created.user ?? created;
    if (!user.id) throw new Error("Account could not be created.");

    await flashMaxRest("flashmax_profiles", {
      method: "POST",
      body: [{ id: user.id, email, role: "customer" }],
      prefer: "resolution=merge-duplicates,return=representation",
      query: "?on_conflict=id",
    });

    const session = await createFlashMaxSession(user.id);
    const response = NextResponse.json({ user: { id: user.id, email, role: "customer" } }, { status: 201 });
    setFlashMaxSessionCookie(response, session);
    return response;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Signup failed." }, { status: 400 });
  }
}
