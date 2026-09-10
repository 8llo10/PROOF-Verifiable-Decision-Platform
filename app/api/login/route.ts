import { NextRequest, NextResponse } from "next/server";
import { setAdminCookie, verifyAdminPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");
  const lang = form.get("lang") === "en" ? "en" : "ar";

  if (!verifyAdminPassword(password)) {
    return NextResponse.redirect(new URL(`/login?error=1&lang=${lang}`, req.url), 303);
  }

  await setAdminCookie();
  return NextResponse.redirect(new URL(`/dashboard?lang=${lang}`, req.url), 303);
}
