"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export default function ToolShell({ title, subtitle, icon, children }: Props) {
  return (
    <main className="min-h-screen pt-20 pb-16 px-6">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/tools"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-text-secondary transition-colors mt-6 mb-4"
        >
          <ArrowLeft className="w-3 h-3" />
          All tools
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow-sm">
            {icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
            <p className="text-sm text-text-secondary">{subtitle}</p>
          </div>
        </motion.div>

        {children}
      </div>
    </main>
  );
}
