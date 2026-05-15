import Link from "next/link";
import { BriefcaseBusiness, FileText, RotateCcw, Search, Sparkles } from "lucide-react";
import { resetDemoAction } from "@/app/actions";
import { AppShell } from "@/components/AppShell";
import { ExpertCard } from "@/components/ExpertCard";
import { Button } from "@/components/ui/button";
import { listExperts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home() {
  const experts = await listExperts({ fallbackToSeed: true });
  const enrichedCount = experts.filter(
    (expert) => expert.enrichment_status === "enriched",
  ).length;

  return (
    <AppShell
      title="Expert intelligence workspace"
      eyebrow="Frank demo"
      actions={
        <>
          <form action={resetDemoAction}>
            <Button type="submit" variant="outline">
              <RotateCcw className="size-4" />
              Reset
            </Button>
          </form>
          <Button asChild>
            <Link href="/search">
              <Search className="size-4" />
              Search
            </Link>
          </Button>
        </>
      }
    >
      <div className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <BriefcaseBusiness className="size-4" />
              Matter-ready expert database
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Enrich a sparse Happenstance record into a defensible expert profile.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              Frank keeps the demo focused on what matters to Daniel: source-backed
              fields, confidence signals, and search rationales that read like a
              senior associate did the diligence.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <Metric label="Experts" value={experts.length.toString()} />
            <Metric label="Enriched" value={enrichedCount.toString()} />
            <Metric label="Packet" value="Ready" icon={<Sparkles className="size-4 text-[#9a6a43]" />} />
          </div>
        </section>

        <section className="rounded-lg border bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold">Search population</h2>
              <p className="text-sm text-muted-foreground">
                One live enrichment target plus four comparison records.
              </p>
            </div>
            <div className="hidden items-center gap-2 text-xs text-muted-foreground md:flex">
              <FileText className="size-4" />
              Provenance and confidence visible after enrichment
            </div>
          </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {experts.map((expert) => (
            <ExpertCard key={expert.id} expert={expert} />
          ))}
        </div>
        </section>
      </div>
    </AppShell>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 flex items-center gap-2 text-2xl font-semibold">
        {icon}
        {value}
      </div>
    </div>
  );
}
