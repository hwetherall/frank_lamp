"use client";

import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function DocumentUploader({
  onFilesChange,
  disabled,
}: {
  onFilesChange: (files: File[]) => void;
  disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  function applyFiles(nextFiles: File[]) {
    const sliced = nextFiles.slice(0, 4);
    setFiles(sliced);
    onFilesChange(sliced);
  }

  return (
    <div
      className={cn(
        "rounded-lg border border-dashed bg-card p-6 transition",
        isDragging && "border-primary bg-accent",
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        applyFiles([...event.dataTransfer.files]);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.txt,.md,.csv,.eml,.rtf,text/*,application/pdf"
        className="hidden"
        disabled={disabled}
        onChange={(event) => applyFiles([...(event.target.files ?? [])])}
      />
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
          <Upload className="size-5" />
        </div>
        <div>
          <div className="font-medium">Drop four source documents</div>
          <div className="text-sm text-muted-foreground">
            PDFs, email exports, briefs, contracts, or voice transcripts
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          Choose files
        </Button>
      </div>

      {files.length > 0 ? (
        <div className="mt-6 space-y-2">
          {files.map((file) => (
            <div
              key={`${file.name}-${file.size}`}
              className="flex items-center justify-between rounded-md border bg-background px-3 py-2 text-sm"
            >
              <span className="truncate">{file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={disabled}
                onClick={() =>
                  applyFiles(files.filter((candidate) => candidate !== file))
                }
              >
                <X className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
