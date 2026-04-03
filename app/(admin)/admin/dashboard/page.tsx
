"use client";

import React from "react";
import { 
  Users, 
  MapPin, 
  IndianRupee, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  MoreHorizontal,
  ChevronRight,
  Download,
  Settings2
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPlaceholder } from "@/components/shared/MapPlaceholder";
import { cn } from "@/lib/utils";

const STATS = [
  { label: "Active Rides", value: "47", diff: "+12%", trend: "up", icon: MapPin, color: "text-success", bg: "bg-success/10" },
  { label: "Online Drivers", value: "134", diff: "+5%", trend: "up", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
  { label: "Today Revenue", value: "₹18,420", diff: "-2.4%", trend: "down", icon: IndianRupee, color: "text-primary", bg: "bg-primary/10" },
  { label: "Pending Disputes", value: "3", diff: "0", trend: "stable", icon: AlertCircle, color: "text-danger", bg: "bg-danger/10" },
];

const LIVE_RIDES = [
  { id: "R-9421", user: "Arjun S.", driver: "Rajesh K.", route: "Sec 17 → Airport", price: "₹240", status: "ongoing", time: "12m left" },
  { id: "R-9422", user: "Priya M.", driver: "Gurpreet S.", route: "MBD Mall → Stn", price: "₹160", status: "negotiating", time: "2m left" },
  { id: "R-9423", user: "Amit V.", driver: "Suresh P.", route: "Model Town → Civil Lines", price: "₹85", status: "completed", time: "2m ago" },
  { id: "R-9424", user: "Neha K.", driver: "Vikram R.", route: "Zirakpur → Phase 7", price: "₹310", status: "cancelled", time: "15m ago" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Operations Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time platform overview for Chandigarh/Ludhiana zone.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 text-sm font-bold bg-white text-foreground hover:bg-muted transition-all">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button className="h-10 text-sm font-bold bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 transition-all">
            <Settings2 className="w-4 h-4 mr-2" />
            Pricing Config
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <Card key={i} className="p-5 bg-white border-border rounded-card flex flex-col justify-between hover:shadow-lg hover:shadow-muted-foreground/5 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", stat.bg)}>
                <stat.icon className={cn("w-5 h-5", stat.color)} />
              </div>
              <div className={cn(
                "flex items-center text-[11px] font-bold",
                stat.trend === "up" ? "text-success" : stat.trend === "down" ? "text-danger" : "text-muted-foreground"
              )}>
                {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : stat.trend === "down" ? <ArrowDownRight className="w-3 h-3 mr-0.5" /> : null}
                {stat.diff && stat.diff !== "0" ? stat.diff : "Stable"}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground tracking-tight font-tabular">{stat.value}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
                {stat.label}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Dynamic Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Live Rides Table */}
        <Card className="lg:col-span-3 bg-white border-border rounded-card overflow-hidden">
          <div className="p-5 border-b border-border flex items-center justify-between bg-muted/20">
            <h3 className="text-sm font-bold text-foreground">Live & Recent Rides</h3>
            <button className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-muted/10">
                  <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">ID</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">User / Driver</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Route</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Pricing</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {LIVE_RIDES.map((ride) => (
                  <tr key={ride.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-5 py-4">
                      <span className="text-[12px] font-bold text-foreground font-tabular">{ride.id}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[13px] font-bold text-foreground">{ride.user}</p>
                      <p className="text-[11px] text-muted-foreground">Driver: {ride.driver}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-[12px] font-medium text-foreground">{ride.route}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{ride.time}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-[13px] font-bold text-foreground font-tabular">{ride.price}</span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "uppercase text-[9px] font-bold px-2 py-0.5 border-transparent",
                          ride.status === "ongoing" ? "bg-success/10 text-success" : 
                          ride.status === "negotiating" ? "bg-warning/10 text-warning" :
                          ride.status === "completed" ? "bg-muted text-muted-foreground" :
                          "bg-danger/10 text-danger"
                        )}
                      >
                        {ride.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right: Supply/Demand Mini Map */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="h-[320px] bg-[#1a1a2e] rounded-card overflow-hidden border-border relative">
            <MapPlaceholder />
            <div className="absolute top-4 left-4 z-20">
               <Badge className="bg-primary/20 backdrop-blur-md border-primary/30 text-primary text-[10px] uppercase font-bold px-2 py-1">
                 Live Supply Map
               </Badge>
            </div>
            <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between gap-3">
               <div className="bg-white/10 backdrop-blur-md border border-white/10 p-2 rounded-lg flex-1">
                 <p className="text-[9px] font-bold text-white/60 uppercase">Supply</p>
                 <p className="text-sm font-bold text-white">134 Drivers</p>
               </div>
               <div className="bg-white/10 backdrop-blur-md border border-white/10 p-2 rounded-lg flex-1">
                 <p className="text-[9px] font-bold text-white/60 uppercase">Demand</p>
                 <p className="text-sm font-bold text-white">82 Users</p>
               </div>
            </div>
          </Card>

          <Card className="p-5 border-border bg-white rounded-card">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Pricing Health</h4>
            <div className="space-y-4">
              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-[11px] font-bold inline-block text-primary uppercase tracking-tighter">Negotiation Success Rate</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold inline-block text-primary">84%</span>
                  </div>
                </div>
                <div className="overflow-hidden h-1.5 text-xs flex rounded bg-primary/10">
                  <div style={{ width: "84%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                </div>
              </div>
              <div className="relative pt-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-[11px] font-bold inline-block text-success uppercase tracking-tighter">Driver Acceptance Rate</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold inline-block text-success">92%</span>
                  </div>
                </div>
                <div className="overflow-hidden h-1.5 text-xs flex rounded bg-success/10">
                  <div style={{ width: "92%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-success"></div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
