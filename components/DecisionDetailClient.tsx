"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Calendar, FileText, Users, WalletCards, ShieldCheck, ExternalLink, Download, Copy, Check, Send, Clock3 } from "lucide-react";
import { supabase } from "@/lib/supabase-browser";
import { Logo } from "@/components/Logo";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { StatusBadge } from "@/components/StatusBadge";
import { HashBlock } from "@/components/HashBlock";
import { locale, withLang, type Lang } from "@/lib/i18n";
import type { ApprovalRequest, AuditEvent, Decision } from "@/lib/types";

export function DecisionDetailClient({ id, lang }: { id: string; lang: Lang }) {
  const ar = lang === "ar";
  const router = useRouter();
  const [decision, setDecision] = useState<Decision | null>(null);
  const [approvals,setApprovals]=useState<ApprovalRequest[]>([]);
  const [audit, setAudit] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.replace(withLang("/login", lang)); return; }
    const { data, error } = await supabase.from("decisions").select("*").eq("id", id).eq("owner_id", user.id).maybeSingle();
    if (error) setError(error.message);
    if (!data) { setLoading(false); return; }
    setDecision(data as Decision);
    const [{data:approvalData},{ data: auditData }] = await Promise.all([
      supabase.from("approval_requests").select("*").eq("decision_id",id).order("created_at",{ascending:true}),
      supabase.from("audit_events").select("*").eq("decision_id", id).order("created_at", { ascending: true })
    ]);
    setApprovals((approvalData||[]) as ApprovalRequest[]);
    setAudit((auditData || []) as AuditEvent[]);
    setLoading(false);
  }, [id, lang, router]);

  useEffect(() => { load(); }, [load]);

  async function downloadEvidence() {
    if (!decision) return;
    const { data, error } = await supabase.storage.from("evidence").download(decision.evidence_path);
    if (error || !data) return setError(error?.message || (ar ? "تعذر تنزيل الملف." : "Could not download file."));
    const url = URL.createObjectURL(data);
    const a = document.createElement("a"); a.href = url; a.download = decision.evidence_name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function approvalUrl(a:ApprovalRequest){ return `${window.location.origin}/approve/${a.token}?lang=${lang}`; }
  async function copyApproval(a:ApprovalRequest){ await navigator.clipboard.writeText(approvalUrl(a)); setCopied(a.id); setTimeout(()=>setCopied(""),1600); }
  function sendWhatsApp(a:ApprovalRequest){
    const phone=(a.party_phone||"").replace(/\D/g,"");
    const url=approvalUrl(a);
    const text=ar
      ? `مرحبًا ${a.party_name}، لديك طلب اعتماد عبر PROOF${decision?.title?`:\n${decision.title}`:""}.\nراجع التفاصيل وسجّل موافقتك أو رفضك من الرابط:\n${url}`
      : `Hi ${a.party_name}, you have an approval request via PROOF${decision?.title?`:\n${decision.title}`:""}.\nReview it and approve or reject here:\n${url}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`,"_blank","noopener,noreferrer");
  }
  async function copyVerification() {
    if (!decision) return;
    const url = `${window.location.origin}/verify/${encodeURIComponent(decision.code)}?lang=${lang}`;
    await navigator.clipboard.writeText(url); setCopied("verify"); setTimeout(() => setCopied(""), 1600);
  }

  if (loading) return <main className="app-bg"><div className="empty-state">{ar ? "جاري تحميل المعاملة…" : "Loading request…"}</div></main>;
  if (!decision) return <main className="login-page" dir={ar?"rtl":"ltr"}><div className="login-card"><h1>{ar?"المعاملة غير موجودة":"Request not found"}</h1><p>{ar?"المعاملة غير موجودة أو ما عندك صلاحية للوصول لها.":"This request does not exist or you do not have access to it."}</p><Link className="button button-primary" href={withLang("/dashboard",lang)}>{ar?"العودة للوحة التحكم":"Back to dashboard"}</Link></div></main>;

  const d = decision;
  return <main className="app-bg" dir={ar?"rtl":"ltr"}>
    <header className="app-header"><Link href={withLang("/",lang)}><Logo/></Link><nav>{d.status==="APPROVED"&&<Link href={withLang(`/verify/${d.code}`,lang)} className="header-link"><ExternalLink size={15}/>{ar?"صفحة التحقق العامة":"Public verification"}</Link>}<LanguageSwitch lang={lang}/></nav></header>
    <div className="record-container">
      <Link href={withLang("/dashboard",lang)} className="back-link">{ar?<ArrowRight size={16}/>:<ArrowLeft size={16}/>} {ar?"العودة للطلبات":"Back to requests"}</Link>
      <div className="record-title"><div><div className="record-code">{d.code}</div><h1>{d.title}</h1><p>{d.summary}</p></div><StatusBadge status={d.status} lang={lang}/></div>
      {error && <div className="error-box">{error}</div>}
      <div className="record-grid">
        <section className="record-card"><div className="card-heading-row"><h2>{ar?"تفاصيل المعاملة":"Agreement details"}</h2><button className="icon-action" onClick={downloadEvidence}><Download size={16}/>{ar?"تنزيل الملف":"Download file"}</button></div><div className="detail-grid"><div><Calendar/><span>{ar?"أُنشئ":"Created"}</span><strong>{new Date(d.created_at).toLocaleString(locale(lang))}</strong></div><div><Users/><span>{ar?"الطرفان":"Parties"}</span><strong>{d.parties.join(ar?" × ":" × ")}</strong></div><div><WalletCards/><span>{ar?"المبلغ":"Amount"}</span><strong>{d.amount!==null?`${Number(d.amount).toLocaleString(locale(lang))} ${d.currency}`:(ar?"غير محدد":"Not specified")}</strong></div><div><FileText/><span>{ar?"الملف المرجعي":"Reference file"}</span><strong>{d.evidence_name}</strong></div></div><HashBlock hash={d.evidence_hash} lang={lang}/></section>

        <section className="record-card"><h2>{ar?"اعتماد الطرفين":"Two-party approval"}</h2>
          <div className="decision-actions">
            {approvals.map(a=><div key={a.id} className="integrity-note" style={{display:"block",padding:16}}>
              <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"center",marginBottom:10}}><div><strong>{a.party_name}</strong><div className="field-hint">{a.party_role==="INITIATOR"?(ar?"الطرف الأول / منشئ الطلب":"Party 1 / requester"):(ar?"الطرف الثاني / المستلم":"Party 2 / recipient")}</div></div><StatusBadge status={a.status as "PENDING"|"APPROVED"|"REJECTED"} lang={lang}/></div>
              {a.status==="PENDING"&&d.status==="PENDING"?<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{a.party_phone&&<button className="button button-primary" type="button" onClick={()=>sendWhatsApp(a)}><Send size={15}/>{ar?"إرسال عبر واتساب":"Send via WhatsApp"}</button>}<button className="button button-dark" type="button" onClick={()=>copyApproval(a)}>{copied===a.id?<Check size={15}/>:<Copy size={15}/>} {copied===a.id?(ar?"تم النسخ":"Copied"):(ar?"نسخ رابط الاعتماد":"Copy approval link")}</button></div>:<div className="field-hint"><Clock3 size={14}/> {a.responded_at?new Date(a.responded_at).toLocaleString(locale(lang)):(ar?"بانتظار الرد":"Waiting for response")}{a.note?` · ${a.note}`:""}</div>}
            </div>)}
            {approvals.length===0&&<div className="error-box">{ar?"لم تُنشأ طلبات الموافقة لهذه المعاملة.":"Approval requests were not created for this agreement."}</div>}
          </div>
          {d.status==="PENDING"&&<p className="field-hint" style={{marginTop:14}}>{ar?"لا يوجد زر اعتماد للمالك هنا. كل طرف لازم يفتح رابطه المستقل ويسجل قراره بنفسه.":"There is no owner approval shortcut. Each party must open their independent link and submit their own response."}</p>}
          {d.status==="APPROVED"&&<div className="locked-state"><ShieldCheck size={32}/><strong>{ar?"وافق الطرفان — السجل مقفل":"Both parties approved — record locked"}</strong><p>{ar?"تم إنشاء سجل القرار النهائي تلقائيًا وأصبحت بصمة الملف والبيانات غير قابلة للتعديل.":"The final decision record was created automatically and the agreement data and file fingerprint are now immutable."}</p><button className="button button-dark button-wide" onClick={copyVerification}>{copied==="verify"?<Check size={16}/>:<Copy size={16}/>} {copied==="verify"?(ar?"تم نسخ الرابط":"Link copied"):(ar?"نسخ رابط التحقق النهائي":"Copy final verification link")}</button></div>}
          {d.status==="REJECTED"&&<div className="locked-state"><strong>{ar?"تم رفض المعاملة":"Agreement rejected"}</strong><p>{d.decision_note||(ar?"رفض أحد الطرفين الطلب.":"One party rejected the request.")}</p></div>}
        </section>
      </div>
      <section className="record-card audit-card"><h2>{ar?"سجل التدقيق":"Audit trail"}</h2>{audit.map(a=><div className="audit-row" key={a.id}><div className="audit-pin"/><div><strong>{a.event_type==="CREATED"?(ar?"إنشاء المعاملة":"Request created"):a.event_type==="PARTY_APPROVED"?(ar?"موافقة طرف":"Party approved"):a.event_type==="PARTY_REJECTED"?(ar?"رفض طرف":"Party rejected"):a.event_type==="APPROVED"?(ar?"اكتمال الاعتماد":"Approval completed"):a.event_type==="REJECTED"?(ar?"إغلاق بالرفض":"Rejected"):a.event_type}</strong><p>{a.message}</p></div><time>{new Date(a.created_at).toLocaleString(locale(lang))}</time></div>)}</section>
    </div>
  </main>;
}
