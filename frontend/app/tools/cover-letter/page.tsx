"use client";
import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import ResumeUpload from "@/components/analyze/ResumeUpload";
import ToolShell from "@/components/tools/ToolShell";
import CopyButton from "@/components/tools/CopyButton";
import { generateCoverLetter } from "@/lib/api";
import type { CoverLetterResult } from "@/lib/types";
import { motion } from "framer-motion";
import { FileText, Loader2, Sparkles, AlertCircle, Download } from "lucide-react";

export default function CoverLetterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const [userName, setUserName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CoverLetterResult | null>(null);
  const [error, setError] = useState("");

  const canSubmit = !!file && !!jdText && !!userName && !loading;

  async function handleSubmit() {
    if (!file || !canSubmit) return;
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const r = await generateCoverLetter({
        resume: file,
        jdText,
        userName,
        companyName,
        tone,
      });
      setResult(r);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <ToolShell
        title="Cover Letter Generator"
        subtitle="Tailored to a specific job posting using your resume."
        icon={<FileText className="w-5 h-5 text-white" />}
      >
        {!result && (
          <div className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg border border-danger/30 bg-danger/10 text-danger text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2">Your Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder-muted focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2">Company Name (optional)</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Stripe"
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder-muted focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
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
                placeholder="Paste the full job description..."
                rows={6}
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder-muted resize-none focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">Tone</label>
              <div className="flex gap-2">
                {["professional", "enthusiastic", "conversational"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                      tone === t
                        ? "bg-primary/15 border border-primary/40 text-primary-light"
                        : "bg-surface border border-border text-text-secondary hover:border-border-light"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-primary text-white font-semibold text-base shadow-glow disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating your cover letter...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Cover Letter
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
              <p className="text-xs text-muted">Tone: <span className="text-text-secondary capitalize">{result.tone}</span></p>
              <div className="flex gap-2">
                <CopyButton text={result.full_text} label="Copy letter" />
                <button
                  onClick={() => { setResult(null); }}
                  className="px-3 py-1.5 rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary text-xs font-medium"
                >
                  Regenerate
                </button>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-border bg-card">
              <div className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-2">Subject</div>
              <p className="text-sm text-text-primary mb-6 pb-6 border-b border-border">{result.subject_line}</p>

              <div className="prose prose-invert max-w-none">
                <p className="text-sm text-text-primary mb-4">{result.greeting}</p>
                <p className="text-sm text-text-secondary leading-relaxed mb-4 whitespace-pre-wrap">{result.opening_paragraph}</p>
                {result.body_paragraphs.map((p, i) => (
                  <p key={i} className="text-sm text-text-secondary leading-relaxed mb-4 whitespace-pre-wrap">{p}</p>
                ))}
                <p className="text-sm text-text-secondary leading-relaxed mb-4 whitespace-pre-wrap">{result.closing_paragraph}</p>
                <p className="text-sm text-text-primary whitespace-pre-wrap">{result.signature}</p>
              </div>
            </div>
          </motion.div>
        )}
      </ToolShell>
    </>
  );
}
