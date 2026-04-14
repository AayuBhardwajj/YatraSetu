"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { User, Mail, Lock, Phone, MapPin, Camera, ChevronRight, ChevronLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import axios from "axios";
import { uploadToCloudinary } from "@/lib/cloudinary";

const userSignupSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number").optional().or(z.literal("")),
  city: z.string().min(2, "City is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords mismatch",
  path: ["confirmPassword"],
});

type UserSignupValues = z.infer<typeof userSignupSchema>;

export default function UserSignup() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UserSignupValues>({
    resolver: zodResolver(userSignupSchema),
    mode: "onChange",
  });

  const nextStep = async () => {
    const fieldsMap: Record<number, (keyof UserSignupValues)[]> = {
      1: ["fullName", "email", "password", "confirmPassword"],
      2: ["phone"],
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

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: UserSignupValues) => {
    setIsUploading(true);
    try {
      // 1. Auth Signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: 'user'
          }
        }
      });

      if (authError) throw authError;
      const userId = authData.user?.id;
      if (!userId) throw new Error("User ID not found after signup");

      let avatarUrl = "";
      // 2. Optional Photo Upload
      if (profilePhoto) {
        // Need signature
        const { data: signData } = await axios.post("/api/upload/signature", {
          userId,
          docType: 'avatar',
          fileHash: `avatar-${Date.now()}` // Mock hash for now
        });
        
        const uploadResult = await uploadToCloudinary(profilePhoto, signData);
        avatarUrl = uploadResult.public_id;
      }

      // 3. Update Profiles Table (Trigger might handle it, but we update city/phone)
       const { error: profileError } = await supabase
        .from("profiles")
        .update({
          phone: data.phone,
          city: data.city,
          avatar_url: avatarUrl
        })
        .eq("id", userId);

      if (profileError) throw profileError;

      toast({ title: "Account Created!", description: "Welcome to Zipp. Redirecting to home..." });
      router.push("/home");

    } catch (error: any) {
      toast({ variant: "destructive", title: "Signup Failed", description: error.message });
    } finally {
      setIsUploading(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({ x: direction > 0 ? 50 : -50, opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction: number) => ({ zIndex: 0, x: direction < 0 ? 50 : -50, opacity: 0 }),
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[500px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
      <div className="p-8 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className={cn("h-1.5 w-8 rounded-full transition-all duration-300", step >= s ? "bg-primary" : "bg-muted")} />
            ))}
          </div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Step {step} of 3</span>
        </div>
        <h2 className="text-2xl font-bold text-text-primary">User Registration</h2>
      </div>

      <div className="flex-1 px-8 sm:px-10 py-2 relative min-h-[400px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.form key={step} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                  <Input {...register("fullName")} placeholder="Full Name" className={cn("h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold focus-visible:bg-white", errors.fullName && "bg-danger-light/30")} />
                  {errors.fullName && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.fullName.message}</p>}
                </div>
                <div className="relative pt-2">
                  <Mail className="absolute left-4 top-[1.6rem] w-5 h-5 text-text-muted" />
                  <Input {...register("email")} placeholder="Email Address" className={cn("h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold", errors.email && "bg-danger-light/30")} />
                  {errors.email && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.email.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="relative">
                    <Lock className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                    <Input {...register("password")} type="password" placeholder="Password" className={cn("h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold", errors.password && "bg-danger-light/30")} />
                    {errors.password && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.password.message}</p>}
                  </div>
                  <div className="relative">
                    <Input {...register("confirmPassword")} type="password" placeholder="Confirm" className={cn("h-14 px-4 bg-muted/40 border-none rounded-2xl font-semibold", errors.confirmPassword && "bg-danger-light/30")} />
                    {errors.confirmPassword && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.confirmPassword.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="flex justify-center py-2">
                  <label className="relative group cursor-pointer inline-block">
                    <div className="w-28 h-28 bg-muted/40 rounded-[35px] flex flex-col items-center justify-center border-2 border-dashed border-border group-hover:bg-muted/60 transition-all overflow-hidden">
                      {photoPreview ? <img src={photoPreview} className="w-full h-full object-cover" /> : (
                        <><Camera className="w-6 h-6 text-text-muted" /><span className="text-[9px] font-bold text-text-muted mt-1 uppercase">Profile Photo</span></>
                      )}
                    </div>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
                  </label>
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                  <Input {...register("phone")} placeholder="Phone (+91)" className={cn("h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold shadow-inner", errors.phone && "bg-danger-light/30")} />
                  {errors.phone && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.phone.message}</p>}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="relative">
                  <MapPin className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                  <Input {...register("city")} placeholder="Enter your city" className={cn("h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold", errors.city && "bg-danger-light/30")} />
                  {errors.city && <p className="text-danger text-[10px] font-bold absolute -bottom-5 left-2">{errors.city.message}</p>}
                </div>
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 flex gap-4 items-center">
                  <div className="bg-primary/10 p-2 rounded-xl text-primary"><CheckCircle2 className="w-5 h-5" /></div>
                  <p className="text-[10px] font-bold text-primary/80 uppercase tracking-widest leading-relaxed">Almost there! Complete your setup to start riding.</p>
                </div>
              </div>
            )}
          </motion.form>
        </AnimatePresence>
      </div>

      <div className="p-8 pt-4 space-y-4">
        <div className="flex gap-4">
          {step > 1 && (
            <Button variant="ghost" onClick={prevStep} className="h-14 flex-1 rounded-2xl font-bold bg-muted/20 text-text-secondary"><ChevronLeft className="mr-2 w-5 h-5" /> Back</Button>
          )}
          {step < 3 ? (
            <Button onClick={nextStep} className="h-14 flex-[2] bg-primary hover:bg-primary/90 text-white rounded-2xl text-base font-bold shadow-xl shadow-primary/25 transition-all group">Continue <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>
          ) : (
            <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting || isUploading} className="h-14 flex-[2] bg-primary hover:bg-primary/90 text-white rounded-2xl text-base font-bold shadow-xl shadow-primary/25 transition-all">
              {isSubmitting || isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Finish Signup <CheckCircle2 className="ml-2 w-5 h-5" /></>}
            </Button>
          )}
        </div>
      </div>
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-[#9D80FF] to-primary/40 mt-auto" />
    </motion.div>
  );
}
