import Link from "next/link";
import { ShieldX } from "lucide-react";

export default function NotFound(){
  return <main className="login-page"><div className="login-card" style={{textAlign:"center"}}><div className="verify-icon" style={{margin:"0 auto"}}><ShieldX/></div><div><span className="eyebrow">404 · NOT FOUND</span><h1>السجل غير موجود</h1><p>Record not found. تأكد من كود PROOF ثم حاول مرة ثانية.</p></div><Link href="/verify?lang=ar" className="button button-primary button-wide">العودة للتحقق · Back to verify</Link></div></main>
}
