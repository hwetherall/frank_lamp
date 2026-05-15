import { createClient, type InsForgeClient } from "@insforge/sdk";

let client: InsForgeClient | null = null;

export function getInsforgeClient() {
  if (client) {
    return client;
  }

  const baseUrl = process.env.INSFORGE_URL;
  const anonKey = process.env.INSFORGE_KEY;

  if (!baseUrl || !anonKey) {
    throw new Error("Missing INSFORGE_URL or INSFORGE_KEY");
  }

  client = createClient({
    baseUrl,
    anonKey,
    isServerMode: true,
  });

  return client;
}
