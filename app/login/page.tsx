"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { User, Car, Shield, Eye, EyeOff, Check } from "lucide-react";
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

const TAGLINES = [
  "Your city, on demand.",
  "Fair prices. No surprises.",
  "Ride, deliver, repeat.",
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<(typeof ROLES)[number]["id"]>("rider");
  const [showPassword, setShowPassword] = useState(false);
  const [taglineIndex, setTaglineIndex] = useState(0);
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const onSubmit = async (data: LoginFormValues) => {
    // Mock API Delay
    await new Promise((r) => setTimeout(r, 600));

    const { email, password } = data;

    // Hardcoded credentials logic
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
      toast({ title: "Login successful!", description: `Redirecting as ${selectedRole}...` });
      
      if (selectedRole === "rider") router.push("/home");
      else if (selectedRole === "driver") router.push("/driver/dashboard");
      else router.push("/admin/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email, password, or role selection.",
      });
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Panel: Desktop Decor */}
      <div className="hidden lg:flex lg:w-[45%] h-full relative overflow-hidden">
        <MouseParallax>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-12">
            <h1 className="text-[64px] font-bold tracking-tight mb-4">Zipp</h1>
            <div className="h-8 relative w-full flex justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={taglineIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-xl text-primary font-medium absolute"
                >
                  {TAGLINES[taglineIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
        </MouseParallax>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-[55%] h-full flex flex-col items-center justify-start lg:justify-center p-6 lg:p-12 bg-surface overflow-y-auto">
        <div className="w-full max-w-[440px] space-y-8">
          {/* Logo Mark */}
          <div className="flex flex-col items-center lg:items-start space-y-2">
            <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-sm">
              Z
            </div>
            <h2 className="display-sm text-foreground mt-4">Welcome back</h2>
            <p className="body-sm text-muted-foreground">Please enter your details to continue.</p>
          </div>

          <div className="space-y-6">
            {/* Role Selector */}
            <div className="grid grid-cols-3 gap-3">
              {ROLES.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      "flex flex-col items-center p-3 rounded-card border transition-all duration-200 outline-none",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary"
                        : "border-border bg-white hover:border-primary/50"
                    )}
                  >
                    <Icon className={cn("w-6 h-6 mb-2", isSelected ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-sm font-medium", isSelected ? "text-primary" : "text-foreground")}>
                      {role.label}
                    </span>
                    <span className="text-[10px] text-muted-foreground hidden sm:block">{role.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Input
                    {...register("email")}
                    placeholder="Email address"
                    className={cn("h-11 rounded-input", errors.email && "border-danger ring-danger")}
                  />
                  {errors.email && <p className="text-danger text-xs px-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-1 relative">
                  <Input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className={cn("h-11 rounded-input pr-10", errors.password && "border-danger ring-danger")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  {errors.password && <p className="text-danger text-xs px-1">{errors.password.message}</p>}
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button type="button" className="text-sm font-medium text-primary hover:underline">
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-input text-base font-medium transition-transform active:scale-[0.98]"
              >
                {isSubmitting ? "Signing in..." : `Continue as ${ROLES.find((r) => r.id === selectedRole)?.label}`}
              </Button>
            </form>

            {/* Social Divider */}
            <div className="relative flex items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-sm text-muted-foreground">OR</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            {/* Secondary Actions */}
            <div className="space-y-3">
              <Button variant="outline" className="w-full h-11 border-border bg-white rounded-input flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </Button>
              <Button variant="outline" className="w-full h-11 border-border bg-white rounded-input">
                Continue with Phone
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
              New here?{" "}
              <button type="button" className="text-primary font-bold hover:underline">
                Create account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
