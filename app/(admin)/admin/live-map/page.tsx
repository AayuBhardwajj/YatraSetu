"use client";

import React, { useState } from "react";
import { 
  Search, 
  MapPin, 
  Navigation, 
  Users, 
  Activity, 
  Zap, 
  Layers, 
  Maximize2,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Flame,
  Car,
  ChevronRight,
  Info
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { cn } from "@/lib/utils";

const HOTSPOTS = [
  { id: 1, name: "Sector 17 Market", demand: "High", wait: "2m", color: "text-danger" },
  { id: 2, name: "Chandigarh Airport", demand: "Peak", wait: "5m", color: "text-warning" },
  { id: 3, name: "Elante Mall", demand: "Medium", wait: "1m", color: "text-success" },
];

export default function AdminLiveMapPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="absolute inset-0 overflow-hidden bg-muted">
      {/* Full Screen Map */}
      <div className="absolute inset-0 z-0">
        <MapPlaceholder className="h-full w-full opacity-80" />
      </div>

      {/* Floating Header (Overlay) */}
      <div className="absolute top-8 left-8 z-10 flex items-center gap-4">
        <Card className="p-2 border-none bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl flex items-center gap-2">
          <div className="flex items-center gap-2 px-4 py-2 bg-text-primary text-white rounded-xl shadow-lg border border-white/10">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest">Network Live</span>
          </div>
          <div className="h-8 w-[1px] bg-border/40 mx-1" />
          <div className="flex items-center gap-4 px-4 py-2">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-text-muted" />
              <span className="text-sm font-bold text-text-primary font-tabular">142 Drivers</span>
            </div>
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-text-muted" />
              <span className="text-sm font-bold text-text-primary font-tabular">84 Active Rides</span>
            </div>
          </div>
        </Card>
        
        <div className="flex items-center gap-2">
          <button className="w-12 h-12 bg-white/80 backdrop-blur-xl border border-border/40 rounded-2xl flex items-center justify-center text-text-primary shadow-xl hover:bg-white transition-all transform hover:scale-105 active:scale-95">
            <Layers className="w-5 h-5" />
          </button>
          <button className="w-12 h-12 bg-white/80 backdrop-blur-xl border border-border/40 rounded-2xl flex items-center justify-center text-text-primary shadow-xl hover:bg-white transition-all transform hover:scale-105 active:scale-95">
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Right Sidebar Overlay */}
      <aside className="absolute right-8 top-8 bottom-8 w-[400px] z-10 flex flex-col gap-6 animate-in slide-in-from-right-10 duration-200">
        
        {/* Search & Intelligence */}
        <Card className="p-6 border-none bg-white/90 backdrop-blur-2xl rounded-[32px] shadow-2xl space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest">Global Network Search</h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
              <Input 
                placeholder="Find Ride ID, Driver Name, or Plate..." 
                className="pl-12 h-14 bg-muted/40 border-none rounded-2xl font-medium focus-visible:ring-primary/10 shadow-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-primary-light rounded-2xl border border-primary/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Revenue Today</span>
                <TrendingUp className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-lg font-bold text-text-primary font-tabular">₹42,840</p>
            </div>
            <div className="p-4 bg-success-light rounded-2xl border border-success/10">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-success uppercase tracking-widest">Active Ops</span>
                <Zap className="w-3.5 h-3.5 text-success fill-success" />
              </div>
              <p className="text-lg font-bold text-text-primary font-tabular">98% Stable</p>
            </div>
          </div>
        </Card>

        {/* Hotspots & Demand */}
        <Card className="flex-1 border-none bg-white/90 backdrop-blur-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col">
          <div className="p-8 border-b border-border/40 flex items-center justify-between shrink-0">
             <div className="flex items-center gap-3">
               <Flame className="w-5 h-5 text-danger" />
               <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest">Dynamic Hotspots</h3>
             </div>
             <Badge className="bg-danger-light text-danger border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase">Dynamic Pricing Active</Badge>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
            {HOTSPOTS.map((hotspot) => (
              <div 
                key={hotspot.id}
                className="p-5 bg-white border border-border/40 rounded-2x hover:border-primary/30 transition-all cursor-pointer group rounded-2xl"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{hotspot.name}</h4>
                    <p className="text-xs text-text-muted mt-0.5">Average wait: {hotspot.wait}</p>
                  </div>
                  <Badge className={cn(
                    "text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border-none",
                    hotspot.demand === "High" || hotspot.demand === "Peak" ? "bg-danger-light text-danger" : "bg-success-light text-success"
                  )}>
                    {hotspot.demand} Demand
                  </Badge>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-dashed border-border/40">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Surge Factor</span>
                  <span className="text-sm font-bold text-text-primary font-tabular">1.{hotspot.id}x</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 border-t border-border/40 bg-muted/10 shrink-0">
            <Button className="w-full h-12 bg-text-primary text-white rounded-xl font-bold uppercase tracking-widest text-[11px] shadow-lg hover:bg-text-secondary transition-all active:scale-[0.98]">
              Dispatch Bulk Alert
            </Button>
          </div>
        </Card>

        {/* Real-time System Event (Subtle) */}
        <div className="bg-gradient-to-br from-text-primary to-text-secondary p-6 rounded-[28px] shadow-2xl text-white relative overflow-hidden group">
          <Activity className="absolute top-[-10%] right-[-10%] w-24 h-24 opacity-10 group-hover:rotate-12 transition-transform duration-1000" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
              <Info className="w-5 h-5 text-white/70" />
            </div>
            <div>
              <p className="text-xs font-bold opacity-60 uppercase tracking-widest leading-none mb-1">Last System Update</p>
              <p className="text-sm font-medium">Auto-dispatch algorithms optimized for peak traffic.</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
