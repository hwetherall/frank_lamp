import Link from "next/link";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { fieldValueToText, initials } from "@/lib/format";
import type { Expert } from "@/lib/schema";

export function ExpertCard({ expert }: { expert: Expert }) {
  const isEnriched = expert.enrichment_status === "enriched";

  return (
    <Card className="rounded-lg bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="flex flex-row items-start gap-4">
        <Avatar className="size-12 ring-1 ring-border">
          <AvatarFallback>{initials(expert)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <CardTitle className="truncate text-[15px]">
            {expert.name.value}
          </CardTitle>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {expert.role.value} - {expert.company.value}
          </p>
        </div>
        <Badge variant={isEnriched ? "default" : "secondary"} className="shrink-0">
          {isEnriched ? "Enriched" : "Skeleton"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="size-4" />
          <span>{fieldValueToText(expert.geography)}</span>
        </div>
        <div>
          <div className="text-xs font-medium uppercase text-muted-foreground">
            Industries
          </div>
          <div className="mt-1 line-clamp-2 leading-6">
            {fieldValueToText(expert.industries)}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium uppercase text-muted-foreground">
            Relationship
          </div>
          <div className="mt-1">{fieldValueToText(expert.relationship_owner)}</div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-3 bg-[#fafafa]">
        <Button asChild variant="outline" size="sm">
          <Link href={`/experts/${expert.id}`}>
            Detail <ArrowRight className="size-4" />
          </Link>
        </Button>
        {expert.is_demo_target && !isEnriched ? (
          <Button asChild size="sm">
            <Link href={`/experts/${expert.id}/enrich`}>
              <Sparkles className="size-4" /> Enrich
            </Link>
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}
