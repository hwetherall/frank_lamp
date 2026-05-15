import { cn } from "@/lib/utils";
import { confidenceTone } from "@/lib/format";

export function ConfidenceDot({ confidence }: { confidence: number }) {
  const tone = confidenceTone(confidence);

  return (
    <span
      aria-label={`Confidence ${confidence.toFixed(2)}`}
      className={cn(
        "inline-block size-2.5 rounded-full",
        tone === "high" && "bg-emerald-500",
        tone === "medium" && "bg-yellow-400",
        tone === "low" && "bg-red-500",
      )}
    />
  );
}
