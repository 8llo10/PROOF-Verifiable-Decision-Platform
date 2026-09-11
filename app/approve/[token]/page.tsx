import { ApprovalResponseClient } from "@/components/ApprovalResponseClient";
import { resolveLang } from "@/lib/i18n";

export default async function ApprovalPage({params,searchParams}:{params:Promise<{token:string}>;searchParams:Promise<{lang?:string}>}) {
  const [{token},q]=await Promise.all([params,searchParams]);
  const lang=resolveLang(q.lang);
  return <ApprovalResponseClient token={token} lang={lang}/>;
}
