"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import { motion } from "framer-motion";
import { TrendingUp, CheckCircle2, Circle, ArrowRight, BookOpen, Target } from "lucide-react";
import { cn } from "@/lib/utils";

// Placeholder skill progress data — will come from Supabase in Phase 2
const MOCK_SKILLS = [
  { skill: "dbt (Data Build Tool)", status: "completed", priority: 95, type: "technical" },
  { skill: "Apache Airflow", status: "in_progress", priority: 88, type: "technical" },
  { skill: "Spark", status: "in_progress", priority: 72, type: "technical" },
  { skill: "Stakeholder Communication", status: "not_started", priority: 60, type: "soft" },
  { skill: "Python (Advanced)", status: "not_started", priority: 55, type: "technical" },
];

type Status = "not_started" | "in_progress" | "completed";

export default function DashboardPage() {
  const [skills, setSkills] = useState(MOCK_SKILLS);

  const completed = skills.filter((s) => s.status === "completed").length;
  const total = skills.length;
  const pct = Math.round((completed / total) * 100);

  function cycle(skill: string) {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.skill !== skill) return s;
        const next: Status =
          s.status === "not_started" ? "in_progress" : s.status === "in_progress" ? "completed" : "not_started";
        return { ...s, status: next };
      })
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16 px-6">
        <div className="mx-auto max-w-4xl">

          {/* Header */}
          <div className="pt-8 mb-10">
            <h1 className="text-3xl font-bold text-text-primary mb-2">My Progress Dashboard</h1>
            <p className="text-text-secondary text-sm">Track your skill gap closure over time.</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Skills Tracked", value: total, icon: Target, color: "text-violet-400" },
              { label: "Completed", value: completed, icon: CheckCircle2, color: "text-emerald-400" },
              { label: "In Progress", value: skills.filter(s => s.status === "in_progress").length, icon: TrendingUp, color: "text-blue-400" },
              { label: "Gap Closed", value: `${pct}%`, icon: BookOpen, color: "text-orange-400" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-2xl border border-border bg-card"
              >
                <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
                <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-xs text-muted mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mb-8 p-5 rounded-2xl border border-border bg-card">
            <div className="flex justify-between text-sm mb-3">
              <span className="font-medium text-text-primary">Overall Gap Closure</span>
              <span className="text-primary-light font-semibold">{pct}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-surface overflow-hidden">
              <motion.div
                className="h-full rounded-full shimmer-bar"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-muted mt-2">
              {completed} of {total} skills closed · Keep going!
            </p>
          </div>

          {/* Skill list */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-widest">Skill Progress</h2>
            {skills
              .slice()
              .sort((a, b) => b.priority - a.priority)
              .map((s, i) => (
                <motion.div
                  key={s.skill}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-border bg-card"
                >
                  {/* Toggle button */}
                  <button
                    onClick={() => cycle(s.skill)}
                    className="flex-shrink-0 focus:outline-none"
                    title="Click to cycle status"
                  >
                    {s.status === "completed" ? (
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    ) : s.status === "in_progress" ? (
                      <div className="w-6 h-6 rounded-full border-2 border-primary-light flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary-light" />
                      </div>
                    ) : (
                      <Circle className="w-6 h-6 text-border-light" />
                    )}
                  </button>

                  {/* Skill info */}
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium", s.status === "completed" ? "text-muted line-through" : "text-text-primary")}>
                      {s.skill}
                    </p>
                    <p className="text-xs text-muted capitalize">{s.type} · Priority {s.priority}/100</p>
                  </div>

                  {/* Status badge */}
                  <span className={cn(
                    "text-xs px-2.5 py-1 rounded-full border font-medium capitalize",
                    s.status === "completed"
                      ? "border-success/30 bg-success/10 text-success"
                      : s.status === "in_progress"
                      ? "border-primary/30 bg-primary/10 text-primary-light"
                      : "border-border text-muted"
                  )}>
                    {s.status.replace("_", " ")}
                  </span>
                </motion.div>
              ))}
          </div>

          {/* CTA to re-analyze */}
          <div className="mt-10 p-6 rounded-2xl border border-dashed border-border text-center">
            <p className="text-sm text-text-secondary mb-4">
              Run a new analysis to refresh your skill gaps as you grow.
            </p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-glow hover:opacity-90 transition-all"
            >
              New Analysis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
