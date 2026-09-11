"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, ShieldCheck, FileText, Clock3 } from "lucide-react";
import { supabase } from "@/lib/supabase-browser";
import { HashBlock } from "@/components/HashBlock";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { Logo } from "@/components/Logo";
import { locale, withLang, type Lang } from "@/lib/i18n";

type ApprovalView = {
  request_id:string; decision_id:string; code:string; title:string; summary:string;
  project_name:string|null; amount:number|null; currency:string; evidence_name:string;
  evidence_hash:string; decision_status:string; party_role:string; party_name:string;
  approval_status:string; counterpart_status:string; created_at:string; expires_at:string;
};

export function ApprovalResponseClient({token,lang}:{token:string;lang:Lang}) {
  const ar=lang==="ar";
  const [data,setData]=useState<ApprovalView|null>(null);
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState(false);
  const [note,setNote]=useState("");
  const [error,setError]=useState("");
  const [done,setDone]=useState("");

  async function load(){
    setLoading(true); setError("");
    const {data,error}=await supabase.rpc("get_approval_request",{p_token:token});
    if(error) setError(ar?"رابط الاعتماد غير صالح أو منتهي.":"This approval link is invalid or expired.");
    else setData((data?.[0]||null) as ApprovalView|null);
    setLoading(false);
  }
  useEffect(()=>{load();},[token]);

  async function respond(action:"APPROVED"|"REJECTED"){
    setBusy(true); setError("");
    const {data:result,error}=await supabase.rpc("respond_to_approval",{p_token:token,p_action:action,p_note:note.trim()||null});
    setBusy(false);
    if(error) return setError(ar?"تعذر تسجيل ردك. قد يكون الطلب أُنجز أو انتهت صلاحيته.":"Could not record your response. The request may already be completed or expired.");
    setDone(action);
    await load();
  }

  if(loading) return <main className="login-page"><div className="login-card">{ar?"جاري فتح طلب الاعتماد…":"Opening approval request…"}</div></main>;
  if(error && !data) return <main className="login-page" dir={ar?"rtl":"ltr"}><div className="login-card"><Logo/><h1>{ar?"تعذر فتح الطلب":"Could not open request"}</h1><p>{error}</p><Link className="button button-dark" href={withLang("/",lang)}>{ar?"العودة لـ PROOF":"Back to PROOF"}</Link></div></main>;
  if(!data) return null;

  const completed=data.approval_status!=="PENDING" || data.decision_status!=="PENDING";
  return <main className="app-bg" dir={ar?"rtl":"ltr"}>
    <header className="app-header"><Link href={withLang("/",lang)}><Logo/></Link><LanguageSwitch lang={lang}/></header>
    <div className="narrow-container">
      <div className="page-heading"><span className="eyebrow">{data.code} · {ar?"طلب اعتماد آمن":"SECURE APPROVAL REQUEST"}</span><h1>{data.title}</h1><p>{ar?`مرحبًا ${data.party_name}، راجع المعاملة والملف المرجعي ثم سجّل موافقتك أو رفضك.`:`Hi ${data.party_name}, review the agreement and reference evidence, then approve or reject it.`}</p></div>
      <section className="record-card">
        <div className="detail-grid">
          <div><ShieldCheck/><span>{ar?"دورك":"Your role"}</span><strong>{data.party_role==="INITIATOR"?(ar?"الطرف الأول / منشئ الطلب":"Party 1 / requester"):(ar?"الطرف الثاني / المستلم":"Party 2 / recipient")}</strong></div>
          <div><Clock3/><span>{ar?"حالة الطرف الآخر":"Other party"}</span><strong>{data.counterpart_status==="APPROVED"?(ar?"وافق":"Approved"):data.counterpart_status==="REJECTED"?(ar?"رفض":"Rejected"):(ar?"بانتظار الرد":"Pending")}</strong></div>
          <div><FileText/><span>{ar?"الملف المرجعي":"Reference file"}</span><strong>{data.evidence_name}</strong></div>
          <div><span>{ar?"المبلغ":"Amount"}</span><strong>{data.amount!==null?`${Number(data.amount).toLocaleString(locale(lang))} ${data.currency}`:(ar?"غير محدد":"Not specified")}</strong></div>
        </div>
        <p style={{marginTop:18,lineHeight:1.8}}>{data.summary}</p>
        <HashBlock hash={data.evidence_hash} lang={lang}/>
      </section>

      {done && <div className="success-box">{done==="APPROVED"?(ar?"تم تسجيل موافقتك بنجاح.":"Your approval was recorded successfully."):(ar?"تم تسجيل رفضك.":"Your rejection was recorded.")}</div>}
      {error && <div className="error-box">{error}</div>}

      <section className="record-card">
        <h2>{ar?"قرارك":"Your response"}</h2>
        {completed ? <div className="locked-state"><ShieldCheck size={34}/><strong>{data.approval_status==="APPROVED"?(ar?"تمت موافقتك":"You approved this request"):data.approval_status==="REJECTED"?(ar?"تم تسجيل رفضك":"You rejected this request"):(ar?"تم إغلاق الطلب":"Request closed")}</strong><p>{data.decision_status==="APPROVED"?(ar?"اكتملت موافقة الطرفين وأصبح السجل نهائيًا ومقفلًا.":"Both parties approved. The final record is now locked."):data.decision_status==="REJECTED"?(ar?"تم رفض المعاملة ولن تتحول إلى سجل معتمد.":"The agreement was rejected and will not become an approved record."):(ar?"بانتظار رد الطرف الآخر.":"Waiting for the other party.")}</p></div> : <div className="decision-actions">
          <textarea value={note} onChange={e=>setNote(e.target.value)} maxLength={800} placeholder={ar?"ملاحظة اختيارية قبل إرسال ردك":"Optional note before submitting"}/>
          <button className="button button-primary button-wide" disabled={busy} onClick={()=>respond("APPROVED")}><CheckCircle2 size={18}/>{ar?"أوافق على هذه المعاملة":"Approve this agreement"}</button>
          <button className="button button-danger button-wide" disabled={busy} onClick={()=>respond("REJECTED")}><XCircle size={18}/>{ar?"أرفض هذه المعاملة":"Reject this agreement"}</button>
          <small>{ar?"بإرسال ردك، يتم تسجيل وقت الاستجابة وربطها بهذه النسخة من الملف عبر بصمة SHA-256.":"Submitting records your response time and binds it to this exact file fingerprint."}</small>
        </div>}
      </section>
    </div>
  </main>;
}
