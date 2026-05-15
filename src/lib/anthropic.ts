import Anthropic from "@anthropic-ai/sdk";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

let client: Anthropic | null = null;

export function getAnthropicClient() {
  if (client) {
    return client;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY");
  }

  client = new Anthropic({ apiKey });
  return client;
}

export function extractJsonObject(raw: string) {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in LLM response");
  }

  return JSON.parse(cleaned.slice(start, end + 1)) as unknown;
}

export async function completeJson(prompt: string, retryContext?: string) {
  const anthropic = getAnthropicClient();
  const content = retryContext
    ? `${prompt}\n\nYour prior response did not validate. Fix only the JSON and return the full corrected object.\n\nValidation error:\n${retryContext}`
    : prompt;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 6000,
    temperature: 0.1,
    messages: [{ role: "user", content }],
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  await writeDebugPrompt(prompt, text);
  return extractJsonObject(text);
}

async function writeDebugPrompt(prompt: string, response: string) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  try {
    const debugDir = path.join(process.cwd(), "debug");
    await mkdir(debugDir, { recursive: true });
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    await writeFile(
      path.join(debugDir, `${timestamp}.json`),
      JSON.stringify({ prompt, response }, null, 2),
      "utf8",
    );
  } catch {
    // Debug logging should never break the demo flow.
  }
}
