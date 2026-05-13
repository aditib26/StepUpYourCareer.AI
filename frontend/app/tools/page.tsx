import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import { FileText, PenLine, Mail, Linkedin, Mic, ArrowRight } from "lucide-react";

const tools = [
  {
    href: "/tools/cover-letter",
    title: "Cover Letter Generator",
    description: "Tailored, non-generic cover letters that connect your experience directly to the role.",
    icon: FileText,
    accent: "from-violet-500 to-purple-600",
    time: "~10s",
  },
  {
    href: "/tools/resume-rewriter",
    title: "Resume Rewriter",
    description: "Transforms weak bullets into XYZ-formula achievements with quantified impact.",
    icon: PenLine,
    accent: "from-blue-500 to-cyan-600",
    time: "~15s",
  },
  {
    href: "/tools/cold-email",
    title: "Cold Email Generator",
    description: "High-response outreach emails for recruiters, hiring managers, and informational interviews.",
    icon: Mail,
    accent: "from-emerald-500 to-teal-600",
    time: "~8s",
  },
  {
    href: "/tools/linkedin",
    title: "LinkedIn Optimizer",
    description: "Rewrites your headline, About section, and experience bullets for maximum recruiter visibility.",
    icon: Linkedin,
    accent: "from-sky-500 to-blue-600",
    time: "~12s",
  },
  {
    href: "/interview",
    title: "AI Mock Interviewer",
    description: "Voice-based mock interview powered by GPT-4o. Real questions, real feedback, real growth.",
    icon: Mic,
    accent: "from-pink-500 to-rose-600",
    time: "~10 min",
    featured: true,
  },
];

export default function ToolsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16 px-6">
        <div className="mx-auto max-w-5xl">

          {/* Header */}
          <div className="pt-10 mb-12 text-center">
            <p className="text-primary-light text-sm font-semibold uppercase tracking-widest mb-3">
              AI Tools
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
              Your <span className="gradient-text">unfair advantage</span>
            </h1>
            <p className="text-text-secondary max-w-xl mx-auto">
              Every tool below is powered by GPT-4o + your resume + a real job posting.
              No generic templates. No fluff.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className={`group relative overflow-hidden rounded-2xl border bg-card card-glow p-6 ${
                  tool.featured ? "border-primary/40 md:col-span-2" : "border-border"
                }`}
              >
                {tool.featured && (
                  <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-primary/15 border border-primary/30 text-primary-light text-xs font-semibold">
                    ✨ Featured
                  </span>
                )}

                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.accent} flex items-center justify-center flex-shrink-0 shadow-glow-sm`}>
                    <tool.icon className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-base font-semibold text-text-primary">{tool.title}</h3>
                      <span className="text-xs text-muted">{tool.time}</span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed">{tool.description}</p>
                    <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary-light group-hover:gap-2.5 transition-all">
                      Open tool <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
