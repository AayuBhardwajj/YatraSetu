"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Phone, 
  MessageCircle, 
  Share2, 
  AlertCircle, 
  MapPin, 
  Navigation2, 
  Star,
  CheckCircle2,
  Clock,
  ShieldAlert
} from "lucide-react";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRideStore } from "@/store/useRideStore";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Driver confirmed", status: "completed" },
  { id: 2, label: "Driver arriving", status: "active" },
  { id: 3, label: "Trip in progress", status: "upcoming" },
  { id: 4, label: "Completed", status: "upcoming" },
];

export default function TrackingPage() {
  const router = useRouter();
  const { currentRide, driverInfo } = useRideStore();
  const [eta, setEta] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setEta((prev) => (prev > 0 ? prev - 1 : 0));
    }, 10000);

    const completionTimer = setTimeout(() => {
      router.push("/payment");
    }, 20000);

    return () => {
      clearInterval(timer);
      clearTimeout(completionTimer);
    };
  }, [router]);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      {/* Left: Map Panel (70%) */}
      <div className="w-[70%] h-full relative">
        <MapPlaceholder 
          height="100%" 
          showDriverDots={false} 
          showRouteLine={true} 
        />
        
        {/* Driver Pin with Pulsing Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative">
            <div className="absolute inset-0 bg-success/30 rounded-full animate-ping scale-150" />
            <div className="relative bg-success p-2 rounded-full border-2 border-white shadow-lg">
              <Navigation2 className="w-5 h-5 text-white fill-white transform rotate-45" />
            </div>
          </div>
        </div>

        {/* User Pin */}
        <div className="absolute top-[40%] left-[40%] z-20">
          <div className="bg-primary p-2 rounded-full border-2 border-white shadow-lg">
            <MapPin className="w-5 h-5 text-white fill-white" />
          </div>
        </div>

        {/* Map Overlay Pill */}
        <div className="absolute bottom-10 left-10 z-10">
          <div className="bg-white px-6 py-3 rounded-full shadow-xl border border-border flex items-center space-x-3">
            <div className="w-2.5 h-2.5 bg-success rounded-full animate-pulse" />
            <span className="text-[14px] font-bold text-text-primary uppercase tracking-tight">Driver is 1.2 km away</span>
          </div>
        </div>
      </div>

      {/* Right: Info Panel (30%) */}
      <aside className="w-[30%] h-full bg-white border-l border-border overflow-y-auto no-scrollbar p-8 flex flex-col space-y-8">
        
        {/* Status Banner */}
        <Card className="bg-success rounded-xl p-5 text-white border-none space-y-1 shadow-lg shadow-success/10">
          <h2 className="text-[18px] font-bold">Driver is on the way</h2>
          <p className="text-sm opacity-90">Arrives in approximately {eta} minutes</p>
        </Card>

        {/* Driver Card */}
        <Card className="p-6 border-border shadow-none space-y-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-2xl border-2 border-primary/10">
              RK
            </div>
            <div className="flex-1">
              <h3 className="text-[18px] font-bold text-text-primary leading-tight">Rajesh Kumar</h3>
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center text-warning font-bold">
                  <Star className="w-3.5 h-3.5 fill-warning mr-1" />
                  4.8
                </div>
                <span className="text-text-muted">·</span>
                <span className="text-text-secondary font-medium">1,240 trips</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-text-muted font-medium uppercase">Vehicle</span>
                <span className="text-[15px] font-semibold text-text-primary">Maruti Swift Dzire</span>
              </div>
              <div className="px-3 py-1 bg-muted border border-border rounded font-mono text-xs font-bold text-text-primary">
                PB-10-AB-1234
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <Button size="icon" className="w-12 h-12 rounded-full bg-success hover:bg-success/90 shadow-md">
                <Phone className="w-5 h-5" />
              </Button>
              <Button size="icon" className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 shadow-md">
                <MessageCircle className="w-5 h-5" />
              </Button>
              <Button size="icon" className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 text-text-primary shadow-sm border border-border">
                <Share2 className="w-5 h-5" />
              </Button>
              <Button size="icon" className="w-14 h-14 rounded-full bg-danger hover:bg-danger/90 shadow-lg pulse-danger">
                <ShieldAlert className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Trip Progress Stepper */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest pl-1">Trip Progress</h3>
          <div className="space-y-6 relative pl-8">
            <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-muted" />
            
            {STEPS.map((step) => (
              <div key={step.id} className="relative flex items-center space-x-4">
                <div className={cn(
                  "absolute left-[-23px] w-4 h-4 rounded-full border-2 z-10 transition-colors",
                  step.status === "completed" ? "bg-success border-success" :
                  step.status === "active" ? "bg-white border-primary animate-pulse" :
                  "bg-white border-muted"
                )}>
                  {step.status === "completed" && <CheckCircle2 className="w-4 h-4 text-white -translate-x-[2px] -translate-y-[2px]" />}
                  {step.status === "active" && <div className="w-1.5 h-1.5 bg-primary rounded-full m-auto mt-[3px]" />}
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-sm font-bold",
                    step.status === "upcoming" ? "text-text-muted" : "text-text-primary"
                  )}>
                    {step.label}
                  </span>
                  {step.status === "active" && <span className="text-[11px] text-primary font-bold animate-pulse">Live</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trip Details Card */}
        <Card className="p-5 border-border shadow-none space-y-4 bg-muted/30">
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">From</span>
            <p className="text-sm font-semibold truncate">Model Town, Ludhiana</p>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">To</span>
            <p className="text-sm font-semibold truncate">Railway Station</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex flex-col">
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Estimated Fare</span>
              <p className="text-lg font-bold text-text-primary font-tabular">₹160</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Payment</span>
              <span className="text-sm font-semibold text-primary">Wallet</span>
            </div>
          </div>
        </Card>

      </aside>
    </div>
  );
}
