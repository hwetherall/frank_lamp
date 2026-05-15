import { getInsforgeClient } from "@/lib/insforge";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  type Expert,
  expertListSchema,
  expertSchema,
} from "@/lib/schema";
import { seedExperts } from "@/lib/seed-data";

type ExpertRow = {
  id: string;
  is_demo_target: boolean | null;
  enrichment_status: "skeleton" | "enriched";
  record: unknown;
  created_at: string;
  updated_at: string;
};

function rowToExpert(row: ExpertRow): Expert {
  const record = row.record as Partial<Expert>;
  return expertSchema.parse({
    ...record,
    id: row.id,
    is_demo_target: Boolean(row.is_demo_target),
    enrichment_status: row.enrichment_status,
    created_at: row.created_at,
    updated_at: row.updated_at,
  });
}

function expertToRow(expert: Expert) {
  return {
    id: expert.id,
    is_demo_target: Boolean(expert.is_demo_target),
    enrichment_status: expert.enrichment_status,
    record: expert,
  };
}

function shouldUseLocalDemoStore() {
  return (
    process.env.FRANK_DATA_MODE === "local" ||
    !process.env.INSFORGE_URL ||
    !process.env.INSFORGE_KEY
  );
}

function localStorePath() {
  return path.join(process.cwd(), ".frank-demo", "experts.json");
}

async function readLocalExperts() {
  const filePath = localStorePath();

  try {
    const content = await readFile(filePath, "utf8");
    return expertListSchema.parse(JSON.parse(content));
  } catch {
    await writeLocalExperts(seedExperts);
    return seedExperts;
  }
}

async function writeLocalExperts(experts: Expert[]) {
  const parsed = expertListSchema.parse(experts);
  await mkdir(path.dirname(localStorePath()), { recursive: true });
  await writeFile(localStorePath(), JSON.stringify(parsed, null, 2), "utf8");
  return parsed;
}

export async function listExperts(options: { fallbackToSeed?: boolean } = {}) {
  if (shouldUseLocalDemoStore()) {
    return readLocalExperts();
  }

  try {
    const { data, error } = await getInsforgeClient().database
      .from("experts")
      .select("id,is_demo_target,enrichment_status,record,created_at,updated_at")
      .order("id", { ascending: true });

    if (error) {
      throw error;
    }

    return expertListSchema.parse((data as ExpertRow[]).map(rowToExpert));
  } catch (error) {
    if (options.fallbackToSeed ?? false) {
      return seedExperts;
    }

    throw error;
  }
}

export async function getExpert(id: string, options: { fallbackToSeed?: boolean } = {}) {
  if (shouldUseLocalDemoStore()) {
    const experts = await readLocalExperts();
    return experts.find((expert) => expert.id === id) ?? null;
  }

  try {
    const { data, error } = await getInsforgeClient().database
      .from("experts")
      .select("id,is_demo_target,enrichment_status,record,created_at,updated_at")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return null;
    }

    return rowToExpert(data as ExpertRow);
  } catch (error) {
    if (options.fallbackToSeed ?? false) {
      return seedExperts.find((expert) => expert.id === id) ?? null;
    }

    throw error;
  }
}

export async function saveExpert(expert: Expert) {
  const parsed = expertSchema.parse({
    ...expert,
    updated_at: new Date().toISOString(),
  });

  if (shouldUseLocalDemoStore()) {
    const experts = await readLocalExperts();
    const nextExperts = experts.some((candidate) => candidate.id === parsed.id)
      ? experts.map((candidate) =>
          candidate.id === parsed.id ? parsed : candidate,
        )
      : [...experts, parsed];

    await writeLocalExperts(nextExperts);
    return parsed;
  }

  const { data, error } = await getInsforgeClient().database
    .from("experts")
    .update(expertToRow(parsed))
    .eq("id", parsed.id)
    .select("id,is_demo_target,enrichment_status,record,created_at,updated_at")
    .single();

  if (error) {
    throw error;
  }

  return rowToExpert(data as ExpertRow);
}

export async function upsertExperts(experts: Expert[]) {
  if (shouldUseLocalDemoStore()) {
    await writeLocalExperts(experts);
    return;
  }

  const rows = expertListSchema.parse(experts).map(expertToRow);
  const { error } = await getInsforgeClient().database
    .from("experts")
    .upsert(rows, { onConflict: "id" });

  if (error) {
    throw error;
  }
}
