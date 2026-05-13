"use client";
import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import ResumeUpload from "@/components/analyze/ResumeUpload";
import ToolShell from "@/components/tools/ToolShell";
import CopyButton from "@/components/tools/CopyButton";
import { generateColdEmail } from "@/lib/api";
import type { ColdEmailResult } from "@/lib/types";
import { motion } from "framer-motion";
import { Mail, Loader2, Sparkles, AlertCircle, Lightbulb } from "lucide-react";

const PURPOSES = [
  { value: "informational_interview", label: "Coffee chat / informational interview" },
  { value: "referral_request", label: "Referral request" },
  { value: "job_application", label: "Job application follow-up" },
];

export default function ColdEmailPage() {
  const [file, setFile] = useState<File | null>(null);
  const [userName, setUserName] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [targetPersonName, setTargetPersonName] = useState("");
  const [targetPersonRole, setTargetPersonRole] = useState("");
  const [purpose, setPurpose] = useState(PURPOSES[0].value);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ColdEmailResult | null>(null);
  const [error, setError] = useState("");

  const canSubmit =
    !!file && !!userName && !!targetRole && !!targetCompany && !!targetPersonName && !!targetPersonRole && !loading;

  async function handleSubmit() {
    if (!file || !canSubmit) return;
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const r = await generateColdEmail({
        resume: file,
        userName,
        targetRole,
        targetCompany,
        targetPersonName,
        targetPersonRole,
        purpose,
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
        title="Cold Email Generator"
        subtitle="High-response-rate outreach. No 'I hope this finds you well'."
        icon={<Mail className="w-5 h-5 text-white" />}
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
                <label className="block text-xs font-medium text-text-secondary mb-2">Target Role You Want</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="Senior Data Engineer"
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder-muted focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2">Their Name</label>
                <input
                  type="text"
                  value={targetPersonName}
                  onChange={(e) => setTargetPersonName(e.target.value)}
                  placeholder="John Smith"
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder-muted focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-2">Their Role</label>
                <input
                  type="text"
                  value={targetPersonRole}
                  onChange={(e) => setTargetPersonRole(e.target.value)}
                  placeholder="Engineering Manager"
                  className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder-muted focus:outline-none focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">Their Company</label>
              <input
                type="text"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="Stripe"
                className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder-muted focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">Purpose</label>
              <div className="space-y-2">
                {PURPOSES.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPurpose(p.value)}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                      purpose === p.value
                        ? "border-primary/40 bg-primary/10 text-primary-light"
                        : "border-border bg-surface text-text-secondary hover:border-border-light"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">Your Resume (for context)</label>
              <ResumeUpload file={file} onFile={setFile} />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-primary text-white font-semibold text-base shadow-glow disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Crafting your email...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Email
                </>
              )}
            </button>
          </div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted">Ready to send</p>
              <button
                onClick={() => setResult(null)}
                className="px-3 py-1.5 rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary text-xs font-medium"
              >
                Try again
              </button>
            </div>

            {/* Main email */}
            <div className="p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-widest">Subject</span>
                <CopyButton text={result.subject_line} label="Copy subject" />
              </div>
              <p className="text-sm text-text-primary mb-6 pb-6 border-b border-border">{result.subject_line}</p>

              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-widest">Email Body</span>
                <CopyButton text={result.email_body} label="Copy body" />
              </div>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{result.email_body}</p>
            </div>

            {/* Follow-up */}
            <div className="p-6 rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-text-secondary uppercase tracking-widest">7-Day Follow-Up</span>
                <CopyButton text={result.follow_up_text} label="Copy" />
              </div>
              <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">{result.follow_up_text}</p>
            </div>

            {/* Personalization tips */}
            {result.personalization_notes.length > 0 && (
              <div className="p-5 rounded-2xl border border-yellow-400/20 bg-yellow-400/5">
                <p className="text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-3 flex items-center gap-1.5">
                  <Lightbulb className="w-3 h-3" />
                  Make It Even More Personal
                </p>
                <ul className="space-y-2">
                  {result.personalization_notes.map((n, i) => (
                    <li key={i} className="text-sm text-text-secondary flex gap-2">
                      <span className="text-yellow-400">→</span>
                      {n}
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
