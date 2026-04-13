"use client";

import React, { Suspense, lazy, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthBackground } from "@/components/login/MouseParallax";
import { Loader2 } from "lucide-react";

// Lazy load signup flows
const UserSignup = lazy(() => import("@/components/auth/UserSignup"));
const DriverSignup = lazy(() => import("@/components/auth/DriverSignup"));

export default function SignupPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "user" || roleParam === "driver") {
      setRole(roleParam);
    } else {
      // Default to user or redirect if no role is found
      setRole("user");
    }
  }, [searchParams]);

  if (!role) return null;

  return (
    <AuthBackground>
      <div className="flex w-full h-full max-w-[1600px] mx-auto relative z-10 items-center justify-center p-4">
        <Suspense fallback={
          <div className="flex flex-col items-center justify-center space-y-4 bg-white/80 backdrop-blur-xl p-12 rounded-[40px] shadow-2xl border border-white/20">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-sm font-bold text-text-muted uppercase tracking-widest animate-pulse">Initializing {role} setup...</p>
          </div>
        }>
          {role === "user" ? <UserSignup /> : <DriverSignup />}
        </Suspense>
      </div>
    </AuthBackground>
  );
}
