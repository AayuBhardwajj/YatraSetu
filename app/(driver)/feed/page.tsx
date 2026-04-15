"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Navigation, MapPin, Clock, ChevronRight, 
  Wifi, WifiOff, Loader2, IndianRupee 
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useDriverFeedStore } from "@/store/driverFeedStore";
import { useDriverFeed } from "@/hooks/useDriverFeed";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

export default function DriverFeedPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, driverProfile } = useAuthStore();
  const { requests, isListening } = useDriverFeedStore();
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  // Connection to live broadcast feed
  useDriverFeed();

  const handleAccept = async (rideId: string) => {
    if (!user) return;
    setAcceptingId(rideId);
    
    try {
      const res = await fetch("/api/rides/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId, driverId: user.id }),
      });

      const data = await res.json();
      if (res.status === 409) {
        toast({ title: "Too slow!", description: "Another driver accepted this ride.", variant: "destructive" });
        return;
      }
      if (data.error) throw new Error(data.error);

      router.push(`/driver/ride/${rideId}/negotiate`);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-8">
      <div className="max-w-xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-text-primary tracking-tight">Live Feed</h1>
            <p className="text-sm text-text-muted font-medium mt-1">Available ride requests in your city.</p>
          </div>
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-widest transition-all",
            isListening ? "bg-success/10 border-success/20 text-success" : "bg-muted border-border text-text-muted"
          )}>
            {isListening ? (
              <><Wifi className="w-4 h-4 animate-pulse" /> Online</>
            ) : (
              <><WifiOff className="w-4 h-4" /> Connecting...</>
            )}
          </div>
        </div>

        {/* Feed */}
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-white rounded-[40px] border border-dashed border-border/60">
               <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
                 <Navigation className="w-8 h-8 text-text-muted/40 animate-pulse" />
               </div>
               <p className="text-sm font-bold text-text-muted">No active requests nearby.</p>
            </div>
          ) : (
            requests.map((ride) => (
              <Card 
                key={ride.id} 
                className="p-6 bg-white rounded-[32px] border-none shadow-xl shadow-black/5 hover:shadow-black/10 transition-shadow group overflow-hidden relative"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <IndianRupee className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Suggested fare</p>
                      <p className="text-xl font-black text-text-primary tracking-tight">₹{ride.suggested_price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-xl">
                    <Clock className="w-3.5 h-3.5 text-text-muted" />
                    <span className="text-[11px] font-bold text-text-secondary">Just now</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-success flex-shrink-0" />
                      <div className="w-0.5 flex-1 bg-border/40 my-1" />
                      <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-4">
                      <div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Pickup</p>
                        <p className="text-sm font-bold text-text-primary truncate">{ride.pickup_label}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Dropoff</p>
                        <p className="text-sm font-bold text-text-primary truncate">{ride.drop_label}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => handleAccept(ride.id)}
                  disabled={acceptingId !== null}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl text-base font-bold shadow-lg shadow-primary/20 group"
                >
                  {acceptingId === ride.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Accept & Negotiate <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </Button>

                {/* Hover decoration */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform" />
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
