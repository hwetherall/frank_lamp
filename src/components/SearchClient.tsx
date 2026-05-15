"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { SearchResults } from "@/components/SearchResults";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Expert, SearchResult } from "@/lib/schema";

const sampleQueries = [
  "AI experts with knowledge of the Energy Industry and can speak Japanese",
  "Someone who could brief us on supply chain resilience in East Asia",
  "Experts Daniel owns who are rated 4+ stars",
];

export function SearchClient({ experts }: { experts: Expert[] }) {
  const [query, setQuery] = useState(sampleQueries[0]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runSearch(nextQuery = query) {
    const trimmed = nextQuery.trim();
    if (!trimmed) {
      return;
    }

    setQuery(trimmed);
    setIsSearching(true);
    setError(null);

    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: trimmed }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      setError(payload.error ?? "Search failed");
      setIsSearching(false);
      return;
    }

    const payload = (await response.json()) as { results: SearchResult[] };
    setResults(payload.results);
    setIsSearching(false);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              void runSearch();
            }
          }}
        />
        <Button onClick={() => void runSearch()} disabled={isSearching}>
          <Search className="size-4" />
          Search
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {sampleQueries.map((sample) => (
          <Button
            key={sample}
            type="button"
            variant="outline"
            size="sm"
            disabled={isSearching}
            onClick={() => void runSearch(sample)}
          >
            {sample}
          </Button>
        ))}
      </div>
      </section>
      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      {isSearching ? (
        <div className="rounded-lg border bg-card p-5 text-sm text-muted-foreground">
          Asking Claude to rank all five experts...
        </div>
      ) : null}
      {results.length > 0 ? (
        <SearchResults experts={experts} results={results} />
      ) : null}
    </div>
  );
}
