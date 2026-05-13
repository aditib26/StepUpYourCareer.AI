"use client";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { resourceIcon } from "@/lib/utils";
import type { SkillResources } from "@/lib/types";

interface Props { resources: SkillResources[]; }

export default function ResourceSection({ resources }: Props) {
  if (!resources.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-text-primary">
        Learning resources
        <span className="ml-2 text-xs font-normal text-muted">Hand-curated, verified links</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((sr, i) => (
          <motion.div
            key={sr.skill}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="p-5 rounded-2xl border border-border bg-card card-glow"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-3 pb-3 border-b border-border">
              {sr.skill}
            </h3>
            <ul className="space-y-2.5">
              {sr.resources.map((r) => (
                <li key={r.url} className="group">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2.5 hover:text-text-primary transition-colors"
                  >
                    <span className="text-base flex-shrink-0 mt-0.5">{resourceIcon(r.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text-secondary group-hover:text-text-primary transition-colors leading-relaxed">
                        {r.title}
                      </p>
                      {r.description && (
                        <p className="text-xs text-muted mt-0.5 leading-relaxed">{r.description}</p>
                      )}
                      <span className="text-xs text-muted mt-0.5 block">{r.platform}</span>
                    </div>
                    <ExternalLink className="w-3 h-3 text-muted group-hover:text-accent-light flex-shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
