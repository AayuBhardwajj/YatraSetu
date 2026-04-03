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
  Target
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics Insights</h1>
          <p className="text-sm text-muted-foreground mt-1">Data-driven performance metrics for the Zipp platform.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-border h-10 px-4 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-muted transition-all">
             <Calendar className="w-4 h-4 text-muted-foreground" />
             <span className="text-xs font-bold text-foreground uppercase tracking-widest">Last 30 Days</span>
          </div>
          <Button className="h-10 bg-primary text-white hover:bg-primary/90 text-xs font-bold uppercase tracking-widest">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Top Level Highlight Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Conversion Rate", value: "68.2%", diff: "+4.1%", trend: "up", color: "text-primary" },
          { label: "Avg Ride Revenue", value: "₹192.40", diff: "+₹12.00", trend: "up", color: "text-success" },
          { label: "User Retention", value: "42.5%", diff: "-1.2%", trend: "down", color: "text-danger" },
          { label: "Driver Churn", value: "3.4%", diff: "-0.5%", trend: "up", color: "text-success" },
        ].map((stat, i) => (
          <Card key={i} className="p-5 bg-white border-border rounded-card flex flex-col justify-between">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
               <h3 className="text-2xl font-bold text-foreground font-tabular">{stat.value}</h3>
               <div className={cn(
                 "flex items-center text-[10px] font-bold mb-1",
                 stat.trend === "up" ? "text-success" : "text-danger"
               )}>
                 {stat.trend === "up" ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                 {stat.diff}
               </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-24">
        {/* Revenue Trend Area */}
        <Card className="lg:col-span-2 p-6 bg-white border-border rounded-card flex flex-col min-h-[400px]">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                 </div>
                 <div>
                    <h3 className="text-sm font-bold text-foreground">Revenue Over Time</h3>
                    <p className="text-[11px] text-muted-foreground">Daily platform revenue across all cities</p>
                 </div>
              </div>
              <div className="flex gap-2">
                 <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 text-[10px] font-bold uppercase py-1">Revenue: ₹12.4M</Badge>
              </div>
           </div>
           
           {/* Chart Placeholder */}
           <div className="flex-1 rounded-xl bg-muted/20 border border-dashed border-border flex flex-col items-center justify-center text-center p-12 space-y-3">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center">
                 <BarChart3 className="w-8 h-8 text-muted-foreground opacity-30" />
              </div>
              <div>
                 <p className="text-sm font-bold text-foreground">Revenue Trend Chart</p>
                 <p className="text-xs text-muted-foreground mt-1">Area chart showing daily gross revenue vs target revenue.</p>
              </div>
           </div>
        </Card>

        {/* Trips by Hour Chart */}
        <Card className="p-6 bg-white border-border rounded-card flex flex-col h-[320px]">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Trips by hour</h3>
              <Target className="w-4 h-4 text-muted-foreground" />
           </div>
           <div className="flex-1 rounded-xl bg-muted/20 border border-dashed border-border flex items-center justify-center text-center p-6 space-y-2">
              <div>
                 <p className="text-[11px] font-bold text-foreground font-tabular leading-tight">Bar chart loads here</p>
                 <p className="text-[10px] text-muted-foreground">Hourly trip volume peak identification.</p>
              </div>
           </div>
        </Card>

        {/* Negotiation Acceptance Chart */}
        <Card className="p-6 bg-white border-border rounded-card flex flex-col h-[320px]">
           <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest pl-1">Negotiation Success</h3>
              <PieChart className="w-4 h-4 text-muted-foreground" />
           </div>
           <div className="flex-1 rounded-xl bg-muted/20 border border-dashed border-border flex items-center justify-center text-center p-6 space-y-2">
              <div>
                 <p className="text-[11px] font-bold text-foreground font-tabular leading-tight">Donut chart loads here</p>
                 <p className="text-[10px] text-muted-foreground">Ratio of Accepted offers vs Countered vs Expired.</p>
              </div>
           </div>
        </Card>
      </div>
    </div>
  );
}
