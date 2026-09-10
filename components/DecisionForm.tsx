"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, ShieldCheck, Info } from "lucide-react";
import type { Lang } from "@/lib/i18n";
import { withLang } from "@/lib/i18n";

export function DecisionForm({lang="ar"}:{lang?:Lang}) {
  const ar=lang==="ar"; const router=useRouter();
  const [busy,setBusy]=useState(false); const [error,setError]=useState("");
  async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setError("");const body=new FormData(e.currentTarget);const res=await fetch("/api/decisions",{method:"POST",body});const json=await res.json();setBusy(false);if(!res.ok)return setError(ar?(json.error==="Demo mode is read-only. Add Supabase environment variables to create real records."?"نسخة النشر الحالية غير مربوطة بمفتاح Supabase السري بعد. الواجهة جاهزة، لكن إنشاء سجل حقيقي يحتاج تفعيل متغيرات السيرفر على Vercel.":json.error||"تعذر إنشاء السجل."):json.error||"Could not create record.");router.push(withLang(`/decision/${json.id}`,lang));router.refresh();}
  return <form className="form-card product-form" onSubmit={submit}>
    <div className="form-section-title"><span>01</span>{ar?"بيانات القرار":"Decision"}</div>
    <div className="field-grid"><label>{ar?"عنوان القرار":"Decision title"}<input name="title" required maxLength={140} placeholder={ar?"استبدال الباب المقاوم للحريق — الدور الثالث":"Replace fire-rated door — Floor 3"}/></label><label>{ar?"المشروع / السياق":"Project / context"}<input name="project_name" placeholder={ar?"مبنى النور":"Al Noor Building"}/></label></div>
    <label>{ar?"وش القرار اللي تم الاتفاق عليه؟":"What was agreed?"}<textarea name="summary" required maxLength={2000} rows={5} placeholder={ar?"اكتب القرار النهائي بشكل واضح ومحدد، مو كامل المحادثة.":"Describe the exact final decision, not the whole conversation."}/><span className="field-hint">{ar?"هذا النص هو اللي بيظهر في سجل التحقق العام.":"This text appears in the public verification record."}</span></label>
    <div className="field-grid three"><label>{ar?"المبلغ":"Amount"}<input name="amount" type="number" min="0" step="0.01" placeholder="1800"/></label><label>{ar?"العملة":"Currency"}<select name="currency" defaultValue="SAR"><option>SAR</option><option>USD</option><option>AED</option><option>EUR</option></select></label><label>{ar?"الأطراف":"Parties"}<input name="parties" placeholder={ar?"مدير الموقع، المقاول":"Site Manager, Contractor"}/></label></div>
    <div className="form-section-title"><span>02</span>{ar?"الدليل الأصلي":"Original evidence"}</div>
    <label className="dropzone"><FileUp size={30}/><strong>{ar?"ارفع الملف اللي يثبت القرار":"Attach the file that proves the decision"}</strong><span>{ar?"صورة، PDF، نص أو مستند · بحد أقصى 6 MB":"Image, PDF, text or document · max 6 MB"}</span><input name="evidence" type="file" required accept="image/*,.pdf,.txt,.doc,.docx"/></label>
    <div className="integrity-note"><Info size={17}/><span>{ar?"PROOF يحسب SHA-256 للملف على السيرفر. بعد اعتماد القرار، قاعدة البيانات تمنع تغيير بصمة الدليل أو مساره أو اسمه.":"PROOF hashes the file server-side with SHA-256. Once approved, database rules prevent changing its evidence fingerprint, path or name."}</span></div>
    {error&&<div className="error-box">{error}</div>}
    <button className="button button-primary button-wide button-large" disabled={busy}><ShieldCheck size={18}/>{busy?(ar?"جاري تثبيت بصمة الدليل…":"Fingerprinting evidence…"):(ar?"إنشاء سجل قابل للتحقق":"Create verifiable record")}</button>
  </form>;
}
