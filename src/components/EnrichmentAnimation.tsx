"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

const messages = [
  "Reading contract...",
  "Parsing email thread...",
  "Extracting from voice memo...",
  "Cross-referencing LinkedIn...",
  "Synthesizing profile narrative...",
];

export function EnrichmentAnimation() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="rounded-lg border bg-white p-5 shadow-sm">
      <div className="mb-3 text-sm font-medium">{messages[index]}</div>
      <Progress value={((index + 1) / messages.length) * 88} />
    </div>
  );
}
