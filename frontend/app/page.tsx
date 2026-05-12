import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Hero />
        <Features />
        <HowItWorks />

        {/* Footer */}
        <footer className="border-t border-border py-10 px-6 text-center">
          <p className="text-sm text-muted">
            © 2025 StepUpYourCareer.AI · Built for the builders of tomorrow
          </p>
        </footer>
      </main>
    </>
  );
}
