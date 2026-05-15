import { INDUSTRIES, type Expert } from "@/lib/schema";

export function enrichmentPrompt({
  skeleton,
  documents,
}: {
  skeleton: Expert;
  documents: Array<{ filename: string; content: string }>;
}) {
  return `You are enriching an expert record for Innovera's expert database (Frank).

You will receive a skeleton record from Happenstance and four source documents. Produce a complete structured expert record using only justified facts. Every field must include value, provenance, confidence, and source_ref when useful.

## Skeleton record
${JSON.stringify(skeleton, null, 2)}

## Source documents
${documents.map((doc) => `### ${doc.filename}\n${doc.content}`).join("\n\n")}

## Rules
- Return ONLY a JSON object. No prose before or after.
- Match the requested field shape exactly. Do not include id, created_at, updated_at, enrichment_status, or is_demo_target.
- Provenance must be one of: voice, doc, web, human, inferred, happenstance.
- Confidence must be a number between 0 and 1.
- If a field cannot be justified, return value: null with confidence: 0.
- Industries must only use these values: ${INDUSTRIES.join(", ")}. If none fits, return [].
- profile_narrative should be 200-400 words, third person, concrete, and useful for semantic search.
- Prefer direct source facts over inference. Use "inferred" only when synthesizing across sources.

## Output JSON shape
{
  "name": { "value": "...", "provenance": "happenstance", "confidence": 1, "source_ref": "optional" },
  "role": { "value": "...", "provenance": "doc", "confidence": 0.9 },
  "company": { "value": "...", "provenance": "doc", "confidence": 0.9 },
  "geography": { "value": "...", "provenance": "doc", "confidence": 0.9 },
  "languages": { "value": [{ "language": "Japanese", "proficiency": "native" }], "provenance": "voice", "confidence": 0.9 },
  "industries": { "value": ["Energy"], "provenance": "doc", "confidence": 0.9 },
  "expertise_tags": { "value": ["AI strategy"], "provenance": "inferred", "confidence": 0.8 },
  "engagement_type": { "value": "one-off briefing", "provenance": "doc", "confidence": 0.8 },
  "performance_rating": { "value": { "stars": 4, "notes": "..." }, "provenance": "doc", "confidence": 0.8 },
  "relationship_owner": { "value": "Daniel", "provenance": "doc", "confidence": 0.8 },
  "fee_arrangement": { "value": "$500/hour", "provenance": "doc", "confidence": 0.9 },
  "contact": { "value": { "email": "name@example.com", "phone": "+1...", "linkedin": "https://..." }, "provenance": "doc", "confidence": 0.9 },
  "conflict_flags": { "value": ["Company"], "provenance": "doc", "confidence": 0.8 },
  "availability": { "value": "available with 2 weeks notice", "provenance": "voice", "confidence": 0.8 },
  "profile_narrative": { "value": "...", "provenance": "inferred", "confidence": 0.8 }
}`;
}
