"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2, Car, MapPin, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRideRequestStore } from "@/store/rideRequestStore";
import { useRideBroadcast } from "@/hooks/useRideBroadcast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function RideWaitingPage() {
  const router = useRouter();
  const params = useParams();
  const rideId = params.id as string;
  const { activeRequest, reset } = useRideRequestStore();
  
  // Listen for realtime status changes (e.g. driver accepts)
  useRideBroadcast(rideId);

  useEffect(() => {
    if (activeRequest?.status === "negotiating") {
      router.push(`/ride/${rideId}/negotiate`);
    } else if (activeRequest?.status === "cancelled" || activeRequest?.status === "expired") {
       // Handle cancellation/expiration
    }
  }, [activeRequest?.status, rideId, router]);

  const handleCancel = async () => {
    const supabase = createClient();
    await supabase.from("ride_requests").update({ status: "cancelled" }).eq("id", rideId);
    reset();
    router.push("/ride/new");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden border-none p-10 space-y-10 text-center relative">
        <div className="space-y-4">
          <div className="relative mx-auto w-24 h-24">
             <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 border-4 border-dashed border-primary/20 rounded-full"
             />
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="p-5 bg-primary/10 rounded-3xl">
                 <Car className="w-8 h-8 text-primary animate-bounce" />
               </div>
             </div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-text-primary tracking-tight">Looking for a Hero</h1>
            <p className="text-sm text-text-muted font-medium mt-1">Contacting nearby drivers in your area...</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-muted/40 rounded-[28px] p-6 space-y-4 text-left">
             <div className="flex items-start gap-4">
               <div className="w-2 h-2 rounded-full bg-success mt-1.5 flex-shrink-0" />
               <div className="flex-1 min-w-0">
                 <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Pickup</p>
                 <p className="text-sm font-bold text-text-primary truncate">{activeRequest?.pickup_label || "Your location"}</p>
               </div>
             </div>
             <div className="flex items-start gap-4">
               <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
               <div className="flex-1 min-w-0">
                 <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Destination</p>
                 <p className="text-sm font-bold text-text-primary truncate">{activeRequest?.drop_label || "..."}</p>
               </div>
             </div>
             <div className="pt-2 flex items-center justify-between border-t border-border/10">
                <span className="text-xs font-bold text-text-muted">Estimated Fare</span>
                <span className="text-lg font-black text-primary">₹{activeRequest?.suggested_price}</span>
             </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-primary/60">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Secure Broadcast active</span>
          </div>
        </div>

        <Button 
          variant="ghost" 
          onClick={handleCancel}
          className="w-full h-14 rounded-2xl font-bold text-text-muted hover:text-danger hover:bg-danger/5 transition-all group"
        >
          <X className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> Cancel Request
        </Button>

        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/10 via-primary to-primary/10" />
      </Card>
    </div>
  );
}
