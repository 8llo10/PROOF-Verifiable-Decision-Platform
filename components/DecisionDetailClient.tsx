"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, FileText, Users, WalletCards, ShieldCheck, ExternalLink, Download, Copy, Check } from "lucide-react";
import { supabase } from "@/lib/supabase-browser";
import { Logo } from "@/components/Logo";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { StatusBadge } from "@/components/StatusBadge";
import { HashBlock } from "@/components/HashBlock";
import { locale, withLang, type Lang } from "@/lib/i18n";
import type { AuditEvent, Decision } from "@/lib/types";

export function DecisionDetailClient({ id, lang }: { id: string; lang: Lang }) {
  const ar = lang === "ar";
  const router = useRouter();
  const [decision, setDecision] = useState<Decision | null>(null);
  const [audit, setAudit] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace(withLang("/login", lang)); return; }
    const { data, error } = await supabase.from("decisions").select("*").eq("id", id).eq("owner_id", user.id).maybeSingle();
    if (error) setError(error.message);
    if (!data) { setLoading(false); return; }
    setDecision(data as Decision);
    const { data: auditData } = await supabase.from("audit_events").select("*").eq("decision_id", id).order("created_at", { ascending: true });
    setAudit((auditData || []) as AuditEvent[]);
    setLoading(false);
  }, [id, lang, router]);

  useEffect(() => { load(); }, [load]);

  async function decide(status: "APPROVED" | "REJECTED") {
    if (!decision) return;
    setBusy(true); setError("");
    const { error } = await supabase.from("decisions").update({ status, decided_at: new Date().toISOString(), decision_note: note.trim() || null }).eq("id", decision.id).eq("status", "PENDING");
    setBusy(false);
    if (error) return setError(error.message);
    await load();
  }

  async function downloadEvidence() {
    if (!decision) return;
    const { data, error } = await supabase.storage.from("evidence").download(decision.evidence_path);
    if (error || !data) return setError(error?.message || (ar ? "تعذر تنزيل الدليل." : "Could not download evidence."));
    const url = URL.createObjectURL(data);
    const a = document.createElement("a"); a.href = url; a.download = decision.evidence_name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  async function copyVerification() {
    if (!decision) return;
    const url = `${window.location.origin}/verify/${encodeURIComponent(decision.code)}?lang=${lang}`;
    await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1600);
  }

  if (loading) return <main className="app-bg"><div className="empty-state">{ar ? "جاري تحميل السجل…" : "Loading record…"}</div></main>;
  if (!decision) return <main className="login-page" dir={ar?"rtl":"ltr"}><div className="login-card"><h1>{ar?"السجل غير موجود":"Record not found"}</h1><p>{ar?"السجل غير موجود أو ما عندك صلاحية للوصول له.":"This record does not exist or you do not have access to it."}</p><Link className="button button-primary" href={withLang("/dashboard",lang)}>{ar?"العودة للوحة التحكم":"Back to dashboard"}</Link></div></main>;

  const d = decision;
  return <main className="app-bg" dir={ar?"rtl":"ltr"}>
    <header className="app-header"><Link href={withLang("/",lang)}><Logo/></Link><nav><Link href={withLang(`/verify/${d.code}`,lang)} className="header-link"><ExternalLink size={15}/>{ar?"صفحة التحقق العامة":"Public verification"}</Link><LanguageSwitch lang={lang}/></nav></header>
    <div className="record-container">
      <Link href={withLang("/dashboard",lang)} className="back-link">{ar?<ArrowRight size={16}/>:<ArrowLeft size={16}/>} {ar?"العودة للسجلات":"Back to records"}</Link>
      <div className="record-title"><div><div className="record-code">{d.code}</div><h1>{d.title}</h1><p>{d.summary}</p></div><StatusBadge status={d.status} lang={lang}/></div>
      {error && <div className="error-box">{error}</div>}
      <div className="record-grid">
        <section className="record-card"><div className="card-heading-row"><h2>{ar?"تفاصيل القرار":"Decision details"}</h2><button className="icon-action" onClick={downloadEvidence}><Download size={16}/>{ar?"تنزيل الدليل":"Download evidence"}</button></div><div className="detail-grid"><div><Calendar/><span>{ar?"أُنشئ":"Created"}</span><strong>{new Date(d.created_at).toLocaleString(locale(lang))}</strong></div><div><Users/><span>{ar?"الأطراف":"Parties"}</span><strong>{d.parties.length?d.parties.join(ar?"، ":", "):(ar?"غير محدد":"Not specified")}</strong></div><div><WalletCards/><span>{ar?"المبلغ":"Amount"}</span><strong>{d.amount!==null?`${Number(d.amount).toLocaleString(locale(lang))} ${d.currency}`:(ar?"غير محدد":"Not specified")}</strong></div><div><FileText/><span>{ar?"ملف الدليل":"Evidence"}</span><strong>{d.evidence_name}</strong></div></div><HashBlock hash={d.evidence_hash} lang={lang}/></section>
        <section className="record-card"><h2>{ar?"حالة القرار":"Decision state"}</h2>{d.status==="PENDING"?<div className="decision-actions"><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder={ar?"ملاحظة القرار (اختياري)":"Decision note (optional)"}/><button disabled={busy} onClick={()=>decide("APPROVED")} className="button button-primary button-wide">{ar?"اعتماد وقفل السجل":"Approve & lock record"}</button><button disabled={busy} onClick={()=>decide("REJECTED")} className="button button-danger button-wide">{ar?"رفض القرار":"Reject decision"}</button></div>:<div className="locked-state"><ShieldCheck size={32}/><strong>{d.status==="APPROVED"?(ar?"السجل معتمد ومقفل":"Approved record is locked"):(ar?"تم رفض القرار":"Decision rejected")}</strong><p>{d.decision_note||(ar?"بدون ملاحظة قرار.":"No decision note.")}</p>{d.decided_at&&<span>{new Date(d.decided_at).toLocaleString(locale(lang))}</span>}{d.status==="APPROVED"&&<button className="button button-dark button-wide" onClick={copyVerification}>{copied?<Check size={16}/>:<Copy size={16}/>} {copied?(ar?"تم نسخ الرابط":"Link copied"):(ar?"نسخ رابط التحقق":"Copy verification link")}</button>}</div>}</section>
      </div>
      <section className="record-card audit-card"><h2>{ar?"سجل التدقيق":"Audit trail"}</h2>{audit.map(a=><div className="audit-row" key={a.id}><div className="audit-pin"/><div><strong>{a.event_type==="CREATED"?(ar?"إنشاء السجل":"Record created"):a.event_type==="APPROVED"?(ar?"اعتماد القرار":"Decision approved"):a.event_type==="REJECTED"?(ar?"رفض القرار":"Decision rejected"):a.event_type}</strong><p>{ar?(a.event_type==="CREATED"?"تم إنشاء سجل القرار وحساب بصمة الدليل.":a.event_type==="APPROVED"?"تم اعتماد القرار وقفل السجل.":a.event_type==="REJECTED"?"تم رفض القرار.":a.message):a.message}</p></div><time>{new Date(a.created_at).toLocaleString(locale(lang))}</time></div>)}</section>
    </div>
  </main>;
}
