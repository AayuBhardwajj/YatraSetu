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
  ShieldAlert
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const DISPUTES = [
  { id: "DISP-101", user: "Arjun Singh", driver: "Rajesh K.", type: "Overcharge", amount: "₹45", status: "open", date: "Today, 10:20 AM" },
  { id: "DISP-102", user: "Priya M.", driver: "Gurpreet S.", type: "No-show", amount: "₹160", status: "review", date: "Today, 09:15 AM" },
  { id: "DISP-103", user: "Amit V.", driver: "Suresh P.", type: "Route deviation", amount: "₹85", status: "resolved", date: "Yesterday, 04:30 PM" },
  { id: "DISP-104", user: "Neha K.", driver: "Vikram R.", type: "Payment issue", amount: "₹310", status: "open", date: "Yesterday, 02:45 PM" },
];

export default function AdminDisputesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDispute, setSelectedDispute] = useState<any>(null);

  const filteredDisputes = DISPUTES.filter(d => 
    d.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dispute Resolution</h1>
          <p className="text-sm text-muted-foreground mt-1">Review and resolve user-driver payment and ride disputes.</p>
        </div>
        <div className="flex bg-white border border-border p-1 rounded-lg">
          {["All", "Open", "Review", "Resolved"].map((status) => (
            <button
              key={status}
              className={cn(
                "px-4 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-widest transition-all",
                status === "All" ? "bg-primary text-white" : "bg-white text-muted-foreground hover:text-foreground"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3 p-3 bg-white border-border rounded-xl flex items-center gap-3">
          <Search className="w-5 h-5 text-muted-foreground ml-2" />
          <Input 
            placeholder="Search disputes by ID or Name..." 
            className="flex-1 bg-muted/30 border-none rounded-lg h-11 text-sm shadow-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Card>
        <Card className="p-4 bg-danger/5 border-danger/20 rounded-xl flex items-center gap-4">
           <div className="w-10 h-10 bg-danger/10 border border-danger/20 rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-danger" />
           </div>
           <div>
              <p className="text-xl font-bold text-danger font-tabular">{DISPUTES.filter(d => d.status === "open").length}</p>
              <p className="text-[10px] font-bold text-danger uppercase opacity-70">Critical Disputes</p>
           </div>
        </Card>
      </div>

      {/* Disputes Table */}
      <Card className="bg-white border-border rounded-card overflow-hidden pb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/10">
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Dispute ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Complaint Type</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Parties involved</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Amount Disputed</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Status / Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredDisputes.map((dispute) => (
                <tr key={dispute.id} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-foreground font-tabular">{dispute.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="border-border text-foreground text-[10px] uppercase font-bold py-1">{dispute.type}</Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <p className="text-[11px] font-bold text-foreground">{dispute.user}</p>
                       <ArrowRight className="w-3 h-3 text-muted-foreground opacity-30" />
                       <p className="text-[11px] font-bold text-muted-foreground">{dispute.driver}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-danger font-tabular">{dispute.amount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={dispute.status} />
                      <span className="text-[11px] text-muted-foreground">{dispute.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Dialog>
                       <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-9 font-bold uppercase tracking-widest text-[10px] hover:bg-muted" onClick={() => setSelectedDispute(dispute)}>
                            Review Details
                          </Button>
                       </DialogTrigger>
                       {selectedDispute && <DisputeDetails dispute={selectedDispute} />}
                    </Dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === "open") return (
    <div className="w-2 h-2 bg-danger rounded-full ring-4 ring-danger/10" />
  );
  if (status === "review") return (
    <div className="w-2 h-2 bg-warning rounded-full ring-4 ring-warning/10" />
  );
  return (
    <div className="w-2 h-2 bg-success rounded-full ring-4 ring-success/10" />
  );
}

function DisputeDetails({ dispute }: { dispute: any }) {
  return (
    <DialogContent className="max-w-[500px] bg-white border-border p-0">
      <DialogHeader className="p-8 pb-4 bg-muted/10 border-b border-border">
         <div className="flex items-center justify-between mb-4">
            <Badge className={cn(
               "uppercase text-[10px] font-bold px-3 py-1 border-none",
               dispute.status === "open" ? "bg-danger text-white" : dispute.status === "resolved" ? "bg-success text-white" : "bg-warning text-white"
            )}>{dispute.status}</Badge>
            <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest">Reported {dispute.date}</span>
         </div>
         <DialogTitle className="text-xl font-bold text-foreground">Dispute: {dispute.type}</DialogTitle>
         <DialogDescription className="text-sm text-muted-foreground mt-2">ID: {dispute.id} · Disputed Amount: <span className="text-danger font-bold">{dispute.amount}</span></DialogDescription>
      </DialogHeader>

      <div className="p-8 space-y-8">
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 p-4 rounded-xl border border-border">
               <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Rider</span>
               </div>
               <p className="text-sm font-bold text-foreground">{dispute.user}</p>
               <p className="text-[11px] text-muted-foreground mt-1">"The driver took a very long route and didn't follow Google Maps."</p>
            </div>
            <div className="bg-muted/30 p-4 rounded-xl border border-border">
               <div className="flex items-center gap-2 mb-2">
                  <Car className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Driver</span>
               </div>
               <p className="text-sm font-bold text-foreground">{dispute.driver}</p>
               <p className="text-[11px] text-muted-foreground mt-1">"There was heavy traffic on the main road, had to take alternate."</p>
            </div>
         </div>

         <div className="space-y-4">
            <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2">Evidence & Context</h4>
            <div className="space-y-3">
               <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <span className="text-xs font-medium text-foreground">Recorded GPS Deviation</span>
                  <span className="text-[10px] font-bold text-danger uppercase">Significant (2.4km)</span>
               </div>
               <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <span className="text-xs font-medium text-foreground">Ride Duration Deviation</span>
                  <span className="text-[10px] font-bold text-warning uppercase">Minor (+4m)</span>
               </div>
            </div>
         </div>
      </div>

      <DialogFooter className="p-8 bg-muted/10 border-t border-border grid grid-cols-2 gap-4">
         <Button variant="outline" className="h-12 border-primary text-primary hover:bg-primary/5 font-bold uppercase tracking-widest text-[11px]">Favor Rider</Button>
         <Button className="h-12 bg-primary text-white font-bold uppercase tracking-widest text-[11px]">Favor Driver</Button>
      </DialogFooter>
    </DialogContent>
  );
}
