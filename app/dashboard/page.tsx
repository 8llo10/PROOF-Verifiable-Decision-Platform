import { DashboardClient } from "@/components/DashboardClient";
import { resolveLang } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function Dashboard({ searchParams }: { searchParams: Promise<{lang?:string}> }) {
  const q = await searchParams;
  return <DashboardClient lang={resolveLang(q.lang)} />;
}
