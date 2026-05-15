import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { ReviewEditor } from "@/components/ReviewEditor";
import { Button } from "@/components/ui/button";
import { getExpert } from "@/lib/data";

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const expert = await getExpert(id, { fallbackToSeed: true });

  if (!expert) {
    notFound();
  }

  return (
    <AppShell title="Review enriched record" eyebrow="Human review">
      <div className="space-y-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Experts
          </Link>
        </Button>
        <header className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight">
            Review enriched record
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Edits are saved as human-reviewed facts with full confidence.
          </p>
        </header>
        <ReviewEditor expert={expert} />
      </div>
    </AppShell>
  );
}
