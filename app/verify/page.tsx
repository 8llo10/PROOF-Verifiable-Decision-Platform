import { FileCheck2, LockKeyhole, Search, ShieldCheck } from "lucide-react";
import { Nav } from "@/components/Nav";
import { resolveLang } from "@/lib/i18n";

export default async function VerifyPage({searchParams}:{searchParams:Promise<{lang?:string}>}){
  const q=await searchParams;
  const lang=resolveLang(q.lang);
  const ar=lang==="ar";
  return <main dir={ar?"rtl":"ltr"}>
    <Nav lang={lang}/>
    <section className="verify-hero container">
      <div className="verify-icon"><ShieldCheck/></div>
      <span className="eyebrow">PROOF · {ar?"التحقق العام":"PUBLIC VERIFICATION"}</span>
      <h1>{ar?"عندك كود قرار؟ تحقق منه هنا.":"Have a decision code? Verify it here."}</h1>
      <p>{ar?"كل قرار معتمد في PROOF يحصل على كود مثل PR-4821. أدخل الكود لعرض القرار المعتمد وبصمة الدليل، وبعدها تقدر ترفع نسختك من الملف وتتأكد هل هي نفس النسخة المرتبطة بالسجل أم لا.":"Every approved PROOF decision has a code such as PR-4821. Enter it to inspect the approved record and evidence fingerprint, then upload your copy to check whether it is exactly the same file tied to the record."}</p>
      <form className="verify-search" action="/verify/lookup" method="get">
        <Search/><input type="hidden" name="lang" value={lang}/><input name="code" placeholder="PR-4821" pattern="PR-[0-9]{4}" title="PR-0000" required/><button className="button button-primary">{ar?"تحقق الآن":"Verify now"}</button>
      </form>
      <div className="verify-explainer">
        <span><FileCheck2 size={17}/><strong>{ar?"يظهر":"Shown"}</strong>{ar?" القرار المعتمد وبياناته وبصمة الدليل":" Approved decision metadata and fingerprint"}</span>
        <span><LockKeyhole size={17}/><strong>{ar?"يبقى خاص":"Private"}</strong>{ar?" الملف الأصلي نفسه لا يتم كشفه للعامة":" The original evidence file is never exposed publicly"}</span>
      </div>
      <div className="trust-line"><LockKeyhole size={16}/>{ar?"ما يحتاج حساب. السجلات المعلقة والمرفوضة لا تظهر للعامة.":"No account required. Pending and rejected records are never public."}</div>
    </section>
  </main>;
}
