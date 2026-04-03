"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, Calendar, ChevronRight, Activity, ArrowUpRight, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const RECENT_TRIPS = [
  { id: 1, time: "11:20 AM", from: "Sector 17", to: "Chandigarh Airport", amount: 240, status: "completed" },
  { id: 2, time: "10:15 AM", from: "MBD Mall", to: "Ludhiana Stn", amount: 160, status: "completed" },
  { id: 3, time: "08:45 AM", from: "Saraba Nagar", to: "Model Town", amount: 85, status: "completed" },
];

export default function DriverEarningsPage() {
  const [period, setPeriod] = useState("week");
  const router = useRouter();

  const earnings = period === "today" ? "₹840" : period === "week" ? "₹5,420" : "₹24,800";
  const trips = period === "today" ? "12" : period === "week" ? "47" : "184";

  return (
    <div className="flex flex-col min-h-screen bg-muted/30">
      {/* Header */}
      <header className="p-4 bg-white border-b border-border sticky top-0 z-10">
        <h1 className="heading-sm text-foreground">Earnings</h1>
      </header>

      <div className="flex-1 p-4 space-y-6 overflow-y-auto pb-32">
        {/* Period Selector */}
        <Tabs defaultValue="week" className="w-full" onValueChange={setPeriod}>
          <TabsList className="grid grid-cols-3 w-full bg-muted/50 p-1 h-12 rounded-pill">
            <TabsTrigger value="today" className="rounded-pill font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Today</TabsTrigger>
            <TabsTrigger value="week" className="rounded-pill font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Week</TabsTrigger>
            <TabsTrigger value="month" className="rounded-pill font-bold text-xs uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm">Month</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Earnings Card */}
        <Card className="p-6 bg-primary border-primary rounded-card text-white relative overflow-hidden shadow-xl shadow-primary/20">
          <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4">
            <Activity className="w-32 h-32" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[12px] font-bold text-white/70 uppercase tracking-widest">Total Earnings</span>
              <TrendingUp className="w-4 h-4 text-white/50" />
            </div>
            <h2 className="text-[44px] font-bold font-tabular leading-none mb-6">
              {earnings}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-tighter mb-1">Total Trips</p>
                <div className="flex items-end gap-1">
                  <span className="text-xl font-bold font-tabular">{trips}</span>
                  <span className="text-[10px] font-medium text-white/50 mb-1">trips</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-tighter mb-1">Avg per trip</p>
                <div className="flex items-end gap-1">
                  <span className="text-xl font-bold font-tabular">₹115</span>
                  <ArrowUpRight className="w-3 h-3 text-success mb-1.5" />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Payout Status Section */}
        <Card className="p-4 border-2 border-dashed border-border bg-white rounded-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center">
              <Target className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[13px] font-bold text-foreground">₹890 pending</p>
              <p className="text-[11px] text-muted-foreground">Next payout: Friday, 4th April</p>
            </div>
          </div>
          <button className="text-primary font-bold text-xs hover:underline">Details</button>
        </Card>

        {/* Transaction History */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[13px] font-bold text-muted-foreground uppercase tracking-widest pl-1">
              Recent Trips
            </h3>
            <button className="text-[11px] font-bold text-primary flex items-center gap-1">
              View History <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-0.5">
            {RECENT_TRIPS.map((trip) => (
              <Card key={trip.id} className="p-4 border-border bg-white rounded-xl mb-2 flex items-center justify-between active:scale-[0.99] transition-transform">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-muted-foreground opacity-50" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-bold text-foreground font-tabular">{trip.time}</span>
                       <Badge variant="outline" className="text-[9px] h-4 uppercase border-success/30 text-success bg-success/5 px-1 font-bold">
                          {trip.status}
                       </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[160px]">
                      {trip.from} → {trip.to}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-base font-bold text-foreground font-tabular">₹{trip.amount}</p>
                   <p className="text-[10px] text-success font-medium">Earned</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
