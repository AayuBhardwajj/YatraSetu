"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  TrendingUp, 
  Star, 
  Clock, 
  Car, 
  ChevronRight, 
  Bell,
  MapPin,
  Navigation2,
  CheckCircle2,
  Zap,
  ArrowUpRight,
  Timer
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { cn } from "@/lib/utils";

const STATS = [
  { label: "Today's Earnings", value: "₹1,420", icon: TrendingUp, color: "text-success", bg: "bg-success-light" },
  { label: "Completed", value: "12", icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Rating", value: "4.8★", icon: Star, color: "text-warning", bg: "bg-warning-light" },
];

const RECENT_ACTIVITY = [
  { id: 1, type: "Ride", destination: "Railway Station", time: "2:45 PM", earning: "₹160", status: "Completed" },
  { id: 2, type: "Ride", destination: "Model Town", time: "1:20 PM", earning: "₹85", status: "Completed" },
  { id: 3, type: "Tip", destination: "Extra Tip", time: "1:25 PM", earning: "₹20", status: "Received" },
];

const HOT_ZONES = [
  { id: 1, name: "Sector 17 Market", surge: "1.5x", distance: "0.8 km" },
  { id: 2, name: "Elante Mall", surge: "1.2x", distance: "2.4 km" },
  { id: 3, name: "Chandigarh University", surge: "1.8x", distance: "5.2 km" },
];

export default function DriverDashboard() {
  const [showRequest, setShowRequest] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Simulate an incoming request after 5 seconds
    const timer = setTimeout(() => setShowRequest(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">
      {/* Left Column: Map & Stats (70%) */}
      <div className="w-[70%] h-full relative border-r border-border">
        <MapPlaceholder 
          height="100%" 
          showDriverDots={true} 
          showRequestPins={true} 
        />
        
        {/* Floating Stats Row */}
        <div className="absolute top-6 left-6 right-6 z-10 grid grid-cols-3 gap-6">
          {STATS.map((stat, i) => (
            <Card key={i} className="p-4 bg-white/90 backdrop-blur-md border-border shadow-xl rounded-2xl flex items-center space-x-4 animate-in slide-in-from-top-4 duration-500 delay-100">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shadow-inner", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{stat.label}</span>
                <span className="text-xl font-bold text-text-primary font-tabular tracking-tight">{stat.value}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Floating "New Request" Card */}
        {showRequest && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 w-[400px] animate-in slide-in-from-bottom-10 fade-in duration-500 zoom-in-95">
            <Card className="p-0 border-2 border-primary bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white animate-pulse">
                      <Zap className="w-5 h-5 fill-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-text-primary">New Ride Requested</h3>
                      <p className="text-xs text-primary font-bold uppercase tracking-wider">Premium Service</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary font-tabular">₹240</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-success rounded-full" />
                    <span className="text-sm font-semibold text-text-primary">Sector 17, Chandigarh</span>
                  </div>
                  <div className="w-px h-4 bg-border ml-1.5" />
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-danger rounded-full" />
                    <span className="text-sm font-semibold text-text-primary">Airport (IXC) Terminal 1</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 px-3 bg-muted rounded-xl">
                  <div className="flex items-center space-x-2">
                    <Timer className="w-4 h-4 text-text-muted" />
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">Expires in 12s</span>
                  </div>
                  <span className="text-xs font-bold text-text-secondary">4.2 km · 12 min away</span>
                </div>

                <div className="flex space-x-3">
                  <Button 
                    onClick={() => router.push("/active-ride")}
                    className="flex-1 h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold shadow-lg shadow-primary/20"
                  >
                    Accept Ride
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowRequest(false)}
                    className="w-20 h-14 border-border text-text-muted hover:bg-muted rounded-2xl"
                  >
                    Decline
                  </Button>
                </div>
              </div>
              <div className="h-1.5 w-full bg-muted">
                <div className="h-full bg-primary animate-progress-shrink transition-all duration-[12000ms] linear" />
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Right Column: Activity & Hot zones (30%) */}
      <aside className="w-[30%] h-full bg-white overflow-y-auto no-scrollbar p-8 space-y-10">
        
        {/* Upcoming/Recent Activity */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest">Recent Activity</h3>
            <Button variant="ghost" size="sm" className="text-primary font-bold h-auto p-0 hover:bg-transparent">See All</Button>
          </div>
          <div className="space-y-4">
            {RECENT_ACTIVITY.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-transparent hover:border-border transition-all">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-text-muted shadow-sm">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-text-primary">To {activity.destination}</span>
                    <span className="text-[11px] text-text-muted font-medium">{activity.time}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-text-primary">{activity.earning}</div>
                  <div className="text-[10px] font-bold text-success uppercase tracking-widest">{activity.status}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hot Zones */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest">Hot Zones Near You</h3>
            <Zap className="w-4 h-4 text-warning animate-bounce" />
          </div>
          <div className="space-y-4">
            {HOT_ZONES.map((zone) => (
              <Card key={zone.id} className="p-4 border-border hover:border-primary/30 transition-all cursor-pointer bg-[#fafbff] group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-2 opacity-10 blur-sm pointer-events-none transition-all group-hover:scale-150 group-hover:opacity-20">
                  <Navigation2 className="w-12 h-12 text-primary" />
                </div>
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{zone.name}</p>
                    <p className="text-[11px] text-text-muted font-medium">{zone.distance} away</p>
                  </div>
                  <div className="text-center">
                    <Badge className="bg-warning text-white border-transparent font-bold">
                      {zone.surge}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <Button variant="outline" className="w-full h-12 border-primary text-primary hover:bg-primary-light font-bold rounded-xl transition-all">
            Navigate to Hot Zone
          </Button>
        </section>

      </aside>
    </div>
  );
}
