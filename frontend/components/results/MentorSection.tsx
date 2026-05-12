"use client";
import { motion } from "framer-motion";
import { Linkedin, User } from "lucide-react";
import type { Mentor } from "@/lib/types";

interface Props { mentors: Mentor[]; }

export default function MentorSection({ mentors }: Props) {
  if (!mentors.length) return null;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-text-primary">Matched Mentors</h2>
        <p className="text-xs text-muted mt-1">
          Matched by skill-cluster alignment — people who&apos;ve bridged the same gaps you have.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mentors.map((mentor, i) => (
          <motion.div
            key={mentor.mentor_id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="p-5 rounded-2xl border border-border bg-card card-glow flex flex-col gap-3"
          >
            {/* Avatar + name */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                {mentor.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mentor.photo_url} alt={mentor.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{mentor.name}</p>
                <p className="text-xs text-muted">{mentor.role}</p>
              </div>
            </div>

            {/* Bio */}
            <p className="text-xs text-text-secondary leading-relaxed flex-1">{mentor.bio}</p>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5">
              {mentor.technical_skills.slice(0, 4).map((s) => (
                <span key={s} className="px-2 py-0.5 rounded-md text-xs bg-primary/10 border border-primary/20 text-primary-light">
                  {s}
                </span>
              ))}
              {mentor.technical_skills.length > 4 && (
                <span className="px-2 py-0.5 rounded-md text-xs bg-surface border border-border text-muted">
                  +{mentor.technical_skills.length - 4}
                </span>
              )}
            </div>

            {/* LinkedIn CTA */}
            <a
              href={mentor.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#0a66c2]/40 bg-[#0a66c2]/10 text-[#70a8e2] text-xs font-medium hover:bg-[#0a66c2]/20 transition-colors"
            >
              <Linkedin className="w-3.5 h-3.5" />
              Connect on LinkedIn
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
