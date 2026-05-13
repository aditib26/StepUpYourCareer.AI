"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Upload, LinkIcon, BarChart3, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Add your resume",
    description:
      "Upload a PDF. Text is extracted and personal details are stripped before anything is sent to the model.",
  },
  {
    number: "02",
    icon: LinkIcon,
    title: "Add a job description",
    description:
      "Paste a URL or the full text. The required skills get extracted for that specific role.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Get the output",
    description:
      "Prioritized gaps, curated resources, mentor matches. From there, run the tools — cover letter, mock interview, LinkedIn rewrite.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 border-t border-border">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <p className="text-primary-light text-sm font-semibold uppercase tracking-widest mb-3">
            How it works
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            Three inputs. One output.
          </h2>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                {/* Icon circle */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow">
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-surface border border-border text-xs font-bold text-muted flex items-center justify-center">
                    {step.number.slice(1)}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-text-primary mb-3">{step.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Link
            href="/analyze"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-primary text-white font-semibold shadow-glow hover:opacity-90 transition-all"
          >
            Start an analysis
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
