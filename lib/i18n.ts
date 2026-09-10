export type Lang = "ar" | "en";

export function resolveLang(value?: string | string[]): Lang {
  return value === "en" ? "en" : "ar";
}

export function withLang(path: string, lang: Lang) {
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}lang=${lang}`;
}

export const locale = (lang: Lang) => (lang === "ar" ? "ar-SA" : "en-GB");

export const statusLabel = (status: string, lang: Lang) => {
  const ar: Record<string,string> = { PENDING: "قيد المراجعة", APPROVED: "معتمد", REJECTED: "مرفوض" };
  return lang === "ar" ? (ar[status] ?? status) : status[0] + status.slice(1).toLowerCase();
};
