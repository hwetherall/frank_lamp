"use client";

import { CheckCircle2, FileText, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DocumentUploader } from "@/components/DocumentUploader";
import { EnrichmentAnimation } from "@/components/EnrichmentAnimation";
import { Button } from "@/components/ui/button";

const preparedDocs = [
  "contract.txt",
  "brief.txt",
  "email-thread.txt",
  "voice-transcript.txt",
];

export function EnrichClient({ expertId }: { expertId: string }) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useCustomFiles, setUseCustomFiles] = useState(false);

  async function submit() {
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.set("expertId", expertId);
    if (useCustomFiles) {
      files.forEach((file) => formData.append("documents", file));
    }

    const response = await fetch("/api/enrich", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      setError(payload.error ?? "Enrichment failed");
      setIsSubmitting(false);
      return;
    }

    router.push(`/experts/${expertId}/review`);
  }

  return (
    <div className="space-y-6">
      <section className="rounded-lg border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="size-4 text-emerald-600" />
              Prepared demo packet
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              The four source documents are already loaded for the live demo.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSubmitting}
            onClick={() => setUseCustomFiles((current) => !current)}
          >
            {useCustomFiles ? "Use prepared docs" : "Swap files"}
          </Button>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {preparedDocs.map((doc) => (
            <div
              key={doc}
              className="flex items-center gap-3 rounded-md border bg-background px-3 py-2 text-sm"
            >
              <FileText className="size-4 text-muted-foreground" />
              <span>{doc}</span>
            </div>
          ))}
        </div>
      </section>

      {useCustomFiles ? (
        <DocumentUploader onFilesChange={setFiles} disabled={isSubmitting} />
      ) : null}
      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      {isSubmitting ? <EnrichmentAnimation /> : null}
      <Button
        size="lg"
        disabled={(useCustomFiles && files.length !== 4) || isSubmitting}
        onClick={submit}
      >
        <Sparkles className="size-4" />
        {useCustomFiles ? "Run custom enrichment" : "Run prepared enrichment"}
      </Button>
    </div>
  );
}
