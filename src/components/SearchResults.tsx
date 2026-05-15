"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fieldValueToText, initials } from "@/lib/format";
import type { Expert, SearchResult } from "@/lib/schema";

export function SearchResults({
  experts,
  results,
}: {
  experts: Expert[];
  results: SearchResult[];
}) {
  const expertById = new Map(experts.map((expert) => [expert.id, expert]));

  return (
    <div className="space-y-3">
      {results.map((result, index) => {
        const expert = expertById.get(result.expert_id);

        if (!expert) {
          return null;
        }

        return (
          <Card key={result.expert_id} className="rounded-lg bg-white shadow-sm">
            <CardHeader className="flex flex-row items-start gap-4">
              <Avatar className="size-11">
                <AvatarFallback>{initials(expert)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base">
                  #{index + 1} {expert.name.value}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {expert.role.value} - {expert.company.value}
                </p>
              </div>
              <Badge variant="secondary">
                {Math.round(result.relevance_score * 100)}%
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6">{result.rationale}</p>
              <div className="grid gap-3 text-sm md:grid-cols-3">
                <div>
                  <div className="text-xs font-medium uppercase text-muted-foreground">
                    Industries
                  </div>
                  <div>{fieldValueToText(expert.industries)}</div>
                </div>
                <div>
                  <div className="text-xs font-medium uppercase text-muted-foreground">
                    Languages
                  </div>
                  <div>{fieldValueToText(expert.languages)}</div>
                </div>
                <div>
                  <div className="text-xs font-medium uppercase text-muted-foreground">
                    Owner
                  </div>
                  <div>{fieldValueToText(expert.relationship_owner)}</div>
                </div>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link
                  href={`/experts/${expert.id}?rationale=${encodeURIComponent(
                    result.rationale,
                  )}`}
                >
                  Open detail <ArrowRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
