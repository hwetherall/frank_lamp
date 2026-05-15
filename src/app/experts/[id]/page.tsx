import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { FieldDisplay } from "@/components/FieldDisplay";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { fieldValueToText, initials } from "@/lib/format";
import { getExpert } from "@/lib/data";

export default async function ExpertDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ rationale?: string }>;
}) {
  const { id } = await params;
  const { rationale } = await searchParams;
  const expert = await getExpert(id, { fallbackToSeed: true });

  if (!expert) {
    notFound();
  }

  return (
    <AppShell title="Expert record" eyebrow={expert.name.value ?? "Profile"}>
      <div className="space-y-6">
        <Button asChild variant="ghost" size="sm">
          <Link href="/">
            <ArrowLeft className="size-4" />
            Experts
          </Link>
        </Button>

        <header className="flex flex-col gap-5 rounded-lg border bg-white p-6 shadow-sm md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="size-16">
              <AvatarFallback>{initials(expert)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="mb-2 flex items-center gap-2">
                <Badge
                  variant={
                    expert.enrichment_status === "enriched"
                      ? "default"
                      : "secondary"
                  }
                >
                  {expert.enrichment_status}
                </Badge>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight">
                {expert.name.value}
              </h1>
              <p className="mt-2 text-muted-foreground">
                {expert.role.value} - {expert.company.value}
              </p>
            </div>
          </div>
          {expert.is_demo_target && expert.enrichment_status === "skeleton" ? (
            <Button asChild>
              <Link href={`/experts/${expert.id}/enrich`}>Enrich</Link>
            </Button>
          ) : null}
        </header>

        {rationale ? (
          <section className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="mb-2 text-sm font-medium">Why this matched</div>
            <p className="text-sm leading-6 text-muted-foreground">
              {rationale}
            </p>
          </section>
        ) : null}

        <section className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-2 text-sm font-medium">Profile narrative</div>
          <p className="whitespace-pre-wrap text-sm leading-7 text-muted-foreground">
            {fieldValueToText(expert.profile_narrative)}
          </p>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <FieldDisplay label="Geography" field={expert.geography} />
          <FieldDisplay label="Languages" field={expert.languages} />
          <FieldDisplay label="Industries" field={expert.industries} />
          <FieldDisplay label="Expertise tags" field={expert.expertise_tags} />
        </section>

        <Separator />

        <section className="grid gap-4 lg:grid-cols-2">
          <FieldDisplay label="Engagement type" field={expert.engagement_type} />
          <FieldDisplay label="Performance rating" field={expert.performance_rating} />
          <FieldDisplay label="Relationship owner" field={expert.relationship_owner} />
          <FieldDisplay label="Fee arrangement" field={expert.fee_arrangement} />
          <FieldDisplay label="Availability" field={expert.availability} />
          <FieldDisplay label="Conflict flags" field={expert.conflict_flags} />
          <FieldDisplay label="Contact" field={expert.contact} />
        </section>
      </div>
    </AppShell>
  );
}
