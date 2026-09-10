import Link from "next/link";
import { Search, ShieldCheck } from "lucide-react";
import { Nav } from "@/components/Nav";

export default function VerifyPage() {
  return <main><Nav/><section className="verify-hero container"><div className="verify-icon"><ShieldCheck/></div><span className="eyebrow">PUBLIC VERIFICATION</span><h1>Verify a decision record.</h1><p>Enter a PROOF code to inspect the decision status and cryptographic evidence fingerprint.</p><form className="verify-search" action="/verify/lookup" method="get"><Search/><input name="code" placeholder="PR-1042" required/><button className="button button-primary">Verify record</button></form><Link href="/verify/PR-1042" className="text-link">Try demo record PR-1042 →</Link></section></main>;
}
