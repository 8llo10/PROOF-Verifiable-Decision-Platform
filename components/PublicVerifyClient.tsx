"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Calendar, FileText, ShieldCheck, XCircle, BriefcaseBusiness, Users, WalletCards } from "lucide-react";
import { Nav } from "@/components/Nav";
import { HashBlock } from "@/components/HashBlock";
import { VerifyFile } from "@/components/VerifyFile";
import { publicSupabase } from "@/lib/supabase-browser";
import { locale, withLang, type Lang } from "@/lib/i18n";

type PublicDecision = {
  code:string; title:string; summary:string; project_name:string|null; amount:number|null; currency:string; parties:string[]; status:"APPROVED";
  evidence_name:string; evidence_type:string|null; evidence_size:number|null; evidence_hash:string; created_at:string; decided_at:string|null; decision_note:string|null;
};

const PUBLIC_FIELDS = "code,title,summary,project_name,amount,currency,parties,status,evidence_name,evidence_type,evidence_size,evidence_hash,created_at,decided_at,decision_note";

export function PublicVerifyClient({ code, lang }: { code: string; lang: Lang }) {
  const ar = lang === "ar";
  const [record, setRecord] = useState<PublicDecision | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let live = true;
    (async () => {
      const { data } = await publicSupabase.from("decisions").select(PUBLIC_FIELDS).eq("code", code.toUpperCase()).eq("status", "APPROVED").maybeSingle();
      if (!live) return;
      setRecord((data || null) as PublicDecision | null); setLoading(false);
    })();
    return () => { live = false; };
  }, [code]);

  return <main dir={ar?"rtl":"ltr"}><Nav lang={lang}/><div className="verify-record container">
    <Link href={withLang("/verify",lang)} className="back-link">{ar?"← تحقق من سجل آخر":"← Verify another record"}</Link>
    {loading ? <div className="empty-state">{ar?"جاري التحقق من السجل…":"Verifying record…"}</div> : !record ? <section className="verification-banner not-verified"><div><XCircle/></div><span>{ar?"غير متحقق":"NOT VERIFIED"}</span><h1>{ar?"ما لقينا سجل معتمد بهذا الكود.":"No approved record was found for this code."}</h1><p>{ar?"تأكد من الكود. السجلات المعلقة أو المرفوضة لا تظهر في التحقق العام.":"Check the code. Pending and rejected records are never exposed through public verification."}</p></section> : <Verified record={record} lang={lang}/>} 
  </div></main>;
}

function Verified({record:d,lang}:{record:PublicDecision;lang:Lang}){
  const ar=lang==="ar";
  return <><section className="verification-banner verified"><div><CheckCircle2/></div><span>{ar?"سجل معتمد":"VERIFIED RECORD"}</span><h1>{ar?"هذا الدليل مرتبط بقرار معتمد.":"Evidence is tied to an approved decision record."}</h1><p>{ar?"رقم السجل":"Record"} {d.code} · {ar?"أُنشئ":"created"} {new Date(d.created_at).toLocaleDateString(locale(lang))}</p></section><div className="public-record-grid"><section className="record-card"><div className="public-title"><span>{d.code}</span><h2>{d.title}</h2><p>{d.summary}</p></div><div className="public-details public-details-extended"><div><BriefcaseBusiness/><span>{ar?"المشروع":"Project"}</span><strong>{d.project_name||(ar?"عام":"General")}</strong></div><div><Users/><span>{ar?"الأطراف":"Parties"}</span><strong>{d.parties.length?d.parties.join(ar?"، ":", "):(ar?"غير محدد":"Not specified")}</strong></div><div><WalletCards/><span>{ar?"المبلغ":"Amount"}</span><strong>{d.amount!==null?`${Number(d.amount).toLocaleString(locale(lang))} ${d.currency}`:(ar?"غير محدد":"Not specified")}</strong></div><div><Calendar/><span>{ar?"وقت القرار":"Decision time"}</span><strong>{d.decided_at?new Date(d.decided_at).toLocaleString(locale(lang)):(ar?"غير محدد":"Not specified")}</strong></div><div><FileText/><span>{ar?"اسم الدليل الأصلي":"Original evidence name"}</span><strong>{d.evidence_name}</strong></div><div><ShieldCheck/><span>{ar?"طريقة التحقق":"Integrity method"}</span><strong>SHA-256</strong></div></div><HashBlock hash={d.evidence_hash} lang={lang}/></section><VerifyFile expectedHash={d.evidence_hash} lang={lang}/></div><p className="verification-note">{ar?"PROOF يتحقق من سلامة الملف، وليس من صحة الادعاء التجاري نفسه. الملف الأصلي يبقى خاصًا بمالكه؛ صفحة التحقق تعرض البصمة والبيانات المعتمدة فقط.":"PROOF verifies file integrity, not the truthfulness of the underlying business claim. The original evidence stays private to its owner; public verification exposes only the approved record and fingerprint."}</p></>;
}
