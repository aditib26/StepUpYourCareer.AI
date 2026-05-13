"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { motion } from "framer-motion";
import {
  TrendingUp,
  CheckCircle2,
  Circle,
  ArrowRight,
  BookOpen,
  Target,
  Sparkles,
  Mic,
  FileText,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "not_started" | "in_progress" | "completed";

interface TrackedSkill {
  skill: string;
  status: Status;
  priority: number;
  type: "technical" | "soft" | "transferable";
}

export default function DashboardPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<TrackedSkill[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
      // TODO Phase 2: fetch user's saved skill progress from Supabase
      // For now, new users start with an empty skill list
    });
  }, [supabase]);

  function cycle(skillName: string) {
    setSkills((prev) =>
      prev.map((s) => {
        if (s.skill !== skillName) return s;
        const next: Status =
          s.status === "not_started" ? "in_progress" : s.status === "in_progress" ? "completed" : "not_started";
        return { ...s, status: next };
      })
    );
  }

  const completed = skills.filter((s) => s.status === "completed").length;
  const total = skills.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-primary-light animate-spin" />
        </main>
      </>
    );
  }

  // ── EMPTY STATE — new user with no analyses ──────────────────────────────
  if (skills.length === 0) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-20 pb-16 px-6">
          <div className="mx-auto max-w-3xl">

            <div className="pt-10 mb-12">
              <h1 className="text-3xl font-bold text-text-primary mb-2">
                Hi, {firstName}.
              </h1>
              <p className="text-text-secondary text-sm">
                Nothing to track yet — run an analysis and your skill gaps will show up here.
              </p>
            </div>

            {/* Hero CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 rounded-3xl border border-primary/30 bg-primary/5 mb-8"
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-5 shadow-glow-sm">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-2">
                Run an analysis
              </h2>
              <p className="text-sm text-text-secondary mb-6 leading-relaxed">
                Add a resume and a job description. The output is prioritized gaps, curated resources, and matched mentors.
              </p>
              <Link
                href="/analyze"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-glow hover:opacity-90 transition-all"
              >
                Start <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Other tools */}
            <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3">
              Or jump into a tool
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/tools/cover-letter"
                className="p-5 rounded-2xl border border-border bg-card card-glow group"
              >
                <FileText className="w-5 h-5 text-violet-400 mb-3" />
                <p className="text-sm font-semibold text-text-primary">Cover letter</p>
                <p className="text-xs text-muted">Per job description</p>
              </Link>
              <Link
                href="/interview"
                className="p-5 rounded-2xl border border-border bg-card card-glow group"
              >
                <Mic className="w-5 h-5 text-pink-400 mb-3" />
                <p className="text-sm font-semibold text-text-primary">Mock interview</p>
                <p className="text-xs text-muted">Voice with feedback</p>
              </Link>
              <Link
                href="/tools"
                className="p-5 rounded-2xl border border-border bg-card card-glow group"
              >
                <BookOpen className="w-5 h-5 text-blue-400 mb-3" />
                <p className="text-sm font-semibold text-text-primary">All tools</p>
                <p className="text-xs text-muted">Resume, LinkedIn, email</p>
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  // ── PROGRESS DASHBOARD — user has tracked skills ──────────────────────────
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16 px-6">
        <div className="mx-auto max-w-4xl">

          {/* Header */}
          <div className="pt-8 mb-10">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Progress
            </h1>
            <p className="text-text-secondary text-sm">Tap a skill to cycle its status.</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Skills tracked", value: total, icon: Target, color: "text-violet-400" },
              { label: "Completed", value: completed, icon: CheckCircle2, color: "text-emerald-400" },
              { label: "In progress", value: skills.filter(s => s.status === "in_progress").length, icon: TrendingUp, color: "text-blue-400" },
              { label: "Gap closed", value: `${pct}%`, icon: BookOpen, color: "text-orange-400" },
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
              <span className="font-medium text-text-primary">Overall</span>
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
              {completed} of {total} skills closed
            </p>
          </div>

          {/* Skill list */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-widest">Skills</h2>
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

                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-medium", s.status === "completed" ? "text-muted line-through" : "text-text-primary")}>
                      {s.skill}
                    </p>
                    <p className="text-xs text-muted capitalize">{s.type} · Priority {s.priority}/100</p>
                  </div>

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

          <div className="mt-10 p-6 rounded-2xl border border-dashed border-border text-center">
            <p className="text-sm text-text-secondary mb-4">
              Run a new analysis to refresh your gaps.
            </p>
            <Link
              href="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-glow hover:opacity-90 transition-all"
            >
              New analysis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
