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
  User, Mail, Phone, Calendar, Car, 
  FileText, CreditCard, Lock, Eye, EyeOff, 
  ChevronRight, ChevronLeft, Camera, CheckCircle2, 
  ShieldCheck, Banknote, MapPin, BadgeCheck, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AuthBackground } from "@/components/login/MouseParallax";
import { cn } from "@/lib/utils";

// --- Validation Schemas ---

const step1Schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  dob: z.string().refine((date) => {
    const birthDate = new Date(date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  }, "Drivers must be at least 18 years old"),
  gender: z.enum(["Male", "Female", "Other", "Prefer not to say"], {
    errorMap: () => ({ message: "Select gender" }),
  }),
});

const step2Schema = z.object({
  vehicleType: z.enum(["Auto", "Bike", "Mini", "Sedan", "SUV"], {
    errorMap: () => ({ message: "Select vehicle type" }),
  }),
  vehicleMake: z.string().min(1, "Make is required"),
  vehicleModel: z.string().min(1, "Model is required"),
  year: z.string().regex(/^\d{4}$/, "Valid year required").refine(y => parseInt(y) > 2000 && parseInt(y) <= new Date().getFullYear(), "Invalid year"),
  color: z.string().min(1, "Color is required"),
  plateNumber: z.string().min(4, "Invalid number plate"),
  rcNumber: z.string().min(5, "Invalid RC number"),
});

const step3Schema = z.object({
  dlNumber: z.string().regex(/^[A-Z]{2}\d{2}\d{4}\d{7}$/, "Invalid DL (Format: ST0020120000000)"),
  dlExpiry: z.string().refine(d => new Date(d) > new Date(), "DL must not be expired"),
  aadhaar: z.string().regex(/^\d{12}$/, "Aadhaar must be 12 digits"),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN (e.g. ABCDE1234F)"),
  insuranceNumber: z.string().min(5, "Insurance number is required"),
  insuranceExpiry: z.string().refine(d => new Date(d) > new Date(), "Insurance must be valid"),
  pucNumber: z.string().min(5, "PUC number is required"),
});

