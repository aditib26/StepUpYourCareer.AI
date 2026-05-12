"use client";
import { useState } from "react";
import Navbar from "@/components/shared/Navbar";
import ResumeUpload from "@/components/analyze/ResumeUpload";
import JDInput from "@/components/analyze/JDInput";
import PipelineProgress from "@/components/analyze/PipelineProgress";
import SkillGapSection from "@/components/results/SkillGapSection";
import ResourceSection from "@/components/results/ResourceSection";
import MentorSection from "@/components/results/MentorSection";
import { streamAnalysis } from "@/lib/api";
import type { AnalysisResult, PipelineEvent, PipelineStep } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertCircle } from "lucide-react";

type Stage = "input" | "processing" | "results";

export default function AnalyzePage() {
  const [stage, setStage] = useState<Stage>("input");
  const [file, setFile] = useState<File | null>(null);
  const [jdUrl, setJdUrl] = useState("");
  const [jdText, setJdText] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [error, setError] = useState("");

  // Pipeline state
  const [currentStep, setCurrentStep] = useState<PipelineStep>("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const canSubmit = !!file && (!!jdUrl || !!jdText) && !!userName;

  async function handleSubmit() {
    if (!file || !canSubmit) return;
    setError("");
    setStage("processing");
    setProgress(0);
    setCurrentStep("pdf_parsing");
    setMessage("Starting analysis...");

    try {
      const stream = await streamAnalysis({
        resume: file,
        jdUrl: jdUrl || undefined,
        jdText: jdText || undefined,
        userName,
        userEmail,
      });

      const reader = stream.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value) continue;

        try {
          const event: PipelineEvent = JSON.parse(value);
          setCurrentStep(event.step);
          setProgress(event.progress);
          setMessage(event.message);

          if (event.step === "complete" && event.data) {
            setResult(event.data as unknown as AnalysisResult);
            setStage("results");
          }
        } catch {
          // skip malformed SSE chunk
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStage("input");
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16 px-6">
        <div className="mx-auto max-w-4xl">

          {/* Header */}
          <div className="text-center mb-10 pt-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-3">
              {stage === "results" && result
                ? `Your Gap Report · ${result.target_role}`
                : "Analyze Your Career Gap"}
            </h1>
            <p className="text-text-secondary">
              {stage === "results"
                ? `${result?.company_name ? `For ${result.company_name} · ` : ""}Powered by GPT-4o + Pareto Prioritization`
                : "Upload your resume and paste a job posting to get started."}
            </p>
          </div>

          {/* Input stage */}
          <AnimatePresence mode="wait">
            {stage === "input" && (
              <motion.div
                key="input"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="space-y-6"
              >
                {error && (
                  <div className="flex items-center gap-3 p-4 rounded-xl border border-danger/30 bg-danger/10 text-danger text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}

                {/* User info */}
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
                    <label className="block text-xs font-medium text-text-secondary mb-2">Email (optional — for report)</label>
                    <input
                      type="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder-muted focus:outline-none focus:border-primary/50 transition-all"
                    />
                  </div>
                </div>

                {/* Resume upload */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2">Resume (PDF)</label>
                  <ResumeUpload file={file} onFile={setFile} />
                </div>

                {/* JD input */}
                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2">Job Description</label>
                  <JDInput
                    jdUrl={jdUrl}
                    jdText={jdText}
                    onUrl={setJdUrl}
                    onText={setJdText}
                  />
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-primary text-white font-semibold text-base shadow-glow disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 hover:shadow-glow transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  {canSubmit ? "Analyze My Career Gap" : "Fill in all fields to continue"}
                </button>

                <p className="text-center text-xs text-muted">
                  Your resume is anonymized before AI processing. We never store personal data.
                </p>
              </motion.div>
            )}

            {/* Processing stage */}
            {stage === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="py-12"
              >
                <PipelineProgress
                  currentStep={currentStep}
                  progress={progress}
                  message={message}
                />
              </motion.div>
            )}

            {/* Results stage */}
            {stage === "results" && result && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Top Pareto priorities */}
                <div className="p-6 rounded-2xl border border-primary/30 bg-primary/5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary-light mb-4">
                    🎯 Pareto Focus — Top 3 Skills (80% of the result)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {result.top_skills.map((s, i) => (
                      <div key={s.skill} className="p-4 rounded-xl bg-card border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg font-black text-primary-light">#{i + 1}</span>
                          <span className="text-sm font-semibold text-text-primary">{s.skill}</span>
                        </div>
                        <div className="text-xs text-muted mb-2">Priority: {s.priority_score}/100</div>
                        <p className="text-xs text-text-secondary leading-relaxed">{s.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <SkillGapSection gaps={result.skill_gaps} />
                <ResourceSection resources={result.resources} />
                <MentorSection mentors={result.mentors} />

                {/* Re-analyze button */}
                <div className="text-center pt-4">
                  <button
                    onClick={() => { setStage("input"); setResult(null); setProgress(0); }}
                    className="px-6 py-3 rounded-xl border border-border text-text-secondary hover:text-text-primary hover:border-border-light text-sm font-medium transition-all"
                  >
                    ← Start a new analysis
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
