"use client";

import React from "react";
import { 
  Bell, 
  Search, 
  MapPin, 
  ShieldCheck, 
  MoreHorizontal,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function DriverHeader() {
  return (
    <header className="sticky top-0 h-16 w-full bg-white/80 backdrop-blur-md border-b border-border flex items-center justify-between px-8 z-40">
      {/* Left section: Mode indicator */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Badge className="bg-success text-white border-transparent py-1 px-3 rounded-full text-[11px] font-bold uppercase tracking-wider">
            Driver Mode
          </Badge>
          <div className="w-px h-6 bg-border mx-2" />
          <div className="flex items-center text-text-secondary">
            <MapPin className="w-4 h-4 mr-2" />
            <span className="text-sm font-semibold">Chandigarh, IN</span>
          </div>
        </div>
      </div>

      {/* Right section: Global Actions */}
      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="hidden lg:flex items-center bg-muted rounded-xl px-4 py-2 w-64 group truncate">
          <Search className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search earnings, trips..." 
            className="bg-transparent border-none outline-none text-xs font-semibold text-text-primary ml-3 w-full"
          />
        </div>

        {/* Support Badge */}
        <div className="hidden xl:flex items-center bg-primary-light px-3 py-1.5 rounded-full border border-primary/10">
          <ShieldCheck className="w-3.5 h-3.5 text-primary mr-2" />
          <span className="text-[11px] font-bold text-primary uppercase tracking-tighter">Support 24/7</span>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative group hover:bg-muted rounded-xl">
          <Bell className="w-5 h-5 text-text-secondary group-hover:text-primary transition-all group-hover:scale-110" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-500/20" />
        </Button>

        {/* Settings */}
        <Button variant="ghost" size="icon" className="hover:bg-muted rounded-xl group">
          <MoreHorizontal className="w-5 h-5 text-text-secondary group-hover:text-primary transition-all" />
        </Button>
      </div>
    </header>
  );
}
