"use client";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import ResumeUpload from "@/components/analyze/ResumeUpload";
import VoiceRecorder from "@/components/interview/VoiceRecorder";
import InterviewFeedbackView from "@/components/interview/InterviewFeedbackView";
import { startInterview, respondInterview, finishInterview } from "@/lib/api";
import type { InterviewFeedback } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Loader2, Sparkles, AlertCircle, Volume2 } from "lucide-react";

type Stage = "setup" | "interview" | "generating_feedback" | "feedback";

interface Turn {
  role: "interviewer" | "candidate";
  text: string;
}

function base64ToAudioUrl(b64: string): string {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: "audio/mp3" });
  return URL.createObjectURL(blob);
}

export default function InterviewPage() {
  const [stage, setStage] = useState<Stage>("setup");
  const [error, setError] = useState("");

  // Setup
  const [file, setFile] = useState<File | null>(null);
  const [jdText, setJdText] = useState("");
  const [targetRole, setTargetRole] = useState("");

  // Interview state
  const [sessionId, setSessionId] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [transcript, setTranscript] = useState<Turn[]>([]);
  const [currentAudio, setCurrentAudio] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedback, setFeedback] = useState<InterviewFeedback | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const canStart = !!file && !!jdText && !!targetRole;

  // Auto-play AI question audio when it changes
  useEffect(() => {
    if (!currentAudio || !audioRef.current) return;
    audioRef.current.src = currentAudio;
    audioRef.current.play().catch(() => {});
  }, [currentAudio]);

  async function handleStart() {
    if (!file || !canStart) return;
    setError("");
    setIsProcessing(true);
    setStage("interview");
    try {
      const r = await startInterview({ resume: file, jdText, targetRole });
      setSessionId(r.session_id);
      setQuestionNumber(r.question_number);
      setTotalQuestions(r.total_questions);
      setTranscript([{ role: "interviewer", text: r.first_question }]);
      setCurrentAudio(base64ToAudioUrl(r.audio_b64));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to start interview");
      setStage("setup");
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleResponse(audio: Blob) {
    setIsProcessing(true);
    setError("");
    try {
      const r = await respondInterview({ sessionId, audio });
      setTranscript((prev) => [...prev, { role: "candidate", text: r.transcription }]);

      if (r.is_complete) {
        setStage("generating_feedback");
        const fb = await finishInterview(sessionId);
        setFeedback(fb);
        setStage("feedback");
      } else if (r.next_question && r.audio_b64) {
        setTranscript((prev) => [...prev, { role: "interviewer", text: r.next_question! }]);
        setQuestionNumber(r.question_number);
        setCurrentAudio(base64ToAudioUrl(r.audio_b64));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to process response");
    } finally {
      setIsProcessing(false);
    }
  }

  function handleRestart() {
    setStage("setup");
    setFile(null);
    setJdText("");
    setTargetRole("");
    setSessionId("");
    setTranscript([]);
    setCurrentAudio(null);
    setFeedback(null);
    setError("");
  }

  function replayAudio() {
    audioRef.current?.play().catch(() => {});
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16 px-6">
        <div className="mx-auto max-w-3xl">

          {/* Hidden audio element */}
          <audio ref={audioRef} style={{ display: "none" }} />

          <AnimatePresence mode="wait">

            {/* SETUP */}
            {stage === "setup" && (
              <motion.div
                key="setup"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="space-y-6 pt-8"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center shadow-glow">
                    <Mic className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-text-primary mb-2">AI Mock Interviewer</h1>
                  <p className="text-text-secondary text-sm max-w-lg mx-auto">
                    Voice-based mock interview. 5 questions tailored to your resume + the role.
                    Real-time speech, real feedback at the end.
                  </p>
                </div>

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
                    placeholder="Senior ML Engineer at Anthropic"
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
                    placeholder="Paste the JD so the interviewer can ask role-specific questions..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-xl bg-surface border border-border text-sm text-text-primary placeholder-muted resize-none focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>

                <button
                  onClick={handleStart}
                  disabled={!canStart || isProcessing}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-primary text-white font-semibold text-base shadow-glow disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Start Mock Interview
                </button>

                <div className="p-4 rounded-xl border border-border bg-card text-xs text-text-secondary leading-relaxed">
                  <strong className="text-text-primary">Heads up:</strong> we&apos;ll need microphone access.
                  The interview takes ~5–10 minutes. Take your time on each answer — the better your responses, the more useful the feedback.
                </div>
              </motion.div>
            )}

            {/* INTERVIEW */}
            {stage === "interview" && (
              <motion.div
                key="interview"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="space-y-6 pt-8"
              >
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs text-muted mb-2">
                    <span>Question {questionNumber} of {totalQuestions}</span>
                    <span>{Math.round((questionNumber / totalQuestions) * 100)}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-surface overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>

                {/* Current question */}
                {transcript.length > 0 && transcript[transcript.length - 1].role === "interviewer" && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={transcript.length}
                    className="p-6 rounded-2xl border border-primary/30 bg-primary/5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold uppercase tracking-widest text-primary-light">Interviewer</p>
                      <button
                        onClick={replayAudio}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border text-xs text-text-secondary hover:text-text-primary transition-colors"
                      >
                        <Volume2 className="w-3 h-3" />
                        Replay
                      </button>
                    </div>
                    <p className="text-base text-text-primary leading-relaxed">
                      {transcript[transcript.length - 1].text}
                    </p>
                  </motion.div>
                )}

                {/* Voice recorder */}
                <div className="py-6">
                  <VoiceRecorder onRecorded={handleResponse} isProcessing={isProcessing} />
                </div>

                {/* Transcript so far (collapsible scroll) */}
                {transcript.length > 1 && (
                  <details className="rounded-xl border border-border bg-card">
                    <summary className="px-4 py-3 text-xs font-medium text-text-secondary cursor-pointer hover:text-text-primary">
                      Show transcript ({transcript.length} turns)
                    </summary>
                    <div className="px-4 pb-4 space-y-3 max-h-72 overflow-y-auto">
                      {transcript.map((t, i) => (
                        <div key={i} className={t.role === "interviewer" ? "text-primary-light" : "text-text-primary"}>
                          <span className="text-xs font-semibold uppercase tracking-widest text-muted">{t.role}</span>
                          <p className="text-sm leading-relaxed">{t.text}</p>
                        </div>
                      ))}
                    </div>
                  </details>
                )}

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg border border-danger/30 bg-danger/10 text-danger text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                  </div>
                )}
              </motion.div>
            )}

            {/* GENERATING FEEDBACK */}
            {stage === "generating_feedback" && (
              <motion.div
                key="generating"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="pt-32 text-center"
              >
                <Loader2 className="w-12 h-12 text-primary-light animate-spin mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-text-primary mb-3">Generating your feedback report...</h2>
                <p className="text-sm text-text-secondary">Analyzing your responses across communication, technical depth, and structure.</p>
              </motion.div>
            )}

            {/* FEEDBACK */}
            {stage === "feedback" && feedback && (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="pt-8"
              >
                <InterviewFeedbackView feedback={feedback} onRestart={handleRestart} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </>
  );
}
