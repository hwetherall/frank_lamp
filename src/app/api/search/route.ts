import { NextResponse } from "next/server";
import { completeJson } from "@/lib/anthropic";
import { listExperts } from "@/lib/data";
import { demoSearch } from "@/lib/demo";
import { searchPrompt } from "@/lib/prompts/search";
import { searchResponseSchema, type SearchResponse } from "@/lib/schema";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { query?: unknown };
    const query = typeof body.query === "string" ? body.query.trim() : "";

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const experts = await listExperts({ fallbackToSeed: true });

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ results: demoSearch(query, experts) });
    }

    const prompt = searchPrompt({ query, experts });
    let parsed: SearchResponse;

    try {
      parsed = searchResponseSchema.parse(await completeJson(prompt));
    } catch (error) {
      parsed = searchResponseSchema.parse(
        await completeJson(
          prompt,
          error instanceof Error ? error.message : "Invalid search JSON",
        ),
      );
    }

    const seen = new Set<string>();
    const results = parsed.results
      .filter((result) => experts.some((expert) => expert.id === result.expert_id))
      .filter((result) => {
        if (seen.has(result.expert_id)) {
          return false;
        }
        seen.add(result.expert_id);
        return true;
      });

    for (const expert of experts) {
      if (!seen.has(expert.id)) {
        results.push({
          expert_id: expert.id,
          relevance_score: 0,
          rationale: "The model did not return this expert, so Frank treats it as an unranked weak match.",
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Search failed" },
      { status: 500 },
    );
  }
}
