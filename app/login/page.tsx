import Link from "next/link";
import { Logo } from "@/components/Logo";

export default async function Login({ searchParams }: { searchParams: Promise<{error?: string}> }) {
  const q = await searchParams;
  return <main className="login-page"><div className="login-card"><Link href="/"><Logo/></Link><div><span className="eyebrow">RESTRICTED AREA</span><h1>Decision desk</h1><p>Create and approve records. Public verification stays accessible without login.</p></div><form action="/api/login" method="post"><label>Admin password<input type="password" name="password" required autoFocus/></label>{q.error && <div className="error-box">Incorrect password.</div>}<button className="button button-primary button-wide">Unlock dashboard</button></form><Link className="text-link" href="/verify">I only need to verify a record →</Link></div></main>;
}
