"use client";

import React from "react";
import { 
  Plus, 
  Send, 
  History, 
  Settings, 
  ArrowUpRight, 
  ArrowDownLeft,
  CreditCard,
  Wallet as WalletIcon,
  Download,
  MoreVertical,
  CheckCircle2,
  Clock,
  Smartphone,
  ShieldCheck,
  TrendingUp,
  Zap,
  ArrowRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TRANSACTIONS = [
  { id: "TX-9021", label: "Ride to Railway Station", amount: -160, date: "Today, 4:45 PM", type: "debit", status: "Success" },
  { id: "TX-9022", label: "Added from HDFC Bank", amount: 500, date: "Yesterday, 11:20 AM", type: "credit", status: "Success" },
  { id: "TX-9023", label: "Bike ride to Sector 17", amount: -45, date: "10 Oct, 09:15 PM", type: "debit", status: "Success" },
  { id: "TX-9024", label: "Refund: Cancelled Trip", amount: 130, date: "08 Oct, 02:45 PM", type: "credit", status: "Success" },
  { id: "TX-9025", label: "Monthly ZippPass", amount: -299, date: "01 Oct, 10:00 AM", type: "debit", status: "Success" },
];

const CARDS = [
  { provider: "Visa", last4: "4242", expiry: "12/26", color: "bg-gradient-to-br from-gray-900 to-gray-800" },
  { provider: "Mastercard", last4: "8891", expiry: "08/25", color: "bg-gradient-to-br from-blue-600 to-blue-400" },
];

export default function WalletPage() {
  return (
    <div className="max-w-[1100px] mx-auto p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Financial Hub</h1>
          <p className="text-sm text-text-muted font-medium mt-1">Manage your balance, cards, and rewards.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-10 border border-border text-text-secondary hover:text-primary rounded-xl font-bold px-4 text-sm">
            <Download className="w-4 h-4 mr-1.5" />
            Statement
          </Button>
          <Button className="h-10 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold px-5 shadow-lg shadow-primary/15 text-sm">
            <Plus className="w-4 h-4 mr-1.5" />
            Add Funds
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Balance & Cards */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Balance Card */}
          <Card className="p-7 border-none bg-gradient-to-br from-[#6C47FF] to-[#9D85FF] text-white rounded-3xl shadow-2xl relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-56 h-56 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-md">
                  <WalletIcon className="w-4 h-4" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em]">ZippWallet</span>
                </div>
                <div className="flex items-center gap-1.5 text-white/60 text-[9px] font-bold tracking-wider uppercase">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Secure
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-[10px] font-bold opacity-60 uppercase tracking-wider">Available Balance</span>
                <div className="text-4xl sm:text-5xl font-bold font-tabular leading-none tracking-tighter">
                  ₹2,480
                  <span className="text-2xl sm:text-3xl opacity-60">.20</span>
                </div>
                <div className="flex items-center gap-1.5 pt-2">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">+12% from last month</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button className="h-11 bg-white text-primary hover:bg-white/90 font-bold rounded-xl shadow-lg text-sm">
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Transfer
                </Button>
                <Button className="h-11 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-xl backdrop-blur-md text-sm">
                  Cashback
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 bg-white border border-border/30 rounded-2xl shadow-sm space-y-3">
                <div className="w-9 h-9 bg-primary-light rounded-xl flex items-center justify-center text-primary">
                  <Zap className="w-4 h-4 fill-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Rewards</p>
                  <p className="text-lg font-bold text-text-primary">1,240 <span className="text-xs text-text-muted font-medium">pts</span></p>
                </div>
            </div>
            <div className="p-5 bg-white border border-border/30 rounded-2xl shadow-sm space-y-3">
                <div className="w-9 h-9 bg-success/10 rounded-xl flex items-center justify-center text-success">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Auto-Reload</p>
                  <p className="text-lg font-bold text-text-primary">Enabled</p>
                </div>
            </div>
          </div>

          {/* Linked Cards Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-[0.15em]">Saved Methods</h3>
              <Button variant="ghost" className="text-primary font-bold text-xs p-0 h-auto">Add New</Button>
            </div>
            <div className="space-y-3">
              {CARDS.map((card, i) => (
                <div key={i} className={cn("p-5 rounded-2xl text-white flex items-center justify-between group cursor-pointer hover:scale-[1.01] transition-all", card.color)}>
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md flex-shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold tracking-widest">•••• {card.last4}</p>
                      <p className="text-[10px] font-medium opacity-50 uppercase truncate">{card.provider} · Exp {card.expiry}</p>
                    </div>
                  </div>
                  <Badge className="bg-white/10 text-white border-none group-hover:bg-white group-hover:text-black transition-colors text-[10px] flex-shrink-0">Default</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Transactions */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-none bg-white rounded-3xl shadow-lg shadow-black/[0.02] overflow-hidden">
            <div className="p-6 border-b border-border/30 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center text-text-secondary flex-shrink-0">
                  <History className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-text-primary tracking-tight">Activity Log</h3>
              </div>
              <div className="flex items-center gap-1 p-1 bg-muted rounded-xl">
                {["History", "Earnings", "Refunds"].map((tab) => (
                  <button key={tab} className={cn(
                    "px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                    tab === "History" ? "bg-white text-primary shadow-sm" : "text-text-muted hover:text-text-primary"
                  )}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="divide-y divide-border/20">
              {TRANSACTIONS.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-5 hover:bg-muted/20 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 flex-shrink-0",
                      tx.type === "credit" ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                    )}>
                      {tx.type === "credit" ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors truncate">{tx.label}</p>
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{tx.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0 ml-3">
                    <Badge className="bg-success/10 text-success border-none text-[9px] font-bold uppercase px-2 py-0.5 rounded-full hidden sm:flex">
                      {tx.status}
                    </Badge>
                    <p className={cn(
                      "text-base font-bold font-tabular tracking-tight",
                      tx.type === "credit" ? "text-success" : "text-text-primary"
                    )}>
                      {tx.type === "credit" ? "+" : "-"}₹{Math.abs(tx.amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 border-t border-border/30 flex items-center justify-center">
              <Button variant="ghost" className="text-primary font-bold uppercase tracking-[0.15em] text-[11px] hover:bg-primary-light">
                Load More
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </div>
          </Card>

          {/* Security Banner */}
          <div className="p-6 bg-muted/30 rounded-2xl border border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-primary/5 flex-shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div className="min-w-0">
                <h4 className="text-base font-bold text-text-primary">Securing your finances</h4>
                <p className="text-sm text-text-muted font-medium">256-bit encryption with multi-factor auth.</p>
              </div>
            </div>
            <Button variant="outline" className="h-10 border border-primary text-primary hover:bg-primary-light font-bold rounded-xl px-6 text-sm flex-shrink-0">
              Audit Logs
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
