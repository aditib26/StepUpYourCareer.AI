"use client";
import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import ResumeUpload from "@/components/analyze/ResumeUpload";
import ToolShell from "@/components/tools/ToolShell";
import CopyButton from "@/components/tools/CopyButton";
import { optimizeLinkedIn } from "@/lib/api";
import type { LinkedInOptimization } from "@/lib/types";
import { motion } from "framer-motion";
import { Linkedin, Loader2, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

export default function LinkedInPage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [currentHeadline, setCurrentHeadline] = useState("");
  const [currentAbout, setCurrentAbout] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LinkedInOptimization | null>(null);
  const [error, setError] = useState("");

  const canSubmit = !!file && !!targetRole && !loading;

  async function handleSubmit() {
    if (!file || !canSubmit) return;
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const r = await optimizeLinkedIn({
        resume: file,
        targetRole,
        currentHeadline,
        currentAbout,
      });
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Optimization failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <ToolShell
        title="LinkedIn profile"
        subtitle="Rewrites your headline, About section, and experience bullets."
        icon={<Linkedin className="w-5 h-5 text-white" />}
      >
        {!result && (
          <div className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg border border-danger/30 bg-danger/10 text-danger text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="AI Engineer at FAANG"
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder-muted focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">Resume (PDF)</label>
              <ResumeUpload file={file} onFile={setFile} />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">Current LinkedIn Headline (optional)</label>
              <input
                type="text"
                value={currentHeadline}
                onChange={(e) => setCurrentHeadline(e.target.value)}
                placeholder="Data Analyst at XYZ"
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder-muted focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">Current About Section (optional)</label>
              <textarea
                value={currentAbout}
                onChange={(e) => setCurrentAbout(e.target.value)}
                placeholder="Paste your current LinkedIn About section..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder-muted resize-none focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-primary text-white font-semibold text-base shadow-glow disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Rewriting…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate
                </>
              )}
            </button>
          </div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="flex justify-end">
              <button
                onClick={() => setResult(null)}
                className="px-3 py-1.5 rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary text-xs font-medium"
              >
                Try again
              </button>
            </div>

            {/* Headlines */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Headlines (3 angles)</p>
              {result.headline_options.map((h, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                  <span className="text-lg font-black text-primary-light">#{i + 1}</span>
                  <p className="flex-1 text-sm text-text-primary leading-relaxed">{h}</p>
                  <CopyButton text={h} />
                </div>
              ))}
            </div>

            {/* About */}
            <div className="p-5 rounded-2xl border border-primary/30 bg-primary/5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary-light">About section</p>
                <CopyButton text={result.about_section} />
              </div>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{result.about_section}</p>
            </div>

            {/* Skills */}
            <div className="p-5 rounded-2xl border border-border bg-card">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3">Skills to list</p>
              <div className="flex flex-wrap gap-2">
                {result.skills_to_add.map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-md text-xs bg-primary/10 border border-primary/20 text-primary-light">{s}</span>
                ))}
              </div>
            </div>

            {/* Experience bullets */}
            {result.experience_bullets.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">Experience bullets</p>
                {result.experience_bullets.map((b, i) => (
                  <div key={i} className="p-4 rounded-xl border border-border bg-card">
                    {b.original && (
                      <p className="text-xs text-muted line-through mb-2">{b.original}</p>
                    )}
                    <div className="flex items-start gap-2">
                      <ArrowRight className="w-3.5 h-3.5 text-primary-light flex-shrink-0 mt-0.5" />
                      <p className="flex-1 text-sm text-text-primary leading-relaxed font-medium">{b.rewritten}</p>
                      <CopyButton text={b.rewritten} />
                    </div>
                    <p className="text-xs text-muted leading-relaxed mt-2 pl-5">{b.reasoning}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Profile strength tips */}
            <div className="p-5 rounded-2xl border border-border bg-card">
              <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3">Next steps</p>
              <ul className="space-y-2">
                {result.profile_strength_tips.map((t, i) => (
                  <li key={i} className="text-sm text-text-secondary flex gap-2">
                    <span className="text-primary-light">✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </ToolShell>
    </>
  );
}
