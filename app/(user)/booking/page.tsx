"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Navigation2, Info, Bike, Car, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PriceRangeBar } from "@/components/user/PriceRangeBar";
import { MOCK_ML_PRICING } from "@/lib/mock/data";
import { useRideStore } from "@/store/useRideStore";
import { useNegotiationStore } from "@/store/useNegotiationStore";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "bike", name: "Bike", icon: Bike, price: 45 },
  { id: "auto", name: "Auto", icon: Car, price: 89 },
  { id: "mini", name: "Mini", icon: Car, price: 130 },
  { id: "sedan", name: "Sedan", icon: Car, price: 180 },
];

export default function BookingPage() {
  const [selectedCategory, setSelectedCategory] = useState("mini");
  const [destination, setDestination] = useState("");
  const router = useRouter();
  const { setRide } = useRideStore();
  const { initNegotiation } = useNegotiationStore();

  const handleBooking = () => {
    const category = CATEGORIES.find(c => c.id === selectedCategory);
    if (!category) return;

    setRide({
      id: "ride_" + Date.now(),
      from: "Sector 17, Chandigarh",
      to: destination || "Ludhiana Railway Station",
      category: category.name,
      price: category.price,
    });

    initNegotiation(MOCK_ML_PRICING.suggestedPrice, MOCK_ML_PRICING.minPrice, MOCK_ML_PRICING.maxPrice);
    router.push("/negotiate");
  };

  return (
    <div className="flex flex-col h-screen bg-surface">
      {/* Header */}
      <header className="p-4 flex items-center gap-4 border-b border-border">
        <button 
          onClick={() => router.back()}
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </button>
        <h1 className="heading-sm text-foreground">Confirm Trip</h1>
      </header>

      {/* Location Inputs */}
      <div className="p-4 space-y-4">
        <div className="relative pl-10 space-y-4">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-[2px] h-[40%] border-l-2 border-dashed border-border" />
          
          <div className="relative">
            <div className="absolute left-[-28px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-success ring-4 ring-success/10" />
            <Input 
              value="Sector 17, Chandigarh" 
              readOnly 
              className="bg-muted border-none rounded-input h-12 text-sm font-medium"
            />
          </div>

          <div className="relative">
            <div className="absolute left-[-28px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-danger ring-4 ring-danger/10" />
            <Input 
              placeholder="Where to?" 
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-white border-primary rounded-input h-12 text-sm font-medium ring-offset-2 focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto px-4 py-2">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "flex-shrink-0 w-28 p-4 rounded-card border transition-all active:scale-95",
                  isSelected 
                    ? "bg-primary border-primary text-white shadow-md shadow-primary/20" 
                    : "bg-surface border-border text-muted-foreground hover:border-primary/50"
                )}
              >
                <Icon className={cn("w-6 h-6 mb-2", isSelected ? "text-white" : "text-primary")} />
                <p className={cn("text-[13px] font-bold", isSelected ? "text-white" : "text-foreground")}>
                  {cat.name}
                </p>
                <p className={cn("text-[11px] font-tabular mt-1", isSelected ? "text-white/80" : "text-muted-foreground")}>
                  ₹{cat.price}
                </p>
              </button>
            );
          })}
        </div>

        {/* ML Price Card */}
        <div className="mt-4 animate-in fade-in slide-in-from-bottom-5 duration-500">
          <Card className="p-4 border-primary bg-primary/5 rounded-card relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-bold text-primary uppercase tracking-wider">AI Suggested Price</span>
                <Info className="w-3 h-3 text-primary/60" />
              </div>
              <div className="bg-primary/10 px-2 py-1 rounded text-[10px] font-bold text-primary border border-primary/20">
                LATEST MODEL v4.2
              </div>
            </div>

            <div className="mb-4">
              <span className="text-[32px] font-bold font-tabular text-foreground">₹{MOCK_ML_PRICING.suggestedPrice}</span>
              <span className="text-xs text-muted-foreground ml-2">estimated total</span>
            </div>

            <PriceRangeBar 
              min={MOCK_ML_PRICING.minPrice} 
              max={MOCK_ML_PRICING.maxPrice} 
              suggested={MOCK_ML_PRICING.suggestedPrice}
              className="mb-4"
            />

            <div className="flex gap-2">
              <span className="bg-white/80 border border-border px-2 py-1 rounded-full text-[10px] font-medium text-muted-foreground">
                Moderate demand
              </span>
              <span className="bg-white/80 border border-border px-2 py-1 rounded-full text-[10px] font-medium text-muted-foreground">
                3.2km
              </span>
              <span className="bg-white/80 border border-border px-2 py-1 rounded-full text-[10px] font-medium text-muted-foreground">
                ~12 min
              </span>
            </div>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <footer className="p-4 bg-surface border-t border-border space-y-3 z-30 pb-24">
        <Button 
          onClick={handleBooking}
          className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-pill text-base font-bold shadow-lg shadow-primary/20 transition-transform active:scale-[0.98]"
        >
          Accept ₹{MOCK_ML_PRICING.suggestedPrice}
        </Button>
        <Button 
          variant="outline"
          onClick={() => router.push("/negotiate")}
          className="w-full h-14 border-border bg-white text-foreground rounded-pill text-base font-medium transition-transform active:scale-[0.98]"
        >
          Negotiate Price
        </Button>
      </footer>
    </div>
  );
}
