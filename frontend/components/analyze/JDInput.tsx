"use client";
import { useState } from "react";
import { Link2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  jdUrl: string;
  jdText: string;
  onUrl: (v: string) => void;
  onText: (v: string) => void;
  disabled?: boolean;
}

type Tab = "url" | "text";

export default function JDInput({ jdUrl, jdText, onUrl, onText, disabled }: Props) {
  const [tab, setTab] = useState<Tab>("url");

  return (
    <div>
      {/* Tab switcher */}
      <div className="flex gap-1 mb-4 p-1 rounded-lg bg-surface border border-border w-fit">
        {(["url", "text"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            disabled={disabled}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              tab === t
                ? "bg-primary/20 text-primary-light"
                : "text-muted hover:text-text-secondary"
            )}
          >
            {t === "url" ? <Link2 className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
            {t === "url" ? "Job URL" : "Paste Text"}
          </button>
        ))}
      </div>

      {tab === "url" ? (
        <div className="relative">
          <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="url"
            value={jdUrl}
            onChange={(e) => onUrl(e.target.value)}
            disabled={disabled}
            placeholder="https://www.linkedin.com/jobs/view/..."
            className={cn(
              "w-full pl-10 pr-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder-muted",
              "focus:outline-none focus:border-primary/50 focus:bg-card transition-all",
              disabled && "opacity-50"
            )}
          />
        </div>
      ) : (
        <textarea
          value={jdText}
          onChange={(e) => onText(e.target.value)}
          disabled={disabled}
          placeholder="Paste the full job description here..."
          rows={6}
          className={cn(
            "w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder-muted resize-none",
            "focus:outline-none focus:border-primary/50 focus:bg-card transition-all",
            disabled && "opacity-50"
          )}
        />
      )}
    </div>
  );
}
