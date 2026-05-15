import { createClient } from "@insforge/sdk";
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadLocalEnv } from "./env.mjs";

loadLocalEnv();

const baseUrl = process.env.INSFORGE_URL;
const anonKey = process.env.INSFORGE_KEY;
const seedPath = path.join(process.cwd(), "seed", "experts.json");
const experts = JSON.parse(readFileSync(seedPath, "utf8"));

if (!baseUrl || !anonKey || process.env.FRANK_DATA_MODE === "local") {
  const localDir = path.join(process.cwd(), ".frank-demo");
  await import("node:fs/promises").then(async ({ mkdir, writeFile }) => {
    await mkdir(localDir, { recursive: true });
    await writeFile(
      path.join(localDir, "experts.json"),
      JSON.stringify(experts, null, 2),
      "utf8",
    );
  });
  console.log(`Seeded ${experts.length} experts into the local demo store.`);
  process.exit(0);
}

const client = createClient({ baseUrl, anonKey, isServerMode: true });

const { count, error: countError } = await client.database
  .from("experts")
  .select("id", { count: "exact", head: true });

if (countError) {
  console.error(countError.message);
  console.error("Create the table first with sql/create_experts.sql, then rerun npm run seed.");
  process.exit(1);
}

if ((count ?? 0) > 0) {
  console.log(`Seed skipped: experts table already has ${count} row(s).`);
  process.exit(0);
}

const rows = experts.map((expert) => ({
  id: expert.id,
  is_demo_target: Boolean(expert.is_demo_target),
  enrichment_status: expert.enrichment_status,
  record: expert,
}));

const { error } = await client.database.from("experts").insert(rows);

if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`Seeded ${rows.length} experts.`);
