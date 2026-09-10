import type { AuditEvent, Decision } from "./types";

export const demoDecision: Decision = {
  id: "demo-1",
  code: "PR-1042",
  title: "Replace fire-rated door — Floor 3",
  summary: "Approved replacement of the damaged fire-rated door with the revised supplier option.",
  project_name: "Al Noor Building",
  amount: 1800,
  currency: "SAR",
  parties: ["Site Manager", "Contractor"],
  status: "APPROVED",
  evidence_path: "demo/sample-approval.txt",
  evidence_name: "whatsapp-approval.txt",
  evidence_type: "text/plain",
  evidence_size: 209,
  evidence_hash: "3d863945aab30bf23a67b40450338addd55a1fd6e94d22a04498ba53e58a5d0d",
  created_at: "2026-09-10T19:41:00.000Z",
  decided_at: "2026-09-10T19:44:00.000Z",
  decision_note: "Approved as quoted. Proceed with replacement.",
};

export const demoAudit: AuditEvent[] = [
  { id: "a1", decision_id: "demo-1", event_type: "CREATED", message: "Decision record created and evidence fingerprinted.", created_at: "2026-09-10T19:41:00.000Z" },
  { id: "a2", decision_id: "demo-1", event_type: "APPROVED", message: "Decision approved. Evidence hash locked to the record.", created_at: "2026-09-10T19:44:00.000Z" },
];
