"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Bell, Search, Clock, ChevronRight, Car, Bike, Truck, Gift } from "lucide-react";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { BottomSheet } from "@/components/shared/BottomSheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SERVICE_TYPES = [
  { id: "ride", label: "Ride", icon: Car },
  { id: "delivery", label: "Delivery", icon: Truck },
  { id: "rental", label: "Rental", icon: Bike },
];

const RECENT_PLACES = [
  { id: 1, title: "Sector 17, Chandigarh", subtitle: "Market Area" },
  { id: 2, title: "Ludhiana Railway Station", subtitle: "Railway Station" },
];

export default function UserHomePage() {
  const [activeService, setActiveService] = useState("ride");
  const router = useRouter();

  // Get current hour for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden flex flex-col">
      {/* Map Section */}
      <div className="h-[60%] w-full relative">
        <MapPlaceholder />

        {/* Floating Top Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
          <button className="w-11 h-11 bg-surface border border-border rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-transform">
            <Menu className="w-6 h-6 text-foreground" />
          </button>

          <div className="flex-1 px-4">
            <div className="bg-surface/90 backdrop-blur-sm border border-border rounded-full py-2 px-4 shadow-sm inline-block">
              <span className="text-sm font-medium text-foreground">
                {greeting}, Arjun
              </span>
            </div>
          </div>

          <button className="w-11 h-11 bg-surface border border-border rounded-xl flex items-center justify-center shadow-md relative active:scale-95 transition-transform">
            <Bell className="w-6 h-6 text-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full ring-2 ring-surface" />
          </button>
        </div>
      </div>

      {/* Bottom Content Area */}
      <BottomSheet height="auto" className="static h-[40%] border-t-0 shadow-none pb-20">
        <div className="space-y-6">
          {/* Search Bar */}
          <div 
            onClick={() => router.push("/booking")}
            className="group relative cursor-pointer"
          >
            <div className="flex items-center bg-muted border border-border rounded-input h-14 px-4 transition-all group-active:scale-[0.99] group-hover:border-primary/50">
              <Search className="w-5 h-5 text-muted-foreground mr-3" />
              <span className="text-secondary-foreground font-medium">Where to?</span>
            </div>
          </div>

          {/* Service Types */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {SERVICE_TYPES.map((type) => {
              const Icon = type.icon;
              const isSelected = activeService === type.id;
              return (
                <button
                  key={type.id}
                  onClick={() => setActiveService(type.id)}
                  className={cn(
                    "flex-shrink-0 flex items-center gap-2 px-6 py-2.5 rounded-pill border transition-all active:scale-95",
                    isSelected 
                      ? "bg-primary border-primary text-white" 
                      : "bg-surface border-border text-primary"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-bold">{type.label}</span>
                </button>
              );
            })}
          </div>

          {/* Recent Places */}
          <div className="space-y-1">
            <h3 className="text-[13px] font-bold text-muted-foreground uppercase tracking-widest pl-1 mb-2">
              Recent Places
            </h3>
            <div className="space-y-0.5">
              {RECENT_PLACES.map((place) => (
                <button
                  key={place.id}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-muted active:scale-[0.99] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-muted border border-border rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-foreground">{place.title}</p>
                      <p className="text-[12px] text-muted-foreground">{place.subtitle}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground opacity-50" />
                </button>
              ))}
            </div>
          </div>

          {/* Promo Banner */}
          <div className="bg-primary/5 border border-primary/20 rounded-card p-4 flex items-center gap-4 group cursor-pointer active:scale-[0.99] transition-transform">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Gift className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-foreground">Earn ₹50 Off</p>
              <p className="text-xs text-muted-foreground">On your next 3 rides this week</p>
            </div>
            <button className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-tighter">
              Claim
            </button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
