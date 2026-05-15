import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { EnrichClient } from "@/components/EnrichClient";
import { Button } from "@/components/ui/button";

export default async function EnrichPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AppShell title="Enrichment pipeline" eyebrow="Prepared demo">
      <div className="max-w-4xl space-y-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Experts
          </Link>
        </Button>
        <header className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ShieldCheck className="size-4" />
            Offline-ready demo flow
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Enrich Hiroshi Tanaka
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            The demo packet is preloaded, so this screen can run without file
            hunting or an Insforge connection. If Anthropic is not configured,
            Frank uses a deterministic demo enrichment.
          </p>
        </header>
        <EnrichClient expertId={id} />
      </div>
    </AppShell>
  );
}
