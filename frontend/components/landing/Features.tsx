"use client";
import { motion } from "framer-motion";
import { Target, BookOpen, Users, Zap, Shield, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Gap analysis against a real job",
    description:
      "Paste a LinkedIn, Indeed, or company URL. The analysis is for that posting — not a generic role.",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/20",
  },
  {
    icon: Zap,
    title: "Three skills to focus on",
    description:
      "We rank gaps using the 80/20 principle, so you spend time on the skills that actually move the needle.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
  },
  {
    icon: BookOpen,
    title: "Verified learning resources",
    description:
      "Hand-curated courses, books, and videos. Every link is checked. No hallucinated URLs.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
  },
  {
    icon: Users,
    title: "Mentor matching",
    description:
      "K-means clustering pairs you with people already working in the target role.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-400/20",
  },
  {
    icon: Shield,
    title: "Anonymized by default",
    description:
      "Your resume is stripped of personal details before any AI sees it.",
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20",
  },
  {
    icon: TrendingUp,
    title: "Progress over time",
    description:
      "Mark skills as you learn them. The dashboard tracks gap closure across analyses.",
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
            What it does
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            One workflow. Six tools.
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Each tool uses your resume and a specific job description. Together they cover everything from gap analysis to interview prep.
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
