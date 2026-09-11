import Link from "next/link";
import { FileCheck2, Fingerprint, LockKeyhole } from "lucide-react";
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
      <div>
        <span className="eyebrow">PROOF · {ar ? "سجل إثبات القرارات" : "DECISION EVIDENCE REGISTRY"}</span>
        <h1>{ar ? "مساحة العمل الخاصة بقراراتك" : "Your private decision workspace"}</h1>
        <p>{ar ? "أنشئ سجلًا لكل موافقة مهمة، اربطه بالدليل الأصلي، ثم اعتمده واحصل على كود تحقق يمكن مشاركته بدون كشف الملف الخاص." : "Create a record for every important approval, attach the original evidence, approve it and share a verification code without exposing the private file."}</p>
      </div>
      <div className="login-benefits">
        <span><LockKeyhole size={15}/>{ar ? "السجلات والملفات خاصة بمالك الحساب" : "Owner-scoped private records and files"}</span>
        <span><Fingerprint size={15}/>{ar ? "بصمة SHA-256 لكل دليل" : "SHA-256 fingerprint for every evidence file"}</span>
        <span><FileCheck2 size={15}/>{ar ? "التحقق العام للقرارات المعتمدة فقط" : "Public verification for approved records only"}</span>
      </div>
      <AuthForm lang={lang}/>
      <Link className="text-link" href={withLang("/verify",lang)}>{ar ? "عندي كود وأبغى أتحقق من سجل فقط ←" : "I have a code and only need to verify a record →"}</Link>
    </div>
  </main>;
}
