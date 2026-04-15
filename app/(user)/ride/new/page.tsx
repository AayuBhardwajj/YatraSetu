"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Car, MapPin, Search, Loader2, Info, ChevronRight, Navigation 
} from "lucide-react";
import dynamic from "next/dynamic";
import { useAuthStore } from "@/store/useAuthStore";
import { useRideRequestStore } from "@/store/rideRequestStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  useDestinationSearch, 
  type DestinationSuggestion 
} from "@/hooks/useDestinationSearch";

const UserMapWrapper = dynamic(() => import("@/components/user/UserMapWrapper"), { ssr: false });

export default function NewRidePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const { setCreating, setActiveRequest, setError } = useRideRequestStore();

  const [pickupLabel] = useState("Current Location"); // In real app, allow editing
  const [query, setQuery] = useState("");
  const [destination, setDestination] = useState<DestinationSuggestion | null>(null);
  
  const { suggestions, isLoading } = useDestinationSearch(query);

  const handleBooking = async () => {
    if (!user || !destination) return;

    setCreating(true);
    try {
      const res = await fetch("/api/rides/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickupLat: 28.6139, // Fallback base
          pickupLng: 77.2090,
          pickupLabel,
          dropLat: destination.lat,
          dropLng: destination.lng,
          dropLabel: destination.primary,
          distanceKm: 3.5, // Mock distance for now
          passengerId: user.id,
        }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setActiveRequest(data.ride);
      router.push(`/ride/${data.ride.id}/waiting`);
    } catch (err: any) {
      setError(err.message);
      toast({ variant: "destructive", title: "Booking failed", description: err.message });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      {/* Left: Map */}
      <div className="flex-[3] h-full relative">
        <UserMapWrapper 
          destination={destination ? [destination.lat, destination.lng] : null} 
        />
        
        <div className="absolute top-6 left-6 z-[1000] space-y-3">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-xl border border-border/50 flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-success rounded-full flex-shrink-0 animate-pulse" />
            <span className="text-sm font-bold text-text-primary">Pickup: {pickupLabel}</span>
          </div>
          {destination && (
            <div className="bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-2xl shadow-xl border border-border/50 flex items-center gap-3 animate-in fade-in slide-in-from-left-4">
              <div className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0" />
              <span className="text-sm font-bold text-text-primary">Drop: {destination.primary}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right: Panel */}
      <div className="flex-[1.5] h-full bg-white border-l border-border/50 overflow-y-auto no-scrollbar min-w-[380px]">
        <div className="p-8 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Where to?</h1>
            <p className="text-sm text-text-muted mt-1 font-medium">Safe, fast, and reliable rides anytime.</p>
          </div>

          <section className="space-y-4">
            <div className="relative group">
              <Search className={cn(
                "absolute left-4 top-4 w-5 h-5 transition-colors",
                isLoading ? "text-primary animate-pulse" : "text-text-muted group-focus-within:text-primary"
              )} />
              <input
                type="text"
                placeholder="Search destination..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-muted/40 border-none rounded-2xl text-sm font-bold focus-visible:ring-2 focus-visible:ring-primary/20 transition-all outline-none"
              />
            </div>

            {query && suggestions.length > 0 && (
              <div className="space-y-2 max-h-[240px] overflow-y-auto no-scrollbar">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setDestination(s); setQuery(s.primary); }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-primary-light transition-colors text-left group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-muted group-hover:bg-white flex items-center justify-center transition-colors">
                      <MapPin className="w-5 h-5 text-text-muted group-hover:text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-primary truncate">{s.primary}</p>
                      <p className="text-[11px] text-text-muted font-medium truncate mt-0.5">{s.secondary}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          {destination && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <Card className="p-6 bg-primary-light border-none shadow-none rounded-[32px] space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center">
                      <Car className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-primary uppercase tracking-widest">Suggested</p>
                      <p className="text-lg font-bold text-text-primary">Classic Zipp</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-success uppercase">Fair Price</p>
                    <p className="text-2xl font-black text-text-primary">₹145</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1 bg-white/60 p-2 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-text-muted uppercase">Distance</p>
                    <p className="text-sm font-bold text-text-primary">3.5 km</p>
                  </div>
                  <div className="flex-1 bg-white/60 p-2 rounded-xl text-center">
                    <p className="text-[10px] font-bold text-text-muted uppercase">ETA</p>
                    <p className="text-sm font-bold text-text-primary">12 min</p>
                  </div>
                </div>

                <Button 
                  onClick={handleBooking}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl text-base font-bold shadow-xl shadow-primary/20 group"
                >
                  Confirm Ride <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Card>

              <div className="bg-muted/30 p-4 rounded-2xl flex items-start gap-3">
                <Info className="w-5 h-5 text-text-muted mt-0.5 flex-shrink-0" />
                <p className="text-[11px] font-medium text-text-muted leading-relaxed">
                  Price is calculated based on current traffic, distance, and driver availability. You'll be able to negotiate once a driver accepts.
                </p>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
