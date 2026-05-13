import type { Metadata } from "next";
import "./globals.css";

// Force all routes to render dynamically (auth depends on cookies)
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "StepUpYourCareer.AI — Know your gaps. Bridge them fast.",
  description:
    "Upload your resume, paste a job link. Get your exact skill gaps, a verified learning roadmap, and a mentor match in seconds.",
  openGraph: {
    title: "StepUpYourCareer.AI",
    description: "AI-powered career gap analysis. Real job postings. Real resources. Real mentors.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-background text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
