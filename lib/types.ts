export type DecisionStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ApprovalStatus = "PENDING" | "APPROVED" | "REJECTED";
export type PartyRole = "INITIATOR" | "COUNTERPARTY";

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
  initiator_name: string | null;
  initiator_phone: string | null;
  counterparty_name: string | null;
  counterparty_phone: string | null;
  approval_completed_at: string | null;
  created_at: string;
  decided_at: string | null;
  decision_note: string | null;
};

export type ApprovalRequest = {
  id: string;
  decision_id: string;
  owner_id: string;
  party_role: PartyRole;
  party_name: string;
  party_phone: string | null;
  party_email: string | null;
  token: string;
  status: ApprovalStatus;
  note: string | null;
  created_at: string;
  responded_at: string | null;
  expires_at: string;
};

export type AuditEvent = {
  id: string;
  decision_id: string;
  event_type: string;
  message: string;
  created_at: string;
};
