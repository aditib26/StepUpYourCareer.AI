"use client";
import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import ResumeUpload from "@/components/analyze/ResumeUpload";
import ToolShell from "@/components/tools/ToolShell";
import CopyButton from "@/components/tools/CopyButton";
import { rewriteResume } from "@/lib/api";
import type { ResumeRewriteResult } from "@/lib/types";
import { motion } from "framer-motion";
import { PenLine, Loader2, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

export default function ResumeRewriterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeRewriteResult | null>(null);
  const [error, setError] = useState("");

  const canSubmit = !!file && !!jdText && !loading;

  async function handleSubmit() {
    if (!file || !canSubmit) return;
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const r = await rewriteResume({ resume: file, jdText, targetRole });
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Rewrite failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <ToolShell
        title="Resume rewriter"
        subtitle="Rewrites your bullets using the XYZ formula with JD keywords."
        icon={<PenLine className="w-5 h-5 text-white" />}
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
              <label className="block text-xs font-medium text-text-secondary mb-2">Target Role (optional)</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Senior Data Engineer"
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder-muted focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">Resume (PDF)</label>
              <ResumeUpload file={file} onFile={setFile} />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">Job Description</label>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the JD so we can align your bullets to its keywords..."
                rows={6}
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
                  Rewrite
                </>
              )}
            </button>
          </div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted">{result.bullets.length} bullets rewritten</p>
              <button
                onClick={() => setResult(null)}
                className="px-3 py-1.5 rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary text-xs font-medium"
              >
                Try again
              </button>
            </div>

            {/* Overall advice */}
            <div className="p-5 rounded-2xl border border-primary/30 bg-primary/5">
              <p className="text-xs font-semibold uppercase tracking-widest text-primary-light mb-2">Strategy</p>
              <p className="text-sm text-text-secondary leading-relaxed">{result.overall_advice}</p>
            </div>

            {/* Keywords */}
            {result.keywords_to_emphasize.length > 0 && (
              <div className="p-5 rounded-2xl border border-border bg-card">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">Keywords to emphasize</p>
                <div className="flex flex-wrap gap-2">
                  {result.keywords_to_emphasize.map((k) => (
                    <span key={k} className="px-2.5 py-1 rounded-md text-xs bg-primary/10 border border-primary/20 text-primary-light">{k}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Bullets */}
            <div className="space-y-3">
              {result.bullets.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-2xl border border-border bg-card"
                >
                  {b.original && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-1">Before</p>
                      <p className="text-sm text-muted line-through leading-relaxed">{b.original}</p>
                    </div>
                  )}
                  <div className="flex items-start gap-2 mb-3">
                    <ArrowRight className="w-3.5 h-3.5 text-primary-light flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-primary-light uppercase tracking-widest mb-1">{b.original ? "After" : "New Bullet"}</p>
                      <p className="text-sm text-text-primary leading-relaxed font-medium">{b.rewritten}</p>
                    </div>
                    <CopyButton text={b.rewritten} label="Copy" />
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed pl-5">{b.reasoning}</p>
                  {b.keywords_added.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pl-5">
                      {b.keywords_added.map((k) => (
                        <span key={k} className="px-1.5 py-0.5 rounded text-xs bg-emerald-400/10 border border-emerald-400/20 text-emerald-400">+ {k}</span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Sections to add */}
            {result.sections_to_add.length > 0 && (
              <div className="p-5 rounded-2xl border border-border bg-card">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-3">Sections to add</p>
                <ul className="space-y-1.5">
                  {result.sections_to_add.map((s) => (
                    <li key={s} className="text-sm text-text-secondary flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-primary-light" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </ToolShell>
    </>
  );
}
