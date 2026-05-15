import { NextResponse } from "next/server";
import { completeJson } from "@/lib/anthropic";
import { getExpert, saveExpert } from "@/lib/data";
import { getDemoEnrichment, loadDemoDocuments } from "@/lib/demo";
import { enrichmentPrompt } from "@/lib/prompts/enrichment";
import { expertFieldsSchema, type ExpertFields } from "@/lib/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const expertId = formData.get("expertId");
    const files = formData
      .getAll("documents")
      .filter((item): item is File => item instanceof File);

    if (typeof expertId !== "string" || !expertId) {
      return NextResponse.json({ error: "expertId is required" }, { status: 400 });
    }

    if (files.length !== 0 && files.length !== 4) {
      return NextResponse.json(
        { error: "Use the prepared demo documents or upload exactly 4 files" },
        { status: 400 },
      );
    }

    const skeleton = await getExpert(expertId, { fallbackToSeed: true });

    if (!skeleton) {
      return NextResponse.json({ error: "Expert not found" }, { status: 404 });
    }

    const documents =
      files.length === 4
        ? await Promise.all(files.map(extractDocumentText))
        : await loadDemoDocuments();
    let enrichedFields: ExpertFields;

    if (!process.env.ANTHROPIC_API_KEY) {
      enrichedFields = getDemoEnrichment(skeleton);
    } else {
      const prompt = enrichmentPrompt({ skeleton, documents });

      try {
        enrichedFields = expertFieldsSchema.parse(await completeJson(prompt));
      } catch (error) {
        enrichedFields = expertFieldsSchema.parse(
          await completeJson(
            prompt,
            error instanceof Error ? error.message : "Invalid enrichment JSON",
          ),
        );
      }
    }

    const expert = await saveExpert({
      ...skeleton,
      ...enrichedFields,
      enrichment_status: "enriched",
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ expert });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Enrichment failed" },
      { status: 500 },
    );
  }
}

async function extractDocumentText(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = file.name || "untitled";
  const isPdf =
    file.type === "application/pdf" || filename.toLowerCase().endsWith(".pdf");

  if (isPdf) {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });

    try {
      const result = await parser.getText();
      return { filename, content: result.text.slice(0, 50000) };
    } finally {
      await parser.destroy();
    }
  }

  return { filename, content: buffer.toString("utf8").slice(0, 50000) };
}
