import { NextResponse } from "next/server";
import { listExperts, saveExpert } from "@/lib/data";
import { expertSchema } from "@/lib/schema";

export async function GET() {
  const experts = await listExperts({ fallbackToSeed: true });
  return NextResponse.json({ experts });
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const parsed = expertSchema.parse(
      typeof body === "object" && body !== null && "record" in body
        ? (body as { record: unknown }).record
        : body,
    );
    const expert = await saveExpert(parsed);
    return NextResponse.json({ expert });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save expert" },
      { status: 400 },
    );
  }
}
