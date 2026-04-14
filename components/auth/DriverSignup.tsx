"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Lock, Phone, CreditCard, Car, 
  MapPin, Camera, ChevronRight, ChevronLeft, 
  CheckCircle2, Loader2, FileText, BadgeCheck, 
  AlertCircle, Banknote, ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { uploadToCloudinary } from "@/lib/cloudinary";

const driverSignupSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),
  
  aadhaarNumber: z.string().regex(/^\d{12}$/, "Aadhaar must be 12 digits"),
  panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN"),
  dlNumber: z.string().min(5, "DL Number required"),
  
  vehicleType: z.enum(["auto", "bike", "cab"]),
  vehicleMake: z.string().min(1, "Make is required"),
  vehicleModel: z.string().min(1, "Model is required"),
  plateNumber: z.string().min(4, "Invalid number plate"),
  year: z.string().regex(/^\d{4}$/, "Invalid year"),
  
  paymentMethod: z.string().min(5, "Payment detail required"),
  city: z.string().min(2, "City is required"),
  isAvailable: z.boolean().default(true),
});

type DriverSignupValues = z.infer<typeof driverSignupSchema>;

const DOC_TYPES = ['aadhaar', 'pan', 'driving_license', 'rc'] as const;

export default function DriverSignup() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [files, setFiles] = useState<Record<string, File | null>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
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
  } = useForm<DriverSignupValues>({
    resolver: zodResolver(driverSignupSchema),
    mode: "onChange",
    defaultValues: { isAvailable: true }
  });

  const nextStep = async () => {
    const fieldsMap: Record<number, (keyof DriverSignupValues)[]> = {
      1: ["fullName", "email", "password", "phone"],
      2: ["aadhaarNumber", "panNumber", "dlNumber"],
      3: ["vehicleType", "vehicleMake", "vehicleModel", "plateNumber", "year"],
      4: ["paymentMethod"],
      5: ["city"],
    };
    const isValid = await trigger(fieldsMap[step]);
    
    if (step === 2) {
       const missingFiles = DOC_TYPES.filter(t => !files[t]);
       if (missingFiles.length > 0) {
         toast({ variant: "destructive", title: "Missing Documents", description: `Please upload ${missingFiles.join(", ")}` });
         return;
       }
    }

    if (isValid) {
      setDirection(1);
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleFileChange = (type: string, file: File | null) => {
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }));
      setPreviews(prev => ({ ...prev, [type]: URL.createObjectURL(file) }));
    }
  };

  const onSubmit = async (data: DriverSignupValues) => {
    setIsUploading(true);
    try {
      // 1. Auth Signup
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
             full_name: data.fullName,
             role: 'driver'
          }
        }
      });
      if (authError) throw authError;
      const driverId = authData.user?.id;
      if (!driverId) throw new Error("Driver ID not found");

      // 2. Profile & Driver Table (Profiles is auto-trigger'd, but we update)
       await supabase.from("driver_profiles").update({ phone: data.phone, city: data.city }).eq("user_id", driverId);

      // 3. Document Upload Pipeline
      for (const type of DOC_TYPES) {
        const file = files[type];
        if (file) {
          const res = await fetch("/api/cloudinary/sign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ docType: type }),
          });
          const signData = await res.json();
          const uploadResult = await uploadToCloudinary(file, signData);
          
          await supabase.from("driver_documents").insert({
            driver_id: driverId,
            doc_type: type,
            file_url: uploadResult.secure_url,
            cloudinary_id: uploadResult.public_id,
          });
        }
      }

      // 4. Vehicle Data
      await supabase.from("vehicles").insert({
        driver_id: driverId,
        vehicle_type: data.vehicleType,
        make: data.vehicleMake,
        model: data.vehicleModel,
        year: parseInt(data.year),
        plate_number: data.plateNumber,
      });

      // 5. Mark onboarding complete
      await supabase.from("driver_profiles").update({
        aadhaar_number: data.aadhaarNumber,
        pan_number: data.panNumber,
        dl_number: data.dlNumber,
        upi_id: data.paymentMethod,
        vehicle_type: data.vehicleType,
        is_available: data.isAvailable,
        is_onboarding_complete: true,
      }).eq("user_id", driverId);

      toast({ title: "Registration Submitted!", description: "Your details are under review. Redirecting..." });
      router.push("/driver/dashboard");

    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
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
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-[600px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col">
      <div className="p-8 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1.5 flex-1 mr-4">
            {[1, 2, 3, 4, 5, 6].map((s) => (
              <div key={s} className={cn("h-1.5 flex-1 rounded-full transition-all duration-300", step >= s ? "bg-primary" : "bg-muted")} />
            ))}
          </div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex-shrink-0">Step {step} of 6</span>
        </div>
        <h2 className="text-2xl font-bold text-text-primary">
          {step === 1 && "Basic Information"}
          {step === 2 && "Identity Verification (KYC)"}
          {step === 3 && "Vehicle Details"}
          {step === 4 && "Payment Details"}
          {step === 5 && "Service Area"}
          {step === 6 && "Review & Submit"}
        </h2>
      </div>

      <div className="flex-1 px-8 sm:px-10 py-2 relative min-h-[450px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.form key={step} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ type: "spring", stiffness: 300, damping: 30 }} className="space-y-6 pb-6">
            
            {step === 1 && (
              <div className="space-y-4">
                <div className="relative"><User className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" /><Input {...register("fullName")} placeholder="Full Name" className="h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold" /></div>
                <div className="relative"><Mail className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" /><Input {...register("email")} placeholder="Email Address" className="h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold" /></div>
                <div className="relative"><Phone className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" /><Input {...register("phone")} placeholder="Phone Number" className="h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold" /></div>
                <div className="relative"><Lock className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" /><Input {...register("password")} type="password" placeholder="Password" className="h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold" /></div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <Input {...register("aadhaarNumber")} placeholder="Aadhaar No" className="h-14 bg-muted/40 border-none rounded-2xl font-semibold px-4" />
                  <Input {...register("panNumber")} placeholder="PAN Card No" className="h-14 bg-muted/40 border-none rounded-2xl font-semibold px-4" />
                </div>
                <Input {...register("dlNumber")} placeholder="Driving License No" className="h-14 bg-muted/40 border-none rounded-2xl font-semibold px-4" />
                
                <div className="grid grid-cols-2 gap-4">
                  {DOC_TYPES.map(type => (
                    <label key={type} className="flex flex-col items-center justify-center p-4 bg-muted/20 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:bg-muted/40 transition-all relative group h-32">
                      {previews[type] ? <img src={previews[type]} className="absolute inset-0 w-full h-full object-cover rounded-2xl" /> : (
                        <div className="flex flex-col items-center">
                          <Camera className="w-6 h-6 text-text-muted mb-1" />
                          <span className="text-[10px] font-bold text-text-muted uppercase text-center">{type.replace('_',' ')}</span>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(type, e.target.files?.[0] || null)} className="hidden" />
                      {previews[type] && <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl"><BadgeCheck className="text-white w-8 h-8" /></div>}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {['bike', 'auto', 'cab'].map(t => (
                    <button key={t} type="button" onClick={() => register("vehicleType").onChange({ target: { value: t, name: "vehicleType" } })}
                      className={cn("flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all", watch("vehicleType") === t ? "bg-primary/5 border-primary text-primary" : "bg-white border-border/60 text-text-muted")}
                    ><Car className="w-6 h-6 mb-1" /><span className="text-[10px] font-bold uppercase">{t}</span></button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input {...register("vehicleMake")} placeholder="Make (e.g. Maruti)" className="h-14 bg-muted/40 border-none rounded-2xl font-semibold px-4" />
                  <Input {...register("vehicleModel")} placeholder="Model (e.g. Swift)" className="h-14 bg-muted/40 border-none rounded-2xl font-semibold px-4" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input {...register("plateNumber")} placeholder="Plate No" className="h-14 bg-muted/40 border-none rounded-2xl font-semibold px-4" />
                  <Input {...register("year")} placeholder="Year" className="h-14 bg-muted/40 border-none rounded-2xl font-semibold px-4" />
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-5">
                <div className="relative"><Banknote className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" /><Input {...register("paymentMethod")} placeholder="UPI ID or Account No" className="h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold" /></div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] px-2 leading-relaxed">Payments are processed every Monday directly to your primary payout method.</p>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-6">
                 <div className="relative"><MapPin className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" /><Input {...register("city")} placeholder="Secondary Search Area / City" className="h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold" /></div>
                 <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border-2 border-border/60">
                    <span className="text-sm font-bold text-text-primary uppercase tracking-wider">Accepting Rides Immediately</span>
                    <input type="checkbox" {...register("isAvailable")} className="w-10 h-6 rounded-full bg-primary appearance-none cursor-pointer checked:bg-primary transition-all relative after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all checked:after:translate-x-4" />
                 </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <div className="bg-muted/10 p-6 rounded-3xl border border-border/40 space-y-4">
                  <div className="flex items-center gap-4 border-b border-border/40 pb-4">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                    <div><h4 className="text-sm font-bold uppercase tracking-widest leading-none mb-1">Self-Declaration</h4><p className="text-[9px] font-medium text-text-muted uppercase">I certify that all details provided are true and verified.</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-y-3">
                    <div className="text-[9px] font-bold text-text-muted uppercase">Name: <span className="text-text-primary">{watch("fullName")}</span></div>
                    <div className="text-[9px] font-bold text-text-muted uppercase">Vehicle: <span className="text-text-primary">{watch("vehicleModel")}</span></div>
                    <div className="text-[9px] font-bold text-text-muted uppercase">Identity: <span className="text-text-primary">DL Attached</span></div>
                    <div className="text-[9px] font-bold text-text-muted uppercase">Payout: <span className="text-text-primary">Configured</span></div>
                  </div>
                </div>
              </div>
            )}
          </motion.form>
        </AnimatePresence>
      </div>

      <div className="p-8 pt-4 space-y-4">
        <div className="flex gap-4">
          {step > 1 && <Button variant="ghost" onClick={prevStep} className="h-14 flex-1 rounded-2xl font-bold bg-muted/20 text-text-secondary"><ChevronLeft className="mr-2 w-5 h-5" /> Back</Button>}
          {step < 6 ? (
            <Button onClick={nextStep} className="h-14 flex-[2] bg-primary hover:bg-primary/90 text-white rounded-2xl text-base font-bold shadow-xl shadow-primary/25 transition-all group">Continue <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>
          ) : (
            <Button onClick={handleSubmit(onSubmit)} disabled={isSubmitting || isUploading} className="h-14 flex-[2] bg-primary hover:bg-primary/90 text-white rounded-2xl text-base font-bold shadow-xl shadow-primary/25 transition-all">
              {isSubmitting || isUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Submit Application <BadgeCheck className="ml-2 w-5 h-5" /></>}
            </Button>
          )}
        </div>
      </div>
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-[#9D80FF] to-primary/40 mt-auto" />
    </motion.div>
  );
}
