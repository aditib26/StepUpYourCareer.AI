import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import { FileText, PenLine, Mail, Linkedin, Mic, ArrowRight } from "lucide-react";

const tools = [
  {
    href: "/tools/cover-letter",
    title: "Cover Letter",
    description: "Writes a cover letter tailored to a specific job description and your resume.",
    icon: FileText,
    accent: "from-violet-500 to-purple-600",
    time: "~10s",
  },
  {
    href: "/tools/resume-rewriter",
    title: "Resume Rewriter",
    description: "Rewrites your bullets using the XYZ formula with quantified outcomes and JD keywords.",
    icon: PenLine,
    accent: "from-blue-500 to-cyan-600",
    time: "~15s",
  },
  {
    href: "/tools/cold-email",
    title: "Cold Email",
    description: "Drafts an outreach email and a 7-day follow-up for a named person at a target company.",
    icon: Mail,
    accent: "from-emerald-500 to-teal-600",
    time: "~8s",
  },
  {
    href: "/tools/linkedin",
    title: "LinkedIn Profile",
    description: "Generates a new headline, About section, skills list, and rewritten experience bullets.",
    icon: Linkedin,
    accent: "from-sky-500 to-blue-600",
    time: "~12s",
  },
  {
    href: "/interview",
    title: "Mock Interview",
    description: "Voice-based interview with five role-specific questions and a scored feedback report.",
    icon: Mic,
    accent: "from-pink-500 to-rose-600",
    time: "~10 min",
  },
];

export default function ToolsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 pb-16 px-6">
        <div className="mx-auto max-w-5xl">

          {/* Header */}
          <div className="pt-10 mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-text-primary mb-3">
              Tools
            </h1>
            <p className="text-text-secondary max-w-xl">
              Each tool takes your resume and a job description and returns something specific. Pick one to start.
            </p>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group relative overflow-hidden rounded-2xl border bg-card card-glow p-6 border-border"
              >
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
                      Open <ArrowRight className="w-3 h-3" />
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
