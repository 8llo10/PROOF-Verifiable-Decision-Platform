import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "proof",
    mode: "live",
    auth: "supabase",
    persistence: "postgresql",
    storage: "private",
    verification: "sha-256",
  });
}
