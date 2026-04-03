"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { User, Car, Shield, Eye, EyeOff, Check, ArrowRight, Zap } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MouseParallax } from "@/components/login/MouseParallax";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 chars"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const ROLES = [
  { id: "rider", label: "Rider", desc: "Book rides", icon: User },
  { id: "driver", label: "Driver", desc: "Earn money", icon: Car },
  { id: "admin", label: "Admin", desc: "Manage ops", icon: Shield },
] as const;

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<(typeof ROLES)[number]["id"]>("rider");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    await new Promise((r) => setTimeout(r, 800));
    const { email, password } = data;

    let isValid = false;
    let userData = null;

    if (email === "user@zipp.com" && password === "user123" && selectedRole === "rider") {
      isValid = true;
      userData = { id: "u1", name: "Arjun Singh", email, role: "rider" as const };
    } else if (email === "driver@zipp.com" && password === "driver123" && selectedRole === "driver") {
      isValid = true;
      userData = { id: "d1", name: "Rajesh Kumar", email, role: "driver" as const };
    } else if (email === "admin@zipp.com" && password === "admin123" && selectedRole === "admin") {
      isValid = true;
      userData = { id: "a1", name: "Admin Zipp", email, role: "admin" as const };
    }

    if (isValid && userData) {
      login(userData, "mock_jwt_token");
      toast({ title: "Welcome back!", description: `Identifying as ${selectedRole}...` });
      
      if (selectedRole === "rider") router.push("/home");
      else if (selectedRole === "driver") router.push("/driver/dashboard");
      else router.push("/admin/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: "Invalid credentials for the selected role.",
      });
    }
  };

  return (
    <MouseParallax>
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-20 w-full max-w-[480px] px-6 py-12"
      >
        <Card className="bg-white border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] rounded-[48px] p-10 lg:p-12 space-y-10 overflow-hidden relative group">
          {/* Subtle Glow inside card */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-1000" />
          
          <div className="flex flex-col items-center text-center space-y-6 relative z-10">
            <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-primary/20 rotate-3 hover:rotate-0 transition-transform duration-500">
              Z
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-text-primary tracking-tight">Access Zipp</h1>
              <p className="text-sm font-medium text-text-muted">Enter your secure credentials to continue.</p>
            </div>
          </div>

          <div className="space-y-8 relative z-10">
            {/* Identity Switcher */}
            <div className="grid grid-cols-3 gap-3 p-1 bg-muted/30 rounded-[24px]">
              {ROLES.map((role) => {
                const isSelected = selectedRole === role.id;
                const Icon = role.icon;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      "flex flex-col items-center justify-center py-4 px-2 rounded-[20px] transition-all duration-300 relative overflow-hidden",
                      isSelected 
                        ? "bg-white text-primary shadow-sm" 
                        : "text-text-muted hover:text-text-primary hover:bg-white/50"
                    )}
                  >
                    <Icon className={cn("w-5 h-5 mb-1.5 transition-transform", isSelected && "scale-110")} />
                    <span className="text-[11px] font-bold uppercase tracking-widest leading-none">{role.label}</span>
                  </button>
                );
              })}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-4">Identifier</label>
                  <Input
                    {...register("email")}
                    placeholder="name@zipp.com"
                    className={cn(
                      "h-14 px-6 bg-muted/40 border-none rounded-2xl font-bold focus-visible:ring-primary/20 transition-all",
                      errors.email && "bg-danger-light/30"
                    )}
                  />
                  {errors.email && <p className="text-danger text-[10px] font-bold px-4">{errors.email.message}</p>}
                </div>

                <div className="space-y-1 relative">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] ml-4">Secure Key</label>
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={cn(
                      "h-14 px-6 bg-muted/40 border-none rounded-2xl font-bold focus-visible:ring-primary/20 transition-all",
                      errors.password && "bg-danger-light/30"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-[38px] text-text-muted hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.password && <p className="text-danger text-[10px] font-bold px-4">{errors.password.message}</p>}
                </div>
              </div>

              <div className="flex items-center justify-center">
                <button type="button" className="text-xs font-bold text-primary hover:text-primary/70 transition-colors uppercase tracking-widest">
                  Authentication Issue?
                </button>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-16 bg-primary hover:bg-primary/90 text-white rounded-[24px] text-lg font-bold transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] group"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center text-xs font-bold uppercase tracking-[0.3em] text-text-muted">
                <span className="bg-white px-4">Federated Access</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-14 bg-white border-2 border-border/50 rounded-2xl hover:bg-muted/30 font-bold transition-all">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                </svg>
                Google
              </Button>
              <Button variant="outline" className="h-14 bg-white border-2 border-border/50 rounded-2xl hover:bg-muted/30 font-bold transition-all">
                Phone
              </Button>
            </div>

            <p className="text-center text-xs font-bold text-text-muted mt-8 uppercase tracking-[0.1em]">
              New to zipp?{" "}
              <button type="button" className="text-primary hover:underline">
                Register Identity
              </button>
            </p>
          </div>
        </Card>
      </motion.div>
    </MouseParallax>
  );
}
