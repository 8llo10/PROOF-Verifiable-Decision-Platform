import { DEFAULT_CURRENCY, MAX_EVIDENCE_BYTES } from "./constants";

export type CreateDecisionInput = {
  title: string;
  summary: string;
  projectName: string | null;
  amount: number | null;
  currency: string;
  parties: string[];
  evidence: File;
};

function text(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}

export function parseCreateDecisionForm(form: FormData): CreateDecisionInput {
  const title = text(form, "title");
  const summary = text(form, "summary");
  const projectName = text(form, "project_name") || null;
  const amountRaw = text(form, "amount");
  const currency = text(form, "currency") || DEFAULT_CURRENCY;
  const evidence = form.get("evidence");

  if (!title || !summary) {
    throw new Error("Title and decision summary are required.");
  }
  if (title.length > 140) throw new Error("Title must be 140 characters or fewer.");
  if (summary.length > 2_000) throw new Error("Summary must be 2,000 characters or fewer.");
  if (!(evidence instanceof File) || evidence.size === 0) {
    throw new Error("Evidence file is required.");
  }
  if (evidence.size > MAX_EVIDENCE_BYTES) {
    throw new Error("Evidence file must be 6 MB or smaller.");
  }

  const amount = amountRaw ? Number(amountRaw) : null;
  if (amount !== null && (!Number.isFinite(amount) || amount < 0)) {
    throw new Error("Amount must be a valid non-negative number.");
  }

  const parties = text(form, "parties")
    .split(",")
    .map((party) => party.trim())
    .filter(Boolean)
    .slice(0, 20);

  return { title, summary, projectName, amount, currency, parties, evidence };
}
