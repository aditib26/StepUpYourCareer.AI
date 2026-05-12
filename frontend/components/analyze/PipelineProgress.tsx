"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PipelineStep } from "@/lib/types";

const STEPS: { key: PipelineStep; label: string }[] = [
  { key: "pdf_parsed", label: "Resume parsed" },
  { key: "jd_parsed", label: "JD analyzed" },
  { key: "gap_analyzed", label: "Gaps identified" },
  { key: "resources_matched", label: "Resources matched" },
  { key: "mentors_matched", label: "Mentors matched" },
  { key: "complete", label: "Complete" },
];

const ORDER = STEPS.map((s) => s.key);

function stepIndex(step: PipelineStep): number {
  return ORDER.indexOf(step);
}

interface Props {
  currentStep: PipelineStep;
  progress: number;
  message: string;
}

export default function PipelineProgress({ currentStep, progress, message }: Props) {
  const currentIdx = stepIndex(currentStep);

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-muted mb-2">
          <span>{message}</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-surface overflow-hidden">
          <motion.div
            className="h-full rounded-full shimmer-bar"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Step indicators */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {STEPS.map((step, i) => {
          const done = i < currentIdx || currentStep === "complete";
          const active = i === currentIdx && currentStep !== "complete";

          return (
            <div key={step.key} className="flex flex-col items-center gap-1.5 text-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center border transition-all",
                  done
                    ? "bg-success/20 border-success/40 text-success"
                    : active
                    ? "bg-primary/20 border-primary/40 text-primary-light"
                    : "bg-surface border-border text-muted"
                )}
              >
                {done ? (
                  <Check className="w-3.5 h-3.5" />
                ) : active ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <span className="text-xs font-medium">{i + 1}</span>
                )}
              </div>
              <span
                className={cn(
                  "text-xs leading-tight",
                  done ? "text-success" : active ? "text-primary-light" : "text-muted"
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
