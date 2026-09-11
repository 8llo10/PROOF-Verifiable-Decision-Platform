"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, ShieldCheck, Info, UsersRound } from "lucide-react";
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
function cleanPhone(v:string){ return v.replace(/[^0-9+]/g,"").slice(0,20); }

export function DecisionForm({lang="ar"}:{lang?:Lang}) {
  const ar=lang==="ar"; const router=useRouter();
  const [busy,setBusy]=useState(false); const [error,setError]=useState("");

  async function submit(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault(); setBusy(true); setError("");
    const form = new FormData(e.currentTarget);
    const file = form.get("evidence");
    try {
      if (!(file instanceof File) || file.size === 0) throw new Error(ar ? "اختاري ملف المعاملة أو الدليل." : "Choose the agreement or evidence file.");
      if (file.size > MAX_BYTES) throw new Error(ar ? "حجم الملف أكبر من 6 MB." : "File is larger than 6 MB.");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) { router.replace(withLang("/login",lang)); return; }

      const title = String(form.get("title") || "").trim();
      const project = String(form.get("project_name") || "").trim();
      const details = String(form.get("details") || "").trim();
      const amountRaw = String(form.get("amount") || "").trim();
      const currency = String(form.get("currency") || "SAR");
      const initiatorName = String(form.get("initiator_name") || "").trim();
      const initiatorPhone = cleanPhone(String(form.get("initiator_phone") || ""));
      const counterpartyName = String(form.get("counterparty_name") || "").trim();
      const counterpartyPhone = cleanPhone(String(form.get("counterparty_phone") || ""));
      if (!title || !details || !initiatorName || !counterpartyName) throw new Error(ar ? "كمّلي بيانات المعاملة والطرفين." : "Complete the agreement and both party details.");

      const fingerprint = await sha256(file);
      const path = `${user.id}/${crypto.randomUUID()}.${safeExtension(file.name)}`;
      const { error: uploadError } = await supabase.storage.from("evidence").upload(path, file, { upsert: false, contentType: file.type || "application/octet-stream" });
      if (uploadError) throw new Error(uploadError.message);

      const summary = ar
        ? `${details}${amountRaw ? ` — القيمة: ${Number(amountRaw).toLocaleString("ar-SA")} ${currency}` : ""}. يتطلب هذا الطلب موافقة ${initiatorName} و${counterpartyName}.`
        : `${details}${amountRaw ? ` — Value: ${Number(amountRaw).toLocaleString("en-GB")} ${currency}` : ""}. This request requires approval from ${initiatorName} and ${counterpartyName}.`;
      const record = {
        owner_id: user.id,
        title,
        summary,
        project_name: project || null,
        amount: amountRaw ? Number(amountRaw) : null,
        currency,
        parties: [initiatorName,counterpartyName],
        status: "PENDING",
        evidence_path: path,
        evidence_name: file.name,
        evidence_type: file.type || null,
        evidence_size: file.size,
        evidence_hash: fingerprint,
        initiator_name: initiatorName,
        initiator_phone: initiatorPhone || null,
        counterparty_name: counterpartyName,
        counterparty_phone: counterpartyPhone || null,
      };

      let createdId = "";
      for (let attempt=0; attempt<12; attempt++) {
        const { data, error } = await supabase.from("decisions").insert({ ...record, code: randomCode() }).select("id").single();
        if (!error && data) { createdId = data.id; break; }
        if (error?.code !== "23505") {
          await supabase.storage.from("evidence").remove([path]);
          throw new Error(error?.message || (ar ? "تعذر إنشاء الطلب." : "Could not create request."));
        }
      }
      if (!createdId) { await supabase.storage.from("evidence").remove([path]); throw new Error(ar ? "تعذر توليد كود فريد. حاولي مرة ثانية." : "Could not generate a unique code. Try again."); }

      const { error: approvalsError } = await supabase.from("approval_requests").insert([
        { decision_id: createdId, owner_id:user.id, party_role:"INITIATOR", party_name:initiatorName, party_phone:initiatorPhone || null },
        { decision_id: createdId, owner_id:user.id, party_role:"COUNTERPARTY", party_name:counterpartyName, party_phone:counterpartyPhone || null },
      ]);
      if (approvalsError) throw new Error(approvalsError.message);

      router.push(withLang(`/decision/${createdId}`,lang)); router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : (ar ? "حدث خطأ غير متوقع." : "Unexpected error."));
    } finally { setBusy(false); }
  }

  return <form className="form-card product-form" onSubmit={submit}>
    <div className="form-section-title"><span>01</span>{ar?"المعاملة":"Agreement request"}</div>
    <div className="integrity-note"><Info size={17}/><span>{ar?"ما راح تسجلين قرار بعد ما يصير. أنشئي الطلب قبل الاعتماد، وPROOF ينشئ سجل القرار تلقائيًا بعد موافقة الطرفين.":"You do not log a decision after the fact. Start the request before approval and PROOF creates the final decision record automatically after both parties approve."}</span></div>
    <div className="field-grid"><label>{ar?"وش المطلوب اعتماده؟":"What needs approval?"}<input name="title" required maxLength={140} placeholder={ar?"اعتماد عرض سعر تصميم الموقع":"Approve website design quotation"}/></label><label>{ar?"المشروع / السياق":"Project / context"}<input name="project_name" maxLength={160} placeholder={ar?"مشروع الموقع الإلكتروني":"Website Project"}/></label></div>
    <label>{ar?"تفاصيل الطلب":"Request details"}<textarea name="details" required maxLength={1800} rows={4} placeholder={ar?"مثال: تنفيذ الموقع حسب النطاق والمواصفات الموجودة في الملف المرفق.":"Example: Deliver the website according to the scope and specifications in the attached file."}/><span className="field-hint">{ar?"PROOF يحول هذه البيانات تلقائيًا إلى سجل قرار نهائي بعد اكتمال الموافقتين.":"PROOF automatically turns this request into a final decision record after both approvals."}</span></label>
    <div className="field-grid three"><label>{ar?"المبلغ":"Amount"}<input name="amount" type="number" min="0" step="0.01" placeholder="1800"/></label><label>{ar?"العملة":"Currency"}<select name="currency" defaultValue="SAR"><option>SAR</option><option>USD</option><option>AED</option><option>EUR</option></select></label></div>

    <div className="form-section-title"><span>02</span>{ar?"الطرفان":"Both parties"}</div>
    <div className="field-grid"><label>{ar?"الطرف الأول / منشئ الطلب":"Party 1 / Requester"}<input name="initiator_name" required maxLength={120} placeholder={ar?"غلا الهاشمي":"Ghala AlHashmi"}/></label><label>{ar?"رقم جوال الطرف الأول":"Party 1 mobile"}<input name="initiator_phone" inputMode="tel" placeholder="+9665XXXXXXXX"/></label></div>
    <div className="field-grid"><label>{ar?"الطرف الثاني / المستلم":"Party 2 / Recipient"}<input name="counterparty_name" required maxLength={120} placeholder={ar?"أحمد — المقاول":"Ahmed — Contractor"}/></label><label>{ar?"رقم جوال الطرف الثاني":"Party 2 mobile"}<input name="counterparty_phone" inputMode="tel" placeholder="+9665XXXXXXXX"/></label></div>
    <div className="integrity-note"><UsersRound size={17}/><span>{ar?"كل طرف يحصل على رابط اعتماد مستقل. لا يصبح السجل معتمدًا إلا بعد موافقة الطرفين. رفض أي طرف ينهي الطلب كـ مرفوض.":"Each party receives an independent approval link. The record is approved only after both parties approve. A rejection by either party ends the request as rejected."}</span></div>

    <div className="form-section-title"><span>03</span>{ar?"الملف المرجعي":"Reference evidence"}</div>
    <label className="dropzone"><FileUp size={30}/><strong>{ar?"ارفع العرض / العقد / النطاق / الملف المرتبط":"Attach the quote, contract, scope or supporting file"}</strong><span>{ar?"صورة، PDF، نص أو مستند · بحد أقصى 6 MB":"Image, PDF, text or document · max 6 MB"}</span><input name="evidence" type="file" required accept="image/*,.pdf,.txt,.doc,.docx"/></label>
    <div className="integrity-note"><Info size={17}/><span>{ar?"تُحسب بصمة SHA-256 للملف قبل رفعه، ويبقى الملف خاصًا. بعد موافقة الطرفين يُقفل السجل ولا يمكن تغيير الملف أو بيانات الاتفاق.":"SHA-256 is calculated before upload and the file remains private. After both parties approve, the record is locked and the agreement data cannot be changed."}</span></div>
    {error&&<div className="error-box">{error}</div>}
    <button className="button button-primary button-wide button-large" disabled={busy}><ShieldCheck size={18}/>{busy?(ar?"جاري إنشاء الطلب وتجهيز الموافقات…":"Creating request and preparing approvals…"):(ar?"إنشاء طلب اعتماد للطرفين":"Create two-party approval request")}</button>
  </form>;
}
