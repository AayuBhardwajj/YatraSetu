"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AuthBackground } from "@/components/login/MouseParallax";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 chars"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginRole = "USER" | "DRIVER";

const ROLES: Array<{ id: LoginRole; label: string; desc: string; icon: typeof User }> = [
  { id: "USER", label: "User", desc: "Access your account", icon: User },
  { id: "DRIVER", label: "Driver", desc: "Drive & Earn", icon: User },
];

export default function AuthPage() {
  const [selectedRole, setSelectedRole] = useState<LoginRole>("USER");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const container = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useGSAP(() => {
    gsap.from(".brand-logo", { y: 40, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.1 });
    gsap.to(".gsap-word", { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power4.out", delay: 0.3 });
    gsap.from(".gsap-fade-up", { y: 30, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.7 });
  }, { scope: container });

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const selectedRoleLabel = useMemo(
    () => ROLES.find((r) => r.id === selectedRole)?.label ?? "User",
    [selectedRole]
  );

  useEffect(() => {
    const role = new URLSearchParams(window.location.search).get("role");
    if (role === "USER" || role === "DRIVER") setSelectedRole(role as LoginRole);
  }, []);

  const onSignIn = async (data: LoginFormValues) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
       toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error.message,
      });
      return;
    }

    toast({ title: "Welcome back!", description: `Signed in as ${selectedRoleLabel}` });
    router.push(selectedRole === "USER" ? "/dashboard" : "/driver/dashboard");
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${selectedRole === "USER" ? "/dashboard" : "/driver/dashboard"}`,
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "OAuth Error",
        description: error.message,
      });
    }
  };

  return (
    <AuthBackground>
      <div className="flex w-full h-full max-w-[1600px] mx-auto relative z-10">
        <div ref={container} className="hidden lg:flex flex-col justify-between w-1/2 p-16 relative text-white">
          <div className="brand-logo flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary font-bold text-3xl shadow-lg">
              Z
            </div>
            <span className="text-3xl font-bold tracking-tight">Zipp</span>
          </div>

          <div className="space-y-6 max-w-lg mb-20">
            <h1 className="text-6xl font-bold leading-[1.1] tracking-tight">
               <span className="inline-block overflow-hidden pb-2"><span className="gsap-word inline-block translate-y-[100%] opacity-0">Move</span></span>{" "}
               <span className="inline-block overflow-hidden pb-2"><span className="gsap-word inline-block translate-y-[100%] opacity-0">the</span></span>{" "}
               <span className="inline-block overflow-hidden pb-2"><span className="gsap-word inline-block translate-y-[100%] opacity-0">way</span></span>
               <br /> 
               <span className="inline-block overflow-hidden pt-2 pb-2"><span className="text-primary-light gsap-word inline-block translate-y-[100%] opacity-0">you want.</span></span>
            </h1>
            <p className="gsap-fade-up text-lg text-white/70 font-medium leading-relaxed">
              Experience the fastest, safest, and most reliable ride-booking platform. Whether you're riding, driving, or managing operations, Zipp empowers your journey.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-[480px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col my-auto"
          >
            <div className="p-8 sm:p-10 space-y-8 flex-1">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-text-primary">Welcome Back</h2>
                <p className="text-sm text-text-secondary font-medium">Enter your credentials to access your account.</p>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.15em] ml-1">Select Identity</label>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {ROLES.map((role) => {
                    const isSelected = selectedRole === role.id;
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        className={cn(
                          "flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 relative group",
                          isSelected ? "bg-primary/5 border-primary shadow-sm shadow-primary/10" : "bg-white border-border/60 hover:border-border hover:bg-muted/20"
                        )}
                      >
                        {isSelected && <div className="absolute top-2 right-2 text-primary"><CheckCircle2 className="w-3.5 h-3.5" /></div>}
                        <Icon className={cn("w-6 h-6 mb-2 transition-transform duration-300", isSelected ? "text-primary scale-110" : "text-text-muted group-hover:scale-110")} />
                        <span className={cn("text-[11px] sm:text-xs font-bold transition-colors", isSelected ? "text-primary" : "text-text-primary")}>{role.label}</span>
                        <span className={cn("text-[10px] font-semibold mt-0.5", isSelected ? "text-primary/70" : "text-text-muted")}>{role.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={handleLoginSubmit(onSignIn)} className="space-y-5">
                <div className="space-y-4 pb-1">
                  <div className="relative">
                    <Mail className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                    <Input {...registerLogin("email")} placeholder="Email address" className={cn("h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold focus-visible:ring-primary/20 shadow-inner", loginErrors.email && "bg-danger-light/30")} />
                    {loginErrors.email && <p className="text-danger text-[10px] font-bold mt-1.5 ml-2 absolute -bottom-5">{loginErrors.email.message}</p>}
                  </div>

                  <div className="relative pt-2">
                    <Lock className="absolute left-4 top-[1.6rem] w-5 h-5 text-text-muted" />
                    <Input {...registerLogin("password")} type={showPassword ? "text" : "password"} placeholder="Password" className={cn("h-14 pl-12 pr-12 bg-muted/40 border-none rounded-2xl font-semibold shadow-inner", loginErrors.password && "bg-danger-light/30")} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[1.6rem] text-text-muted hover:text-primary transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {loginErrors.password && <p className="text-danger text-[10px] font-bold mt-1.5 ml-2 absolute -bottom-5">{loginErrors.password.message}</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-[11px] font-bold text-text-secondary uppercase tracking-wider select-none">
                    <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 rounded border-border/60 text-primary focus:ring-primary/20" />
                    Remember me
                  </label>
                  <button type="button" className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider">Forgot Password?</button>
                </div>

                <Button type="submit" disabled={isLoginSubmitting} className="w-full h-14 mt-2 bg-primary hover:bg-primary/90 text-white rounded-2xl text-base font-bold shadow-xl shadow-primary/25 transition-all group">
                  {isLoginSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 
                  (<>Sign In<ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>)}
                </Button>

                <Button type="button" variant="outline" onClick={handleGoogleLogin} className="w-full h-14 rounded-2xl text-base font-bold border-border/60 hover:bg-muted/20 transition-all">
                  Continue with Google
                </Button>

                <p className="text-center text-[11px] text-text-secondary font-semibold pt-1">
                  Don’t have an account?{" "}
                  <button type="button" onClick={() => router.push(`/signup?role=${selectedRole.toLowerCase()}`)} className="text-primary font-bold hover:text-primary/80 transition-colors underline underline-offset-2">Sign up</button>
                </p>
              </form>
            </div>
            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-[#9D80FF] to-primary/40 mt-auto flex-shrink-0" />
          </motion.div>
        </div>
      </div>
    </AuthBackground>
  );
}
