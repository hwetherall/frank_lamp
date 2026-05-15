import {
  FileText,
  Globe,
  LinkIcon,
  Mic,
  Sparkles,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Field, Provenance } from "@/lib/schema";

const provenanceConfig: Record<
  Provenance,
  {
    label: string;
    className: string;
    Icon: typeof FileText;
  }
> = {
  voice: {
    label: "Voice",
    className: "border-violet-500/30 bg-violet-500/10 text-violet-700",
    Icon: Mic,
  },
  doc: {
    label: "Document",
    className: "border-blue-500/30 bg-blue-500/10 text-blue-700",
    Icon: FileText,
  },
  web: {
    label: "Web",
    className: "border-teal-500/30 bg-teal-500/10 text-teal-700",
    Icon: Globe,
  },
  human: {
    label: "Human",
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
    Icon: User,
  },
  inferred: {
    label: "Inferred",
    className: "border-zinc-500/30 bg-zinc-500/10 text-zinc-700",
    Icon: Sparkles,
  },
  happenstance: {
    label: "Happenstance",
    className: "border-indigo-500/30 bg-indigo-500/10 text-indigo-700",
    Icon: LinkIcon,
  },
};

export function ProvenanceTag({ field }: { field: Field<unknown> }) {
  const config = provenanceConfig[field.provenance];
  const Icon = config.Icon;

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge variant="outline" className={config.className}>
          <Icon className="size-3" />
          {config.label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        Confidence: {field.confidence.toFixed(2)}. Provenance:{" "}
        {field.provenance}
        {field.source_ref ? ` (${field.source_ref})` : ""}
      </TooltipContent>
    </Tooltip>
  );
}
