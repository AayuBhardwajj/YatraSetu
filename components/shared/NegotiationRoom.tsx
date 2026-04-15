"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Send, CheckCircle2, IndianRupee, MapPin, 
  ArrowRight, ShieldCheck, Timer, MessageSquare 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { useNegotiationStore } from "@/store/negotiationStore";
import { useNegotiationRoom } from "@/hooks/useNegotiationRoom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { RideRequest, NegotiationBid } from "@/types/rides";

interface NegotiationRoomProps {
  rideId: string;
  myRole: "passenger" | "driver";
  myUserId: string;
}

export default function NegotiationRoom({ rideId, myRole, myUserId }: NegotiationRoomProps) {
  const { toast } = useToast();
  const { ride, bids, setRide, setBids, addBid, isConnected, isFinalising, setFinalising } = useNegotiationStore();
  const [bidAmount, setBidAmount] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const supabase = createClient();
  const router = useRouter();

  useNegotiationRoom(rideId, () => {
    const target = myRole === 'driver' ? `/driver/ride/${rideId}/confirmed` : `/ride/${rideId}/confirmed`;
    router.push(target);
  });

  // Initial data fetch
  useEffect(() => {
    async function fetchInitial() {
      const [rideRes, bidsRes] = await Promise.all([
        supabase.from("ride_requests").select("*").eq("id", rideId).single(),
        supabase.from("negotiation_bids").select("*").eq("ride_id", rideId).order("created_at", { ascending: true })
      ]);
      if (rideRes.data) setRide(rideRes.data as RideRequest);
      if (bidsRes.data) setBids(bidsRes.data as NegotiationBid[]);
    }
    fetchInitial();
  }, [rideId, setRide, setBids]);

  // Scroll to bottom when bids change
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [bids]);

  const handlePropose = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= 0) return;

    try {
      const res = await fetch("/api/rides/bid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId, bidderId: myUserId, bidderRole: myRole, amount }),
      });
      const { bid, error } = await res.json();
      if (error) throw new Error(error);

      addBid(bid);
      setBidAmount("");
    } catch (err: any) {
      toast({ variant: "destructive", title: "Bid failed", description: err.message });
    }
  };

  const handleAccept = async (bid: NegotiationBid) => {
    setFinalising(true);
    try {
      const res = await fetch("/api/rides/finalise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rideId, bidId: bid.id, finalPrice: bid.amount }),
      });
      const { error } = await res.json();
      if (error) throw new Error(error);

      toast({ title: "Ride Confirmed!", description: `Fare agreed at ₹${bid.amount}` });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setFinalising(false);
    }
  };

  if (!ride) return null;

  const lastBid = bids[bids.length - 1];
  const canAccept = lastBid && lastBid.bidderId !== myUserId;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-muted/20">
      {/* Header: Ride Info */}
      <div className="bg-white border-b border-border/50 p-6 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-success" />
            <span className="text-sm font-bold text-text-primary truncate max-w-[150px]">{ride.pickup_label}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-text-muted" />
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-bold text-text-primary truncate max-w-[150px]">{ride.drop_label}</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-primary/5 px-4 py-2 rounded-2xl border border-primary/10">
          <div className="text-right">
             <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Suggested</p>
             <p className="text-sm font-black text-text-primary tracking-tight">₹{ride.suggested_price}</p>
          </div>
        </div>
      </div>

      {/* Main Body: Chat-like negotiation */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar scroll-smooth"
      >
        <div className="text-center py-4">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] bg-white px-3 py-1 rounded-full border border-border/50">
            Negotiation Started
          </span>
        </div>

        {bids.map((bid, i) => {
          const isMine = bid.bidderId === myUserId;
          return (
            <motion.div 
              key={bid.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn("flex w-full", isMine ? "justify-end" : "justify-start")}
            >
              <div className={cn(
                "max-w-[80%] rounded-3xl p-4 shadow-sm relative group",
                isMine ? "bg-primary text-white rounded-tr-none" : "bg-white border border-border/50 rounded-tl-none"
              )}>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-black tracking-tight">₹{bid.amount}</span>
                  <span className={cn("text-[10px] font-bold uppercase", isMine ? "text-white/60" : "text-text-muted")}>
                    {isMine ? "My Offer" : myRole === 'driver' ? "Passenger's Bid" : "Driver's Bid"}
                  </span>
                </div>
                {bid.is_accepted && (
                  <div className="mt-2 flex items-center gap-1.5 py-1 px-2.5 bg-success/20 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success" />
                    <span className="text-[10px] font-bold text-success uppercase">Accepted</span>
                  </div>
                )}
                <p className={cn("text-[8px] mt-1 font-medium", isMine ? "text-white/40" : "text-text-muted/50")}>
                  {new Date(bid.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer: Input */}
      <div className="bg-white border-t border-border/50 p-6 pb-10">
        <form onSubmit={handlePropose} className="max-w-xl mx-auto space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <Input 
                type="number" 
                placeholder="Name your price..." 
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="h-14 pl-12 bg-muted/40 border-none rounded-2xl text-base font-bold transition-all focus-visible:ring-primary/20"
              />
            </div>
            <Button 
              type="submit"
              disabled={!bidAmount}
              className="h-14 w-14 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
              <Send className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex gap-3">
            {canAccept && (
              <Button 
                onClick={() => handleAccept(lastBid)}
                disabled={isFinalising}
                className="flex-1 h-14 bg-success hover:bg-success/90 text-white rounded-2xl font-bold shadow-lg shadow-success/20 group"
              >
                Accept ₹{lastBid.amount} <CheckCircle2 className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </Button>
            )}
            {!canAccept && bids.length > 0 && (
               <div className="flex-1 h-14 bg-muted/10 rounded-2xl flex items-center justify-center gap-2 text-text-muted border border-dashed border-border/60">
                 <Timer className="w-4 h-4" />
                 <span className="text-xs font-bold uppercase tracking-widest italic">Waiting for response...</span>
               </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 text-text-muted">
            <div className="flex items-center gap-1.5 opacity-50">
               <ShieldCheck className="w-3.5 h-3.5" />
               <span className="text-[9px] font-bold uppercase tracking-widest">Safe Negotiation</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-border" />
            <div className="flex items-center gap-1.5">
               <div className={cn("w-2 h-2 rounded-full", isConnected ? "bg-success animate-pulse" : "bg-danger")} />
               <span className="text-[9px] font-bold uppercase tracking-widest">{isConnected ? "Connected" : "Disconnected"}</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
