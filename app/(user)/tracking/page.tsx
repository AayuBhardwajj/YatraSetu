"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Phone, MessageCircle, Share2, Star, CheckCircle2, ShieldAlert } from "lucide-react";
import dynamic from "next/dynamic";
const UserMap = dynamic(() => import("@/components/user/UserMap"), { ssr: false });
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
  const [driverPos, setDriverPos] = useState<{ id: string; lat: number; lng: number }[]>([]);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      setUserPos([lat, lng]);
      // Single driver approaching
      const base = { id: 'driver', lat: lat + 0.003, lng: lng + 0.002 };
      setDriverPos([base]);

      // Driver slowly moves toward user
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setDriverPos([{
          id: 'driver',
          lat: base.lat - step * 0.0003,
          lng: base.lng - step * 0.0002,
        }]);
        if (step >= 10) clearInterval(interval);
      }, 3000);

      return () => clearInterval(interval);
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setEta((prev) => (prev > 0 ? prev - 1 : 0));
    }, 10000);
    const completionTimer = setTimeout(() => {
      router.push("/payment");
    }, 20000);
    return () => { clearInterval(timer); clearTimeout(completionTimer); };
  }, [router]);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      {/* Left: Map Panel */}
      <div className="flex-[7] h-full relative min-w-0">
        <UserMap height="100%" drivers={driverPos} />

        {/* Map Overlay Pill */}
        <div className="absolute bottom-6 left-6 z-[1000]">
          <div className="bg-white/95 backdrop-blur-sm px-5 py-3 rounded-full shadow-xl border border-border/50 flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 bg-success rounded-full animate-pulse flex-shrink-0" />
            <span className="text-sm font-bold text-text-primary">
              Driver is {eta > 0 ? `~${eta} min away` : 'arriving now'}
            </span>
          </div>
        </div>
      </div>

      {/* Right: Info Panel */}
      <aside className="flex-[3] h-full bg-white border-l border-border/50 overflow-y-auto no-scrollbar min-w-[300px] max-w-[380px]">
        <div className="p-5 space-y-5">
          <Card className="bg-success rounded-xl p-4 text-white border-none shadow-md shadow-success/10">
            <h2 className="text-base font-bold">Driver is on the way</h2>
            <p className="text-sm opacity-80 mt-0.5">Arrives in ~{eta} minutes</p>
          </Card>

          <Card className="p-5 border-border/50 shadow-none space-y-5">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center text-primary font-bold text-xl border-2 border-primary/10 flex-shrink-0">RK</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-text-primary leading-tight truncate">Rajesh Kumar</h3>
                <div className="flex items-center space-x-2 text-sm mt-0.5">
                  <div className="flex items-center text-warning font-bold">
                    <Star className="w-3.5 h-3.5 fill-warning mr-0.5 flex-shrink-0" />4.8
                  </div>
                  <span className="text-text-muted">·</span>
                  <span className="text-text-secondary font-medium truncate">1,240 trips</span>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-text-muted font-medium uppercase tracking-wide">Vehicle</span>
                  <span className="text-sm font-semibold text-text-primary truncate">Maruti Swift Dzire</span>
                </div>
                <div className="px-2.5 py-1 bg-muted border border-border/50 rounded font-mono text-xs font-bold text-text-primary flex-shrink-0">PB-10-AB-1234</div>
              </div>
              <div className="flex items-center justify-between gap-2 pt-1">
                <Button size="icon" className="w-11 h-11 rounded-full bg-success hover:bg-success/90 shadow-md flex-shrink-0"><Phone className="w-4.5 h-4.5" /></Button>
                <Button size="icon" className="w-11 h-11 rounded-full bg-blue-500 hover:bg-blue-600 shadow-md flex-shrink-0"><MessageCircle className="w-4.5 h-4.5" /></Button>
                <Button size="icon" className="w-11 h-11 rounded-full bg-gray-200 hover:bg-gray-300 text-text-primary shadow-sm border border-border/50 flex-shrink-0"><Share2 className="w-4.5 h-4.5" /></Button>
                <Button size="icon" className="w-12 h-12 rounded-full bg-danger hover:bg-danger/90 shadow-lg flex-shrink-0"><ShieldAlert className="w-5 h-5" /></Button>
              </div>
            </div>
          </Card>

          <section className="space-y-3">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-wider pl-1">Trip Progress</h3>
            <div className="space-y-5 relative pl-7">
              <div className="absolute left-[13px] top-3 bottom-3 w-0.5 bg-muted" />
              {STEPS.map((step) => (
                <div key={step.id} className="relative flex items-center space-x-3">
                  <div className={cn(
                    "absolute left-[-20px] w-3.5 h-3.5 rounded-full border-2 z-10 transition-colors",
                    step.status === "completed" ? "bg-success border-success" :
                      step.status === "active" ? "bg-white border-primary animate-pulse" : "bg-white border-muted"
                  )}>
                    {step.status === "completed" && <CheckCircle2 className="w-3.5 h-3.5 text-white -translate-x-[1px] -translate-y-[1px]" />}
                    {step.status === "active" && <div className="w-1.5 h-1.5 bg-primary rounded-full m-auto mt-[2px]" />}
                  </div>
                  <div className="flex flex-col">
                    <span className={cn("text-sm font-bold", step.status === "upcoming" ? "text-text-muted" : "text-text-primary")}>{step.label}</span>
                    {step.status === "active" && <span className="text-[11px] text-primary font-bold animate-pulse">Live</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <Card className="p-4 border-border/50 shadow-none space-y-3 bg-muted/20">
            <div className="flex flex-col space-y-0.5">
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">From</span>
              <p className="text-sm font-semibold truncate">{currentRide?.pickup || "Current Location"}</p>
            </div>
            <div className="flex flex-col space-y-0.5">
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">To</span>
              <p className="text-sm font-semibold truncate">{currentRide?.dropoff || "Railway Station"}</p>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Estimated Fare</span>
                <p className="text-lg font-bold text-text-primary font-tabular">
                  ₹{currentRide?.finalPrice ?? currentRide?.negotiatedPrice ?? currentRide?.basePrice ?? 160}
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Payment</span>
                <span className="text-sm font-semibold text-primary">Wallet</span>
              </div>
            </div>
          </Card>
        </div>
      </aside>
    </div>
  );
}