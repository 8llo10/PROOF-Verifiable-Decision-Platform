import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Calendar, FileText, ShieldCheck, XCircle } from "lucide-react";
import { Nav } from "@/components/Nav";
import { getDecisionByCode } from "@/lib/data";
import { HashBlock } from "@/components/HashBlock";
import { VerifyFile } from "@/components/VerifyFile";

export const dynamic = "force-dynamic";

export default async function VerifyRecord({params}:{params:Promise<{code:string}>}) {
  const {code}=await params; const d=await getDecisionByCode(decodeURIComponent(code)); if(!d) notFound();
  const ok=d.status==="APPROVED";
  return <main><Nav/><div className="verify-record container"><Link href="/verify" className="back-link">← Verify another record</Link><section className={`verification-banner ${ok?"verified":"not-verified"}`}><div>{ok?<CheckCircle2/>:<XCircle/>}</div><span>{ok?"VERIFIED RECORD":d.status}</span><h1>{ok?"Evidence matches an approved decision record.":"This record is not approved."}</h1><p>Record {d.code} · created {new Date(d.created_at).toLocaleDateString("en-GB")}</p></section><div className="public-record-grid"><section className="record-card"><div className="public-title"><span>{d.code}</span><h2>{d.title}</h2><p>{d.summary}</p></div><div className="public-details"><div><Calendar/><span>Decision date</span><strong>{d.decided_at?new Date(d.decided_at).toLocaleString("en-GB"):"Pending"}</strong></div><div><FileText/><span>Original evidence</span><strong>{d.evidence_name}</strong></div><div><ShieldCheck/><span>Integrity method</span><strong>SHA-256</strong></div></div><HashBlock hash={d.evidence_hash}/></section><VerifyFile code={d.code}/></div><p className="verification-note">PROOF verifies file integrity, not the truthfulness of the underlying business claim. The fingerprint confirms whether a file copy is byte-for-byte identical to the evidence attached to this record.</p></div></main>;
}
