import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  FileCheck2,
  FileLock2,
  Fingerprint,
  HardHat,
  LockKeyhole,
  MessageSquareText,
  SearchCheck,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { Nav } from "@/components/Nav";
import { resolveLang, withLang } from "@/lib/i18n";

export default async function Home({searchParams}:{searchParams:Promise<{lang?:string}>}) {
  const q = await searchParams;
  const lang = resolveLang(q.lang);
  const ar = lang === "ar";

  return <main dir={ar ? "rtl" : "ltr"} lang={lang}>
    <Nav lang={lang}/>

    <section className="hero container product-hero product-hero-grid">
      <div className="hero-copy-column">
        <div className="product-nameplate">
          <span className="product-name">PROOF</span>
          <span>{ar ? "سجل إثبات القرارات" : "Decision Evidence Registry"}</span>
        </div>
        <h1>{ar ? <>ثبّت القرار.<br/><em>واحفظ دليله.</em></> : <>Capture the decision.<br/><em>Protect the evidence.</em></>}</h1>
        <p className="hero-copy">
          {ar
            ? "منتج للفرق التي تعتمد قرارات مهمة عبر واتساب، البريد، الصور أو الملفات. PROOF يحوّل كل موافقة إلى سجل مستقل يوضح ماذا تم اعتماده، من الأطراف، وما هو الملف الأصلي المرتبط به — مع بصمة رقمية وسجل تدقيق يمكن الرجوع له لاحقًا."
            : "A product for teams that approve important work through chats, email, screenshots and files. PROOF turns each approval into a durable record showing what was approved, who was involved and the exact evidence file behind it — with a digital fingerprint and audit trail."}
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" href={withLang("/login",lang)}>{ar ? "إنشاء حساب وتجربة المنتج" : "Create account & try PROOF"} <ArrowRight size={18}/></Link>
          <Link className="button button-ghost" href={withLang("/verify",lang)}>{ar ? "تحقق من سجل" : "Verify a record"}</Link>
        </div>
        <div className="product-promise">
          <span><LockKeyhole size={16}/>{ar ? "الملف الأصلي خاص" : "Original file stays private"}</span>
          <span><Fingerprint size={16}/>{ar ? "SHA-256 لكل دليل" : "SHA-256 per evidence file"}</span>
          <span><BadgeCheck size={16}/>{ar ? "القرار المعتمد يصبح نهائي" : "Approved records become final"}</span>
        </div>
      </div>

      <div className="product-preview" aria-label={ar ? "مثال على سجل قرار" : "Decision record example"}>
        <div className="preview-toolbar"><div><span className="preview-dot"/><span className="preview-dot"/><span className="preview-dot"/></div><span>PR-4821</span></div>
        <div className="preview-status"><CheckCircle2 size={17}/>{ar ? "قرار معتمد" : "Approved decision"}</div>
        <h3>{ar ? "استبدال الباب المقاوم للحريق — الدور الثالث" : "Replace fire-rated door — Floor 3"}</h3>
        <p>{ar ? "تم اعتماد المورد البديل وزيادة 1,800 ريال للنسخة المعدلة." : "The alternative supplier and the additional 1,800 SAR were approved for the revised option."}</p>
        <div className="preview-meta"><div><span>{ar ? "المشروع" : "Project"}</span><strong>{ar ? "مبنى النور" : "Al Noor Building"}</strong></div><div><span>{ar ? "الأطراف" : "Parties"}</span><strong>{ar ? "مدير الموقع · المقاول" : "Site Manager · Contractor"}</strong></div></div>
        <div className="preview-file"><FileCheck2/><div><strong>supplier-revision.pdf</strong><span>SHA-256 · 3d863945…5d0d</span></div><ShieldCheck/></div>
        <div className="preview-audit"><span/><div><strong>{ar ? "تم إنشاء السجل" : "Record created"}</strong><small>10 Sep 2026 · 22:41</small></div></div>
        <div className="preview-audit"><span/><div><strong>{ar ? "تم اعتماد القرار" : "Decision approved"}</strong><small>10 Sep 2026 · 22:46</small></div></div>
      </div>
    </section>

    <section className="problem-band"><div className="container problem-grid">
      <div><span className="eyebrow">{ar ? "ليش PROOF موجود؟" : "WHY PROOF EXISTS"}</span><h2>{ar ? "الموافقة موجودة. لكن إثباتها ضايع." : "The approval exists. The proof does not."}</h2><p>{ar ? "تتخذ الفرق قراراتها بسرعة: رسالة، صورة، مكالمة، PDF. المشكلة تظهر لاحقًا لما يحتاج أحد يثبت بالضبط وش اللي تم اعتماده وعلى أي نسخة من الملف." : "Teams move fast: a message, screenshot, call or PDF. The problem appears later when someone needs to prove exactly what was approved and against which version of the file."}</p></div>
      <div className="chat-stack"><div className="bubble">{ar ? "اعتمدوا الباب البديل. الزيادة 1,800 ريال موافق عليها." : "Use the revised door. +1,800 SAR is approved."}</div><div className="bubble bubble-muted">{ar ? "أي نسخة من عرض المورد؟" : "Which supplier revision?"}</div><div className="bubble bubble-alert">{ar ? "وهل الملف هذا هو نفسه اللي كان وقت الاعتماد؟" : "Is this the exact file that existed when it was approved?"}</div></div>
    </div></section>

    <section id="how" className="container steps-section">
      <span className="eyebrow">{ar ? "من الموافقة إلى الإثبات" : "FROM APPROVAL TO PROOF"}</span>
      <h2 className="section-title">{ar ? "أربع خطوات. بدون نظام ضخم." : "Four steps. No heavyweight workflow system."}</h2>
      <div className="steps">
        <article><MessageSquareText/><span>01</span><h3>{ar ? "سجّل القرار" : "Capture"}</h3><p>{ar ? "اكتب النتيجة النهائية، المشروع، الأطراف والمبلغ إن وجد." : "Record the final decision, context, parties and optional amount."}</p></article>
        <article><Fingerprint/><span>02</span><h3>{ar ? "ارفع الدليل" : "Fingerprint"}</h3><p>{ar ? "أرفق الصورة أو الـPDF أو المستند الأصلي وتُحسب له بصمة SHA-256." : "Attach the original screenshot, PDF or document and compute its SHA-256 fingerprint."}</p></article>
        <article><CheckCircle2/><span>03</span><h3>{ar ? "اعتمد أو ارفض" : "Decide"}</h3><p>{ar ? "غيّر الحالة مرة واحدة مع ملاحظة ووقت محفوظين في سجل التدقيق." : "Approve or reject with a note and timestamp preserved in the audit trail."}</p></article>
        <article><SearchCheck/><span>04</span><h3>{ar ? "تحقق لاحقًا" : "Verify later"}</h3><p>{ar ? "استخدم كود PR للتحقق من السجل أو أعد رفع نسخة من الملف لمطابقة بصمتها." : "Use the PR code to verify the record or re-upload a copy to compare its fingerprint."}</p></article>
      </div>
    </section>

    <section className="product-capabilities container">
      <div className="section-copy"><span className="eyebrow">{ar ? "وش المنتج يسوي فعليًا؟" : "WHAT THE PRODUCT ACTUALLY DOES"}</span><h2>{ar ? "مساحة عمل خاصة + تحقق عام." : "Private workspace + public verification."}</h2><p>{ar ? "المالك يدير سجلاته وأدلته داخل حسابه. الشخص الخارجي ما يحتاج حساب؛ يدخل كود السجل ويتحقق من قرار معتمد فقط، بدون وصول للملف الأصلي." : "Owners manage records and private evidence inside their workspace. External verifiers need no account; they enter a record code and can inspect approved metadata without access to the private original file."}</p></div>
      <div className="capability-grid">
        <article><div className="capability-icon"><FileLock2/></div><h3>{ar ? "مساحة عمل محمية" : "Protected workspace"}</h3><p>{ar ? "تسجيل حساب، سجلات مملوكة للمستخدم، وملفات خاصة مع سياسات وصول على مستوى قاعدة البيانات." : "Authentication, owner-scoped records and private files protected by database-level access policies."}</p></article>
        <article><div className="capability-icon"><ShieldCheck/></div><h3>{ar ? "نزاهة الدليل" : "Evidence integrity"}</h3><p>{ar ? "كل ملف له بصمة SHA-256. إذا تغير بايت واحد، نتيجة المطابقة تتغير." : "Every file has a SHA-256 fingerprint. Change one byte and the verification result changes."}</p></article>
        <article><div className="capability-icon"><SearchCheck/></div><h3>{ar ? "صفحة تحقق عامة" : "Public verification"}</h3><p>{ar ? "السجلات المعتمدة فقط تظهر بكود PR. النسخ غير المعتمدة تبقى خاصة." : "Only approved records are exposed by PR code. Draft or pending records remain private."}</p></article>
      </div>
    </section>

    <section className="usecases container"><div className="section-copy"><span className="eyebrow">{ar ? "مصمم لقرارات لها أثر" : "BUILT FOR DECISIONS THAT MATTER"}</span><h2>{ar ? "لما يكون الرجوع للقرار مهم أكثر من إدارة المهمة." : "When proving the decision matters more than managing the task."}</h2></div><div className="usecase-grid">
      <article><HardHat/><h3>{ar ? "المشاريع والمقاولات" : "Projects & construction"}</h3><p>{ar ? "تغييرات الموقع، اعتماد المورد، فروقات الأسعار، وتعديلات النطاق." : "Site changes, supplier approvals, cost variations and scope decisions."}</p></article>
      <article><Wrench/><h3>{ar ? "الصيانة والتشغيل" : "Maintenance & operations"}</h3><p>{ar ? "اعتماد إصلاح، تبديل قطعة، تجاوز مؤقت، أو قرار تشغيلي حساس." : "Repair approvals, part substitutions, temporary overrides and sensitive operational decisions."}</p></article>
      <article><Building2/><h3>{ar ? "المنشآت والفرق الداخلية" : "Facilities & internal teams"}</h3><p>{ar ? "موافقات مشتريات أو تغييرات أو استثناءات لازم يقدر الفريق يثبتها لاحقًا." : "Purchasing approvals, changes and exceptions the team may need to substantiate later."}</p></article>
    </div></section>

    <section className="cta-band"><div className="container cta-card"><FileCheck2/><div><span className="eyebrow">PROOF · {ar ? "سجل إثبات القرارات" : "Decision Evidence Registry"}</span><h2>{ar ? "لا تبحث عن الموافقة القديمة. خلها سجل من البداية." : "Stop searching for old approvals. Make them records from the start."}</h2></div><Link className="button button-primary" href={withLang("/login",lang)}>{ar ? "ابدأ الآن" : "Start now"}</Link></div></section>

    <footer className="product-footer"><div className="container"><div><strong>PROOF</strong><span>{ar ? "سجل إثبات القرارات التشغيلية" : "Operational Decision Evidence Registry"}</span></div><div><Link href={withLang("/verify",lang)}>{ar ? "التحقق العام" : "Public verification"}</Link><Link href={withLang("/login",lang)}>{ar ? "تسجيل الدخول" : "Sign in"}</Link></div><p>{ar ? "PROOF يتحقق من سلامة الملف وربطه بالسجل، ولا يثبت صحة الادعاء التجاري نفسه." : "PROOF verifies file integrity and its link to a record; it does not prove the truth of the underlying business claim."}</p></div></footer>
  </main>;
}
