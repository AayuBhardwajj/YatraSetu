"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  User, 
  MessageCircle, 
  Phone, 
  X, 
  Check,
  ChevronRight,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { NegotiationTimer } from "@/components/user/NegotiationTimer";
import { PriceRangeBar } from "@/components/user/PriceRangeBar";
import { useNegotiationStore } from "@/store/useNegotiationStore";
import { useRideStore } from "@/store/useRideStore";
import { MOCK_ML_PRICING, MOCK_DRIVERS } from "@/lib/mock/data";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

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
  
  const [sliderValue, setSliderValue] = useState([userOffer || mlSuggested]);
  const [isCountered, setIsCountered] = useState(false);

  useEffect(() => {
    // Simulate a driver counter-offer after 8 seconds
    if (status === "pending" && !isCountered) {
      const timer = setTimeout(() => {
        setDriverOffer(mlSuggested - 10);
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
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      {/* Left Column: Map (55%) */}
      <div className="w-[55%] h-full relative border-r border-border">
        <MapPlaceholder 
          height="100%" 
          showDriverDots={true} 
          showRouteLine={true} 
        />
        
        {/* Map Overlays */}
        <div className="absolute top-6 left-6 z-10 flex flex-col space-y-2">
          <div className="bg-white px-4 py-2 rounded-full shadow-md border border-border flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-primary rounded-full" />
            <span className="text-sm font-semibold">Current Offer: ₹{sliderValue[0]}</span>
          </div>
        </div>
      </div>

      {/* Right Column: Negotiation Panel (45%) */}
      <div className="w-[45%] h-full bg-white overflow-y-auto no-scrollbar p-8 space-y-8">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="hover:bg-muted rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-text-primary" />
          </Button>
          <h2 className="text-[20px] font-bold text-text-primary">Negotiate your price</h2>
        </div>

        {/* Card 1: Trip Summary */}
        <Card className="p-6 border-border shadow-none space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3 text-sm font-medium text-text-primary">
              <div className="w-2 h-2 bg-success rounded-full" />
              <span>Model Town, Ludhiana</span>
            </div>
            <div className="w-0.5 h-4 border-l border-dashed border-border ml-1" />
            <div className="flex items-center space-x-3 text-sm font-medium text-text-primary">
              <div className="w-2 h-2 bg-danger rounded-full" />
              <span>Railway Station</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <span className="px-3 py-1 bg-muted rounded-full text-[11px] font-semibold text-text-secondary">3.2 km</span>
            <span className="px-3 py-1 bg-muted rounded-full text-[11px] font-semibold text-text-secondary">12 min</span>
          </div>
        </Card>

        {/* Card 2: ML Reference */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-secondary flex items-center space-x-2">
              <span>Fair Price Range</span>
              <Info className="w-3.5 h-3.5 opacity-50" />
            </h3>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">Set by AI</span>
          </div>
          <Card className="p-6 bg-primary-light border-none shadow-none">
            <PriceRangeBar 
              min={mlMin} 
              max={mlMax} 
              suggested={mlSuggested} 
            />
            <p className="text-[11px] text-primary/60 font-medium mt-2">
              Based on current demand and traffic conditions in Chandigarh.
            </p>
          </Card>
        </section>

        {/* Card 3: Your Offer */}
        <section className="space-y-6 pt-4">
          <div className="text-center space-y-2">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest">Set your price</h3>
            <div className="text-[56px] font-bold text-text-primary font-tabular leading-none tracking-tighter">
              ₹{sliderValue[0]}
            </div>
          </div>

          <div className="px-4 space-y-4">
            <Slider
              value={sliderValue}
              max={mlMax}
              min={mlMin}
              step={5}
              onValueChange={setSliderValue}
              className="py-4 cursor-pointer"
            />
            <div className="flex justify-between text-xs font-bold text-text-muted">
              <span>₹{mlMin} Min</span>
              <span>₹{mlMax} Max</span>
            </div>
          </div>
          
          <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 text-center">
            <p className="text-sm font-medium text-primary">
              Drivers are more likely to accept ₹165–₹175
            </p>
          </div>
        </section>

        {/* Card 4: Timer */}
        <section className="flex flex-col items-center space-y-4 py-4">
          <NegotiationTimer duration={30} onTimeout={() => router.push("/home")} />
          <p className="text-sm font-semibold text-text-secondary">Offer expires soon</p>
        </section>

        {/* Card 5: Driver Counter (Conditional) */}
        <AnimatePresence>
          {isCountered && driverOffer && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              <Card className="p-6 border-2 border-primary bg-primary-light rounded-xl space-y-6 shadow-xl shadow-primary/10">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                    RK
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-bold text-text-primary">Rajesh Kumar</p>
                    <p className="text-sm text-text-secondary">Counter offered <span className="text-primary font-bold">₹{driverOffer}</span></p>
                  </div>
                  <div className="flex items-center text-warning font-bold text-sm">
                    ★ 4.8
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    onClick={handleAcceptOffer}
                    className="flex-1 h-12 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all"
                  >
                    Accept ₹{driverOffer}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsCountered(false)}
                    className="flex-1 h-12 border-text-muted text-text-muted hover:bg-muted rounded-xl font-bold transition-all"
                  >
                    Decline
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        <div className="pt-4 sticky bottom-0 bg-white pb-8">
          <Button 
            onClick={handleSendOffer}
            disabled={status === "pending" || isCountered}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-xl text-base font-bold shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
          >
            {status === "pending" ? "Waiting for responses..." : `Send ₹${sliderValue[0]} Offer`}
          </Button>
        </div>
      </div>
    </div>
  );
}
