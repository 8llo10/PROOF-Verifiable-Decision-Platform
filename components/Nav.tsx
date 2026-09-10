import Link from "next/link";
import { Logo } from "./Logo";
import { LanguageSwitch } from "./LanguageSwitch";
import { withLang, type Lang } from "@/lib/i18n";

export function Nav({ lang = "ar" }: { lang?: Lang }) {
  return <header className="nav-shell"><nav className="nav container">
    <Link href={withLang("/",lang)} className="logo-link"><Logo /></Link>
    <div className="nav-links">
      <Link href={withLang("/verify",lang)}>{lang === "ar" ? "التحقق" : "Verify"}</Link>
      <Link href={withLang("/dashboard",lang)} className="button button-small">{lang === "ar" ? "لوحة التحكم" : "Dashboard"}</Link>
      <LanguageSwitch lang={lang}/>
    </div>
  </nav></header>;
}
