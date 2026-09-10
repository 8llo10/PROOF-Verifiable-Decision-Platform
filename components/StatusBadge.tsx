import type { DecisionStatus } from "@/lib/types";
import { statusLabel, type Lang } from "@/lib/i18n";
export function StatusBadge({ status, lang="ar" }: { status: DecisionStatus; lang?: Lang }) {
  return <span className={`status status-${status.toLowerCase()}`}><span className="status-dot" />{statusLabel(status,lang)}</span>;
}
