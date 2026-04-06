"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { 
  Search, 
  Bell, 
  MapPin, 
  ChevronDown, 
  Command,
  HelpCircle,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const PAGE_TITLES: Record<string, string> = {
  "/home": "Overview",
  "/booking": "Trip Planner",
  "/tracking": "Live Monitor",
  "/activity": "Activity",
  "/history": "History",
  "/wallet": "Financials",
  "/profile": "Account",
  "/negotiate": "Negotiation",
  "/payment": "Payment",
};

export function UserHeader() {
  const pathname = usePathname();
  const pageTitle = PAGE_TITLES[pathname] || "Zipp";

  return (
    <header className="sticky top-0 h-16 bg-white/60 backdrop-blur-xl border-b border-border/30 px-8 flex items-center justify-between z-40 flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-success/10 rounded-full">
          <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
          <span className="text-success font-bold text-[10px] uppercase tracking-wider">System Online</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative group hidden xl:flex items-center">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search trips, drivers..."
            className="w-[260px] h-10 pl-10 pr-10 bg-white/80 border border-border/40 rounded-xl text-xs font-medium focus:border-primary/30 focus:ring-2 focus:ring-primary/5 focus:bg-white transition-all outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-muted rounded flex items-center gap-0.5 border border-border/30">
            <Command className="w-2.5 h-2.5 text-text-muted" />
            <span className="text-[9px] font-bold text-text-muted">K</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center hover:bg-white hover:shadow-md border border-transparent hover:border-border/40 rounded-xl transition-all text-text-secondary">
            <HelpCircle className="w-[18px] h-[18px]" />
          </button>

          <button className="relative w-9 h-9 flex items-center justify-center hover:bg-white hover:shadow-md border border-transparent hover:border-border/40 rounded-xl transition-all group">
            <Bell className="w-[18px] h-[18px] text-text-secondary group-hover:text-primary transition-colors" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full border-2 border-white" />
          </button>

          <div className="h-5 w-px bg-border/40 mx-1" />

          {/* Location */}
          <button className="flex items-center gap-2.5 px-3 py-1.5 bg-white border border-border/40 rounded-xl shadow-sm hover:shadow-md transition-all group">
            <div className="w-7 h-7 bg-primary-light rounded-lg flex items-center justify-center text-primary flex-shrink-0">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[9px] font-bold text-text-muted uppercase tracking-wider leading-none mb-0.5">Active City</p>
              <p className="text-xs font-bold text-text-primary leading-none">Chandigarh</p>
            </div>
          </button>

          {/* Quick Action */}
          <button className="w-9 h-9 bg-primary text-white flex items-center justify-center rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
             <Zap className="w-4 h-4 fill-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
