import { Suspense } from "react";
import AuthForm from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" />
      <div className="relative z-10 w-full">
        <Suspense fallback={null}>
          <AuthForm mode="signup" />
        </Suspense>
      </div>
    </main>
  );
}
