import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Calendar, FileText, Users, WalletCards, ShieldCheck } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { getAudit, getDecisionById } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";
import { HashBlock } from "@/components/HashBlock";
import { Logo } from "@/components/Logo";

export const dynamic = "force-dynamic";

export default async function DecisionPage({ params }: { params: Promise<{id:string}> }) {
  if (!(await isAdmin())) redirect("/login");
  const { id } = await params;
  const d = await getDecisionById(id); if (!d) notFound();
  const audit = await getAudit(d.id);
  return <main className="app-bg"><header className="app-header"><Link href="/"><Logo/></Link><Link href={`/verify/${d.code}`} className="header-link"><ShieldCheck size={16}/> Public verification</Link></header><div className="record-container"><Link href="/dashboard" className="back-link"><ArrowLeft size={16}/> Back to decisions</Link><div className="record-title"><div><div className="record-code">{d.code}</div><h1>{d.title}</h1><p>{d.summary}</p></div><StatusBadge status={d.status}/></div><div className="record-grid"><section className="record-card"><h2>Decision details</h2><div className="detail-grid"><div><Calendar/><span>Created</span><strong>{new Date(d.created_at).toLocaleString("en-GB")}</strong></div><div><Users/><span>Parties</span><strong>{d.parties.length?d.parties.join(", "):"Not specified"}</strong></div><div><WalletCards/><span>Amount</span><strong>{d.amount!==null?`${Number(d.amount).toLocaleString()} ${d.currency}`:"Not specified"}</strong></div><div><FileText/><span>Evidence</span><strong>{d.evidence_name}</strong></div></div><HashBlock hash={d.evidence_hash}/></section><section className="record-card"><h2>Decision state</h2>{d.status==="PENDING"?<div className="decision-actions"><form id="approveForm" action={`/api/decisions/${d.id}/approve`} method="post"><textarea name="note" placeholder="Approval note (optional)"/><button className="button button-primary button-wide">Approve decision</button></form><form action={`/api/decisions/${d.id}/reject`} method="post"><button className="button button-danger button-wide">Reject</button></form></div>:<div className="locked-state"><ShieldCheck size={32}/><strong>{d.status === "APPROVED" ? "Evidence locked to approved record" : "Decision rejected"}</strong><p>{d.decision_note || "No decision note."}</p>{d.decided_at && <span>{new Date(d.decided_at).toLocaleString("en-GB")}</span>}</div>}</section></div><section className="record-card audit-card"><h2>Audit trail</h2>{audit.map(a=><div className="audit-row" key={a.id}><div className="audit-pin"/><div><strong>{a.event_type}</strong><p>{a.message}</p></div><time>{new Date(a.created_at).toLocaleString("en-GB")}</time></div>)}</section></div></main>;
}
