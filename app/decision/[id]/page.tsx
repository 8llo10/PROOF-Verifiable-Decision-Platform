import { DecisionDetailClient } from "@/components/DecisionDetailClient";
import { resolveLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function DecisionPage({ params, searchParams }: { params: Promise<{id:string}>; searchParams: Promise<{lang?:string}> }) {
  const [{ id }, q] = await Promise.all([params, searchParams]);
  return <DecisionDetailClient id={id} lang={resolveLang(q.lang)} />;
}
