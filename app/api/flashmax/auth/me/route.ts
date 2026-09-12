import { NextResponse } from "next/server";
import { getFlashMaxUser } from "@/lib/flashmax/auth";
import { hasFlashMaxDatabase } from "@/lib/flashmax/supabase";

export async function GET(request: Request) {
  if (!hasFlashMaxDatabase()) {
    return NextResponse.json({ error: "Customer accounts are not configured yet." }, { status: 503 });
  }

  try {
    const user = await getFlashMaxUser(request);
    if (!user) return NextResponse.json({ error: "Login required." }, { status: 401 });
    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Login required." }, { status: 401 });
  }
}
