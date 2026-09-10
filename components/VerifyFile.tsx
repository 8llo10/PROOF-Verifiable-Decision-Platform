"use client";
import { useState } from "react";
import { FileCheck2, UploadCloud } from "lucide-react";
import type { Lang } from "@/lib/i18n";

async function hashFile(file: File) {
  const digest = await crypto.subtle.digest("SHA-256", await file.arrayBuffer());
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2,"0")).join("");
}

export function VerifyFile({expectedHash,lang="ar"}:{expectedHash:string;lang?:Lang}){
  const ar=lang==="ar";
  const[state,setState]=useState<{kind:"match"|"mismatch";message:string;hash:string}|null>(null);
  const[busy,setBusy]=useState(false);
  async function verify(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault(); setBusy(true); setState(null);
    const form=new FormData(e.currentTarget); const file=form.get("file");
    if(!(file instanceof File)){setBusy(false);return;}
    const hash=await hashFile(file); const match=hash.toLowerCase()===expectedHash.trim().toLowerCase();
    setState({kind:match?"match":"mismatch",hash,message:match?(ar?"مطابق — هذه النسخة مطابقة بايت-ببايت للدليل المعتمد.":"MATCH — this copy is byte-for-byte identical to the approved evidence."):(ar?"غير مطابق — هذه النسخة تختلف عن الدليل المعتمد.":"MISMATCH — this copy differs from the approved evidence.")}); setBusy(false);
  }
  return <form className="verify-upload" onSubmit={verify}><div className="verify-upload-icon"><UploadCloud/></div><div><strong>{ar?"تحقق من نسخة ملف":"Check a file copy"}</strong><p>{ar?"ارفع النسخة الموجودة عندك. المقارنة تتم محليًا ببصمة SHA-256 المثبتة في السجل.":"Upload your copy. It is hashed locally and compared with the SHA-256 fingerprint locked in this record."}</p></div><input name="file" type="file" required/><button className="button button-dark" disabled={busy}><FileCheck2 size={17}/>{busy?(ar?"جاري التحقق…":"Checking…"):(ar?"تحقق من الملف":"Verify file")}</button>{state&&<div className={`verify-result ${state.kind}`}><strong>{state.message}</strong><code>{state.hash}</code></div>}</form>;
}
