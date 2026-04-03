"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, 
  Clock, 
  ChevronRight, 
  Car, 
  Package, 
  Key,
  MapPin,
  Users
} from "lucide-react";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { cn } from "@/lib/utils";

const SERVICES = [
  { 
    id: "ride", 
    title: "Book a Ride", 
    subtitle: "Cars & autos", 
    icon: Car,
    href: "/booking"
  },
  { 
    id: "delivery", 
    title: "Send Package", 
    subtitle: "Fast delivery", 
    icon: Package,
    href: "/booking" 
  },
  { 
    id: "rental", 
    title: "Rent a Vehicle", 
    subtitle: "Hourly rentals", 
    icon: Key,
    href: "/booking"
  },
];

const RECENT_PLACES = [
  { id: 1, title: "Sector 17, Chandigarh", subtitle: "Market Area" },
  { id: 2, title: "Ludhiana Railway Station", subtitle: "Punjab" },
  { id: 3, title: "PGI Hospital", subtitle: "Sector 12" },
];

export default function UserHomePage() {
  const [selectedService, setSelectedService] = useState("ride");
  const router = useRouter();

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden">
      {/* Left Column: Map (65%) */}
      <div className="w-[65%] h-full relative border-r border-border">
        <MapPlaceholder height="100%" showDriverDots={true} />
        
        {/* Map Overlays */}
        <div className="absolute top-6 left-6 z-10">
          <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm border border-border">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-text-primary">Chandigarh, Punjab</span>
          </div>
        </div>

        <div className="absolute top-6 right-6 z-10">
          <div className="flex items-center space-x-2 bg-success/10 px-4 py-2 rounded-full border border-success/20">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-xs font-bold text-success">3 drivers nearby</span>
          </div>
        </div>

        {/* Bottom Search Bar Overlay */}
        <div className="absolute bottom-10 left-10 right-10 z-10">
          <div 
            onClick={() => router.push("/booking")}
            className="w-full bg-white p-4 rounded-xl shadow-lg border border-border hover:border-primary transition-all cursor-pointer group"
          >
            <div className="flex items-center space-x-4 bg-muted px-6 h-14 rounded-lg group-hover:bg-primary-light transition-colors">
              <Search className="w-6 h-6 text-text-muted group-hover:text-primary transition-colors" />
              <span className="text-lg font-medium text-text-secondary group-hover:text-primary">Where to?</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Controls (35%) */}
      <div className="w-[35%] h-full bg-white overflow-y-auto no-scrollbar p-8 flex flex-col space-y-10">
        
        {/* Section 1: Service Selector */}
        <section className="space-y-4">
          <h2 className="text-[18px] font-[600] text-text-primary">What do you need?</h2>
          <div className="flex flex-col space-y-3">
            {SERVICES.map((service) => {
              const Icon = service.icon;
              const isSelected = selectedService === service.id;
              return (
                <button
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all text-left group",
                    isSelected 
                      ? "bg-primary-light border-primary" 
                      : "bg-white border-border hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "p-3 rounded-lg transition-colors",
                      isSelected ? "bg-primary text-white" : "bg-muted text-text-secondary group-hover:bg-primary-light group-hover:text-primary"
                    )}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <span className={cn("text-[15px] font-[600]", isSelected ? "text-primary" : "text-text-primary")}>
                        {service.title}
                      </span>
                      <span className="text-xs text-text-secondary">{service.subtitle}</span>
                    </div>
                  </div>
                  <ChevronRight className={cn("w-5 h-5", isSelected ? "text-primary" : "text-text-muted")} />
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 2: Recent Places */}
        <section className="space-y-4">
          <h2 className="text-[18px] font-[600] text-text-primary">Recent places</h2>
          <div className="space-y-1">
            {RECENT_PLACES.map((place) => (
              <button
                key={place.id}
                onClick={() => router.push("/booking")}
                className="w-full flex items-center space-x-4 p-3 rounded-xl hover:bg-muted transition-colors text-left group"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-white transition-colors">
                  <Clock className="w-5 h-5 text-text-secondary" />
                </div>
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-semibold text-text-primary">{place.title}</span>
                  <span className="text-xs text-text-secondary">{place.subtitle}</span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Section 3: Promo Banner */}
        <section>
          <div className="bg-primary rounded-xl p-6 text-white relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform">
            <div className="relative z-10 space-y-4">
              <div className="space-y-1">
                <h3 className="text-xl font-bold">Get ₹50 off</h3>
                <p className="text-primary-light text-xs opacity-90">Use code ZIPP50 on your next ride</p>
              </div>
              <button className="bg-white text-primary px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-light transition-colors">
                Claim Offer
              </button>
            </div>
            {/* Decorative background element */}
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
          </div>
        </section>

      </div>
    </div>
  );
}
