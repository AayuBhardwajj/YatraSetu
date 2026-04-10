"use client";

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Phone, Calendar, MapPin, 
  ShieldCheck, Lock, Eye, EyeOff, ChevronRight, 
  ChevronLeft, Camera, CheckCircle2, Languages,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AuthBackground } from "@/components/login/MouseParallax";
import { cn } from "@/lib/utils";

// --- Validation Schemas ---

const step1Schema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  dob: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  }, "You must be at least 18 years old"),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"], {
    errorMap: () => ({ message: "Please select a gender" }),
  }),
});

const step2Schema = z.object({
  city: z.string().min(2, "City is required"),
  locality: z.string().min(2, "Locality/Area is required"),
  emergencyName: z.string().min(2, "Emergency contact name is required"),
  emergencyPhone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  language: z.string().min(1, "Preferred language is required"),
});

const step3Schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  referralCode: z.string().optional(),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms" }),
  }),
  promotions: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof step1Schema> & z.infer<typeof step2Schema> & z.infer<typeof step3Schema>;

export default function RiderSignup() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const container = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(
      step === 1 ? step1Schema : step === 2 ? step2Schema : step3Schema
    ),
    mode: "onChange",
  });

  useGSAP(() => {
    gsap.from(".brand-logo", { y: 40, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.1 });
    gsap.to(".gsap-word", { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power4.out", delay: 0.3 });
    gsap.from(".gsap-fade-up", { y: 30, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.7 });
  }, { scope: container });

  const nextStep = async () => {
    const fieldsToValidate = 
      step === 1 ? ["fullName", "email", "phone", "dob", "gender"] :
      step === 2 ? ["city", "locality", "emergencyName", "emergencyPhone", "language"] : [];
    
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 800));
    toast({
      title: "Registration Successful!",
      description: "Welcome to Zipp. You can now sign in.",
    });
    router.push("/login?role=RIDER");
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <AuthBackground>
      <div className="flex w-full h-full max-w-[1600px] mx-auto relative z-10">
        {/* Left Side: Branding */}
        <div ref={container} className="hidden lg:flex flex-col justify-between w-1/2 p-16 relative text-white">
          <div className="brand-logo flex items-center gap-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary font-bold text-3xl shadow-lg cursor-pointer" onClick={() => router.push('/')}>
              Z
            </div>
            <span className="text-3xl font-bold tracking-tight">Zipp</span>
          </div>

          <div className="space-y-6 max-w-lg mb-20">
            <h1 className="text-6xl font-bold leading-[1.1] tracking-tight">
               <span className="inline-block overflow-hidden pb-2"><span className="gsap-word inline-block translate-y-[100%] opacity-0">Join</span></span>{" "}
               <span className="inline-block overflow-hidden pb-2"><span className="gsap-word inline-block translate-y-[100%] opacity-0">the</span></span>{" "}
               <span className="inline-block overflow-hidden pb-2"><span className="gsap-word inline-block translate-y-[100%] opacity-0">future</span></span>
               <br /> 
               <span className="inline-block overflow-hidden pt-2 pb-2"><span className="text-primary-light gsap-word inline-block translate-y-[100%] opacity-0">of mobility.</span></span>
            </h1>
            <p className="gsap-fade-up text-lg text-white/70 font-medium leading-relaxed">
              Sign up as a rider and discover a seamless, faster way to traverse your city with comfort and style.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[520px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col min-h-[700px]"
          >
            {/* Progress Header */}
            <div className="p-8 pb-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={cn(
                        "h-1.5 w-8 rounded-full transition-all duration-300",
                        step >= s ? "bg-primary" : "bg-muted"
                      )}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                  Step {step} of 3
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-text-primary">Create Rider Account</h2>
                <p className="text-sm text-text-secondary font-medium">
                  {step === 1 && "Start your journey by filling in your basics."}
                  {step === 2 && "Help us personalize your ride experience."}
                  {step === 3 && "Secure your account and you're good to go!"}
                </p>
              </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 px-8 sm:px-10 py-4 relative">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.form
                  key={step}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6 pb-8"
                >
                  {step === 1 && (
                    <div className="space-y-5">
                      <div className="space-y-4">
                        <label className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.15em] ml-1">Personal Details</label>
                        
                        <div className="relative">
                          <User className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                          <Input
                            {...register("fullName")}
                            placeholder="Full Name"
                            className={cn(
                              "h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold focus-visible:ring-primary/20 focus-visible:bg-white shadow-inner",
                              errors.fullName && "bg-danger-light/30"
                            )}
                          />
                          {errors.fullName && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.fullName.message}</p>}
                        </div>

                        <div className="relative pt-2">
                          <Mail className="absolute left-4 top-[1.6rem] w-5 h-5 text-text-muted" />
                          <Input
                            {...register("email")}
                            placeholder="Email Address"
                            className={cn(
                              "h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold focus-visible:ring-primary/20 focus-visible:bg-white shadow-inner",
                              errors.email && "bg-danger-light/30"
                            )}
                          />
                          {errors.email && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.email.message}</p>}
                        </div>

                        <div className="flex gap-4 pt-2">
                          <div className="relative flex-1">
                            <Phone className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                            <Input
                              {...register("phone")}
                              placeholder="Phone (+91)"
                              className={cn(
                                "h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold focus-visible:ring-primary/20 focus-visible:bg-white shadow-inner",
                                errors.phone && "bg-danger-light/30"
                              )}
                            />
                            {errors.phone && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.phone.message}</p>}
                          </div>
                          
                          <div className="relative flex-1">
                            <Calendar className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                            <Input
                              {...register("dob")}
                              type="date"
                              className={cn(
                                "h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold focus-visible:ring-primary/20 focus-visible:bg-white shadow-inner",
                                errors.dob && "bg-danger-light/30"
                              )}
                            />
                            {errors.dob && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.dob.message}</p>}
                          </div>
                        </div>

                        <div className="space-y-3 pt-2">
                          <label className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.15em] ml-1">Gender</label>
                          <div className="grid grid-cols-2 gap-3">
                            {["Male", "Female", "Other", "Prefer not to say"].map((g) => (
                              <button
                                key={g}
                                type="button"
                                onClick={() => register("gender").onChange({ target: { value: g, name: "gender" } })}
                                className={cn(
                                  "h-12 rounded-xl text-xs font-bold border-2 transition-all",
                                  watch("gender") === g
                                    ? "bg-primary/5 border-primary text-primary"
                                    : "bg-white border-border/60 text-text-primary hover:border-border"
                                )}
                              >
                                {g}
                              </button>
                            ))}
                          </div>
                          {errors.gender && <p className="text-danger text-[10px] font-bold ml-2">{errors.gender.message}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-5">
                      <div className="space-y-4">
                        <label className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.15em] ml-1">Address Details</label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="relative">
                            <MapPin className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                            <Input
                              {...register("city")}
                              placeholder="City"
                              className={cn("h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold", errors.city && "bg-danger-light/30")}
                            />
                            {errors.city && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.city.message}</p>}
                          </div>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                            <Input
                              {...register("locality")}
                              placeholder="Locality/Area"
                              className={cn("h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold", errors.locality && "bg-danger-light/30")}
                            />
                            {errors.locality && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.locality.message}</p>}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4 pt-2">
                        <label className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.15em] ml-1">Emergency Contact</label>
                        <div className="relative">
                          <Heart className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                          <Input
                            {...register("emergencyName")}
                            placeholder="Contact Person’s Name"
                            className={cn("h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold", errors.emergencyName && "bg-danger-light/30")}
                          />
                          {errors.emergencyName && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.emergencyName.message}</p>}
                        </div>
                        <div className="relative pt-2">
                          <Phone className="absolute left-4 top-[1.6rem] w-5 h-5 text-text-muted" />
                          <Input
                            {...register("emergencyPhone")}
                            placeholder="Contact Phone (+91)"
                            className={cn("h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold", errors.emergencyPhone && "bg-danger-light/30")}
                          />
                          {errors.emergencyPhone && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.emergencyPhone.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-4 pt-2">
                        <label className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.15em] ml-1">Preferences</label>
                        <div className="relative">
                          <Languages className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                          <select
                            {...register("language")}
                            className={cn(
                              "w-full h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold appearance-none focus:ring-2 focus:ring-primary/20",
                              errors.language && "bg-danger-light/30"
                            )}
                          >
                            <option value="">Preferred Language</option>
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Regional">Regional (Marathi/Kannada/etc.)</option>
                          </select>
                          {errors.language && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.language.message}</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-5">
                      <div className="space-y-4">
                        <label className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.15em] ml-1">Security</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                          <Input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="Create Password"
                            className={cn("h-14 pl-12 pr-12 bg-muted/40 border-none rounded-2xl font-semibold", errors.password && "bg-danger-light/30")}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-[1.1rem] text-text-muted hover:text-primary transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                          {errors.password && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.password.message}</p>}
                        </div>

                        <div className="relative pt-2">
                          <ShieldCheck className="absolute left-4 top-[1.6rem] w-5 h-5 text-text-muted" />
                          <Input
                            {...register("confirmPassword")}
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            className={cn("h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold", errors.confirmPassword && "bg-danger-light/30")}
                          />
                          {errors.confirmPassword && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.confirmPassword.message}</p>}
                        </div>
                      </div>

                      <div className="space-y-4 pt-2">
                        <label className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.15em] ml-1">Extras (Optional)</label>
                        <div className="flex gap-4">
                           <div className="relative flex-[2]">
                             <Input {...register("referralCode")} placeholder="Referral Code" className="h-14 bg-muted/40 border-none rounded-2xl font-semibold px-4 shadow-inner" />
                           </div>
                           <button type="button" className="flex-1 h-14 bg-muted/20 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center group hover:bg-muted/40 transition-colors">
                              <Camera className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
                              <span className="text-[9px] font-bold text-text-muted mt-1 uppercase">Photo</span>
                           </button>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4">
                        <div className="flex items-start gap-3">
                          <input type="checkbox" {...register("terms")} id="terms" className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary shadow-inner" />
                          <label htmlFor="terms" className="text-[11px] leading-relaxed text-text-secondary">
                            I agree to Zipp’s <span className="text-primary font-bold underline cursor-pointer">Terms of Service</span> and <span className="text-primary font-bold underline cursor-pointer">Privacy Policy</span>.
                          </label>
                        </div>
                        {errors.terms && <p className="text-danger text-[10px] font-bold ml-7">{errors.terms.message}</p>}
                        
                        <div className="flex items-start gap-3">
                          <input type="checkbox" {...register("promotions")} id="promotions" className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary shadow-inner" />
                          <label htmlFor="promotions" className="text-[11px] leading-relaxed text-text-secondary">
                            Opt-in for exclusive offers, promotions, and updates from Zipp.
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.form>
              </AnimatePresence>
            </div>

            {/* Controls Footer */}
            <div className="p-8 pt-4 space-y-4">
              <div className="flex gap-4">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    className="h-14 flex-1 rounded-2xl font-bold bg-muted/20 hover:bg-muted/40 text-text-secondary"
                  >
                    <ChevronLeft className="mr-2 w-5 h-5" />
                    Back
                  </Button>
                )}
                
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="h-14 flex-[2] bg-primary hover:bg-primary/90 text-white rounded-2xl text-base font-bold shadow-xl shadow-primary/25 group transition-all"
                  >
                    Continue
                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                    disabled={isSubmitting}
                    className="h-14 flex-[2] bg-primary hover:bg-primary/90 text-white rounded-2xl text-base font-bold shadow-xl shadow-primary/25 transition-all group"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        Complete Signup
                        <CheckCircle2 className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </Button>
                )}
              </div>

              <p className="text-center text-xs font-medium text-text-muted mt-2">
                Already have an account?{" "}
                <button onClick={() => router.push("/login?role=RIDER")} className="text-primary font-bold hover:underline transition-all">Sign In</button>
              </p>
            </div>

            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-[#9D80FF] to-primary/40 mt-auto" />
          </motion.div>
        </div>
      </div>
    </AuthBackground>
  );
}
