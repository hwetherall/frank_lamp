import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { SearchClient } from "@/components/SearchClient";
import { Button } from "@/components/ui/button";
import { listExperts } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SearchPage() {
  const experts = await listExperts({ fallbackToSeed: true });

  return (
    <AppShell title="Semantic expert search" eyebrow="Search layer">
      <div className="space-y-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Experts
          </Link>
        </Button>
        <header className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Search className="size-4" />
            One-shot semantic ranking
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Semantic expert search
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Ranked results use every field in the five-record demo population.
            Without an Anthropic key, Frank runs a deterministic offline search
            tuned for the prepared demo.
          </p>
        </header>
        <SearchClient experts={experts} />
      </div>
    </AppShell>
  );
}
