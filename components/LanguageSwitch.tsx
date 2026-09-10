"use client";
import { Languages } from "lucide-react";
import type { Lang } from "@/lib/i18n";

export function LanguageSwitch({ lang }: { lang: Lang }) {
  function toggle() {
    const url = new URL(window.location.href);
    url.searchParams.set("lang", lang === "ar" ? "en" : "ar");
    window.location.href = url.pathname + url.search + url.hash;
  }
  return <button type="button" className="language-switch" onClick={toggle} aria-label="Switch language"><Languages size={16}/>{lang === "ar" ? "EN" : "العربية"}</button>;
}
