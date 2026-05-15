import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Expert, ExpertFields, SearchResult } from "@/lib/schema";
import { expertFieldsSchema } from "@/lib/schema";

export const demoDocumentFiles = [
  "contract.txt",
  "brief.txt",
  "email-thread.txt",
  "voice-transcript.txt",
] as const;

export async function loadDemoDocuments() {
  return Promise.all(
    demoDocumentFiles.map(async (filename) => ({
      filename,
      content: await readFile(
        path.join(process.cwd(), "seed", "documents", filename),
        "utf8",
      ),
    })),
  );
}

export function getDemoEnrichment(skeleton: Expert): ExpertFields {
  return expertFieldsSchema.parse({
    name: {
      value: skeleton.name.value,
      provenance: "happenstance",
      confidence: 1,
      source_ref: "Happenstance seed record",
    },
    role: {
      value: "AI Strategy Advisor",
      provenance: "doc",
      confidence: 0.95,
      source_ref: "contract.txt",
    },
    company: {
      value: "Independent Consultant",
      provenance: "happenstance",
      confidence: 1,
      source_ref: "Happenstance seed record",
    },
    geography: {
      value: "Tokyo, Japan",
      provenance: "happenstance",
      confidence: 1,
      source_ref: "Happenstance seed record",
    },
    languages: {
      value: [
        { language: "Japanese", proficiency: "native" },
        { language: "English", proficiency: "fluent" },
      ],
      provenance: "doc",
      confidence: 0.92,
      source_ref: "email-thread.txt",
    },
    industries: {
      value: ["Energy", "Software & AI", "Utilities"],
      provenance: "doc",
      confidence: 0.91,
      source_ref: "brief.txt",
    },
    expertise_tags: {
      value: [
        "AI dispatch optimization",
        "Japanese utility operations",
        "demand forecasting",
        "operator-facing ML adoption",
        "energy AI governance",
      ],
      provenance: "inferred",
      confidence: 0.86,
      source_ref: "brief.txt + voice-transcript.txt",
    },
    engagement_type: {
      value: "deep-dive project with follow-on advisory availability",
      provenance: "doc",
      confidence: 0.93,
      source_ref: "contract.txt",
    },
    performance_rating: {
      value: {
        stars: 5,
        notes:
          "Daniel described Hiroshi as excellent and specifically rated him 5 stars for AI, energy, and Japan-market expert briefings.",
      },
      provenance: "doc",
      confidence: 0.96,
      source_ref: "email-thread.txt",
    },
    relationship_owner: {
      value: "Daniel",
      provenance: "doc",
      confidence: 0.95,
      source_ref: "contract.txt",
    },
    fee_arrangement: {
      value: "USD 650 per hour, four-hour briefing minimum",
      provenance: "doc",
      confidence: 0.95,
      source_ref: "contract.txt",
    },
    contact: {
      value: {
        linkedin: skeleton.contact.value?.linkedin,
      },
      provenance: "happenstance",
      confidence: 0.8,
      source_ref: "Happenstance seed record",
    },
    conflict_flags: {
      value: [
        "Tokyo Electric Power Company",
        "Mitsubishi Heavy Industries",
        "Japanese grid automation procurement bids",
      ],
      provenance: "doc",
      confidence: 0.9,
      source_ref: "contract.txt",
    },
    availability: {
      value:
        "Available with approximately two weeks notice for advisory calls and short workshops.",
      provenance: "voice",
      confidence: 0.88,
      source_ref: "voice-transcript.txt",
    },
    profile_narrative: {
      value:
        "Hiroshi Tanaka is a Tokyo-based AI strategy advisor with unusually practical expertise at the intersection of machine learning and energy operations. His strongest fit is work that combines Japanese utility context, AI adoption strategy, and the operational realities of dispatch centers and grid operators. Source materials describe his ability to explain where AI can create value now: demand forecasting, outage triage, distributed energy resource coordination, and operator-facing decision support, while avoiding overclaims about fully autonomous dispatch. Daniel rated him 5 stars after a client call, noting that Hiroshi gave a concrete view of why Japanese utilities remain cautious about black-box optimization and how models can be introduced credibly inside conservative operating environments. He is native in Japanese and fluent in English, making him well suited for Japan-market briefings or cross-border diligence. His contract lists a USD 650 hourly rate with a four-hour minimum, and he is available with roughly two weeks notice. Conflict flags include TEPCO, Mitsubishi Heavy Industries, and live Japanese grid automation procurement processes.",
      provenance: "inferred",
      confidence: 0.9,
      source_ref: "brief.txt + email-thread.txt + voice-transcript.txt",
    },
  });
}

export function demoSearch(query: string, experts: Expert[]): SearchResult[] {
  const normalized = query.toLowerCase();

  return experts
    .map((expert) => {
      let score = expert.enrichment_status === "enriched" ? 0.45 : 0.18;
      const facts = [
        expert.name.value,
        expert.role.value,
        expert.company.value,
        expert.geography.value,
        expert.industries.value?.join(" "),
        expert.expertise_tags.value?.join(" "),
        expert.languages.value?.map((language) => language.language).join(" "),
        expert.relationship_owner.value,
        expert.profile_narrative.value,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      for (const token of normalized.split(/\W+/).filter((token) => token.length > 2)) {
        if (facts.includes(token)) {
          score += 0.07;
        }
      }

      if (normalized.includes("japanese") || normalized.includes("japan")) {
        score += facts.includes("japanese") || facts.includes("japan") ? 0.18 : -0.1;
      }

      if (normalized.includes("energy")) {
        score += facts.includes("energy") || facts.includes("utility") ? 0.18 : -0.05;
      }

      if (normalized.includes("daniel")) {
        score += expert.relationship_owner.value === "Daniel" ? 0.18 : -0.08;
      }

      if (normalized.includes("4+") || normalized.includes("rated")) {
        score += (expert.performance_rating.value?.stars ?? 0) >= 4 ? 0.18 : -0.08;
      }

      if (normalized.includes("supply chain")) {
        score += facts.includes("supply chain") ? 0.22 : -0.05;
      }

      score = Math.max(0.05, Math.min(0.98, score));

      return {
        expert_id: expert.id,
        relevance_score: Number(score.toFixed(2)),
        rationale: buildRationale(expert, normalized),
      };
    })
    .sort((a, b) => b.relevance_score - a.relevance_score);
}

function buildRationale(expert: Expert, query: string) {
  if (expert.id === "exp_001" && expert.enrichment_status === "enriched") {
    return "Hiroshi is the strongest match because the enriched record confirms Energy, Software & AI, native Japanese, Daniel ownership, and a 5-star prior briefing. The record also includes specific utility AI context such as demand forecasting, dispatch optimization, and operator-facing ML adoption.";
  }

  if (expert.id === "exp_002" && query.includes("supply chain")) {
    return "Maya is a strong supply-chain match with Happenstance-level signals around logistics, supplier risk, and East Asia operations, though the record is still less proven than an enriched expert.";
  }

  if (expert.relationship_owner.value === "Daniel") {
    return "This expert has a Daniel ownership signal, but the skeleton record lacks enough enriched performance and narrative detail to defend a top ranking.";
  }

  return "This expert has some relevant Happenstance-level signals, but the record is mostly skeletal and lacks the provenance-rich detail needed for a high-confidence match.";
}
