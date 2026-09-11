import Link from "next/link";
import { Logo } from "./Logo";
import { LanguageSwitch } from "./LanguageSwitch";
import { withLang, type Lang } from "@/lib/i18n";

export function Nav({ lang = "ar" }: { lang?: Lang }) {
  const ar = lang === "ar";
  return <header className="nav-shell"><nav className="nav container">
    <Link href={withLang("/",lang)} className="logo-link" aria-label="PROOF home">
      <Logo />
      <span className="brand-descriptor">{ar ? "سجل إثبات القرارات" : "Decision Evidence Registry"}</span>
    </Link>
    <div className="nav-links">
      <Link href={withLang("/#how",lang)}>{ar ? "كيف يعمل" : "How it works"}</Link>
      <Link href={withLang("/verify",lang)}>{ar ? "تحقق من سجل" : "Verify record"}</Link>
      <Link href={withLang("/dashboard",lang)} className="button button-small">{ar ? "مساحة العمل" : "Workspace"}</Link>
      <LanguageSwitch lang={lang}/>
    </div>
  </nav></header>;
}
