import { z } from "zod";

export const INDUSTRIES = [
  "Aerospace & Defense",
  "Agriculture",
  "Automotive",
  "Chemicals",
  "Consumer Goods",
  "Energy",
  "Financial Services",
  "Healthcare & Pharma",
  "Industrial Manufacturing",
  "Logistics & Supply Chain",
  "Media & Entertainment",
  "Mining & Metals",
  "Real Estate",
  "Retail",
  "Semiconductors",
  "Software & AI",
  "Telecommunications",
  "Transportation",
  "Utilities",
] as const;

export const provenanceSchema = z.enum([
  "voice",
  "doc",
  "web",
  "human",
  "inferred",
  "happenstance",
]);

export const fieldSchema = <T extends z.ZodTypeAny>(valueSchema: T) =>
  z.object({
    value: valueSchema.nullable(),
    provenance: provenanceSchema,
    confidence: z.number().min(0).max(1),
    source_ref: z.string().optional(),
  });

export const languageSchema = z.object({
  language: z.string(),
  proficiency: z.enum([
    "native",
    "fluent",
    "professional",
    "conversational",
  ]),
});

export const ratingSchema = z.object({
  stars: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  notes: z.string(),
});

export const contactSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  linkedin: z.string().optional(),
});

export const expertFieldsSchema = z.object({
  name: fieldSchema(z.string()),
  role: fieldSchema(z.string()),
  company: fieldSchema(z.string()),
  geography: fieldSchema(z.string()),
  languages: fieldSchema(z.array(languageSchema)),
  industries: fieldSchema(z.array(z.enum(INDUSTRIES))),
  expertise_tags: fieldSchema(z.array(z.string())),
  engagement_type: fieldSchema(z.string()),
  performance_rating: fieldSchema(ratingSchema),
  relationship_owner: fieldSchema(z.string()),
  fee_arrangement: fieldSchema(z.string()),
  contact: fieldSchema(contactSchema),
  conflict_flags: fieldSchema(z.array(z.string())),
  availability: fieldSchema(z.string()),
  profile_narrative: fieldSchema(z.string()),
});

export const expertSchema = expertFieldsSchema.extend({
  id: z.string(),
  is_demo_target: z.boolean().optional().default(false),
  created_at: z.string(),
  updated_at: z.string(),
  enrichment_status: z.enum(["skeleton", "enriched"]),
});

export const expertListSchema = z.array(expertSchema);

export const searchResultSchema = z.object({
  expert_id: z.string(),
  relevance_score: z.number().min(0).max(1),
  rationale: z.string(),
});

export const searchResponseSchema = z.object({
  results: z.array(searchResultSchema),
});

export type Provenance = z.infer<typeof provenanceSchema>;
export type Field<T> = {
  value: T | null;
  provenance: Provenance;
  confidence: number;
  source_ref?: string;
};
export type ExpertFields = z.infer<typeof expertFieldsSchema>;
export type Expert = z.infer<typeof expertSchema>;
export type SearchResult = z.infer<typeof searchResultSchema>;
export type SearchResponse = z.infer<typeof searchResponseSchema>;

export const FIELD_LABELS: Array<[keyof ExpertFields, string]> = [
  ["name", "Name"],
  ["role", "Role"],
  ["company", "Company"],
  ["geography", "Geography"],
  ["languages", "Languages"],
  ["industries", "Industries"],
  ["expertise_tags", "Expertise tags"],
  ["engagement_type", "Engagement type"],
  ["performance_rating", "Performance rating"],
  ["relationship_owner", "Relationship owner"],
  ["fee_arrangement", "Fee arrangement"],
  ["contact", "Contact"],
  ["conflict_flags", "Conflict flags"],
  ["availability", "Availability"],
  ["profile_narrative", "Profile narrative"],
];

export function emptyField<T>(value: T | null = null): Field<T> {
  return {
    value,
    provenance: "happenstance",
    confidence: value === null ? 0 : 1,
  };
}
