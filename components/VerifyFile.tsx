"use client";
import { useState } from "react";
import { FileCheck2, UploadCloud } from "lucide-react";

export function VerifyFile({ code }: { code: string }) {
  const [state, setState] = useState<{kind:string;message:string;hash?:string}|null>(null);
  const [busy, setBusy] = useState(false);

  async function verify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setState(null);
    const form = new FormData(e.currentTarget); form.set("code", code);
    const res = await fetch("/api/verify-file", { method: "POST", body: form });
    const json = await res.json(); setBusy(false);
    setState(json);
  }

  return (
    <form className="verify-upload" onSubmit={verify}>
      <div className="verify-upload-icon"><UploadCloud /></div>
      <div><strong>Check a file against this record</strong><p>Re-upload a copy. PROOF recalculates its SHA-256 fingerprint.</p></div>
      <input name="file" type="file" required />
      <button className="button button-dark" disabled={busy}><FileCheck2 size={17}/>{busy ? "Checking…" : "Verify file"}</button>
      {state && <div className={`verify-result ${state.kind}`}><strong>{state.message}</strong>{state.hash && <code>{state.hash}</code>}</div>}
    </form>
  );
}
