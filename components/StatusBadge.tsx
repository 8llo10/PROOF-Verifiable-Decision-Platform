import type { DecisionStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: DecisionStatus }) {
  return <span className={`status status-${status.toLowerCase()}`}><span className="status-dot" />{status}</span>;
}
