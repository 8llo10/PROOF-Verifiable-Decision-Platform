import {Search,ShieldCheck,LockKeyhole} from "lucide-react";
import {Nav} from "@/components/Nav";
import {resolveLang} from "@/lib/i18n";

export default async function VerifyPage({searchParams}:{searchParams:Promise<{lang?:string}>}){
  const q=await searchParams; const lang=resolveLang(q.lang); const ar=lang==="ar";
  return <main dir={ar?"rtl":"ltr"}><Nav lang={lang}/><section className="verify-hero container"><div className="verify-icon"><ShieldCheck/></div><span className="eyebrow">{ar?"تحقق عام":"PUBLIC VERIFICATION"}</span><h1>{ar?"تحقق من قرار معتمد.":"Verify an approved decision."}</h1><p>{ar?"أدخل كود PROOF. إذا كان القرار معتمدًا، تظهر بياناته وبصمة الدليل بدون كشف الملف الأصلي الخاص.":"Enter a PROOF code. If the decision is approved, its record and evidence fingerprint are shown without exposing the private original file."}</p><form className="verify-search" action="/verify/lookup" method="get"><Search/><input type="hidden" name="lang" value={lang}/><input name="code" placeholder="PR-4821" pattern="PR-[0-9]{4}" title="PR-0000" required/><button className="button button-primary">{ar?"تحقق من السجل":"Verify record"}</button></form><div className="trust-line"><LockKeyhole size={16}/>{ar?"لا يحتاج تسجيل دخول. القرارات غير المعتمدة لا تظهر للعامة.":"No sign-in required. Unapproved records remain private."}</div></section></main>;
}
