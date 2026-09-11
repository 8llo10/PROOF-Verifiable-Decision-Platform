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
      <div className="dashboard-head"><div><span className="eyebrow">{ar ? "مركز الاعتمادات" : "APPROVAL CENTER"}</span><h1>{ar ? "طلبات الاعتماد" : "Approval requests"}</h1><p>{ar ? "أنشئ المعاملة مرة واحدة، أرسل رابطًا مستقلًا لكل طرف، وPROOF يقفل سجل القرار تلقائيًا بعد موافقة الطرفين." : "Create the agreement once, send each party an independent link, and PROOF locks the final decision record automatically after both approve."}</p></div><Link className="button button-primary" href={withLang("/dashboard/new",lang)}><Plus size={18}/>{ar ? "طلب اعتماد جديد" : "New approval request"}</Link></div>
      <div className="metrics"><div><ShieldCheck/><span>{ar ? "مكتمل الطرفين" : "Both approved"}</span><strong>{approved}</strong></div><div><Clock3/><span>{ar ? "بانتظار طرف" : "Awaiting party"}</span><strong>{pending}</strong></div><div><FileCheck2/><span>{ar ? "إجمالي المعاملات" : "Total requests"}</span><strong>{decisions.length}</strong></div></div>
      {error && <div className="error-box">{error}</div>}
      <section className="table-card"><div className="table-head"><div><h2>{ar ? "المعاملات" : "Requests"}</h2><small>{ar ? "كل معاملة، ملفها، أطرافها وحالة اعتمادها" : "Every agreement, evidence file, parties and approval state"}</small></div><span>{decisions.length} {ar ? "معاملة" : "requests"}</span></div>
      {loading ? <div className="empty-state">{ar ? "جاري تحميل الطلبات…" : "Loading requests…"}</div> : decisions.length === 0 ? <div className="empty-state"><FileCheck2/><strong>{ar ? "ما عندك طلبات للحين" : "No requests yet"}</strong><p>{ar ? "ابدأ معاملة وأرسل الاعتماد للطرفين. ما يحتاج أحد يسجل قرار يدوي بعد الاتفاق." : "Start an agreement and send approval to both parties. Nobody needs to manually log a decision afterwards."}</p><Link className="button button-primary" href={withLang("/dashboard/new",lang)}>{ar ? "إنشاء أول طلب" : "Create first request"}</Link></div> : <div className="decision-list">{decisions.map(d => <Link href={withLang(`/decision/${d.id}`,lang)} key={d.id} className="decision-row"><div className="code-box">{d.code}</div><div className="decision-main"><strong>{d.title}</strong><span>{d.project_name || (ar ? "عام" : "General")} · {d.parties.join(ar?" × ":" × ")} · {new Date(d.created_at).toLocaleDateString(locale(lang))}</span></div>{d.amount !== null && <div className="amount">{Number(d.amount).toLocaleString(locale(lang))} {d.currency}</div>}<StatusBadge status={d.status} lang={lang}/><span className="row-arrow">{ar ? <ArrowUpLeft size={17}/> : <ArrowUpRight size={17}/>}</span></Link>)}</div>}</section>
    </div>
  </main>;
}
