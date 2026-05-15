import { ConfidenceDot } from "@/components/ConfidenceDot";
import { ProvenanceTag } from "@/components/ProvenanceTag";
import { cn } from "@/lib/utils";
import { fieldValueToText } from "@/lib/format";
import type { Field } from "@/lib/schema";

export function FieldDisplay({
  label,
  field,
  review = false,
}: {
  label: string;
  field: Field<unknown>;
  review?: boolean;
}) {
  const isLowConfidence = field.confidence < 0.5;

  return (
    <div
      className={cn(
        "rounded-lg border bg-white p-4 shadow-sm",
        review && isLowConfidence && "border-yellow-400 bg-yellow-50/70",
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="flex items-center gap-2">
          <ConfidenceDot confidence={field.confidence} />
          <ProvenanceTag field={field} />
        </div>
      </div>
      <div className="whitespace-pre-wrap text-sm leading-6">
        {fieldValueToText(field)}
      </div>
    </div>
  );
}
