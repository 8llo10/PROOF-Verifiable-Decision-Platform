import Link from "next/link";
import { FileCheck2, Fingerprint, LockKeyhole, UsersRound } from "lucide-react";
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
        <span className="eyebrow">PROOF · {ar ? "اعتماد طرفين وإثبات القرار" : "TWO-PARTY APPROVAL & DECISION EVIDENCE"}</span>
        <h1>{ar ? "مركز اعتماداتك" : "Your approval workspace"}</h1>
        <p>{ar ? "ابدأ المعاملة مرة واحدة، أرسل لكل طرف رابط اعتماد مستقل، وخلي PROOF ينشئ السجل النهائي ويقفله تلقائيًا بعد موافقة الطرفين." : "Start the agreement once, send each party an independent approval link, and let PROOF create and lock the final record automatically after both approve."}</p>
      </div>
      <div className="login-benefits">
        <span><UsersRound size={15}/>{ar ? "موافقة مستقلة وإلزامية للطرفين" : "Independent approval from both parties"}</span>
        <span><LockKeyhole size={15}/>{ar ? "الملف الأصلي خاص بمالك المعاملة" : "Original evidence stays private"}</span>
        <span><Fingerprint size={15}/>{ar ? "بصمة SHA-256 تربط الردود بنفس النسخة" : "SHA-256 binds responses to one exact version"}</span>
        <span><FileCheck2 size={15}/>{ar ? "تحقق عام فقط بعد اكتمال الموافقتين" : "Public verification only after both approvals"}</span>
      </div>
      <AuthForm lang={lang}/>
      <Link className="text-link" href={withLang("/verify",lang)}>{ar ? "عندي كود وأبغى أتحقق من سجل فقط ←" : "I have a code and only need to verify a record →"}</Link>
    </div>
  </main>;
}
