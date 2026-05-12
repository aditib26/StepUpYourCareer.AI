"use client";
import { motion } from "framer-motion";
import { cn, priorityColor, priorityLabel } from "@/lib/utils";
import type { SkillGapResult } from "@/lib/types";

interface Props { gaps: SkillGapResult; }

export default function SkillGapSection({ gaps }: Props) {
  const { technical_skill_gaps, soft_skill_gaps, transferable_skills } = gaps;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">Skill Gap Analysis</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Technical gaps */}
        <div className="p-5 rounded-2xl border border-border bg-card">
          <h3 className="text-sm font-semibold text-text-secondary mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0" />
            Technical Gaps
            <span className="ml-auto text-xs text-muted">{technical_skill_gaps.length} skills</span>
          </h3>
          <ul className="space-y-2">
            {technical_skill_gaps.map((s, i) => (
              <motion.li
                key={s.skill}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-surface"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-text-primary">{s.skill}</span>
                    <span className={cn("text-xs px-1.5 py-0.5 rounded-md border font-medium", priorityColor(s.priority_score))}>
                      {priorityLabel(s.priority_score)}
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">{s.reason}</p>
                </div>
                <span className="text-xs font-bold text-muted flex-shrink-0 mt-0.5">{s.priority_score}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Soft gaps + transferable */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl border border-border bg-card">
            <h3 className="text-sm font-semibold text-text-secondary mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
              Soft Skill Gaps
              <span className="ml-auto text-xs text-muted">{soft_skill_gaps.length} skills</span>
            </h3>
            <ul className="space-y-2">
              {soft_skill_gaps.map((s, i) => (
                <motion.li
                  key={s.skill}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 + 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-xl bg-surface"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-text-primary">{s.skill}</span>
                      <span className={cn("text-xs px-1.5 py-0.5 rounded-md border font-medium", priorityColor(s.priority_score))}>
                        {priorityLabel(s.priority_score)}
                      </span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed">{s.reason}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl border border-success/20 bg-success/5">
            <h3 className="text-sm font-semibold text-success mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success flex-shrink-0" />
              Transferable Strengths
            </h3>
            <div className="flex flex-wrap gap-2">
              {transferable_skills.map((s) => (
                <span key={s} className="px-3 py-1 rounded-full text-xs font-medium bg-success/10 border border-success/20 text-success">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
