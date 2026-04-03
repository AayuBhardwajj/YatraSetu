"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone, MessageCircle, Share2, AlertCircle, MapPin, Navigation2, ChevronUp } from "lucide-react";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { BottomSheet } from "@/components/shared/BottomSheet";
import { Button } from "@/components/ui/button";
import { useRideStore } from "@/store/useRideStore";
import { cn } from "@/lib/utils";

export default function TrackingPage() {
  const router = useRouter();
  const { currentRide, driverInfo } = useRideStore();
  const [eta, setEta] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setEta((prev) => (prev > 0 ? prev - 1 : 0));
    }, 10000); // Reduce ETA every 10s for simulation

    // After 20 seconds, simulate ride completion/payment
    const completionTimer = setTimeout(() => {
      router.push("/payment");
    }, 20000);

    return () => {
      clearInterval(timer);
      clearTimeout(completionTimer);
    };
  }, [router]);

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden flex flex-col bg-[#1a1a2e]">
      {/* Map Section */}
      <div className="h-[65%] w-full relative">
        <MapPlaceholder showDriverDots={false} />
        
        {/* Animated Driver Dot */}
        <div 
          className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_#6C47FF] animate-bounce z-10"
          style={{ animationDuration: '3s' }}
        >
          <Navigation2 className="w-4 h-4 text-white fill-white transform rotate-45" />
        </div>

        {/* Status Overlay */}
        <div className="absolute top-4 left-4 right-4 z-20 flex justify-center">
          <div className="bg-success px-4 py-2 rounded-full flex items-center gap-2 shadow-lg animate-in fade-in slide-in-from-top-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white text-[12px] font-bold uppercase tracking-wider">
              Driver arriving · {eta} min
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Tracking Card */}
      <BottomSheet height="auto" className="static h-[35%] border-t-0 shadow-none pb-24 px-0">
        <div className="space-y-6">
          {/* Driver Info Card */}
          <div className="flex items-center gap-4 px-4">
            <div className="w-14 h-14 bg-muted border border-border rounded-full flex items-center justify-center font-bold text-2xl text-primary overflow-hidden">
              {driverInfo?.name?.split(' ').map((n: string) => n[0]).join('') || "RK"}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-foreground text-base">{driverInfo?.name || "Rajesh Kumar"}</h3>
                <span className="text-[12px] font-bold text-primary">4.8★</span>
              </div>
              <p className="text-[13px] text-muted-foreground">{driverInfo?.vehicle || "Maruti Swift"} · {driverInfo?.plate || "PB-10-AB-1234"}</p>
            </div>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-4 gap-2 px-4">
            {[
              { icon: Phone, label: "Call", color: "text-foreground", bg: "bg-muted" },
              { icon: MessageCircle, label: "Chat", color: "text-foreground", bg: "bg-muted" },
              { icon: Share2, label: "Share", color: "text-foreground", bg: "bg-muted" },
              { icon: AlertCircle, label: "SOS", color: "text-danger", bg: "bg-danger/10 border-danger/20" },
            ].map((action, i) => (
              <button 
                key={i}
                className={cn(
                  "flex flex-col items-center gap-1.5 p-3 rounded-xl border border-transparent transition-all active:scale-95 hover:border-border",
                  action.bg
                )}
              >
                <action.icon className={cn("w-5 h-5", action.color)} />
                <span className={cn("text-[10px] font-bold uppercase tracking-tighter", action.color)}>{action.label}</span>
              </button>
            ))}
          </div>

          {/* Progress Timeline */}
          <div className="px-6 py-2">
            <div className="relative flex items-center justify-between">
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-muted rounded-full">
                <div className="w-1/3 h-full bg-primary rounded-full" />
              </div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-surface border-2 border-primary flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary" />
                </div>
                <span className="text-[10px] font-bold text-foreground mt-1">Pickup</span>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-surface border border-muted-foreground/30 flex items-center justify-center">
                  <Navigation2 className="w-4 h-4 text-muted-foreground/50" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground mt-1">Ongoing</span>
              </div>

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-surface border border-muted-foreground/30 flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-muted-foreground/50" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground mt-1">Ludhiana</span>
              </div>
            </div>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
