import { NextRequest, NextResponse } from "next/server";
export function GET(req: NextRequest) {
  const code = (req.nextUrl.searchParams.get("code") || "").trim().toUpperCase();
  const lang = req.nextUrl.searchParams.get("lang") === "en" ? "en" : "ar";
  return NextResponse.redirect(new URL(`/verify/${encodeURIComponent(code)}?lang=${lang}`, req.url));
}
