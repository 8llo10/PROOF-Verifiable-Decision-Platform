import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { hasSupabase } from "@/lib/supabase-admin";
import { approveDecision } from "@/lib/decisions/service";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.redirect(new URL("/login", req.url), 303);
  if (!hasSupabase()) return NextResponse.redirect(new URL("/dashboard", req.url), 303);

  const { id } = await params;
  const form = await req.formData();
  await approveDecision(id, String(form.get("note") ?? ""));
  return NextResponse.redirect(new URL(`/decision/${id}`, req.url), 303);
}
