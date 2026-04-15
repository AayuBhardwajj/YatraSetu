"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  CheckCircle2, MapPin, IndianRupee, 
  ChevronRight, Navigation, ShieldCheck, LayoutDashboard 
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDriverFeedStore } from "@/store/driverFeedStore";
import { useNegotiationStore } from "@/store/negotiationStore";
import { createClient } from "@/lib/supabase/client";
import type { RideRequest } from "@/types/rides";

export default function DriverRideConfirmedPage() {
  const params = useParams();
  const router = useRouter();
  const rideId = params.id as string;
  const { reset: resetFeed } = useDriverFeedStore();
  const { reset: resetNeg } = useNegotiationStore();
  const [ride, setRide] = useState<RideRequest | null>(null);

  const supabase = createClient();

  useEffect(() => {
    supabase.from("ride_requests").select("*").eq("id", rideId).single().then(({ data }) => {
      if (data) setRide(data as RideRequest);
    });
  }, [rideId]);

  const handleFinish = () => {
    resetFeed();
    resetNeg();
    router.push("/driver/dashboard");
  };

  if (!ride) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-success/5 via-background to-background flex items-center justify-center p-6">
      <Card className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden border-none relative">
        <div className="p-10 space-y-8 text-center">
          <div className="space-y-4">
            <motion.div 
               initial={{ scale: 0, rotate: -180 }}
               animate={{ scale: 1, rotate: 0 }}
               transition={{ type: "spring", stiffness: 260, damping: 20 }}
               className="w-24 h-24 bg-success rounded-[32px] flex items-center justify-center mx-auto shadow-xl shadow-success/20"
            >
              <Navigation className="w-12 h-12 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-black text-text-primary tracking-tight">Booking Secured</h1>
              <p className="text-sm text-text-muted font-medium mt-1">Excellent negotiation! Head to the pickup point now.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="bg-muted/30 p-4 rounded-3xl border border-border/50">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Earnings</p>
                <div className="flex items-center justify-center gap-1">
                   <IndianRupee className="w-4 h-4 text-primary" />
                   <span className="text-2xl font-black text-text-primary">₹{ride.final_price}</span>
                </div>
             </div>
             <div className="bg-muted/30 p-4 rounded-3xl border border-border/50">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Duty Type</p>
                <div className="flex items-center justify-center gap-2 text-primary">
                   <ShieldCheck className="w-4 h-4" />
                   <span className="text-xs font-black uppercase">Instant</span>
                </div>
             </div>
          </div>

          <div className="space-y-4 bg-muted/20 p-6 rounded-[32px] text-left border border-dashed border-border">
             <div className="flex items-start gap-4">
               <MapPin className="w-4 h-4 text-success mt-1 flex-shrink-0" />
               <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Pickup Customer</p>
                  <p className="text-sm font-bold text-text-primary truncate">{ride.pickup_label}</p>
               </div>
             </div>
             <div className="flex items-start gap-4">
               <MapPin className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
               <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Destination</p>
                  <p className="text-sm font-bold text-text-primary truncate">{ride.drop_label}</p>
               </div>
             </div>
          </div>

          <div className="pt-2">
            <Button 
              onClick={handleFinish}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl text-base font-bold shadow-xl shadow-primary/20 group"
            >
              Go to Dashboard <LayoutDashboard className="ml-2 w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </div>
        </div>

        <div className="h-2 w-full bg-gradient-to-r from-success/40 via-success to-success/40" />
      </Card>
    </div>
  );
}
