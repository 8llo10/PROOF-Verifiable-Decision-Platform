import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { hasSupabase } from "@/lib/supabase-admin";
import { createDecision } from "@/lib/decisions/service";
import { parseCreateDecisionForm } from "@/lib/decisions/validation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!hasSupabase()) {
    return NextResponse.json(
      { error: "Demo mode is read-only. Add Supabase environment variables to create real records." },
      { status: 503 },
    );
  }

  try {
    const input = parseCreateDecisionForm(await req.formData());
    const decision = await createDecision(input);
    return NextResponse.json(decision, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create decision.";
    console.error("create-decision", error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
