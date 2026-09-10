import { NextRequest, NextResponse } from "next/server";
export function GET(req: NextRequest) {
  const code = (req.nextUrl.searchParams.get("code") || "").trim().toUpperCase();
  return NextResponse.redirect(new URL(`/verify/${encodeURIComponent(code)}`, req.url));
}
