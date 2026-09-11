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
      <Link href={withLang("/dashboard",lang)} className="back-link">{ar?<ArrowRight size={16}/>:<ArrowLeft size={16}/>} {ar?"العودة للطلبات":"Back to requests"}</Link>
      <div className="page-heading"><span className="eyebrow">{ar?"طلب اعتماد جديد":"NEW APPROVAL REQUEST"}</span><h1>{ar?"ابدأ المعاملة قبل القرار":"Start the agreement before the decision"}</h1><p>{ar?"أدخل بيانات المعاملة والطرفين مرة واحدة. PROOF ينشئ طلبَي موافقة مستقلين، ويتحول الطلب تلقائيًا إلى سجل قرار مقفل فقط بعد موافقة الطرفين.":"Enter the agreement and both parties once. PROOF creates two independent approval requests and automatically turns the request into a locked decision record only after both parties approve."}</p></div>
      <DecisionForm lang={lang}/>
    </div>
  </main>;
}
