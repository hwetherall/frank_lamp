import { createClient } from "@insforge/sdk";
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadLocalEnv } from "./env.mjs";

loadLocalEnv();

const baseUrl = process.env.INSFORGE_URL;
const anonKey = process.env.INSFORGE_KEY;
const seedPath = path.join(process.cwd(), "seed", "experts.json");
const experts = JSON.parse(readFileSync(seedPath, "utf8"));
const target = experts.find((expert) => expert.is_demo_target);

if (!target) {
  console.error("No demo target found in seed/experts.json");
  process.exit(1);
}

if (!baseUrl || !anonKey || process.env.FRANK_DATA_MODE === "local") {
  const localDir = path.join(process.cwd(), ".frank-demo");
  const localPath = path.join(localDir, "experts.json");
  const { mkdir, readFile, writeFile } = await import("node:fs/promises");
  await mkdir(localDir, { recursive: true });

  let currentExperts = experts;
  try {
    currentExperts = JSON.parse(await readFile(localPath, "utf8"));
  } catch {
    currentExperts = experts;
  }

  const nextExperts = currentExperts.map((expert) =>
    expert.id === target.id
      ? {
          ...target,
          enrichment_status: "skeleton",
          updated_at: new Date().toISOString(),
        }
      : expert,
  );

  await writeFile(localPath, JSON.stringify(nextExperts, null, 2), "utf8");
  console.log(`Reset ${target.name.value} (${target.id}) in the local demo store.`);
  process.exit(0);
}

const client = createClient({ baseUrl, anonKey, isServerMode: true });

const { error } = await client.database
  .from("experts")
  .update({
    is_demo_target: true,
    enrichment_status: "skeleton",
    record: {
      ...target,
      enrichment_status: "skeleton",
      updated_at: new Date().toISOString(),
    },
  })
  .eq("id", target.id);

if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`Reset ${target.name.value} (${target.id}) to skeleton state.`);
