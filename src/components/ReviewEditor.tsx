"use client";

import { Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfidenceDot } from "@/components/ConfidenceDot";
import { ProvenanceTag } from "@/components/ProvenanceTag";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { fieldValueToEditableText } from "@/lib/format";
import {
  FIELD_LABELS,
  type Expert,
  type ExpertFields,
  type Field,
} from "@/lib/schema";
import { cn } from "@/lib/utils";

export function ReviewEditor({ expert }: { expert: Expert }) {
  const router = useRouter();
  const [draft, setDraft] = useState(expert);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateField(key: keyof ExpertFields, text: string) {
    const current = draft[key] as Field<unknown>;
    setDraft({
      ...draft,
      [key]: {
        ...current,
        value: parseEditableValue(key, text, current.value),
        provenance: "human",
        confidence: 1,
        source_ref: "review edit",
      },
    });
  }

  async function saveAndContinue() {
    setSaving(true);
    setError(null);

    const response = await fetch("/api/experts", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expertId: draft.id, record: draft }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      setError(payload.error ?? "Unable to save review");
      setSaving(false);
      return;
    }

    router.push("/search");
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}
      <div className="grid gap-4 lg:grid-cols-2">
        {FIELD_LABELS.map(([key, label]) => {
          const field = draft[key] as Field<unknown>;
          return (
            <label
              key={key}
              className={cn(
                "block rounded-lg border bg-white p-4 shadow-sm",
                field.confidence < 0.5 && "border-yellow-400 bg-yellow-50/70",
                key === "profile_narrative" && "lg:col-span-2",
              )}
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {label}
                </span>
                <span className="flex items-center gap-2">
                  <ConfidenceDot confidence={field.confidence} />
                  <ProvenanceTag field={field} />
                </span>
              </div>
              <Textarea
                value={fieldValueToEditableText(field)}
                onChange={(event) => updateField(key, event.target.value)}
                className="min-h-24"
              />
            </label>
          );
        })}
      </div>
      <Button onClick={saveAndContinue} disabled={saving}>
        <Save className="size-4" />
        Save and continue
      </Button>
    </div>
  );
}

function parseEditableValue(
  key: keyof ExpertFields,
  text: string,
  currentValue: unknown,
) {
  const trimmed = text.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    return JSON.parse(trimmed) as unknown;
  }

  if (Array.isArray(currentValue)) {
    if (key === "languages") {
      return trimmed.split(",").map((language) => ({
        language: language.trim(),
        proficiency: "professional",
      }));
    }

    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (key === "industries" || key === "expertise_tags" || key === "conflict_flags") {
    return trimmed
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (key === "contact") {
    return trimmed.includes("@") ? { email: trimmed } : { linkedin: trimmed };
  }

  if (key === "performance_rating") {
    const stars = Number.parseInt(trimmed, 10);
    return {
      stars: Number.isFinite(stars) ? Math.min(5, Math.max(1, stars)) : 3,
      notes: trimmed,
    };
  }

  return trimmed;
}
