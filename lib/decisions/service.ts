import { randomUUID } from "crypto";
import { sha256 } from "@/lib/hash";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { DECISION_CODE_PREFIX } from "./constants";
import { demoDecision } from "@/lib/demo";
import {
  decisionCodeExists,
  insertDecision,
  updateDecisionStatus,
} from "./repository";
import type { CreateDecisionInput } from "./validation";

function safeExtension(fileName: string) {
  const raw = fileName.includes(".") ? fileName.split(".").pop() ?? "bin" : "bin";
  const cleaned = raw.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10);
  return cleaned || "bin";
}

async function generateUniqueCode() {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const number = Math.floor(1000 + Math.random() * 9000);
    const code = `${DECISION_CODE_PREFIX}-${number}`;
    if (code !== demoDecision.code && !(await decisionCodeExists(code))) return code;
  }
  throw new Error("Could not allocate a unique decision code. Please retry.");
}

export async function createDecision(input: CreateDecisionInput) {
  const id = randomUUID();
  const code = await generateUniqueCode();
  const bytes = Buffer.from(await input.evidence.arrayBuffer());
  const evidenceHash = sha256(bytes);
  const evidencePath = `${id}/evidence.${safeExtension(input.evidence.name)}`;
  const storage = supabaseAdmin().storage.from("evidence");

  const { error: uploadError } = await storage.upload(evidencePath, bytes, {
    contentType: input.evidence.type || "application/octet-stream",
    upsert: false,
  });
  if (uploadError) throw uploadError;

  try {
    await insertDecision({
      id,
      code,
      title: input.title,
      summary: input.summary,
      project_name: input.projectName,
      amount: input.amount,
      currency: input.currency,
      parties: input.parties,
      status: "PENDING",
      evidence_path: evidencePath,
      evidence_name: input.evidence.name,
      evidence_type: input.evidence.type || null,
      evidence_size: input.evidence.size,
      evidence_hash: evidenceHash,
    });
  } catch (error) {
    await storage.remove([evidencePath]);
    throw error;
  }

  return { id, code };
}

export async function approveDecision(id: string, note?: string) {
  const decisionNote = note?.trim() || "Approved and locked to the attached evidence fingerprint.";
  await updateDecisionStatus(id, "APPROVED", decisionNote);
}

export async function rejectDecision(id: string) {
  await updateDecisionStatus(id, "REJECTED", "Rejected by decision owner.");
}
