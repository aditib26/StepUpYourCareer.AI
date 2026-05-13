"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UserMenu() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  async function handleLogout() {
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return <div className="w-9 h-9 rounded-full bg-surface animate-pulse" />;
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/auth/login"
          className="px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
        >
          Sign in
        </Link>
        <Link
          href="/auth/signup"
          className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-primary text-white shadow-glow-sm hover:opacity-90 transition-all"
        >
          Get Started
        </Link>
      </div>
    );
  }

  const initial = (user.user_metadata?.full_name || user.email || "?")[0].toUpperCase();
  const name = user.user_metadata?.full_name || user.email?.split("@")[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-bold">
          {initial}
        </div>
        <ChevronDown className={`w-3 h-3 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-12 w-64 rounded-xl border border-border bg-card shadow-card overflow-hidden"
          >
            <div className="p-4 border-b border-border">
              <p className="text-sm font-semibold text-text-primary truncate">{name}</p>
              <p className="text-xs text-muted truncate">{user.email}</p>
            </div>

            <div className="py-1">
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-surface hover:text-danger transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
