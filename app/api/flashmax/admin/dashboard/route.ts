import { NextResponse } from "next/server";
import { isFlashMaxAdmin } from "@/lib/flashmax/auth";
import type { FlashMaxOrder } from "@/lib/flashmax/payments";
import { flashMaxRest } from "@/lib/flashmax/supabase";

type AdminOrder = FlashMaxOrder & { flashmax_profiles: { email: string } | null };

export async function GET(request: Request) {
  if (!isFlashMaxAdmin(request)) {
    return NextResponse.json({ error: "Invalid admin key." }, { status: 401 });
  }

  try {
    const [orders, settings, profiles] = await Promise.all([
      flashMaxRest<AdminOrder[]>("flashmax_orders", {
        query: "?select=*,flashmax_profiles(email)&order=created_at.desc&limit=500",
      }),
      flashMaxRest<Array<{
        confirmed_title: string;
        confirmed_message: string;
        followup_title: string;
        followup_message: string;
        telegram_url: string | null;
      }>>("flashmax_settings", { query: "?select=*&id=eq.default&limit=1" }),
      flashMaxRest<Array<{ id: string }>>("flashmax_profiles", { query: "?select=id" }),
    ]);

    return NextResponse.json({ orders, settings: settings[0], customerCount: profiles.length });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Dashboard could not be loaded." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!isFlashMaxAdmin(request)) {
    return NextResponse.json({ error: "Invalid admin key." }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const settings = {
    confirmed_title: clean(body.confirmed_title, 80),
    confirmed_message: clean(body.confirmed_message, 1000),
    followup_title: clean(body.followup_title, 80),
    followup_message: clean(body.followup_message, 1000),
    telegram_url: clean(body.telegram_url, 500),
    updated_at: new Date().toISOString(),
  };

  if (!settings.confirmed_title || !settings.confirmed_message || !settings.followup_title || !settings.followup_message) {
    return NextResponse.json({ error: "Both notification titles and messages are required." }, { status: 400 });
  }
  if (settings.telegram_url && !/^https:\/\/(t\.me|telegram\.me)\//i.test(settings.telegram_url)) {
    return NextResponse.json({ error: "Enter a valid https://t.me/... Telegram link." }, { status: 400 });
  }

  try {
    const [saved] = await flashMaxRest<Array<typeof settings>>("flashmax_settings", {
      method: "PATCH",
      query: "?id=eq.default",
      body: settings,
    });
    return NextResponse.json({ settings: saved });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Settings could not be saved." }, { status: 500 });
  }
}

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
