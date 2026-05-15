import type { Expert, Field } from "@/lib/schema";

export function fieldValueToText(field: Field<unknown>): string {
  const value = field.value;

  if (value === null || value === undefined) {
    return "Not yet populated";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "None";
    }

    return value
      .map((item) => {
        if (typeof item === "object" && item !== null && "language" in item) {
          const language = item as { language: string; proficiency: string };
          return `${language.language} (${language.proficiency})`;
        }
        return String(item);
      })
      .join(", ");
  }

  if (typeof value === "object") {
    if ("stars" in value) {
      const rating = value as { stars: number; notes: string };
      return `${rating.stars}/5 - ${rating.notes}`;
    }

    return Object.entries(value)
      .filter(([, entry]) => Boolean(entry))
      .map(([key, entry]) => `${key}: ${entry}`)
      .join(", ");
  }

  return String(value);
}

export function fieldValueToEditableText(field: Field<unknown>): string {
  if (field.value === null || field.value === undefined) {
    return "";
  }

  if (typeof field.value === "string") {
    return field.value;
  }

  return JSON.stringify(field.value, null, 2);
}

export function initials(expert: Pick<Expert, "name">): string {
  const value = expert.name.value ?? "?";
  return value
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function confidenceTone(confidence: number): "high" | "medium" | "low" {
  if (confidence >= 0.8) {
    return "high";
  }

  if (confidence >= 0.5) {
    return "medium";
  }

  return "low";
}
