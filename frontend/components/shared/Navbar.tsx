"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/analyze", label: "Analyze" },
    { href: "/dashboard", label: "Dashboard" },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-text-primary text-sm tracking-tight">
            StepUp<span className="gradient-text">Your</span>Career
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                pathname === link.href
                  ? "bg-primary/15 text-primary-light"
                  : "text-text-secondary hover:text-text-primary hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/analyze"
            className="ml-3 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-primary text-white shadow-glow-sm hover:shadow-glow hover:opacity-90 transition-all"
          >
            Start Analysis
          </Link>
        </div>
      </div>
    </nav>
  );
}
