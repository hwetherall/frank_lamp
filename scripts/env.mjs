import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export function loadLocalEnv() {
  for (const file of [".env.local", ".env"]) {
    const fullPath = path.join(process.cwd(), file);
    if (!existsSync(fullPath)) {
      continue;
    }

    const content = readFileSync(fullPath, "utf8");
    for (const line of content.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
        continue;
      }

      const [key, ...rest] = trimmed.split("=");
      if (!process.env[key]) {
        process.env[key] = rest.join("=").replace(/^["']|["']$/g, "");
      }
    }
  }
}
