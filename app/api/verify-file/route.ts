import { NextRequest, NextResponse } from "next/server";
import { sha256 } from "@/lib/hash";
import { getDecisionByCode } from "@/lib/data";
import { MAX_VERIFICATION_BYTES } from "@/lib/decisions/constants";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const code = String(form.get("code") ?? "").trim().toUpperCase();
  const file = form.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ kind: "mismatch", message: "Choose a file first." }, { status: 400 });
  }
  if (file.size > MAX_VERIFICATION_BYTES) {
    return NextResponse.json({ kind: "mismatch", message: "File is too large." }, { status: 400 });
  }

  const decision = await getDecisionByCode(code);
  if (!decision) {
    return NextResponse.json({ kind: "mismatch", message: "Record not found." }, { status: 404 });
  }

  const hash = sha256(Buffer.from(await file.arrayBuffer()));
  const match = hash === decision.evidence_hash;

  return NextResponse.json({
    kind: match ? "match" : "mismatch",
    message: match
      ? "MATCH — this file is byte-for-byte identical to the recorded evidence."
      : "MISMATCH — this file does not match the recorded evidence.",
    hash,
  });
}
