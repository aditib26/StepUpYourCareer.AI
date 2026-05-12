"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  file: File | null;
  onFile: (f: File | null) => void;
  disabled?: boolean;
}

export default function ResumeUpload({ file, onFile, disabled }: Props) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) onFile(accepted[0]);
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled,
  });

  if (file) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl border border-success/30 bg-success/10">
        <div className="w-9 h-9 rounded-lg bg-success/20 flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-success" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary truncate">{file.name}</p>
          <p className="text-xs text-muted">{(file.size / 1024).toFixed(0)} KB · PDF</p>
        </div>
        {!disabled && (
          <button
            onClick={(e) => { e.stopPropagation(); onFile(null); }}
            className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors flex-shrink-0"
          >
            <X className="w-3 h-3 text-text-secondary" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "group relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all",
        isDragActive
          ? "border-primary bg-primary/10"
          : "border-border hover:border-primary/50 hover:bg-primary/5",
        disabled && "opacity-50 pointer-events-none"
      )}
    >
      <input {...getInputProps()} />
      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
        <Upload className="w-5 h-5 text-primary-light" />
      </div>
      <p className="text-sm font-medium text-text-primary mb-1">
        {isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
      </p>
      <p className="text-xs text-muted">PDF only · Max 10 MB</p>
      <div className="mt-4">
        <span className="px-4 py-1.5 rounded-lg border border-border text-xs text-text-secondary group-hover:border-border-light transition-colors">
          Browse files
        </span>
      </div>
    </div>
  );
}
