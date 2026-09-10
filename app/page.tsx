import Link from "next/link";
import { ArrowRight, CheckCircle2, FileLock2, Fingerprint, MessageSquareText, ShieldCheck } from "lucide-react";
import { Nav } from "@/components/Nav";

export default function Home() {
  return <main>
    <Nav />
    <section className="hero container">
      <div className="hero-kicker"><span className="pulse" /> DECISION INTEGRITY LAYER</div>
      <h1>What was agreed<br/><em>shouldn’t disappear</em><br/>inside a chat.</h1>
      <p className="hero-copy">PROOF turns informal operational decisions into verifiable records — with evidence, approvals, timestamps and cryptographic file integrity.</p>
      <div className="hero-actions"><Link className="button button-primary" href="/dashboard">Open dashboard <ArrowRight size={18}/></Link><Link className="button button-ghost" href="/verify/PR-1042">See live verification</Link></div>
      <div className="trust-line"><ShieldCheck size={17}/> No blockchain. No black box. Just clear evidence + SHA-256 integrity.</div>
    </section>

    <section className="problem-band">
      <div className="container problem-grid">
        <div><span className="eyebrow">THE PROBLEM</span><h2>“Who approved this?”</h2><p>The answer is often buried in screenshots, WhatsApp threads, calls and revised files.</p></div>
        <div className="chat-stack"><div className="bubble">Okay, use the revised door. +1,800 SAR is approved.</div><div className="bubble bubble-muted">Which file was this about?</div><div className="bubble bubble-alert">That screenshot was edited later.</div></div>
      </div>
    </section>

    <section className="container steps-section">
      <span className="eyebrow">HOW PROOF WORKS</span><h2 className="section-title">One decision. One record. One fingerprint.</h2>
      <div className="steps">
        <article><MessageSquareText/><span>01</span><h3>Capture</h3><p>Write the exact decision and attach the original message, PDF or screenshot.</p></article>
        <article><Fingerprint/><span>02</span><h3>Fingerprint</h3><p>PROOF calculates a SHA-256 hash for the evidence before storing the record.</p></article>
        <article><CheckCircle2/><span>03</span><h3>Approve</h3><p>Approve or reject the decision and keep a timestamped audit trail.</p></article>
        <article><FileLock2/><span>04</span><h3>Verify</h3><p>Anyone with the code can verify whether a copy still matches the approved evidence.</p></article>
      </div>
    </section>
  </main>;
}
