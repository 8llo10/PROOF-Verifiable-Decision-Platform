import { NextResponse } from "next/server";
import { hasSupabase } from "@/lib/supabase-admin";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "proof",
    mode: hasSupabase() ? "connected" : "demo",
  });
}
