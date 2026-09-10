import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { AuthForm } from "@/components/AuthForm";
import { resolveLang, withLang } from "@/lib/i18n";

export default async function Login({ searchParams }: { searchParams: Promise<{lang?:string}> }) {
  const q = await searchParams;
  const lang = resolveLang(q.lang);
  const ar = lang === "ar";
  return <main className="login-page" dir={ar ? "rtl" : "ltr"}>
    <div className="login-card">
      <div className="login-top"><Link href={withLang("/", lang)}><Logo/></Link><LanguageSwitch lang={lang}/></div>
      <div><span className="eyebrow">{ar ? "حساب PROOF" : "PROOF ACCOUNT"}</span><h1>{ar ? "ادخل لمساحة قراراتك" : "Your decision workspace"}</h1><p>{ar ? "أنشئ حسابك مجانًا. سجلاتك وملفاتك الخاصة معزولة بصلاحيات قاعدة البيانات، بينما التحقق العام يعرض القرارات المعتمدة فقط." : "Create a free account. Your private records and evidence are isolated by database policies, while public verification exposes approved records only."}</p></div>
      <AuthForm lang={lang}/>
      <Link className="text-link" href={withLang("/verify",lang)}>{ar ? "أبغى أتحقق من سجل فقط ←" : "I only need to verify a record →"}</Link>
    </div>
  </main>;
}
