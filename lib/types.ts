export type DecisionStatus = "PENDING" | "APPROVED" | "REJECTED";

export type Decision = {
  id: string;
  owner_id: string;
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
  evidence_size: number | null;
  evidence_hash: string;
  created_at: string;
  decided_at: string | null;
  decision_note: string | null;
};

export type AuditEvent = {
  id: string;
  decision_id: string;
  event_type: string;
  message: string;
  created_at: string;
};
