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
    <div className="max-w-[1200px] mx-auto p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-text-primary tracking-tight">Financial Hub</h1>
          <p className="text-sm text-text-muted font-medium mt-2">Manage your balance, cards, and reward points.</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="h-12 border-2 border-border text-text-secondary hover:text-primary rounded-2xl font-bold px-6">
            <Download className="w-4 h-4 mr-2" />
            Statement
          </Button>
          <Button className="h-12 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold px-8 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
            <Plus className="w-4 h-4 mr-2" />
            Add Funds
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Balance & Cards (5 Columns) */}
        <div className="lg:col-span-5 space-y-10">
          
          {/* Main Balance Card */}
          <Card className="p-10 border-none bg-gradient-to-br from-[#6C47FF] to-[#9D85FF] text-white rounded-[40px] shadow-2xl relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-white/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10 space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md">
                  <WalletIcon className="w-5 h-5" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">ZippWallet</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-[10px] font-bold tracking-widest uppercase">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Secure
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-xs font-bold opacity-70 uppercase tracking-widest">Available Balance</span>
                <div className="text-[64px] font-bold font-tabular leading-none tracking-tighter">
                  ₹2,480.20
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <TrendingUp className="w-4 h-4 text-emerald-300" />
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">+12% from last month</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button className="h-14 bg-white text-primary hover:bg-white/90 font-bold rounded-2xl shadow-xl transition-all active:scale-[0.95]">
                  <Send className="w-4 h-4 mr-2" />
                  Transfer
                </Button>
                <Button className="h-14 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl backdrop-blur-md transition-all active:scale-[0.95]">
                  Cashback Settings
                </Button>
              </div>
            </div>
          </Card>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-white border border-border/50 rounded-[32px] shadow-sm space-y-4">
                <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center text-primary">
                  <Zap className="w-5 h-5 fill-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">ZippRewards</p>
                  <p className="text-xl font-bold text-text-primary">1,240 <span className="text-xs text-text-muted font-medium">pts</span></p>
                </div>
            </div>
            <div className="p-6 bg-white border border-border/50 rounded-[32px] shadow-sm space-y-4">
                <div className="w-10 h-10 bg-success-light rounded-xl flex items-center justify-center text-success">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Auto-Reload</p>
                  <p className="text-xl font-bold text-text-primary">Enabled</p>
                </div>
            </div>
          </div>

          {/* Linked Cards Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold text-text-secondary uppercase tracking-[0.2em]">Saved Methods</h3>
              <Button variant="ghost" className="text-primary font-bold text-xs p-0 h-auto">Add New</Button>
            </div>
            <div className="space-y-4">
              {CARDS.map((card, i) => (
                <div key={i} className={cn("p-6 rounded-[28px] text-white flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-all", card.color)}>
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold tracking-widest">•••• {card.last4}</p>
                      <p className="text-[10px] font-medium opacity-60 uppercase">{card.provider} · Exp {card.expiry}</p>
                    </div>
                  </div>
                  <Badge className="bg-white/10 text-white border-none group-hover:bg-white group-hover:text-black transition-colors">Default</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Transactions (7 Columns) */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-8">
          <Card className="border-none bg-white rounded-[40px] shadow-xl shadow-black/[0.03] overflow-hidden">
            <div className="p-10 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-text-secondary">
                  <History className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-text-primary tracking-tight">Activity Log</h3>
              </div>
              <div className="flex items-center gap-2 p-1 bg-muted rounded-xl">
                {["History", "Earnings", "Refunds"].map((tab) => (
                  <button key={tab} className={cn(
                    "px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all",
                    tab === "History" ? "bg-white text-primary shadow-sm" : "text-text-muted hover:text-text-primary"
                  )}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-2">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="px-8 py-5 text-[10px] font-bold text-text-muted uppercase tracking-[0.15em]">Transaction Details</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-text-muted uppercase tracking-[0.15em]">Status</th>
                    <th className="px-8 py-5 text-[10px] font-bold text-text-muted uppercase tracking-[0.15em] text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {TRANSACTIONS.map((tx) => (
                    <tr key={tx.id} className="group hover:bg-muted/30 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                            tx.type === "credit" ? "bg-success-light text-success" : "bg-danger-light text-danger"
                          )}>
                            {tx.type === "credit" ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{tx.label}</p>
                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{tx.date}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge className="bg-success-light text-success border-none text-[9px] font-bold uppercase px-3 py-1 rounded-full">
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <p className={cn(
                          "text-lg font-bold font-tabular tracking-tight",
                          tx.type === "credit" ? "text-success" : "text-text-primary"
                        )}>
                          {tx.type === "credit" ? "+" : "-"}₹{Math.abs(tx.amount).toFixed(2)}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-10 border-t border-border flex items-center justify-center">
              <Button variant="ghost" className="text-primary font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-primary-light">
                Load More Records
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>

          {/* Security Banner */}
          <div className="p-8 bg-muted/40 rounded-[32px] border border-border/50 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-primary shadow-xl shadow-primary/5">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-text-primary">Securing your finances</h4>
                <p className="text-sm text-text-muted font-medium">All transactions use 256-bit encryption with multi-factor authentication.</p>
              </div>
            </div>
            <Button variant="outline" className="h-12 border-2 border-primary text-primary hover:bg-primary-light font-bold rounded-xl px-10">
              Audit Logs
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
