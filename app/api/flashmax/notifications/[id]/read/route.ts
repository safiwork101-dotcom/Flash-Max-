import { NextResponse } from "next/server";
import { requireFlashMaxUser } from "@/lib/flashmax/auth";
import { flashMaxRest } from "@/lib/flashmax/supabase";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireFlashMaxUser(request);
    const { id } = await context.params;
    await flashMaxRest("flashmax_notifications", {
      method: "PATCH",
      query: `?id=eq.${encodeURIComponent(id)}&user_id=eq.${encodeURIComponent(user.id)}&available_at=lte.${encodeURIComponent(new Date().toISOString())}`,
      body: { read_at: new Date().toISOString(), updated_at: new Date().toISOString() },
      prefer: "return=minimal",
    });
    return NextResponse.json({ read: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Notification could not be updated.";
    return NextResponse.json({ error: message }, { status: message === "Login required." ? 401 : 500 });
  }
}
