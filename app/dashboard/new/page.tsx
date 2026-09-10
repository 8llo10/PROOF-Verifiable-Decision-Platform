import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DecisionForm } from "@/components/DecisionForm";
import { Logo } from "@/components/Logo";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { resolveLang, withLang } from "@/lib/i18n";

export default async function NewDecision({searchParams}:{searchParams:Promise<{lang?:string}>}) {
  const q=await searchParams; const lang=resolveLang(q.lang); const ar=lang==="ar";
  return <main className="app-bg" dir={ar?"rtl":"ltr"}>
    <header className="app-header"><Link href={withLang("/",lang)}><Logo/></Link><LanguageSwitch lang={lang}/></header>
    <div className="narrow-container">
      <Link href={withLang("/dashboard",lang)} className="back-link">{ar?<ArrowRight size={16}/>:<ArrowLeft size={16}/>} {ar?"العودة للقرارات":"Back to decisions"}</Link>
      <div className="page-heading"><span className="eyebrow">{ar?"سجل جديد":"NEW RECORD"}</span><h1>{ar?"ثبّت قرار تشغيلي":"Capture a decision"}</h1><p>{ar?"ارفع الدليل الأصلي وسجّل القرار. الوصول الفعلي محمي بحسابك وصلاحيات RLS في قاعدة البيانات.":"Attach the original evidence and capture the decision. Access is protected by your account and database RLS policies."}</p></div>
      <DecisionForm lang={lang}/>
    </div>
  </main>;
}
