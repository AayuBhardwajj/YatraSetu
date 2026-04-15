"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Clock, ChevronRight, Car, Package, Key, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

const UserMapWrapper = dynamic(
  () => import("@/components/user/UserMapWrapper"),
  { ssr: false, loading: () => <div className="w-full h-full bg-muted animate-pulse" /> }
);

const SERVICES = [
  { id: "ride", title: "Book a Ride", subtitle: "Cars & autos", icon: Car, href: "/booking" },
  { id: "delivery", title: "Send Package", subtitle: "Fast delivery", icon: Package, href: "/booking" },
  { id: "rental", title: "Rent a Vehicle", subtitle: "Hourly rentals", icon: Key, href: "/booking" },
];

const RECENT_PLACES = [
  { id: 1, title: "Sector 17, Chandigarh", subtitle: "Market Area" },
  { id: 2, title: "Ludhiana Railway Station", subtitle: "Punjab" },
  { id: 3, title: "PGI Hospital", subtitle: "Sector 12" },
];

interface Driver { id: string; lat: number; lng: number; }

export default function UserHomePage() {
  const [selectedService, setSelectedService] = useState("ride");
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const router = useRouter();
  const { userProfile } = useAuthStore();
  const city = (userProfile as any)?.city || 'Your City';



  // Generate 3 alive-feeling drivers that drift slightly
  useEffect(() => {
    // Use a default coordinate base (Delhi or similar) for simulation seeding
    const lat = 28.6139;
    const lng = 77.2090;

    const base: Driver[] = [
      { id: 'd1', lat: lat + 0.003, lng: lng + 0.002 },
      { id: 'd2', lat: lat - 0.002, lng: lng + 0.004 },
      { id: 'd3', lat: lat + 0.001, lng: lng - 0.003 },
    ];
    setDrivers(base);

    // Drift every 3s to feel alive
    const interval = setInterval(() => {
      setDrivers(base.map(d => ({
        ...d,
        lat: d.lat + (Math.random() - 0.5) * 0.0003,
        lng: d.lng + (Math.random() - 0.5) * 0.0003,
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden">
      {/* Left Column: Map */}
      <div className="flex-[3] h-full relative border-r border-border/50 min-w-0">
        <UserMapWrapper drivers={drivers} />

        {/* Overlays */}
        <div className="absolute top-5 left-5 z-[1000]">
          <div className="flex items-center space-x-2 bg-white/95 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-md border border-border/50">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-sm font-semibold text-text-primary">{city}</span>
          </div>
        </div>

        <div className="absolute top-5 right-5 z-[1000]">
          <div className="flex items-center space-x-2 bg-success/10 backdrop-blur-sm px-4 py-2.5 rounded-full border border-success/20">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse flex-shrink-0" />
            <span className="text-xs font-bold text-success">3 drivers nearby</span>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 z-[1000]">
          <div
            onClick={() => router.push("/booking")}
            className="w-full bg-white/95 backdrop-blur-sm p-3.5 rounded-2xl shadow-xl border border-border/50 hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className="flex items-center space-x-3.5 bg-muted/60 px-5 h-12 rounded-xl group-hover:bg-primary-light transition-colors">
              <Search className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors flex-shrink-0" />
              <span className="text-base font-medium text-text-secondary group-hover:text-primary">Where to?</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Controls */}
      <div className="flex-[2] h-full bg-white overflow-y-auto no-scrollbar min-w-[320px] max-w-[420px]">
        <div className="p-6 space-y-8">
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-text-primary">What do you need?</h2>
            <div className="flex flex-col space-y-2.5">
              {SERVICES.map((service) => {
                const Icon = service.icon;
                const isSelected = selectedService === service.id;
                return (
                  <button
                    key={service.id}
                    onClick={() => { setSelectedService(service.id); router.push(service.href); }}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all text-left group",
                      isSelected ? "bg-primary-light border-primary/30 shadow-sm" : "bg-white border-border hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className={cn(
                        "p-2.5 rounded-xl transition-colors flex-shrink-0",
                        isSelected ? "bg-primary text-white" : "bg-muted text-text-secondary group-hover:bg-primary-light group-hover:text-primary"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className={cn("text-sm font-bold", isSelected ? "text-primary" : "text-text-primary")}>{service.title}</span>
                        <span className="text-xs text-text-muted">{service.subtitle}</span>
                      </div>
                    </div>
                    <ChevronRight className={cn("w-4 h-4 flex-shrink-0", isSelected ? "text-primary" : "text-text-muted")} />
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-text-primary">Recent places</h2>
            <div className="space-y-0.5">
              {RECENT_PLACES.map((place) => (
                <button
                  key={place.id}
                  onClick={() => router.push("/booking")}
                  className="w-full flex items-center space-x-3.5 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left group"
                >
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center group-hover:bg-white transition-colors flex-shrink-0">
                    <Clock className="w-4 h-4 text-text-muted" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-semibold text-text-primary truncate">{place.title}</span>
                    <span className="text-xs text-text-muted">{place.subtitle}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section>
            <div className="bg-primary rounded-2xl p-5 text-white relative overflow-hidden group cursor-pointer hover:scale-[1.01] transition-transform">
              <div className="relative z-10 space-y-3">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">Get ₹50 off</h3>
                  <p className="text-primary-light text-xs opacity-80">Use code ZIPP50 on your next ride</p>
                </div>
                <button className="bg-white text-primary px-4 py-2 rounded-lg text-xs font-bold hover:bg-primary-light transition-colors">
                  Claim Offer
                </button>
              </div>
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-2xl group-hover:bg-white/15 transition-colors" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}