const step4Schema = z.object({
  bankHolder: z.string().min(2, "Account holder name is required"),
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z.string().min(9, "Invalid account number"),
  ifsc: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC (e.g. SBIN0123456)"),
  upiId: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  terms: z.literal(true, {
    errorMap: () => ({ message: "Required" }),
  }),
  bgConsent: z.literal(true, {
    errorMap: () => ({ message: "Required" }),
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords mismatch",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof step1Schema> & z.infer<typeof step2Schema> & z.infer<typeof step3Schema> & z.infer<typeof step4Schema>;

export default function DriverSignup() {
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
      step === 1 ? step1Schema : step === 2 ? step2Schema : step === 3 ? step3Schema : step4Schema
    ),
    mode: "onChange",
  });

  useGSAP(() => {
    gsap.from(".brand-logo", { y: 40, opacity: 0, duration: 1.2, ease: "power3.out", delay: 0.1 });
    gsap.to(".gsap-word", { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power4.out", delay: 0.3 });
    gsap.from(".gsap-fade-up", { y: 30, opacity: 0, duration: 1, stagger: 0.15, ease: "power3.out", delay: 0.7 });
  }, { scope: container });

  const nextStep = async () => {
    const fieldsMap: Record<number, (keyof FormData)[]> = {
      1: ["fullName", "email", "phone", "dob", "gender"],
      2: ["vehicleType", "vehicleMake", "vehicleModel", "year", "color", "plateNumber", "rcNumber"],
      3: ["dlNumber", "dlExpiry", "aadhaar", "pan", "insuranceNumber", "insuranceExpiry", "pucNumber"],
    };
    
    const isValid = await trigger(fieldsMap[step]);
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
      description: "Driver account created. You can now sign in and wait for verification.",
    });
    router.push("/login?role=USER");
  };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 }),
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
               <span className="inline-block overflow-hidden pb-2"><span className="gsap-word inline-block translate-y-[100%] opacity-0">Earn</span></span>{" "}
               <span className="inline-block overflow-hidden pb-2"><span className="gsap-word inline-block translate-y-[100%] opacity-0">more</span></span>{" "}
               <span className="inline-block overflow-hidden pb-2"><span className="gsap-word inline-block translate-y-[100%] opacity-0">with</span></span>
               <br /> 
               <span className="inline-block overflow-hidden pt-2 pb-2"><span className="text-primary-light gsap-word inline-block translate-y-[100%] opacity-0">every mile.</span></span>
            </h1>
            <p className="gsap-fade-up text-lg text-white/70 font-medium leading-relaxed">
              Zipp offers the lowest commissions and real-time payouts. Join our community of professional drivers today.
            </p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[560px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col min-h-[750px]"
          >
            {/* Progress Header */}
            <div className="p-8 pb-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                   <div className="bg-primary/10 p-2 rounded-xl">
                      <Car className="w-4 h-4 text-primary" />
                   </div>
                   <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Driver Onboarding</span>
                </div>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4].map((s) => (
                    <div
                      key={s}
                      className={cn(
                        "h-1.5 w-6 rounded-full transition-all duration-300",
                        step >= s ? "bg-primary" : "bg-muted"
                      )}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-text-primary">
                   {step === 1 && "Start Your Profile"}
                   {step === 2 && "Vehicle Information"}
                   {step === 3 && "Identity & Verification"}
                   {step === 4 && "Setup Payouts"}
                </h2>
                <p className="text-sm text-text-secondary font-medium">
                  {step === 1 && "Let's gather some basic info about you."}
                  {step === 2 && "Details about the vehicle you'll be driving."}
                  {step === 3 && "Securely upload your legal documents."}
                  {step === 4 && "Finalize banking and secure your account."}
                </p>
              </div>
            </div>

            {/* Form Content */}
            <div className="flex-1 px-8 sm:px-10 py-2 relative">
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
                  className="space-y-5 pb-8"
                >
                  {step === 1 && (
                    <div className="space-y-4">
                        <div className="flex justify-center py-2">
                           <div className="relative group cursor-pointer">
                              <div className="w-24 h-24 bg-muted/40 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-border group-hover:bg-muted/60 transition-all overflow-hidden">
                                 <Camera className="w-6 h-6 text-text-muted" />
                                 <span className="text-[9px] font-bold text-text-muted mt-1 uppercase">Profile Photo</span>
                              </div>
                              <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-xl shadow-lg border-2 border-white">
                                 <BadgeCheck className="w-4 h-4" />
                              </div>
                           </div>
                        </div>

                        <div className="relative">
                          <User className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                          <Input {...register("fullName")} placeholder="Full Name" className={cn("h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold focus-visible:bg-white shadow-inner", errors.fullName && "bg-danger-light/30")} />
                          {errors.fullName && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.fullName.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="relative">
                              <Mail className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                              <Input {...register("email")} placeholder="Email" className={cn("h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold shadow-inner", errors.email && "bg-danger-light/30")} />
                              {errors.email && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.email.message}</p>}
                           </div>
                           <div className="relative">
                              <Phone className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                              <Input {...register("phone")} placeholder="Phone (+91)" className={cn("h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold shadow-inner", errors.phone && "bg-danger-light/30")} />
                              {errors.phone && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.phone.message}</p>}
                           </div>
                        </div>

                        <div className="relative">
                          <Calendar className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                          <Input {...register("dob")} type="date" className={cn("h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold shadow-inner", errors.dob && "bg-danger-light/30")} />
                          {errors.dob && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.dob.message}</p>}
                        </div>

                        <div className="space-y-3 pt-2">
                          <label className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.15em] ml-1">Gender</label>
                          <div className="grid grid-cols-2 gap-3">
                            {["Male", "Female", "Other", "Prefer not to say"].map((g) => (
                              <button key={g} type="button" onClick={() => register("gender").onChange({ target: { value: g, name: "gender" } })}
                                className={cn("h-12 rounded-xl text-xs font-bold border-2 transition-all", watch("gender") === g ? "bg-primary/5 border-primary text-primary" : "bg-white border-border/60 text-text-primary hover:border-border")}
                              > {g} </button>
                            ))}
                          </div>
                   </div>
                </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                        <div className="space-y-3">
                          <label className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.15em] ml-1">Vehicle Type</label>
                          <div className="grid grid-cols-5 gap-2">
                             {["Bike", "Auto", "Mini", "Sedan", "SUV"].map(type => (
                                <button key={type} type="button" onClick={() => register("vehicleType").onChange({ target: { value: type, name: "vehicleType" } })}
                                   className={cn("flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all", watch("vehicleType") === type ? "bg-primary/5 border-primary text-primary" : "bg-white border-border/60 text-text-muted")}
                                >
                                   <Car className="w-5 h-5 mb-1" />
                                   <span className="text-[9px] font-bold uppercase">{type}</span>
                                </button>
                             ))}
                          </div>
                          {errors.vehicleType && <p className="text-danger text-[10px] font-bold">{errors.vehicleType.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="relative">
                              <Input {...register("vehicleMake")} placeholder="Make (e.g. Maruti)" className="h-14 px-4 bg-muted/40 border-none rounded-2xl font-semibold shadow-inner" />
                              {errors.vehicleMake && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.vehicleMake.message}</p>}
                           </div>
                           <div className="relative">
                              <Input {...register("vehicleModel")} placeholder="Model (e.g. Swift)" className="h-14 px-4 bg-muted/40 border-none rounded-2xl font-semibold shadow-inner" />
                              {errors.vehicleModel && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.vehicleModel.message}</p>}
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-1">
                           <div className="relative">
                              <Input {...register("year")} placeholder="Manufacture Year" className="h-14 px-4 bg-muted/40 border-none rounded-2xl font-semibold shadow-inner" />
                              {errors.year && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.year.message}</p>}
                           </div>
                           <div className="relative">
                              <Input {...register("color")} placeholder="Vehicle Color" className="h-14 px-4 bg-muted/40 border-none rounded-2xl font-semibold shadow-inner" />
                              {errors.color && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.color.message}</p>}
                           </div>
                        </div>

                        <div className="relative pt-1">
                          <Input {...register("plateNumber")} placeholder="Number Plate (e.g. MH01AB1234)" className="h-14 px-4 bg-muted/40 border-none rounded-2xl font-semibold shadow-inner" />
                          {errors.plateNumber && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.plateNumber.message}</p>}
                        </div>

                        <div className="relative pt-1">
                          <Input {...register("rcNumber")} placeholder="RC Book Number" className="h-14 px-4 bg-muted/40 border-none rounded-2xl font-semibold shadow-inner" />
                          {errors.rcNumber && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.rcNumber.message}</p>}
                        </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="relative">
                              <FileText className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                              <Input {...register("dlNumber")} placeholder="Driving License No" className="h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold" />
                              {errors.dlNumber && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.dlNumber.message}</p>}
                           </div>
                           <div className="relative">
                              <Calendar className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                              <Input {...register("dlExpiry")} type="date" className="h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold" />
                              {errors.dlExpiry && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.dlExpiry.message}</p>}
                           </div>
                        </div>

                        <div className="relative pt-1">
                           <CreditCard className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                           <Input {...register("aadhaar")} placeholder="Aadhaar (12 digits)" className="h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold" />
                           <span className="absolute right-4 top-[1.2rem] text-[10px] font-bold text-text-muted uppercase tracking-widest">Masked Data</span>
                           {errors.aadhaar && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.aadhaar.message}</p>}
                        </div>

                        <div className="relative pt-1">
                           <ShieldCheck className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                           <Input {...register("pan")} placeholder="PAN Card Number" className="h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold" />
                           {errors.pan && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.pan.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-1">
                           <div className="relative">
                              <Input {...register("insuranceNumber")} placeholder="Insurance No" className="h-14 px-4 bg-muted/40 border-none rounded-2xl font-semibold" />
                              {errors.insuranceNumber && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.insuranceNumber.message}</p>}
                           </div>
                           <div className="relative">
                              <Input {...register("insuranceExpiry")} type="date" className="h-14 px-4 bg-muted/40 border-none rounded-2xl font-semibold" />
                              {errors.insuranceExpiry && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.insuranceExpiry.message}</p>}
                           </div>
                        </div>

                        <div className="relative pt-1">
                           <AlertCircle className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                           <Input {...register("pucNumber")} placeholder="Pollution Certificate (PUC) Number" className="h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold" />
                           {errors.pucNumber && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.pucNumber.message}</p>}
                        </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-4">
                        <div className="space-y-3">
                           <label className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.15em] ml-1">Bank Information</label>
                           <div className="relative">
                              <User className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                              <Input {...register("bankHolder")} placeholder="Account Holder Name" className="h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold shadow-inner" />
                              {errors.bankHolder && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.bankHolder.message}</p>}
                           </div>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="relative">
                                 <Banknote className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                                 <Input {...register("bankName")} placeholder="Bank Name" className="h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold shadow-inner" />
                                 {errors.bankName && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.bankName.message}</p>}
                              </div>
                              <div className="relative">
                                 <Input {...register("ifsc")} placeholder="IFSC Code" className="h-14 px-4 bg-muted/40 border-none rounded-2xl font-semibold shadow-inner" />
                                 {errors.ifsc && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.ifsc.message}</p>}
                              </div>
                           </div>
                           <div className="relative">
                              <Input {...register("accountNumber")} placeholder="Account Number" className="h-14 px-4 bg-muted/40 border-none rounded-2xl font-semibold shadow-inner" />
                              {errors.accountNumber && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.accountNumber.message}</p>}
                           </div>
                        </div>

                        <div className="space-y-3 pt-2">
                           <label className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.15em] ml-1">Account Security</label>
                           <div className="grid grid-cols-2 gap-4">
                              <div className="relative">
                                 <Lock className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                                 <Input {...register("password")} type={showPassword ? "text" : "password"} placeholder="Password" className="h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold shadow-inner" />
                                 {errors.password && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.password.message}</p>}
                              </div>
                              <div className="relative">
                                 <Input {...register("confirmPassword")} type={showPassword ? "text" : "password"} placeholder="Confirm" className="h-14 px-4 bg-muted/40 border-none rounded-2xl font-semibold shadow-inner" />
                                 {errors.confirmPassword && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.confirmPassword.message}</p>}
                              </div>
                           </div>
                        </div>

                        <div className="space-y-3 pt-4">
                           <div className="flex items-start gap-3">
                              <input type="checkbox" {...register("terms")} id="terms" className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                              <label htmlFor="terms" className="text-[10px] font-medium leading-relaxed text-text-secondary uppercase tracking-wider">Agree to Terms & Privacy Policy</label>
                           </div>
                           <div className="flex items-start gap-3">
                              <input type="checkbox" {...register("bgConsent")} id="bgConsent" className="mt-1 w-4 h-4 rounded border-border text-primary focus:ring-primary" />
                              <label htmlFor="bgConsent" className="text-[10px] font-medium leading-relaxed text-text-secondary uppercase tracking-wider">Consent for Background Check</label>
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
                  <Button type="button" variant="ghost" onClick={prevStep}
                    className="h-14 flex-1 rounded-2xl font-bold bg-muted/20 hover:bg-muted/40 text-text-secondary"
                  > <ChevronLeft className="mr-2 w-5 h-5" /> Back </Button>
                )}
                
                {step < 4 ? (
                  <Button type="button" onClick={nextStep}
                    className="h-14 flex-[2] bg-primary hover:bg-primary/90 text-white rounded-2xl text-base font-bold shadow-xl shadow-primary/25 group transition-all"
                  > Continue <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /> </Button>
                ) : (
                  <Button type="submit" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}
                    className="h-14 flex-[2] bg-primary hover:bg-primary/90 text-white rounded-2xl text-base font-bold shadow-xl shadow-primary/25 transition-all group"
                  >
                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 
                    <> Finish Setup <CheckCircle2 className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" /> </>}
                  </Button>
                )}
              </div>
              <p className="text-center text-xs font-medium text-text-muted mt-2">
                Already registered? <button onClick={() => router.push("/login?role=USER")} className="text-primary font-bold hover:underline">Sign In</button>
              </p>
            </div>

            <div className="h-1.5 w-full bg-gradient-to-r from-primary via-[#9D80FF] to-primary/40 mt-auto" />
          </motion.div>
        </div>
      </div>
    </AuthBackground>
  );
}
