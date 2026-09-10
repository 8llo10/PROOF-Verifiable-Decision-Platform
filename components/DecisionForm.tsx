"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, ShieldCheck, Info } from "lucide-react";
import { supabase } from "@/lib/supabase-browser";
import type { Lang } from "@/lib/i18n";
import { withLang } from "@/lib/i18n";

const MAX_BYTES = 6 * 1024 * 1024;

async function sha256(file: File) {
  const bytes = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}

function safeExtension(name: string) {
  const raw = name.includes(".") ? name.split(".").pop()!.toLowerCase() : "bin";
  return /^[a-z0-9]{1,8}$/.test(raw) ? raw : "bin";
}

function randomCode() { return `PR-${Math.floor(1000 + Math.random() * 9000)}`; }

export function DecisionForm({lang="ar"}:{lang?:Lang}) {
  const ar=lang==="ar"; const router=useRouter();
  const [busy,setBusy]=useState(false); const [error,setError]=useState("");

  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault(); setBusy(true); setError("");
    const form = new FormData(e.currentTarget);
    const file = form.get("evidence");
    try {
      if (!(file instanceof File) || file.size === 0) throw new Error(ar ? "اختاري ملف الدليل الأصلي." : "Choose the original evidence file.");
      if (file.size > MAX_BYTES) throw new Error(ar ? "حجم الدليل أكبر من 6 MB." : "Evidence is larger than 6 MB.");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) { router.replace(withLang("/login",lang)); return; }

      const fingerprint = await sha256(file);
      const path = `${user.id}/${crypto.randomUUID()}.${safeExtension(file.name)}`;
      const { error: uploadError } = await supabase.storage.from("evidence").upload(path, file, { upsert: false, contentType: file.type || "application/octet-stream" });
      if (uploadError) throw new Error(uploadError.message);

      const parties = String(form.get("parties") || "").split(/[,،]/).map(v => v.trim()).filter(Boolean).slice(0,20);
      const amountRaw = String(form.get("amount") || "").trim();
      const record = {
        owner_id: user.id,
        title: String(form.get("title") || "").trim(),
        summary: String(form.get("summary") || "").trim(),
        project_name: String(form.get("project_name") || "").trim() || null,
        amount: amountRaw ? Number(amountRaw) : null,
        currency: String(form.get("currency") || "SAR"),
        parties,
        status: "PENDING",
        evidence_path: path,
        evidence_name: file.name,
        evidence_type: file.type || null,
        evidence_size: file.size,
        evidence_hash: fingerprint,
      };

      let createdId = "";
      for (let attempt=0; attempt<12; attempt++) {
        const { data, error } = await supabase.from("decisions").insert({ ...record, code: randomCode() }).select("id").single();
        if (!error && data) { createdId = data.id; break; }
        if (error?.code !== "23505") {
          await supabase.storage.from("evidence").remove([path]);
          throw new Error(error?.message || (ar ? "تعذر إنشاء السجل." : "Could not create record."));
        }
      }
      if (!createdId) { await supabase.storage.from("evidence").remove([path]); throw new Error(ar ? "تعذر توليد كود فريد. حاولي مرة ثانية." : "Could not generate a unique code. Try again."); }
      router.push(withLang(`/decision/${createdId}`,lang)); router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : (ar ? "حدث خطأ غير متوقع." : "Unexpected error."));
    } finally { setBusy(false); }
  }

  return <form className="form-card product-form" onSubmit={submit}>
    <div className="form-section-title"><span>01</span>{ar?"بيانات القرار":"Decision"}</div>
    <div className="field-grid"><label>{ar?"عنوان القرار":"Decision title"}<input name="title" required maxLength={140} placeholder={ar?"استبدال الباب المقاوم للحريق — الدور الثالث":"Replace fire-rated door — Floor 3"}/></label><label>{ar?"المشروع / السياق":"Project / context"}<input name="project_name" maxLength={160} placeholder={ar?"مبنى النور":"Al Noor Building"}/></label></div>
    <label>{ar?"وش القرار اللي تم الاتفاق عليه؟":"What was agreed?"}<textarea name="summary" required maxLength={2000} rows={5} placeholder={ar?"اكتب القرار النهائي بشكل واضح ومحدد، مو كامل المحادثة.":"Describe the exact final decision, not the whole conversation."}/><span className="field-hint">{ar?"هذا النص يظهر في صفحة التحقق العامة بعد الاعتماد.":"This text appears on the public verification page after approval."}</span></label>
    <div className="field-grid three"><label>{ar?"المبلغ":"Amount"}<input name="amount" type="number" min="0" step="0.01" placeholder="1800"/></label><label>{ar?"العملة":"Currency"}<select name="currency" defaultValue="SAR"><option>SAR</option><option>USD</option><option>AED</option><option>EUR</option></select></label><label>{ar?"الأطراف":"Parties"}<input name="parties" placeholder={ar?"مدير الموقع، المقاول":"Site Manager, Contractor"}/></label></div>
    <div className="form-section-title"><span>02</span>{ar?"الدليل الأصلي":"Original evidence"}</div>
    <label className="dropzone"><FileUp size={30}/><strong>{ar?"ارفع الملف اللي يثبت القرار":"Attach the file that proves the decision"}</strong><span>{ar?"صورة، PDF، نص أو مستند · بحد أقصى 6 MB":"Image, PDF, text or document · max 6 MB"}</span><input name="evidence" type="file" required accept="image/*,.pdf,.txt,.doc,.docx"/></label>
    <div className="integrity-note"><Info size={17}/><span>{ar?"تُحسب بصمة SHA-256 داخل جهازك قبل حفظ السجل، والملف يُرفع إلى مساحة خاصة لا يقرأها إلا مالكه. بعد الاعتماد يصبح السجل نهائيًا وغير قابل للتعديل.":"SHA-256 is calculated before the record is stored, and the file is uploaded to a private owner-only space. After approval, the record becomes immutable."}</span></div>
    {error&&<div className="error-box">{error}</div>}
    <button className="button button-primary button-wide button-large" disabled={busy}><ShieldCheck size={18}/>{busy?(ar?"جاري تثبيت الدليل وإنشاء السجل…":"Securing evidence and creating record…"):(ar?"إنشاء سجل قابل للتحقق":"Create verifiable record")}</button>
  </form>;
}
