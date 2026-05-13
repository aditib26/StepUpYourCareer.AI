"use client";
import { motion } from "framer-motion";
import { TrendingUp, MessageSquare, Code, Layers, ThumbsUp, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InterviewFeedback } from "@/lib/types";

interface Props {
  feedback: InterviewFeedback;
  onRestart: () => void;
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
  if (score >= 60) return "text-blue-400 bg-blue-400/10 border-blue-400/20";
  if (score >= 40) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
  return "text-red-400 bg-red-400/10 border-red-400/20";
}

function ScoreCard({ label, score, icon: Icon }: { label: string; score: number; icon: typeof TrendingUp }) {
  return (
    <div className="p-4 rounded-2xl border border-border bg-card">
      <Icon className="w-4 h-4 text-text-secondary mb-2" />
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className={cn("text-2xl font-bold", scoreColor(score).split(" ")[0])}>{score}</p>
    </div>
  );
}

export default function InterviewFeedbackView({ feedback, onRestart }: Props) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Headline score */}
      <div className="p-8 rounded-3xl border border-primary/30 bg-primary/5 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-light mb-3">Overall Score</p>
        <p className={cn("text-7xl font-extrabold gradient-text mb-3")}>{feedback.overall_score}</p>
        <p className="text-sm text-text-secondary max-w-xl mx-auto">{feedback.summary}</p>
      </div>

      {/* Score breakdown */}
      <div className="grid grid-cols-3 gap-3">
        <ScoreCard label="Communication" score={feedback.communication_score} icon={MessageSquare} />
        <ScoreCard label="Technical" score={feedback.technical_score} icon={Code} />
        <ScoreCard label="Structure (STAR)" score={feedback.structure_score} icon={Layers} />
      </div>

      {/* Strengths + Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-400 mb-3">
            <ThumbsUp className="w-3 h-3" />
            Strengths
          </p>
          <ul className="space-y-2">
            {feedback.strengths.map((s, i) => (
              <li key={i} className="text-sm text-text-secondary flex gap-2">
                <span className="text-emerald-400">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-2xl border border-orange-400/20 bg-orange-400/5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-orange-400 mb-3">
            <Wrench className="w-3 h-3" />
            Areas to Improve
          </p>
          <ul className="space-y-2">
            {feedback.improvements.map((s, i) => (
              <li key={i} className="text-sm text-text-secondary flex gap-2">
                <span className="text-orange-400">→</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Per-question feedback */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Question-by-Question Breakdown</p>
        {feedback.per_question_feedback.map((q, i) => (
          <div key={i} className="p-5 rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest">Q{i + 1}</p>
              <span className={cn("text-xs px-2 py-0.5 rounded-md border font-medium", scoreColor(q.score))}>
                {q.score}/100
              </span>
            </div>
            <p className="text-sm font-medium text-text-primary mb-2">{q.question}</p>
            <p className="text-xs text-muted leading-relaxed mb-3 italic">&ldquo;{q.answer}&rdquo;</p>
            <p className="text-sm text-text-secondary leading-relaxed pt-3 border-t border-border">{q.feedback}</p>
          </div>
        ))}
      </div>

      {/* Restart */}
      <div className="text-center pt-4">
        <button
          onClick={onRestart}
          className="px-6 py-3 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-glow hover:opacity-90 transition-all"
        >
          Take Another Interview
        </button>
      </div>
    </motion.div>
  );
}
