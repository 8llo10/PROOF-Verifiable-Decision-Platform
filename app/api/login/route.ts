import { NextRequest, NextResponse } from "next/server";
import { setAdminCookie, verifyAdminPassword } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const password = String(form.get("password") ?? "");

  if (!verifyAdminPassword(password)) {
    return NextResponse.redirect(new URL("/login?error=1", req.url), 303);
  }

  await setAdminCookie();
  return NextResponse.redirect(new URL("/dashboard", req.url), 303);
}
