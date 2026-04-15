"use client";

import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MapPin, 
  Calendar, 
  Download, 
  ChevronRight,
  TrendingDown,
  PieChart,
  Target,
  Zap,
  ArrowUpRight,
  Clock,
  Activity,
  ShieldAlert,
  Car,
  AlertCircle,
  Check
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const PULSE_EVENTS = [
  { id: 1, type: "registration", user: "Vikram S.", time: "2m ago", text: "New Driver Registered", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
  { id: 2, type: "dispute", user: "Ticket #242", time: "5m ago", text: "New Dispute Opened", icon: AlertCircle, color: "text-danger", bg: "bg-danger-light" },
  { id: 3, type: "milestone", user: "System", time: "12m ago", text: "Daily Revenue Target Met", icon: Zap, color: "text-warning", bg: "bg-warning-light" },
  { id: 4, type: "ride", user: "Ride #882", time: "15m ago", text: "High Fare Ride Completed", icon: Car, color: "text-success", bg: "bg-success-light" },
];

const REVENUE_DATA = [
  { day: "Mon", value: 32000, height: "65%" },
  { day: "Tue", value: 38000, height: "75%" },
  { day: "Wed", value: 35000, height: "70%" },
  { day: "Thu", value: 42000, height: "85%" },
  { day: "Fri", value: 48000, height: "100%" },
  { day: "Sat", value: 45000, height: "90%" },
  { day: "Sun", value: 42800, height: "85%" },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-10 max-w-[1400px] mx-auto   duration-200">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Intelligence Dashboard</h1>
          <p className="text-sm text-text-muted font-medium mt-1">Real-time platform performance and system health across all sectors.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 bg-white border-border text-text-secondary hover:text-primary rounded-2xl font-bold px-6 border-2">
            <Calendar className="w-4.5 h-4.5 mr-2" />
            Last 24 Hours
          </Button>
          <Button className="h-12 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold px-8 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
            <Download className="w-4.5 h-4.5 mr-2" />
            Export System Logs
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="p-8 border-none bg-white rounded-[32px] shadow-xl shadow-black/5 space-y-6 group hover:shadow-primary/5 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <Activity className="w-7 h-7" />
            </div>
            <Badge className="bg-success-light text-success border-transparent px-3 py-1 rounded-full font-bold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
              12.5%
            </Badge>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">Total Platform Trips</span>
            <h3 className="text-4xl font-bold text-text-primary font-tabular tracking-tighter">2,420</h3>
          </div>
        </Card>

        <Card className="p-8 border-none bg-white rounded-[32px] shadow-xl shadow-black/5 space-y-6 group hover:shadow-primary/5 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 bg-success-light rounded-2xl flex items-center justify-center text-success group-hover:scale-110 transition-transform">
              <TrendingUp className="w-7 h-7" />
            </div>
            <Badge className="bg-success-light text-success border-transparent px-3 py-1 rounded-full font-bold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
              8.2%
            </Badge>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">Gross Platform Revenue</span>
            <h3 className="text-4xl font-bold text-text-primary font-tabular tracking-tighter">₹42,800</h3>
          </div>
        </Card>

        <Card className="p-8 border-none bg-white rounded-[32px] shadow-xl shadow-black/5 space-y-6 group hover:shadow-primary/5 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <Users className="w-7 h-7" />
            </div>
            <Badge className="bg-danger-light text-danger border-transparent px-3 py-1 rounded-full font-bold flex items-center">
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
              2.4%
            </Badge>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">Total Active Drivers</span>
            <h3 className="text-4xl font-bold text-text-primary font-tabular tracking-tighter">142</h3>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Growth Chart Area */}
        <Card className="lg:col-span-8 p-10 border-none bg-white rounded-[40px] shadow-xl shadow-black/5 flex flex-col space-y-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-text-primary tracking-tight">Revenue Growth Intelligence</h3>
              <p className="text-sm text-text-muted font-medium">Daily platform revenue trends for the current week.</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-8 border-primary/20 bg-primary/5 text-primary font-bold px-4">
                Target: ₹50,000 / day
              </Badge>
            </div>
          </div>

          <div className="flex-1 flex items-end justify-between gap-6 px-4 h-[300px]">
            {REVENUE_DATA.map((data, i) => (
              <div key={i} className="flex-1 flex flex-col items-center group/chart">
                <div className="relative w-full flex flex-col items-center">
                  <div className="absolute bottom-full mb-3 opacity-0 group-hover/chart:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-text-primary text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xl whitespace-nowrap">
                      ₹{data.value.toLocaleString()}
                    </div>
                  </div>
                  <div 
                    className="w-full bg-muted/40 group-hover/chart:bg-primary transition-all duration-200 rounded-t-2xl relative"
                    style={{ height: data.height }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover/chart:opacity-100 transition-opacity" />
                  </div>
                </div>
                <span className="text-[10px] font-bold mt-4 text-text-muted uppercase tracking-widest">{data.day}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Live Pulse Feed */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center justify-between pl-1">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest">System Pulse</h3>
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-success uppercase tracking-widest">Real-time</span>
            </div>
          </div>

          <div className="space-y-4">
            {PULSE_EVENTS.map((event) => (
              <Card key={event.id} className="p-5 border-none bg-white rounded-3xl shadow-xl shadow-black/[0.03] space-y-4 hover:shadow-black/[0.06] transition-all group cursor-pointer border border-transparent hover:border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", event.bg, event.color)}>
                      <event.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-text-primary">{event.text}</h4>
                      <p className="text-[11px] text-text-muted font-medium">{event.user}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-tight">{event.time}</span>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6 border-none bg-gradient-to-br from-text-primary to-text-secondary text-white rounded-3xl shadow-xl shadow-black/10 overflow-hidden relative">
            <ShieldAlert className="absolute top-[-10%] right-[-10%] w-24 h-24 opacity-10" />
            <div className="relative z-10 space-y-4">
              <div>
                <p className="text-xs font-bold opacity-60 uppercase tracking-widest mb-1">Incident Report</p>
                <h4 className="text-lg font-bold">Network Stability</h4>
              </div>
              <div className="flex items-center space-x-2 py-1 px-3 bg-white/10 rounded-full w-fit">
                <Check className="w-4 h-4 text-success" />
                <span className="text-[10px] font-bold uppercase tracking-widest">All Nodes Operational</span>
              </div>
              <Button variant="outline" className="w-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40 h-10 font-bold text-xs uppercase tracking-widest rounded-xl transition-all">
                Run Diagnostics
              </Button>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}
