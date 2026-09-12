import { NextResponse } from "next/server";
import { requireFlashMaxUser } from "@/lib/flashmax/auth";
import type { FlashMaxOrder } from "@/lib/flashmax/payments";
import { flashMaxRest } from "@/lib/flashmax/supabase";

export type FlashMaxNotification = {
  id: string;
  order_id: string;
  kind: string;
  title: string;
  message: string;
  action_label: string | null;
  action_url: string | null;
  available_at: string;
  read_at: string | null;
  created_at: string;
};

export async function GET(request: Request) {
  try {
    const user = await requireFlashMaxUser(request);
    const [orders, notifications] = await Promise.all([
      flashMaxRest<FlashMaxOrder[]>("flashmax_orders", {
        query: `?select=*&user_id=eq.${encodeURIComponent(user.id)}&order=created_at.desc&limit=100`,
      }),
      flashMaxRest<FlashMaxNotification[]>("flashmax_notifications", {
        query: `?select=id,order_id,kind,title,message,action_label,action_url,available_at,read_at,created_at&user_id=eq.${encodeURIComponent(user.id)}&available_at=lte.${encodeURIComponent(new Date().toISOString())}&order=available_at.desc&limit=100`,
      }),
    ]);

    return NextResponse.json({ user, orders, notifications });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Account could not be loaded.";
    return NextResponse.json({ error: message }, { status: message === "Login required." ? 401 : 500 });
  }
}
