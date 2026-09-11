import Link from "next/link";
import {
  ArrowRight, BadgeCheck, Building2, CheckCircle2, FileCheck2, FileLock2,
  Fingerprint, HardHat, Link2, SearchCheck, ShieldCheck, UsersRound, Wrench
} from "lucide-react";
import { Nav } from "@/components/Nav";
import { resolveLang, withLang } from "@/lib/i18n";

export default async function Home({searchParams}:{searchParams:Promise<{lang?:string}>}) {
  const q=await searchParams; const lang=resolveLang(q.lang); const ar=lang==="ar";
  return <main dir={ar?"rtl":"ltr"} lang={lang}>
    <Nav lang={lang}/>

    <section className="hero container product-hero product-hero-grid">
      <div className="hero-copy-column">
        <div className="product-nameplate"><span className="product-name">PROOF</span><span>{ar?"اعتماد طرفين وإثبات قابل للتحقق":"Two-party approval & verifiable evidence"}</span></div>
        <h1>{ar?<>ابدأ الطلب.<br/><em>وخلي PROOF يثبت القرار.</em></>:<>Start the request.<br/><em>Let PROOF prove the decision.</em></>}</h1>
        <p className="hero-copy">{ar?"بدل ما يتفق طرفان في واتساب ثم يرجع أحد يسجل القرار يدويًا، تبدأ المعاملة داخل PROOF مرة واحدة. النظام ينشئ طلب موافقة مستقل لكل طرف، يربط الموافقتين بنفس الملف وبصمته الرقمية، ثم يقفل سجل القرار تلقائيًا بعد اكتمالهما.":"Instead of agreeing in chat and manually documenting the decision later, start the agreement once in PROOF. The system creates an independent approval request for each party, binds both responses to the same evidence fingerprint, then locks the final decision record automatically."}</p>
        <div className="hero-actions"><Link className="button button-primary" href={withLang("/login",lang)}>{ar?"ابدأ طلب اعتماد":"Start an approval request"}<ArrowRight size={18}/></Link><Link className="button button-ghost" href={withLang("/verify",lang)}>{ar?"تحقق من سجل":"Verify a record"}</Link></div>
        <div className="product-promise"><span><UsersRound size={16}/>{ar?"موافقة الطرفين إلزامية":"Both parties must approve"}</span><span><Fingerprint size={16}/>{ar?"SHA-256 للملف المرجعي":"SHA-256 evidence fingerprint"}</span><span><BadgeCheck size={16}/>{ar?"إقفال تلقائي بعد الاكتمال":"Automatic final lock"}</span></div>
      </div>

      <div className="product-preview">
        <div className="preview-toolbar"><div><span className="preview-dot"/><span className="preview-dot"/><span className="preview-dot"/></div><span>PR-4821</span></div>
        <div className="preview-status"><CheckCircle2 size={17}/>{ar?"اكتملت موافقة الطرفين":"Both parties approved"}</div>
        <h3>{ar?"اعتماد عرض سعر تصميم الموقع":"Website design quotation approval"}</h3>
        <p>{ar?"تنفيذ الموقع حسب النطاق والمواصفات في الملف المرفق بقيمة 1,800 ريال.":"Deliver the website according to the attached scope and specifications for 1,800 SAR."}</p>
        <div className="preview-meta"><div><span>{ar?"الطرف الأول":"Party 1"}</span><strong>{ar?"صاحبة المشروع · موافق":"Project owner · Approved"}</strong></div><div><span>{ar?"الطرف الثاني":"Party 2"}</span><strong>{ar?"المقاول · موافق":"Contractor · Approved"}</strong></div></div>
        <div className="preview-file"><FileCheck2/><div><strong>website-scope.pdf</strong><span>SHA-256 · 3d863945…5d0d</span></div><ShieldCheck/></div>
        <div className="preview-audit"><span/><div><strong>{ar?"أُنشئ طلب الاعتماد":"Approval request created"}</strong><small>11 Sep 2026 · 05:12</small></div></div>
        <div className="preview-audit"><span/><div><strong>{ar?"وافق الطرف الأول":"Party 1 approved"}</strong><small>11 Sep 2026 · 05:14</small></div></div>
        <div className="preview-audit"><span/><div><strong>{ar?"وافق الطرف الثاني · تم الإقفال":"Party 2 approved · Locked"}</strong><small>11 Sep 2026 · 05:17</small></div></div>
      </div>
    </section>

    <section className="problem-band"><div className="container problem-grid"><div><span className="eyebrow">{ar?"المشكلة اللي نحلها":"THE PROBLEM"}</span><h2>{ar?"لا تسجل القرار بعد ما يضيع سياقه.":"Do not document the decision after its context is lost."}</h2><p>{ar?"العرض في ملف، والموافقة في رسالة، والطرف الثاني يقول إنه وافق على نسخة مختلفة. PROOF يجعل الاعتماد نفسه هو الذي يصنع سجل القرار، بدل الاعتماد على ذاكرة أحد أو توثيق يدوي لاحق.":"The quote is in a file, approval is in a message, and later someone says they approved a different revision. PROOF makes the approval process create the record itself instead of relying on memory or after-the-fact documentation."}</p></div><div className="chat-stack"><div className="bubble">{ar?"هذا العرض النهائي، نعتمده؟":"This is the final quote. Approve?"}</div><div className="bubble bubble-muted">{ar?"أرسل لي رابط PROOF.":"Send me the PROOF link."}</div><div className="bubble bubble-alert">{ar?"تمت موافقة الطرفين وربطها بنفس الملف ✓":"Both approvals are now bound to the same file ✓"}</div></div></div></section>

    <section id="how" className="container steps-section"><span className="eyebrow">{ar?"كيف يعمل":"HOW IT WORKS"}</span><h2 className="section-title">{ar?"طلب واحد. رابطان. سجل نهائي واحد.":"One request. Two links. One final record."}</h2><div className="steps">
      <article><FileCheck2/><span>01</span><h3>{ar?"ابدأ المعاملة":"Start"}</h3><p>{ar?"أدخل المطلوب اعتماده والطرفين وارفع الملف المرجعي مرة واحدة.":"Enter what needs approval, both parties and the reference file once."}</p></article>
      <article><Link2/><span>02</span><h3>{ar?"أرسل رابطين":"Invite"}</h3><p>{ar?"PROOF ينشئ رابط اعتماد مستقل لكل طرف ويمكن إرساله مباشرة عبر واتساب.":"PROOF creates an independent approval link for each party, ready to send through WhatsApp."}</p></article>
      <article><UsersRound/><span>03</span><h3>{ar?"الطرفان يردان":"Approve"}</h3><p>{ar?"كل طرف يراجع نفس المعاملة والبصمة ويوافق أو يرفض من جواله بدون حساب.":"Each party reviews the same agreement and fingerprint, then approves or rejects without an account."}</p></article>
      <article><ShieldCheck/><span>04</span><h3>{ar?"إقفال تلقائي":"Lock"}</h3><p>{ar?"بعد الموافقتين، يتحول الطلب تلقائيًا إلى سجل معتمد ومقفل وقابل للتحقق العام.":"After both approvals, the request automatically becomes a locked, publicly verifiable record."}</p></article>
    </div></section>

    <section className="product-capabilities container"><div className="section-copy"><span className="eyebrow">{ar?"مصمم للراحة والثقة":"BUILT FOR LOW-FRICTION TRUST"}</span><h2>{ar?"المستخدم يشوف خطوات بسيطة. النظام يتكفل بالباقي.":"The user sees simple actions. The system handles the proof."}</h2><p>{ar?"ما يحتاج الطرف الثاني حساب، وما يحتاج صاحب المعاملة يعيد كتابة القرار بعد الاتفاق. قاعدة البيانات تسجل الردود، الوقت، حالة كل طرف، وسجل التدقيق، ثم تقفل السجل آليًا.":"The recipient needs no account and the requester never retypes the decision afterwards. The database records responses, timestamps, party states and the audit trail, then locks the record automatically."}</p></div><div className="capability-grid">
      <article><div className="capability-icon"><FileLock2/></div><h3>{ar?"ملف خاص":"Private evidence"}</h3><p>{ar?"الملف المرجعي يبقى خاصًا بصاحب المعاملة، بينما الطرفان يوافقان على بياناته وبصمته.":"The reference file remains private to its owner while both approvals are bound to its metadata and fingerprint."}</p></article>
      <article><div className="capability-icon"><Fingerprint/></div><h3>{ar?"سلامة النسخة":"Exact-version integrity"}</h3><p>{ar?"إذا تغيرت نسخة الملف، تتغير بصمة SHA-256 ولا تطابق النسخة التي تم الاعتماد عليها.":"If the file changes, its SHA-256 fingerprint changes and no longer matches the approved version."}</p></article>
      <article><div className="capability-icon"><SearchCheck/></div><h3>{ar?"تحقق بعد الاعتماد":"Verify later"}</h3><p>{ar?"بعد اكتمال الطرفين فقط، يصبح كود PR صالحًا للتحقق العام بدون كشف الملف الأصلي.":"Only after both parties approve does the PR code become publicly verifiable without exposing the original file."}</p></article>
    </div></section>

    <section className="usecases container"><div className="section-copy"><span className="eyebrow">{ar?"متى يفيد؟":"WHERE IT FITS"}</span><h2>{ar?"أي اتفاق صغير لكن الرجوع له لاحقًا مهم.":"Any lightweight agreement that may matter later."}</h2></div><div className="usecase-grid"><article><HardHat/><h3>{ar?"المقاولات والمشاريع":"Construction & projects"}</h3><p>{ar?"فروقات الأسعار، أوامر التغيير، اعتماد مورد أو نطاق عمل.":"Cost variations, change orders, suppliers and scope approvals."}</p></article><article><Wrench/><h3>{ar?"الصيانة والتشغيل":"Maintenance & operations"}</h3><p>{ar?"اعتماد إصلاح أو استبدال قطعة أو إجراء تشغيلي بين جهتين.":"Repair, part replacement and operational approvals between parties."}</p></article><article><Building2/><h3>{ar?"الخدمات والفريلانسر":"Services & freelance"}</h3><p>{ar?"اعتماد عرض سعر، نطاق تسليم، إضافة مدفوعة أو تغيير في الاتفاق.":"Quotations, delivery scope, paid additions and agreement changes."}</p></article></div></section>

    <section className="cta-band"><div className="container cta-card"><FileCheck2/><div><span className="eyebrow">PROOF</span><h2>{ar?"بدل «قلت لك ووافقت». خل الموافقة نفسها تصير إثبات.":"Turn “you said yes” into a verifiable approval record."}</h2></div><Link className="button button-primary" href={withLang("/login",lang)}>{ar?"ابدأ الآن":"Start now"}</Link></div></section>

    <footer className="product-footer"><div className="container"><div><strong>PROOF</strong><span>{ar?"منصة اعتماد طرفين وإثبات القرارات":"Two-party approval & decision evidence platform"}</span></div><div><Link href={withLang("/verify",lang)}>{ar?"التحقق العام":"Public verification"}</Link><Link href={withLang("/login",lang)}>{ar?"تسجيل الدخول":"Sign in"}</Link></div><p>{ar?"PROOF يثبت ما تم اعتماده وربطه ببصمة ملف وسجل استجابة؛ ولا يحل محل العقود النظامية أو يثبت صحة الادعاء التجاري نفسه.":"PROOF records what was approved and binds it to a file fingerprint and response trail; it is not a substitute for a legal contract and does not prove the truth of the underlying commercial claim."}</p></div></footer>
  </main>;
}
