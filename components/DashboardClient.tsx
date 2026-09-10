"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, ShieldCheck, Clock3, FileCheck2, ArrowUpLeft, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { StatusBadge } from "@/components/StatusBadge";
import { supabase } from "@/lib/supabase-browser";
import { locale, withLang, type Lang } from "@/lib/i18n";
import type { Decision } from "@/lib/types";

export function DashboardClient({ lang }: { lang: Lang }) {
  const ar = lang === "ar";
  const router = useRouter();
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace(withLang("/login", lang)); return; }
      const { data, error } = await supabase.from("decisions").select("*").eq("owner_id", user.id).order("created_at", { ascending: false });
      if (!live) return;
      if (error) setError(error.message); else setDecisions((data || []) as Decision[]);
      setLoading(false);
    })();
    return () => { live = false; };
  }, [lang, router]);

  async function signOut() { await supabase.auth.signOut(); router.replace(withLang("/login", lang)); router.refresh(); }

  const approved = decisions.filter(d => d.status === "APPROVED").length;
  const pending = decisions.filter(d => d.status === "PENDING").length;

  return <main className="app-bg" dir={ar ? "rtl" : "ltr"}>
    <header className="app-header"><Link href={withLang("/",lang)}><Logo/></Link><nav><Link href={withLang("/verify",lang)}><Search size={16}/>{ar ? "التحقق العام" : "Public verify"}</Link><LanguageSwitch lang={lang}/><button onClick={signOut}>{ar ? "تسجيل الخروج" : "Sign out"}</button></nav></header>
    <div className="app-container">
      <div className="dashboard-head"><div><span className="eyebrow">{ar ? "مساحة قراراتك" : "YOUR DECISION SPACE"}</span><h1>{ar ? "سجل القرارات" : "Decision records"}</h1><p>{ar ? "سجلاتك خاصة بك. القرار المعتمد فقط يصبح قابلًا للتحقق العام عبر الكود." : "Your records are private. Only approved decisions become publicly verifiable by code."}</p></div><Link className="button button-primary" href={withLang("/dashboard/new",lang)}><Plus size={18}/>{ar ? "قرار جديد" : "New decision"}</Link></div>
      <div className="metrics"><div><ShieldCheck/><span>{ar ? "معتمد" : "Approved"}</span><strong>{approved}</strong></div><div><Clock3/><span>{ar ? "بانتظار المراجعة" : "Pending"}</span><strong>{pending}</strong></div><div><FileCheck2/><span>{ar ? "إجمالي سجلاتي" : "My records"}</span><strong>{decisions.length}</strong></div></div>
      {error && <div className="error-box">{error}</div>}
      <section className="table-card"><div className="table-head"><div><h2>{ar ? "السجلات" : "Records"}</h2><small>{ar ? "كل قرار ودليله وبصمته وحالته" : "Every decision with its evidence, fingerprint and state"}</small></div><span>{decisions.length} {ar ? "سجل" : "records"}</span></div>
      {loading ? <div className="empty-state">{ar ? "جاري تحميل سجلاتك…" : "Loading your records…"}</div> : decisions.length === 0 ? <div className="empty-state"><FileCheck2/><strong>{ar ? "ما عندك سجلات للحين" : "No records yet"}</strong><p>{ar ? "أنشئ أول قرار وارفع دليله، وبعدها اعتمده وشارك كود التحقق." : "Create your first decision, attach evidence, approve it and share its verification code."}</p><Link className="button button-primary" href={withLang("/dashboard/new",lang)}>{ar ? "إنشاء أول سجل" : "Create first record"}</Link></div> : <div className="decision-list">{decisions.map(d => <Link href={withLang(`/decision/${d.id}`,lang)} key={d.id} className="decision-row"><div className="code-box">{d.code}</div><div className="decision-main"><strong>{d.title}</strong><span>{d.project_name || (ar ? "عام" : "General")} · {new Date(d.created_at).toLocaleDateString(locale(lang))}</span></div>{d.amount !== null && <div className="amount">{Number(d.amount).toLocaleString(locale(lang))} {d.currency}</div>}<StatusBadge status={d.status} lang={lang}/><span className="row-arrow">{ar ? <ArrowUpLeft size={17}/> : <ArrowUpRight size={17}/>}</span></Link>)}</div>}</section>
    </div>
  </main>;
}
