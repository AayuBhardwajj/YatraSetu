"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Navigation2, User, Phone, MessageCircle, MoreVertical, X, Check, MapPin } from "lucide-react";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { BottomSheet } from "@/components/shared/BottomSheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: "arrived", label: "Arrived at Pickup", button: "I've Arrived" },
  { id: "started", label: "Ongoing Trip", button: "Start Ride" },
  { id: "completed", label: "Finish Trip", button: "Complete Ride" },
];

export default function DriverActiveRidePage() {
  const [stepIndex, setStepIndex] = useState(0);
  const router = useRouter();

  const handleNextStep = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      router.push("/driver/earnings");
    }
  };

  const currentStep = STEPS[stepIndex];

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden flex flex-col bg-[#1a1a2e]">
      {/* Map Section */}
      <div className="flex-1 w-full relative">
        <MapPlaceholder showDriverDots={false} />
        
        {/* Animated Navigation Route */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_#6C47FF] animate-pulse z-10">
          <Navigation2 className="w-4 h-4 text-white fill-white transform rotate-45" />
        </div>
      </div>

      {/* Navigation Bottom Sheet */}
      <BottomSheet height="auto" className="static h-[45%] border-t-0 shadow-none pb-24 px-0">
        <div className="space-y-6">
          {/* Status Overlay */}
          <div className="px-4">
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-lg">
                  <Navigation2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Navigation</p>
                  <p className="text-sm font-bold text-foreground">
                    {stepIndex === 0 ? "Heading to pickup · 4 min" : stepIndex === 1 ? "Trip Ongoing · 12 min" : "Destination Arrived"}
                  </p>
                </div>
              </div>
              <MoreVertical className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          {/* Passenger Info Card */}
          <div className="px-4 flex items-center gap-4">
            <div className="w-14 h-14 bg-muted border border-border rounded-full flex items-center justify-center font-bold text-2xl text-primary">
              AS
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground text-base">Arjun Singh</h3>
                <span className="text-[12px] font-bold text-amber-500">4.2★</span>
              </div>
              <p className="text-[13px] text-muted-foreground">Pickup: Sector 17, Chandigarh</p>
            </div>
            <div className="flex gap-2">
              <button className="p-3 bg-muted rounded-full active:scale-95 transition-transform">
                <Phone className="w-5 h-5 text-foreground" />
              </button>
              <button className="p-3 bg-muted rounded-full active:scale-95 transition-transform">
                <MessageCircle className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>

          {/* Step Timeline */}
          <div className="px-6 py-2">
            <div className="relative flex items-center justify-between">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-muted rounded-full" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary rounded-full transition-all duration-500" 
                   style={{ width: `${(stepIndex / (STEPS.length - 1)) * 100}%` }} />
              
              {STEPS.map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500",
                    i <= stepIndex ? "bg-primary border-primary" : "bg-white border-muted-foreground/30"
                  )}>
                    {i < stepIndex ? <Check className="w-4 h-4 text-white" /> : 
                     i === stepIndex ? <div className="w-2 h-2 bg-white rounded-full animate-pulse" /> :
                     <div className="w-2 h-2 bg-muted/50 rounded-full" />}
                  </div>
                  <span className={cn(
                    "text-[10px] font-bold mt-1 transition-colors duration-500",
                    i <= stepIndex ? "text-primary" : "text-muted-foreground/50"
                  )}>
                    {step.id.charAt(0).toUpperCase() + step.id.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="px-4">
            <Button 
              onClick={handleNextStep}
              className={cn(
                "w-full h-14 text-white rounded-pill text-base font-bold shadow-lg transition-transform active:scale-[0.98]",
                stepIndex === 0 ? "bg-primary shadow-primary/20" : 
                stepIndex === 1 ? "bg-primary shadow-primary/20" : "bg-success shadow-success/20"
              )}
            >
              {currentStep.button}
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
