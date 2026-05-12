import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#08080f",
        surface: "#0f0f1a",
        card: "#13131f",
        border: "#1e1e30",
        "border-light": "#2a2a40",
        primary: "#7c3aed",
        "primary-light": "#9d5ef0",
        accent: "#2563eb",
        "accent-light": "#3b82f6",
        muted: "#64748b",
        "text-primary": "#e2e8f0",
        "text-secondary": "#94a3b8",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #7c3aed, #2563eb)",
        "gradient-card": "linear-gradient(145deg, #13131f, #0f0f1a)",
        "gradient-glow": "radial-gradient(ellipse at top, rgba(124,58,237,0.15), transparent 70%)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        pulse: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      boxShadow: {
        glow: "0 0 40px rgba(124, 58, 237, 0.2)",
        "glow-sm": "0 0 20px rgba(124, 58, 237, 0.15)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
