"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, MessageCircle, Phone, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { NegotiationTimer } from "@/components/user/NegotiationTimer";
import { PriceRangeBar } from "@/components/user/PriceRangeBar";
import { useNegotiationStore } from "@/store/useNegotiationStore";
import { useRideStore } from "@/store/useRideStore";
import { MOCK_ML_PRICING, MOCK_DRIVERS } from "@/lib/mock/data";
import { cn } from "@/lib/utils";

export default function NegotiatePage() {
  const router = useRouter();
  const { 
    userOffer, 
    setUserOffer, 
    mlMin, 
    mlMax, 
    mlSuggested, 
    status, 
    driverOffer, 
    setDriverOffer, 
    acceptOffer 
  } = useNegotiationStore();
  const { currentRide, setDriver, updateStatus } = useRideStore();
  
  const [sliderValue, setSliderValue] = useState([userOffer]);
  const [isCountered, setIsCountered] = useState(false);

  useEffect(() => {
    // Simulate a driver counter-offer after 8 seconds
    if (status === "pending" && !isCountered) {
      const timer = setTimeout(() => {
        setDriverOffer(mlSuggested - 10); // Driver asks for a bit less than suggested but more than min
        setIsCountered(true);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [status, isCountered, mlSuggested, setDriverOffer]);

  const handleSendOffer = () => {
    setUserOffer(sliderValue[0]);
  };

  const handleAcceptOffer = () => {
    acceptOffer();
    setDriver(MOCK_DRIVERS[0]);
    updateStatus("accepted");
    router.push("/tracking");
  };

  return (
    <div className="flex flex-col h-screen bg-surface">
      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-border bg-white z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="heading-sm text-foreground">Make your offer</h1>
        </div>
        <NegotiationTimer duration={30} onTimeout={() => router.push("/home")} size={48} strokeWidth={4} />
      </header>

      {/* Reference Bar */}
      <div className="p-4 bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Pricing Intelligence</span>
          <span className="text-[12px] font-bold text-primary">₹{mlMin} — [₹{mlSuggested}] — ₹{mlMax}</span>
        </div>
        <PriceRangeBar 
          min={mlMin} 
          max={mlMax} 
          suggested={mlSuggested} 
          userOffer={sliderValue[0]} 
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-12">
        {/* Large Price Display */}
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground mb-2">Your Offer</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[64px] font-bold text-foreground font-tabular leading-tight">₹{sliderValue[0]}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Driver must respond in 0:24</p>
        </div>

        {/* Custom Price Slider */}
        <div className="w-full max-w-[320px] px-4 space-y-8">
          <Slider
            defaultValue={sliderValue}
            max={mlMax}
            min={mlMin}
            step={5}
            onValueChange={setSliderValue}
            className="py-4"
          />
          <div className="flex justify-between text-sm font-bold text-muted-foreground">
            <span>₹{mlMin}</span>
            <span>₹{mlMax}</span>
          </div>
        </div>
      </div>

      {/* Driver Counter-Offer Section */}
      <AnimatePresence>
        {isCountered && driverOffer && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="px-4 pb-4"
          >
            <Card className="p-4 border-2 border-primary bg-primary/5 rounded-card flex flex-col gap-4 shadow-xl shadow-primary/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted border border-border rounded-full flex items-center justify-center font-bold text-xl text-primary">
                  RK
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-foreground">Rajesh Kumar <span className="text-xs font-normal text-muted-foreground">· 4.8★</span></p>
                  <p className="text-xs text-muted-foreground mt-0.5">Counter offered: <span className="text-primary font-bold">₹{driverOffer}</span></p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleAcceptOffer}
                  className="flex-1 h-12 bg-primary text-white rounded-pill font-bold active:scale-[0.98]"
                >
                  Accept ₹{driverOffer}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsCountered(false)}
                  className="w-14 h-12 border-border bg-white rounded-pill flex items-center justify-center active:scale-[0.98]"
                >
                  <X className="w-6 h-6 text-muted-foreground" />
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Button */}
      <footer className="p-4 bg-surface border-t border-border pb-24">
        <Button 
          onClick={handleSendOffer}
          disabled={status === "pending" || isCountered}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-pill text-base font-bold shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]"
        >
          {status === "pending" ? "Waiting for responses..." : `Send ₹${sliderValue[0]} Offer`}
        </Button>
      </footer>
    </div>
  );
}

import { AnimatePresence, motion } from "framer-motion";
