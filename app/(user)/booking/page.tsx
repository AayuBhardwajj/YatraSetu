"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Navigation2, Info, Bike, Car, ChevronRight, LocateFixed, X, ArrowUpDown } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriceRangeBar } from "@/components/user/PriceRangeBar";
import { MOCK_ML_PRICING } from "@/lib/mock/data";
import { useRideStore } from "@/store/useRideStore";
import { useNegotiationStore } from "@/store/useNegotiationStore";
import { cn } from "@/lib/utils";

const UserMap = dynamic(() => import("@/components/user/UserMap"), { ssr: false });

const CATEGORIES = [
  { id: "bike", name: "Bike", icon: Bike, price: 45, time: "~8 min" },
  { id: "auto", name: "Auto", icon: Car, price: 89, time: "~10 min" },
  { id: "mini", name: "Mini", icon: Car, price: 130, time: "~12 min" },
  { id: "sedan", name: "Sedan", icon: Car, price: 180, time: "~14 min" },
];

interface Driver { id: string; lat: number; lng: number; }

export default function BookingPage() {
  const [selectedCategory, setSelectedCategory] = useState("mini");
  const [destination, setDestination] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const router = useRouter();
  const { setRide } = useRideStore();
  const { initNegotiation } = useNegotiationStore();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      setUserPos([lat, lng]);
    });
  }, []);

  // Generate alive-feeling drivers near user
  useEffect(() => {
    if (!userPos) return;
    const [lat, lng] = userPos;
    const base: Driver[] = [
      { id: 'd1', lat: lat + 0.003, lng: lng + 0.002 },
      { id: 'd2', lat: lat - 0.002, lng: lng + 0.004 },
      { id: 'd3', lat: lat + 0.001, lng: lng - 0.003 },
    ];
    setDrivers(base);

    const interval = setInterval(() => {
      setDrivers(base.map(d => ({
        ...d,
        lat: d.lat + (Math.random() - 0.5) * 0.0003,
        lng: d.lng + (Math.random() - 0.5) * 0.0003,
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [userPos]);

  const handleBooking = () => {
    const category = CATEGORIES.find(c => c.id === selectedCategory);
    if (!category) return;
    setRide({
      id: "ride_" + Date.now(),
      from: "Current Location",
      to: destination || "Ludhiana Railway Station",
      category: category.name,
      price: category.price,
    });
    initNegotiation(MOCK_ML_PRICING.suggestedPrice, MOCK_ML_PRICING.minPrice, MOCK_ML_PRICING.maxPrice);
    router.push("/negotiate");
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      {/* Left Column: Map */}
      <div className="flex-[3] h-full relative border-r border-border/50 min-w-0">
        <UserMap height="100%" drivers={drivers} />

        {/* Route Indicators */}
        <div className="absolute top-5 left-5 z-[1000] flex flex-col space-y-2">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-md border border-border/50 flex items-center space-x-2">
            <div className="w-2.5 h-2.5 bg-success rounded-full flex-shrink-0" />
            <span className="text-sm font-semibold truncate">Current Location</span>
          </div>
          {destination && (
            <div className="bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-md border border-border/50 flex items-center space-x-2 animate-in slide-in-from-top-2">
              <div className="w-2.5 h-2.5 bg-danger rounded-full flex-shrink-0" />
              <span className="text-sm font-semibold truncate">{destination}</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Content */}
      <div className="flex-[2] h-full bg-white overflow-y-auto no-scrollbar min-w-[340px] max-w-[440px]">
        <div className="p-6 space-y-7">
          {/* Route Inputs */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-text-primary">Plan your trip</h2>
              <Button variant="ghost" size="sm" className="text-primary hover:bg-primary-light text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 mr-1.5" />Swap
              </Button>
            </div>
            <Card className="p-5 border-border/50 shadow-none space-y-3.5 relative">
              <div className="absolute left-[30px] top-[48px] bottom-[48px] w-0.5 border-l-2 border-dashed border-border" />
              <div className="flex items-center space-x-3.5">
                <div className="w-3.5 h-3.5 rounded-full bg-success ring-4 ring-success/10 flex-shrink-0" />
                <div className="flex-1 flex items-center bg-muted/50 rounded-xl px-4 h-11">
                  <span className="text-sm font-medium text-text-secondary truncate">Current Location</span>
                  <Button variant="ghost" size="icon" className="ml-auto text-primary h-8 w-8">
                    <LocateFixed className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center space-x-3.5">
                <div className="w-3.5 h-3.5 rounded-full bg-danger ring-4 ring-danger/10 flex-shrink-0" />
                <div className="flex-1 flex items-center bg-white border border-primary/50 rounded-xl px-4 h-11 ring-2 ring-primary/10">
                  <input
                    autoFocus
                    placeholder="Enter destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm font-medium text-text-primary w-full h-full"
                  />
                  {destination && (
                    <Button variant="ghost" size="icon" className="ml-auto text-text-muted hover:text-text-primary h-8 w-8" onClick={() => setDestination("")}>
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </section>

          {/* Ride Categories */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-text-primary">Choose your ride</h2>
            <div className="grid grid-cols-2 gap-3">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "flex flex-col items-center justify-center p-5 rounded-2xl border transition-all space-y-2.5",
                      isSelected ? "bg-primary-light border-2 border-primary/40 shadow-sm" : "bg-white border-border hover:border-primary/30"
                    )}
                  >
                    <div className={cn("p-2.5 rounded-full", isSelected ? "bg-primary text-white" : "bg-muted text-primary")}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-center">
                      <p className={cn("text-sm font-bold", isSelected ? "text-primary" : "text-text-primary")}>{cat.name}</p>
                      <p className="text-lg font-bold text-text-primary font-tabular">₹{cat.price}</p>
                      <p className="text-[11px] text-text-muted">{cat.time}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ML Price Card */}
          {isLoaded && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Card className="p-5 bg-primary-light border-l-4 border-l-primary border-y-0 border-r-0 rounded-none rounded-r-xl space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-primary uppercase tracking-tight">AI Suggested Price</span>
                    <Info className="w-3.5 h-3.5 text-primary opacity-50" />
                  </div>
                  <div className="px-2 py-0.5 bg-success/15 text-success text-[10px] font-bold rounded uppercase">Fair price</div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-4xl font-bold text-primary font-tabular tracking-tight">₹{MOCK_ML_PRICING.suggestedPrice}</span>
                  <span className="text-xs text-primary/50 font-medium">suggested fare</span>
                </div>
                <PriceRangeBar min={MOCK_ML_PRICING.minPrice} max={MOCK_ML_PRICING.maxPrice} suggested={MOCK_ML_PRICING.suggestedPrice} />
                <div className="flex flex-wrap gap-2">
                  {["Moderate demand", "3.2 km", "~12 min"].map((chip) => (
                    <div key={chip} className="px-2.5 py-1 bg-white/60 border border-primary/10 rounded-full text-[11px] font-semibold text-primary">{chip}</div>
                  ))}
                </div>
                <div className="flex flex-col space-y-2.5 pt-1">
                  <Button onClick={handleBooking} className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/20">
                    Accept ₹{MOCK_ML_PRICING.suggestedPrice}
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/negotiate")} className="w-full h-12 border-primary text-primary hover:bg-primary hover:text-white rounded-xl text-sm font-semibold transition-all">
                    Negotiate Price
                  </Button>
                </div>
              </Card>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}