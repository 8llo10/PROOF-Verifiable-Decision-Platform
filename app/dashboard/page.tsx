import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Search, ShieldCheck, Clock3, FileCheck2 } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { listDecisions } from "@/lib/data";
import { StatusBadge } from "@/components/StatusBadge";
import { Logo } from "@/components/Logo";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  if (!(await isAdmin())) redirect("/login");
  const decisions = await listDecisions();
  const approved = decisions.filter(d=>d.status==="APPROVED").length;
  const pending = decisions.filter(d=>d.status==="PENDING").length;
  return <main className="app-bg">
    <header className="app-header"><Link href="/"><Logo/></Link><nav><Link href="/verify"><Search size={16}/> Verify</Link><form action="/api/logout" method="post"><button>Sign out</button></form></nav></header>
    <div className="app-container">
      <div className="dashboard-head"><div><span className="eyebrow">DECISION CONTROL</span><h1>Evidence desk</h1><p>Capture the decision before the context disappears.</p></div><Link className="button button-primary" href="/dashboard/new"><Plus size={18}/> New decision</Link></div>
      <div className="metrics"><div><ShieldCheck/><span>Approved</span><strong>{approved}</strong></div><div><Clock3/><span>Pending</span><strong>{pending}</strong></div><div><FileCheck2/><span>Total records</span><strong>{decisions.length}</strong></div></div>
      <section className="table-card"><div className="table-head"><h2>Decision records</h2><span>{decisions.length} total</span></div><div className="decision-list">{decisions.map(d=><Link href={`/decision/${d.id}`} key={d.id} className="decision-row"><div className="code-box">{d.code}</div><div className="decision-main"><strong>{d.title}</strong><span>{d.project_name || "General"} · {new Date(d.created_at).toLocaleDateString("en-GB")}</span></div>{d.amount!==null && <div className="amount">{Number(d.amount).toLocaleString()} {d.currency}</div>}<StatusBadge status={d.status}/><span className="row-arrow">→</span></Link>)}</div></section>
    </div>
  </main>;
}
