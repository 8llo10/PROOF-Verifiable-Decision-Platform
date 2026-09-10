import { supabaseAdmin } from "@/lib/supabase-admin";
import type { DecisionStatus } from "@/lib/types";

export type DecisionInsert = {
  id: string;
  code: string;
  title: string;
  summary: string;
  project_name: string | null;
  amount: number | null;
  currency: string;
  parties: string[];
  status: DecisionStatus;
  evidence_path: string;
  evidence_name: string;
  evidence_type: string | null;
  evidence_size: number;
  evidence_hash: string;
};

export async function decisionCodeExists(code: string) {
  const { data, error } = await supabaseAdmin()
    .from("decisions")
    .select("id")
    .eq("code", code)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function insertDecision(row: DecisionInsert) {
  const { error } = await supabaseAdmin().from("decisions").insert(row);
  if (error) throw error;
}

export async function updateDecisionStatus(
  id: string,
  status: Exclude<DecisionStatus, "PENDING">,
  note: string,
) {
  const { data, error } = await supabaseAdmin()
    .from("decisions")
    .update({ status, decided_at: new Date().toISOString(), decision_note: note })
    .eq("id", id)
    .eq("status", "PENDING")
    .select("id")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Decision was not found or has already been decided.");
}
