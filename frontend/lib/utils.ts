import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function priorityColor(score: number): string {
  if (score >= 80) return "text-red-400 bg-red-400/10 border-red-400/20";
  if (score >= 60) return "text-orange-400 bg-orange-400/10 border-orange-400/20";
  if (score >= 40) return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
  return "text-blue-400 bg-blue-400/10 border-blue-400/20";
}

export function priorityLabel(score: number): string {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

export function resourceIcon(type: string): string {
  const icons: Record<string, string> = {
    course: "🎓",
    book: "📚",
    video: "▶️",
    article: "📄",
  };
  return icons[type] ?? "🔗";
}
