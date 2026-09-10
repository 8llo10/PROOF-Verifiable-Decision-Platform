"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, ShieldCheck } from "lucide-react";

export function DecisionForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setError("");
    const body = new FormData(e.currentTarget);
    const res = await fetch("/api/decisions", { method: "POST", body });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) return setError(json.error || "Could not create record.");
    router.push(`/decision/${json.id}`);
    router.refresh();
  }

  return (
    <form className="form-card" onSubmit={submit}>
      <div className="form-section-title"><span>01</span> Decision</div>
      <div className="field-grid">
        <label>Decision title<input name="title" required placeholder="Replace fire-rated door — Floor 3" /></label>
        <label>Project / context<input name="project_name" placeholder="Al Noor Building" /></label>
      </div>
      <label>What was agreed?<textarea name="summary" required rows={4} placeholder="Describe the exact decision, not the whole conversation." /></label>
      <div className="field-grid three">
        <label>Amount<input name="amount" type="number" step="0.01" placeholder="1800" /></label>
        <label>Currency<select name="currency" defaultValue="SAR"><option>SAR</option><option>USD</option><option>AED</option><option>EUR</option></select></label>
        <label>Parties<input name="parties" placeholder="Site Manager, Contractor" /></label>
      </div>

      <div className="form-section-title"><span>02</span> Evidence</div>
      <label className="dropzone">
        <FileUp size={28} />
        <strong>Attach the original evidence</strong>
        <span>Screenshot, PDF, image, text or document · max 6 MB</span>
        <input name="evidence" type="file" required accept="image/*,.pdf,.txt,.doc,.docx" />
      </label>

      {error && <div className="error-box">{error}</div>}
      <button className="button button-primary button-wide" disabled={busy}>
        <ShieldCheck size={18} /> {busy ? "Fingerprinting evidence…" : "Create verifiable record"}
      </button>
    </form>
  );
}
