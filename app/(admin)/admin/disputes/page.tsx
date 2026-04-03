"use client";

import React, { useState } from "react";
import { 
  AlertCircle, 
  Search, 
  Filter, 
  MessageSquare, 
  User, 
  Car, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  XCircle,
  MoreHorizontal,
  ChevronRight,
  ShieldAlert,
  MapPin,
  Scale,
  Zap,
  Info,
  Calendar,
  Check,
  X
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const DISPUTES = [
  { 
    id: "DISP-101", 
    user: "Arjun Singh", 
    driver: "Rajesh K.", 
    type: "Overcharge", 
    amount: "₹45", 
    status: "open", 
    date: "Today, 10:20 AM",
    reason: "The driver took a very long route and didn't follow Google Maps.",
    driverResponse: "There was heavy traffic on the main road, had to take alternate.",
    evidence: { gps: "Significant (2.4km deviation)", time: "Minor (+4m deviation)", rating: "4.8★ Driver" }
  },
  { 
    id: "DISP-102", 
    user: "Priya M.", 
    driver: "Gurpreet S.", 
    type: "No-show", 
    amount: "₹160", 
    status: "review", 
    date: "Today, 09:15 AM",
    reason: "Driver marked as arrived but was not at the location.",
    driverResponse: "Rider was not responding to calls at the gate.",
    evidence: { gps: "At Location (12m accuracy)", time: "Wait time: 8m", rating: "4.9★ Driver" }
  },
  { 
    id: "DISP-103", 
    user: "Amit V.", 
    driver: "Suresh P.", 
    type: "Route deviation", 
    amount: "₹85", 
    status: "resolved", 
    date: "Yesterday, 04:30 PM",
    reason: "Unprofessional behavior during the ride.",
    driverResponse: "Politely asked rider to not eat in the car.",
    evidence: { gps: "Standard Route", time: "On Time", rating: "4.2★ Driver" }
  },
];

export default function AdminDisputesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(DISPUTES[0].id);

  const filteredDisputes = DISPUTES.filter(d => 
    d.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedDispute = DISPUTES.find(d => d.id === selectedId) || DISPUTES[0];

  return (
    <div className="flex h-[calc(100vh-144px)] w-full overflow-hidden bg-background rounded-[32px] border border-border/50 shadow-2xl">
      
      {/* Left Column: Dispute Queue (40%) */}
      <div className="w-[40%] h-full flex flex-col border-r border-border bg-white overflow-hidden">
        <div className="p-8 border-b border-border space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Resolution Queue</h1>
            <Badge className="bg-danger-light text-danger border-transparent px-3 py-1 rounded-full font-bold">
              {DISPUTES.filter(d => d.status === "open").length} Critical
            </Badge>
          </div>
          
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <Input 
              placeholder="Search by ID or Name..." 
              className="pl-11 h-12 bg-muted/40 border-none rounded-2xl font-medium focus-visible:ring-primary/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
          {filteredDisputes.map((dispute) => (
            <Card 
              key={dispute.id}
              onClick={() => setSelectedId(dispute.id)}
              className={cn(
                "p-5 border-2 transition-all cursor-pointer group rounded-2xl relative overflow-hidden",
                selectedId === dispute.id 
                  ? "border-primary bg-white shadow-xl shadow-primary/5" 
                  : "border-transparent bg-muted/30 hover:bg-muted/50"
              )}
            >
              {dispute.status === "open" && (
                <div className="absolute top-0 left-0 w-1 h-full bg-danger" />
              )}
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{dispute.id}</span>
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{dispute.date}</span>
              </div>
              
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors">{dispute.type}</h3>
                  <div className="flex items-center text-xs font-medium text-text-muted">
                    {dispute.user} <ArrowRight className="w-3 h-3 mx-2 opacity-30" /> {dispute.driver}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-danger">{dispute.amount}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Right Column: Case Details & Resolution (60%) */}
      <div className="w-[60%] h-full flex flex-col bg-[#fcfdfe] relative">
        {selectedDispute ? (
          <>
            {/* Header Details */}
            <div className="p-10 border-b border-border flex items-center justify-between bg-white">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-muted rounded-[24px] flex items-center justify-center text-text-muted group-hover:scale-110 transition-transform">
                  <Scale className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-bold text-text-primary tracking-tight">{selectedDispute.type} Claim</h2>
                    <Badge className={cn(
                      "uppercase text-[10px] font-bold px-3 py-1 rounded-full",
                      selectedDispute.status === "open" ? "bg-danger text-white" : "bg-success text-white"
                    )}>
                      {selectedDispute.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-text-muted font-medium">Case ID: {selectedDispute.id} · Disputed Amount: <span className="text-danger font-bold">{selectedDispute.amount}</span></p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" className="h-11 rounded-xl border-border font-bold text-xs uppercase tracking-widest px-6 hover:bg-muted">
                  <Info className="w-4 h-4 mr-2" />
                  View Original Ride
                </Button>
              </div>
            </div>

            {/* Case Body */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-10 space-y-10">
              
              {/* Evidence Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-5 border-none bg-white rounded-2xl shadow-xl shadow-black/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">GPS Tracking</span>
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm font-bold text-text-primary">{selectedDispute.evidence.gps}</p>
                </Card>
                <Card className="p-5 border-none bg-white rounded-2xl shadow-xl shadow-black/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Timer Logs</span>
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm font-bold text-text-primary">{selectedDispute.evidence.time}</p>
                </Card>
                <Card className="p-5 border-none bg-white rounded-2xl shadow-xl shadow-black/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Driver Health</span>
                    <ShieldAlert className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm font-bold text-text-primary">{selectedDispute.evidence.rating}</p>
                </Card>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-text-muted">
                    <User className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Rider Narrative</h4>
                  </div>
                  <div className="p-6 bg-blue-50/50 rounded-[32px] border border-blue-100 italic text-sm text-text-primary leading-relaxed">
                    "{selectedDispute.reason}"
                  </div>
                  <p className="text-xs font-bold text-text-muted pl-4">— {selectedDispute.user}</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-text-muted">
                    <Car className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-widest">Driver Response</h4>
                  </div>
                  <div className="p-6 bg-emerald-50/50 rounded-[32px] border border-emerald-100 italic text-sm text-text-primary leading-relaxed">
                    "{selectedDispute.driverResponse}"
                  </div>
                  <p className="text-xs font-bold text-text-muted pl-4">— {selectedDispute.driver}</p>
                </div>
              </div>

              {/* Action Center */}
              <div className="pt-6 border-t border-border flex flex-col items-center space-y-6">
                <div className="flex items-center space-x-4 bg-muted/30 p-2 rounded-2xl">
                  <Button className="h-14 bg-primary text-white rounded-xl font-bold px-10 shadow-xl shadow-primary/10 transition-all hover:bg-primary/90 active:scale-95 space-x-3">
                    <Check className="w-5 h-5" />
                    <span>Favor Rider (Refund {selectedDispute.amount})</span>
                  </Button>
                  <Button className="h-14 bg-white border-2 border-primary text-primary rounded-xl font-bold px-10 hover:bg-primary-light transition-all active:scale-95 space-x-3">
                    <X className="w-5 h-5" />
                    <span>Reject Claim</span>
                  </Button>
                </div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">All resolutions are logged and final</p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 opacity-20">
            <Scale className="w-32 h-32 mb-6" />
            <h2 className="text-2xl font-bold">Select a case to resolve</h2>
          </div>
        )}
      </div>
    </div>
  );
}
