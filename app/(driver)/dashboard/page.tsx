"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { User, TrendingUp, Star, Clock, Car, ChevronRight, Bell } from "lucide-react";
import { OnlineToggle } from "@/components/driver/OnlineToggle";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const STATS = [
  { label: "Trips", value: "12", icon: Car, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Earnings", value: "₹840", icon: TrendingUp, color: "text-success", bg: "bg-success/10" },
  { label: "Rating", value: "4.8", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
  { label: "Online", value: "4.5h", icon: Clock, color: "text-purple-500", bg: "bg-purple-50" },
];

export default function DriverDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      {/* Top Bar */}
      <header className="p-4 bg-white border-b border-border flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
            RK
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Welcome back</p>
            <h1 className="text-sm font-bold text-foreground">Hey, Rajesh</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-success/10 px-3 py-1.5 rounded-full border border-success/20">
            <span className="text-[11px] font-bold text-success uppercase">Today: ₹840</span>
          </div>
          <button className="p-2 hover:bg-muted rounded-xl transition-colors relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full ring-2 ring-white" />
          </button>
        </div>
      </header>

      <div className="flex-1 p-4 space-y-6 overflow-y-auto pb-32">
        {/* Large Online Toggle */}
        <div className="flex justify-center py-4">
          <OnlineToggle 
            initialState={isOnline} 
            onToggle={setIsOnline} 
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {STATS.map((stat, i) => (
            <Card key={i} className="p-4 border-border bg-white rounded-card flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                <p className="text-base font-bold text-foreground font-tabular">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Incoming Requests Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[13px] font-bold text-muted-foreground uppercase tracking-widest">
              Live Requests
            </h3>
            {isOnline && (
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-success">
                <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                Live
              </span>
            )}
          </div>

          {!isOnline ? (
            <div className="bg-white border border-border border-dashed rounded-card p-12 text-center space-y-3">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Car className="w-8 h-8 text-muted-foreground opacity-30" />
              </div>
              <p className="text-sm font-medium text-muted-foreground">Go online to receive ride requests in your area.</p>
              <button 
                onClick={() => setIsOnline(true)}
                className="text-primary font-bold text-sm hover:underline"
              >
                Go Online Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Request Card Component would go here, or we redirect to requests Tab */}
              <Card 
                onClick={() => router.push("/driver/requests")}
                className="p-4 border-2 border-primary bg-primary/5 rounded-card flex items-center justify-between cursor-pointer active:scale-[0.99] transition-transform animate-in fade-in slide-in-from-bottom-2"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-primary/20 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">New Ride Request</p>
                    <p className="text-xs text-primary font-medium">₹160 offer · 1.2km away</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-primary" />
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
