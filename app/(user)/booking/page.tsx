"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  Navigation2, 
  Info, 
  Bike, 
  Car, 
  ChevronRight,
  LocateFixed,
  X,
  ArrowUpDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { PriceRangeBar } from "@/components/user/PriceRangeBar";
import { MOCK_ML_PRICING } from "@/lib/mock/data";
import { useRideStore } from "@/store/useRideStore";
import { useNegotiationStore } from "@/store/useNegotiationStore";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { id: "bike", name: "Bike", icon: Bike, price: 45, time: "~8 min" },
  { id: "auto", name: "Auto", icon: Car, price: 89, time: "~10 min" },
  { id: "mini", name: "Mini", icon: Car, price: 130, time: "~12 min" },
  { id: "sedan", name: "Sedan", icon: Car, price: 180, time: "~14 min" },
];

export default function BookingPage() {
  const [selectedCategory, setSelectedCategory] = useState("mini");
  const [destination, setDestination] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();
  const { setRide } = useRideStore();
  const { initNegotiation } = useNegotiationStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      {/* Left Column: Map (60%) */}
      <div className="w-[60%] h-full relative border-r border-border">
        <MapPlaceholder 
          height="100%" 
          showDriverDots={false} 
          showRouteLine={destination !== ""} 
        />
        
        {/* Route Indicators */}
        <div className="absolute top-6 left-6 z-10 flex flex-col space-y-2">
          <div className="bg-white px-4 py-2 rounded-full shadow-md border border-border flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-success rounded-full" />
            <span className="text-sm font-semibold">Sector 17, Chandigarh</span>
          </div>
          {destination && (
            <div className="bg-white px-4 py-2 rounded-full shadow-md border border-border flex items-center space-x-2 animate-in slide-in-from-top-2">
              <div className="w-2.5 h-2.5 bg-danger rounded-full" />
              <span className="text-sm font-semibold">{destination}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Content (40%) */}
      <div className="w-[40%] h-full bg-white overflow-y-auto no-scrollbar p-8 space-y-10">
        
        {/* Section 1: Route Inputs */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-[600] text-text-primary">Plan your trip</h2>
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary-light">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              Swap
            </Button>
          </div>

          <Card className="p-6 border-border shadow-none space-y-4 relative">
            <div className="absolute left-[34px] top-[54px] bottom-[54px] w-0.5 border-l-2 border-dashed border-border" />
            
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 rounded-full bg-success ring-4 ring-success/10 flex-shrink-0" />
              <div className="flex-1 flex items-center bg-muted rounded-lg px-4 h-12">
                <span className="text-sm font-medium text-text-secondary">Current Location</span>
                <Button variant="ghost" size="icon" className="ml-auto text-primary">
                  <LocateFixed className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 rounded-full bg-danger ring-4 ring-danger/10 flex-shrink-0" />
              <div className="flex-1 flex items-center bg-white border border-primary rounded-lg px-4 h-12 ring-2 ring-primary-light">
                <input
                  autoFocus
                  placeholder="Enter destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm font-medium text-text-primary w-full h-full"
                />
                {destination && (
                  <Button variant="ghost" size="icon" className="ml-auto text-text-muted hover:text-text-primary" onClick={() => setDestination("")}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </section>

        {/* Section 2: Ride Categories */}
        <section className="space-y-4">
          <h2 className="text-[18px] font-[600] text-text-primary">Choose your ride</h2>
          <div className="grid grid-cols-2 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex flex-col items-center justify-center p-6 rounded-xl border transition-all space-y-3",
                    isSelected 
                      ? "bg-primary-light border-2 border-primary shadow-sm" 
                      : "bg-white border-border hover:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-full",
                    isSelected ? "bg-primary text-white" : "bg-muted text-primary"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className={cn("text-[15px] font-bold", isSelected ? "text-primary" : "text-text-primary")}>{cat.name}</p>
                    <p className="text-xl font-bold text-text-primary font-tabular">₹{cat.price}</p>
                    <p className="text-[12px] text-text-muted">{cat.time}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 3: ML Price Card */}
        {isLoaded && (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="p-6 bg-primary-light border-l-4 border-l-primary border-y-0 border-r-0 rounded-none rounded-r-xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-[13px] font-bold text-primary uppercase tracking-tight">AI Suggested Price</span>
                  <Info className="w-3.5 h-3.5 text-primary opacity-60" />
                </div>
                <div className="px-2 py-0.5 bg-success/20 text-success text-[10px] font-bold rounded-md uppercase">
                  Fair price
                </div>
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-[40px] font-bold text-primary font-tabular tracking-tight">₹{MOCK_ML_PRICING.suggestedPrice}</span>
                <span className="text-xs text-primary/60 font-medium">suggested fare</span>
              </div>

              <PriceRangeBar 
                min={MOCK_ML_PRICING.minPrice} 
                max={MOCK_ML_PRICING.maxPrice} 
                suggested={MOCK_ML_PRICING.suggestedPrice}
              />

              <div className="flex flex-wrap gap-2">
                {["Moderate demand", "3.2 km", "~12 min"].map((chip) => (
                  <div key={chip} className="px-3 py-1 bg-white/60 border border-primary/10 rounded-full text-[11px] font-semibold text-primary">
                    {chip}
                  </div>
                ))}
              </div>

              <div className="flex flex-col space-y-3 pt-2">
                <Button 
                  onClick={handleBooking}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-xl text-base font-bold shadow-lg shadow-primary/20"
                >
                  Accept ₹{MOCK_ML_PRICING.suggestedPrice}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => router.push("/negotiate")}
                  className="w-full h-14 border-primary text-primary hover:bg-primary hover:text-white rounded-xl text-base font-semibold transition-all"
                >
                  Negotiate Price
                </Button>
              </div>
            </Card>
          </section>
        )}
      </div>
    </div>
  );
}
