"use client";
import { motion } from "framer-motion";
import { Target, BookOpen, Users, Zap, Shield, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "JD-Specific Gap Analysis",
    description:
      "Paste any LinkedIn, Indeed, or company job posting. We analyze your gaps against *that exact role*, not a generic template.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
  },
  {
    icon: Zap,
    title: "Pareto Prioritization",
    description:
      "The 80/20 rule applied to your career. We surface the 3 skills that will move the needle most — so you study what matters.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
  },
  {
    icon: BookOpen,
    title: "Verified Learning Roadmap",
    description:
      "No hallucinated URLs. Every course, book, and video is curated and verified. Real links that actually work.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  {
    icon: Users,
    title: "Mentor Matching",
    description:
      "Get matched to professionals already working in your target role via skill-based clustering — not random recommendations.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your resume is anonymized before any AI processing. We never store your personal information.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Log skills as you learn them. Watch your gap shrink over time. Turn analysis into action.",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Features() {
  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-primary-light text-sm font-semibold uppercase tracking-widest mb-3">
            Everything you need
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Built for serious job seekers
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Not another resume builder. A full career intelligence layer between you and your next role.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={item}
              className={`p-6 rounded-2xl border card-glow bg-card border-border`}
            >
              <div className={`w-10 h-10 rounded-xl ${f.bg} ${f.border} border flex items-center justify-center mb-4`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-2">{f.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
