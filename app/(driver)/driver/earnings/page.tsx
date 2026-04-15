"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  TrendingUp, 
  Calendar, 
  ChevronRight, 
  Activity, 
  ArrowUpRight, 
  Clock, 
  Target,
  Download,
  IndianRupee,
  Wallet,
  ArrowDownCircle,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const DAILY_STATS = [
  { day: "Mon", amount: 1200, height: "60%" },
  { day: "Tue", amount: 1500, height: "75%" },
  { day: "Wed", amount: 900, height: "45%" },
  { day: "Thu", amount: 1800, height: "90%" },
  { day: "Fri", amount: 1400, height: "70%" },
  { day: "Sat", amount: 2100, height: "100%" },
  { day: "Sun", amount: 1100, height: "55%" },
];

const PAYOUT_HISTORY = [
  { id: "P1", date: "01 Apr 2024", amount: "₹5,420", status: "Paid", bank: "HDFC Bank •••• 4231" },
  { id: "P2", date: "25 Mar 2024", amount: "₹4,890", status: "Paid", bank: "SBI Bank •••• 9812" },
  { id: "P3", date: "18 Mar 2024", amount: "₹6,120", status: "Paid", bank: "HDFC Bank •••• 4231" },
];

export default function DriverEarningsPage() {
  const [period, setPeriod] = useState("week");
  const router = useRouter();

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-muted/30 flex justify-center p-8 overflow-y-auto no-scrollbar">
      <div className="w-full max-w-[1000px] space-y-8   duration-200">
        
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-bold text-text-primary underline decoration-success/20 underline-offset-8">Earnings</h1>
          <div className="flex items-center space-x-3">
            <Button variant="outline" className="bg-white border-border text-text-secondary hover:text-primary rounded-xl font-bold">
              <Download className="w-4 h-4 mr-2" />
              Statement
            </Button>
            <Button className="bg-success hover:bg-success/90 text-white rounded-xl font-bold px-6 shadow-lg shadow-success/10 transition-all active:scale-[0.98]">
              Withdraw Funds
            </Button>
          </div>
        </div>

        {/* Top: Large Earnings Card (Glassmorphism Style) */}
        <Card className="p-10 border-none bg-gradient-to-br from-success to-emerald-600 text-white rounded-[32px] shadow-2xl shadow-success/20 relative overflow-hidden group">
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-[2000ms]" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="text-sm font-bold opacity-70 uppercase tracking-widest pl-1">Total Earnings (This Week)</span>
                <div className="text-[64px] font-bold font-tabular leading-tight tracking-tighter">
                  ₹8,420.50
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className="bg-white/20 text-white border-none px-4 py-1.5 rounded-full font-bold flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  +12.5% from last week
                </Badge>
                <div className="flex items-center text-white/70 text-sm font-bold">
                  <Clock className="w-4 h-4 mr-2" />
                  Cycle ends in 2 days
                </div>
              </div>
            </div>

            {/* Weekly Graph (Simple CSS Bar Chart) */}
            <div className="h-[180px] flex items-end justify-between gap-3 px-4">
              {DAILY_STATS.map((stat) => (
                <div key={stat.day} className="flex-1 flex flex-col items-center group/bar">
                  <div className="relative w-full flex flex-col items-center">
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover/bar:opacity-100 transition-opacity translate-y-1 group-hover/bar:translate-y-0 duration-300">
                      <div className="bg-white text-success text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                        ₹{stat.amount}
                      </div>
                    </div>
                    <div 
                      className="w-full bg-white/20 group-hover/bar:bg-white/40 transition-all duration-200 rounded-t-lg"
                      style={{ height: stat.height }}
                    />
                  </div>
                  <span className="text-[10px] font-bold mt-3 opacity-60 uppercase">{stat.day}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Middle: Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 border-none bg-white rounded-2xl shadow-xl shadow-black/5 flex items-center space-x-5 group hover:shadow-primary/5 transition-all">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <Clock className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none mb-1.5">Online Hours</span>
              <span className="text-2xl font-bold text-text-primary font-tabular tracking-tight">32h 15m</span>
            </div>
          </Card>

          <Card className="p-6 border-none bg-white rounded-2xl shadow-xl shadow-black/5 flex items-center space-x-5 group hover:shadow-primary/5 transition-all">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
              <BarChart3 className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none mb-1.5">Total Trips</span>
              <span className="text-2xl font-bold text-text-primary font-tabular tracking-tight">142</span>
            </div>
          </Card>

          <Card className="p-6 border-none bg-white rounded-2xl shadow-xl shadow-black/5 flex items-center space-x-5 group hover:shadow-primary/5 transition-all">
            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
              <IndianRupee className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none mb-1.5">Collected Tips</span>
              <span className="text-2xl font-bold text-text-primary font-tabular tracking-tight">₹420.00</span>
            </div>
          </Card>
        </div>

        {/* Bottom: Payout History */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest pl-1">Payout History</h3>
            <Button variant="ghost" className="text-primary font-bold text-sm h-auto p-0 hover:bg-transparent">View Reports</Button>
          </div>
          
          <div className="space-y-4">
            {PAYOUT_HISTORY.map((payout) => (
              <Card key={payout.id} className="p-6 border-border hover:border-success/30 transition-all bg-white rounded-2xl flex items-center justify-between group">
                <div className="flex items-center space-x-5">
                  <div className="w-12 h-12 bg-muted group-hover:bg-success-light rounded-2xl flex items-center justify-center text-text-muted group-hover:text-success transition-colors">
                    <ArrowDownCircle className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[16px] font-bold text-text-primary">{payout.amount} Transferred</span>
                    <span className="text-xs text-text-muted font-medium">{payout.bank} • {payout.date}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="px-3 py-1 bg-success-light text-success font-bold text-[10px] uppercase tracking-widest rounded-full">
                    {payout.status}
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-success transition-all group-hover:translate-x-1" />
                </div>
              </Card>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
