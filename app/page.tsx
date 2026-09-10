import Link from "next/link";
import { ArrowRight, CheckCircle2, FileLock2, Fingerprint, MessageSquareText, ShieldCheck, Building2, Wrench, HardHat, FileCheck2 } from "lucide-react";
import { Nav } from "@/components/Nav";
import { resolveLang, withLang } from "@/lib/i18n";

export default async function Home({searchParams}:{searchParams:Promise<{lang?:string}>}) {
  const q=await searchParams; const lang=resolveLang(q.lang); const ar=lang==="ar";
  return <main dir={ar?"rtl":"ltr"} lang={lang}>
    <Nav lang={lang}/>
    <section className="hero container product-hero">
      <div className="hero-kicker"><span className="pulse" /> {ar?"طبقة نزاهة للقرارات التشغيلية":"DECISION INTEGRITY LAYER"}</div>
      <h1>{ar?<>لا تخلي قرار مهم<br/><em>يضيع داخل محادثة.</em></>:<>Don’t let an important decision<br/><em>disappear inside a chat.</em></>}</h1>
      <p className="hero-copy">{ar?"PROOF يحوّل الموافقات والقرارات التشغيلية غير الرسمية إلى سجل موثّق: القرار، الأطراف، الملف الأصلي، بصمة SHA-256، حالة الاعتماد وسجل تدقيق كامل.":"PROOF turns informal operational approvals into verifiable records with the decision, parties, original evidence, SHA-256 fingerprint, approval status and a complete audit trail."}</p>
      <div className="hero-actions"><Link className="button button-primary" href={withLang("/dashboard",lang)}>{ar?"ابدأ من لوحة التحكم":"Open dashboard"} <ArrowRight size={18}/></Link><Link className="button button-ghost" href={withLang("/verify/PR-1042",lang)}>{ar?"جرّب التحقق المباشر":"See live verification"}</Link></div>
      <div className="trust-line"><ShieldCheck size={17}/>{ar?"بدون Blockchain وبدون ادعاءات غامضة — دليل واضح + بصمة ملف قابلة للتحقق.":"No blockchain. No black box. Clear evidence + verifiable file integrity."}</div>
    </section>

    <section className="problem-band"><div className="container problem-grid">
      <div><span className="eyebrow">{ar?"المشكلة الحقيقية":"THE REAL PROBLEM"}</span><h2>{ar?"مين وافق؟ وعلى أي نسخة؟":"Who approved it — and which version?"}</h2><p>{ar?"في التشغيل اليومي، الموافقة قد تكون برسالة واتساب أو صورة أو مكالمة. بعد أسبوع يبدأ البحث: من اعتمد؟ كم المبلغ؟ أي ملف كان المقصود؟ وهل الصورة نفسها تغيرت؟":"In daily operations, approval may live in WhatsApp, a screenshot or a call. A week later, teams are searching for who approved what, for how much, and against which exact file."}</p></div>
      <div className="chat-stack"><div className="bubble">{ar?"تمام، اعتمدوا الباب البديل. الزيادة 1,800 ريال موافق عليها.":"Okay, use the revised door. +1,800 SAR is approved."}</div><div className="bubble bubble-muted">{ar?"طيب أي ملف كان المقصود؟":"Which file was this about?"}</div><div className="bubble bubble-alert">{ar?"والصورة هذي أصلية ولا اتعدلت بعدين؟":"Was this screenshot edited later?"}</div></div>
    </div></section>

    <section className="container steps-section"><span className="eyebrow">{ar?"كيف يعمل PROOF":"HOW PROOF WORKS"}</span><h2 className="section-title">{ar?"قرار واحد. سجل واحد. بصمة واحدة.":"One decision. One record. One fingerprint."}</h2>
      <div className="steps">
        <article><MessageSquareText/><span>01</span><h3>{ar?"سجّل":"Capture"}</h3><p>{ar?"اكتب القرار بشكل واضح واربطه بالمشروع والأطراف والمبلغ.":"Capture the exact decision, context, parties and amount."}</p></article>
        <article><Fingerprint/><span>02</span><h3>{ar?"ثبّت الدليل":"Fingerprint"}</h3><p>{ar?"ارفع الملف الأصلي ويحسب السيرفر بصمة SHA-256 قبل حفظ السجل.":"Upload the original evidence and compute its SHA-256 fingerprint server-side."}</p></article>
        <article><CheckCircle2/><span>03</span><h3>{ar?"اعتمد":"Approve"}</h3><p>{ar?"اعتمد أو ارفض، مع وقت القرار وملاحظة واضحة وسجل تدقيق.":"Approve or reject with timestamp, note and audit trail."}</p></article>
        <article><FileLock2/><span>04</span><h3>{ar?"تحقق":"Verify"}</h3><p>{ar?"شارك كود السجل؛ ويمكن إعادة رفع أي نسخة للتأكد أنها مطابقة بايت-ببايت.":"Share the record code and verify any copy byte-for-byte."}</p></article>
      </div>
    </section>

    <section className="usecases container"><div className="section-copy"><span className="eyebrow">{ar?"مصمم للعمل الحقيقي":"BUILT FOR REAL OPERATIONS"}</span><h2>{ar?"مو نظام مهام جديد. طبقة إثبات للقرار نفسه.":"Not another task manager. A proof layer for the decision itself."}</h2></div><div className="usecase-grid">
      <article><HardHat/><h3>{ar?"المشاريع والمقاولات":"Projects & construction"}</h3><p>{ar?"تغييرات الموقع، اعتماد المورد، فروقات الأسعار، وتعديلات النطاق.":"Site changes, supplier approvals, cost variations and scope decisions."}</p></article>
      <article><Wrench/><h3>{ar?"الصيانة والتشغيل":"Maintenance & operations"}</h3><p>{ar?"اعتماد إصلاح، تبديل قطعة، تجاوز مؤقت، أو قرار تشغيلي حساس.":"Repair approvals, part substitutions, temporary overrides and operational decisions."}</p></article>
      <article><Building2/><h3>{ar?"المنشآت والفرق الداخلية":"Facilities & internal teams"}</h3><p>{ar?"أي قرار لازم يرجع له الفريق لاحقًا بدليل واضح بدل البحث في المحادثات.":"Any decision the team may need to defend later without digging through chats."}</p></article>
    </div></section>

    <section className="cta-band"><div className="container cta-card"><FileCheck2/><div><span className="eyebrow">PROOF</span><h2>{ar?"إذا القرار يستحق التنفيذ، يستحق سجل يثبته.":"If a decision is worth executing, it is worth proving."}</h2></div><Link className="button button-primary" href={withLang("/dashboard",lang)}>{ar?"افتح المنتج":"Open product"}</Link></div></section>
  </main>;
}
