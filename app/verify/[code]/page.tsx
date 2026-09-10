import { PublicVerifyClient } from "@/components/PublicVerifyClient";
import { resolveLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function VerifyRecord({ params, searchParams }: { params: Promise<{code:string}>; searchParams: Promise<{lang?:string}> }) {
  const [{ code }, q] = await Promise.all([params, searchParams]);
  return <PublicVerifyClient code={decodeURIComponent(code)} lang={resolveLang(q.lang)} />;
}
