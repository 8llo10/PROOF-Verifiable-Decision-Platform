import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { isAdmin } from "@/lib/auth";
import { DecisionForm } from "@/components/DecisionForm";
import { Logo } from "@/components/Logo";

export default async function NewDecision() {
  if (!(await isAdmin())) redirect("/login");
  return <main className="app-bg"><header className="app-header"><Link href="/"><Logo/></Link></header><div className="narrow-container"><Link href="/dashboard" className="back-link"><ArrowLeft size={16}/> Back to decisions</Link><div className="page-heading"><span className="eyebrow">NEW RECORD</span><h1>Capture a decision</h1><p>Attach the original evidence. PROOF fingerprints the exact file before it enters the record.</p></div><DecisionForm/></div></main>;
}
