"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  Info, 
  Zap, 
  Check, 
  Send,
  Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { NegotiationTimer } from "@/components/user/NegotiationTimer"; // Reusing for consistency
import { cn } from "@/lib/utils";

export default function DriverNegotiatePage() {
  const router = useRouter();
  
  const [timerValue, setTimerValue] = useState(45);
  const [offerValue, setOfferValue] = useState(280);
  
  const userOffer = 240;
  const suggestedPrice = 280;
  const maxPrice = 350;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerValue((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-muted/30 flex items-start justify-center p-8 overflow-y-auto no-scrollbar">
      <div className="w-full max-w-[600px] space-y-8   duration-200">
        
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-text-muted hover:text-text-primary h-auto p-0 hover:bg-transparent transition-colors font-bold flex items-center"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Requests
          </Button>
          <div className="flex items-center space-x-2 text-primary">
            <Zap className="w-4 h-4 fill-primary" />
            <span className="text-xs font-bold uppercase tracking-widest">High Demand Zone</span>
          </div>
        </div>

        {/* Route Info Card */}
        <Card className="p-6 border-none shadow-xl shadow-primary/5 bg-white rounded-3xl space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-4 flex-1">
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 bg-success rounded-full ring-4 ring-success-light" />
                <span className="text-sm font-bold text-text-primary">Sector 17, Chandigarh</span>
              </div>
              <div className="w-px h-6 bg-border ml-1.25" />
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 bg-danger rounded-full ring-4 ring-danger-light" />
                <span className="text-sm font-bold text-text-primary">Airport (IXC) Terminal 1</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Base Price</span>
              <div className="text-3xl font-bold text-text-primary font-tabular">₹{userOffer}</div>
            </div>
          </div>
        </Card>

        {/* Negotiation Slider Card */}
        <Card className="p-8 border-none shadow-xl shadow-primary/5 bg-white rounded-3xl space-y-12">
          <div className="text-center space-y-2">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest">Select Your Counter Offer</h3>
            <div className="text-[64px] font-bold text-primary font-tabular tracking-tighter">
              ₹{offerValue}
            </div>
          </div>

          <div className="px-4 space-y-6">
            <Slider 
              defaultValue={[offerValue]}
              max={maxPrice}
              min={userOffer}
              step={5}
              onValueChange={(v) => setOfferValue(v[0])}
              className="py-4"
            />
            
            <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider text-text-muted">
              <div className="flex flex-col items-start gap-1">
                <span>User Offer</span>
                <span className="text-sm text-text-secondary">₹{userOffer}</span>
              </div>
              <div className="flex flex-col items-center gap-1 text-primary">
                <span>Suggested</span>
                <span className="text-sm">₹{suggestedPrice}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span>Max Range</span>
                <span className="text-sm text-text-secondary">₹{maxPrice}</span>
              </div>
            </div>
          </div>

          <div className="bg-primary-light p-4 rounded-2xl flex items-start space-x-3">
            <Info className="w-5 h-5 text-primary mt-0.5" />
            <p className="text-xs font-medium text-primary leading-relaxed">
              Based on supply and demand in this area, we recommend counter-offering between 
              <span className="font-bold mx-1">₹270 - ₹300</span> to maximize your earnings while remaining competitive.
            </p>
          </div>
        </Card>

        {/* Actions Footer */}
        <div className="space-y-6">
          <div className="flex space-x-4">
            <Button 
              onClick={() => router.push("/active-ride")}
              className="flex-1 h-16 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold shadow-xl shadow-primary/20 text-lg transition-all active:scale-[0.98]"
            >
              <Send className="w-5 h-5 mr-2" />
              Counter Offer ₹{offerValue}
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push("/active-ride")}
              className="flex-1 h-16 border-border text-text-primary hover:bg-muted rounded-2xl font-bold text-lg transition-all"
            >
              <Check className="w-5 h-5 mr-2 text-success" />
              Accept ₹{userOffer}
            </Button>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-3 text-text-muted">
              <Timer className="w-5 h-5" />
              <span className="text-sm font-bold uppercase tracking-widest">Remaining to respond</span>
            </div>
            <div className="text-3xl font-bold font-tabular text-text-primary">
              0:{timerValue < 10 ? `0${timerValue}` : timerValue}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
