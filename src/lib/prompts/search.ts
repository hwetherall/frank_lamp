import type { Expert } from "@/lib/schema";

export function searchPrompt({
  query,
  experts,
}: {
  query: string;
  experts: Expert[];
}) {
  return `You are the semantic search layer for Frank, Innovera's expert database.

Rank ALL experts by relevance to the user's natural-language query and explain your reasoning.

## User query
"${query}"

## All experts
${JSON.stringify(
  experts.map((expert) => ({
    id: expert.id,
    name: expert.name.value,
    role: expert.role.value,
    company: expert.company.value,
    geography: expert.geography.value,
    languages: expert.languages.value,
    industries: expert.industries.value,
    expertise_tags: expert.expertise_tags.value,
    performance_rating: expert.performance_rating.value,
    relationship_owner: expert.relationship_owner.value,
    availability: expert.availability.value,
    conflict_flags: expert.conflict_flags.value,
    profile_narrative: expert.profile_narrative.value,
    enrichment_status: expert.enrichment_status,
  })),
  null,
  2,
)}

## Ranking guidance
- Hard constraints in the query must be respected; experts who fail them rank last.
- Soft signals include industry, expertise, language, geography, relationship owner, rating, availability, and profile narrative.
- Enriched records should outrank skeleton records when the facts support it.
- Be honest about gaps in skeleton records.

## Output
Return ONLY a JSON object:
{
  "results": [
    {
      "expert_id": "exp_001",
      "relevance_score": 0.92,
      "rationale": "One to two sentences citing specific facts."
    }
  ]
}

Return every expert exactly once.`;
}
