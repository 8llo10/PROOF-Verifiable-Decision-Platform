import type { Lang } from "@/lib/i18n";

export function HashBlock({ hash, lang = "ar" }: { hash: string; lang?: Lang }) {
  return (
    <div className="hash-block" dir="ltr">
      <div className="hash-label">{lang === "ar" ? "بصمة الدليل SHA-256" : "SHA-256 EVIDENCE FINGERPRINT"}</div>
      <code>{hash}</code>
    </div>
  );
}
