"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary-light text-sm font-medium mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          AI-powered career gap analysis
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.08] tracking-tight text-text-primary mb-6"
        >
          Land the role.
          <br />
          <span className="gradient-text">Know the gaps.</span>
          <br />
          Bridge them fast.
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Upload your resume and paste any job posting URL. In seconds you get
          your exact skill gaps, the 20% of skills that give 80% of the results,
          verified learning resources, and a matched mentor.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/analyze"
            className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-primary text-white font-semibold text-base shadow-glow hover:shadow-glow hover:opacity-90 transition-all"
          >
            Analyze My Resume
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="#how-it-works"
            className="px-8 py-4 rounded-xl border border-border text-text-secondary hover:text-text-primary hover:border-border-light font-medium text-base transition-all"
          >
            See how it works
          </Link>
        </motion.div>

        {/* Social proof */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-sm text-muted"
        >
          Free to start · No credit card required · Results in under 30 seconds
        </motion.p>
      </div>
    </section>
  );
}
