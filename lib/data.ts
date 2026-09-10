import { demoAudit, demoDecision } from "./demo";
import { hasSupabase, supabaseAdmin } from "./supabase-admin";
import type { AuditEvent, Decision } from "./types";

export async function listDecisions(): Promise<Decision[]> {
  if (!hasSupabase()) return [demoDecision];

  const { data, error } = await supabaseAdmin()
    .from("decisions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;

  const records = (data ?? []) as Decision[];
  return records.length ? records : [demoDecision];
}

export async function getDecisionByCode(code: string): Promise<Decision | null> {
  const normalized = code.toUpperCase();
  if (!hasSupabase()) return normalized === demoDecision.code ? demoDecision : null;

  const { data, error } = await supabaseAdmin()
    .from("decisions")
    .select("*")
    .eq("code", normalized)
    .maybeSingle();
  if (error) throw error;

  if (data) return data as Decision;
  return normalized === demoDecision.code ? demoDecision : null;
}

export async function getDecisionById(id: string): Promise<Decision | null> {
  if (id === demoDecision.id) return demoDecision;
  if (!hasSupabase()) return null;

  const { data, error } = await supabaseAdmin()
    .from("decisions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Decision | null;
}

export async function getAudit(decisionId: string): Promise<AuditEvent[]> {
  if (decisionId === demoDecision.id) return demoAudit;
  if (!hasSupabase()) return [];

  const { data, error } = await supabaseAdmin()
    .from("audit_events")
    .select("*")
    .eq("decision_id", decisionId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as AuditEvent[];
}
