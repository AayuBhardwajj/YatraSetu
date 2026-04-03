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
import { Badge } from "@/components/ui/badge";

const PAGE_TITLES: Record<string, string> = {
  "/home": "Overview",
  "/booking": "Trip Planner",
  "/tracking": "Live Monitor",
  "/activity": "Your Activity",
  "/history": "History",
  "/wallet": "Financials",
  "/profile": "Account",
  "/ride-negotiate": "Bidding",
  "/payment": "Settlement",
};

export function UserHeader() {
  const pathname = usePathname();
  const pageTitle = PAGE_TITLES[pathname] || "Zipp Console";

  return (
    <header className="sticky top-0 h-24 bg-white/40 backdrop-blur-md px-12 flex items-center justify-between z-40">
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">{pageTitle}</h1>
        <div className="h-6 w-[1px] bg-border/40" />
        <div className="flex items-center gap-2 px-3 py-1.5 bg-success-light rounded-full text-success font-bold text-[10px] uppercase tracking-widest">
          <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
          System Operational
        </div>
      </div>

      <div className="flex items-center space-x-8">
        {/* Advanced Search */}
        <div className="relative group hidden xl:flex items-center">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Search className="w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search trips, drivers, transactions..."
            className="w-[320px] h-12 pl-12 pr-12 bg-white/60 border border-border/40 rounded-2xl text-xs font-medium focus:border-primary/30 focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all outline-none shadow-sm"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-muted rounded flex items-center gap-1 border border-border/40">
            <Command className="w-2.5 h-2.5 text-text-muted" />
            <span className="text-[9px] font-bold text-text-muted uppercase">K</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Help & Support */}
          <button className="w-11 h-11 flex items-center justify-center hover:bg-white hover:shadow-xl hover:shadow-black/[0.02] border border-transparent hover:border-border/40 rounded-xl transition-all text-text-secondary">
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Notifications */}
          <button className="relative w-11 h-11 flex items-center justify-center hover:bg-white hover:shadow-xl hover:shadow-black/[0.02] border border-transparent hover:border-border/40 rounded-xl transition-all group">
            <Bell className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
            <span className="absolute top-3 right-3 w-2 h-2 bg-danger rounded-full border-2 border-white shadow-sm" />
          </button>

          <div className="h-6 w-[1px] bg-border/40" />

          {/* Location Selector */}
          <button className="flex items-center space-x-3 px-4 py-2 bg-white border border-border/40 rounded-xl shadow-sm hover:shadow-xl hover:shadow-black/[0.02] transition-all group">
            <div className="w-8 h-8 bg-primary-light rounded-lg flex items-center justify-center text-primary">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none mb-1">Active City</p>
              <p className="text-xs font-bold text-text-primary">Chandigarh <ChevronDown className="w-3 h-3 inline-block ml-1 opacity-40 group-hover:opacity-100 transition-opacity" /></p>
            </div>
          </button>

          {/* Quick Action - Turbo/Premium */}
          <button className="w-11 h-11 bg-primary text-white flex items-center justify-center rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all hover:scale-110 active:scale-95">
             <Zap className="w-5 h-5 fill-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
