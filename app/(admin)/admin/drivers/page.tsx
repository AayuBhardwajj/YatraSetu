"use client";

import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  ShieldCheck, 
  ShieldAlert, 
  ShieldMinus,
  Star,
  Car,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ChevronRight,
  UserPlus,
  Clock
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const DRIVERS = [
  { id: "D-1021", name: "Rajesh Kumar", rating: 4.8, status: "online", acceptance: "94%", trips: 1420, kyc: "verified", vehicle: "Toyota Camry", plate: "PB 65 AC 1234", city: "Ludhiana" },
  { id: "D-1022", name: "Gurpreet Singh", rating: 4.9, status: "online", acceptance: "98%", trips: 2150, kyc: "verified", vehicle: "Honda Amaze", plate: "PB 01 XY 5678", city: "Chandigarh" },
  { id: "D-1023", name: "Suresh Pal", rating: 4.5, status: "offline", acceptance: "82%", trips: 430, kyc: "pending", vehicle: "Hyundai i10", plate: "PB 65 CZ 9012", city: "Jalandhar" },
  { id: "D-1024", name: "Vikram R.", rating: 3.2, status: "suspended", acceptance: "45%", trips: 120, kyc: "rejected", vehicle: "Swift Dzire", plate: "PB 11 MK 3456", city: "Amritsar" },
  { id: "D-1025", name: "Amit Verma", rating: 4.7, status: "online", acceptance: "91%", trips: 890, kyc: "verified", vehicle: "Toyota Etios", plate: "PB 02 LL 7890", city: "Ludhiana" },
];

export default function AdminDriversPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredDrivers = DRIVERS.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || d.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-10 max-w-[1400px] mx-auto   duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Fleet Management</h1>
          <p className="text-sm text-text-muted font-medium mt-1">Monitor driver performance, compliance, and real-time availability.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-12 bg-white border-border text-text-secondary hover:text-primary rounded-2xl font-bold px-6 border-2">
            <Filter className="w-4.5 h-4.5 mr-2" />
            Advanced Filters
          </Button>
          <Button className="h-12 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold px-8 shadow-xl shadow-primary/20 transition-all active:scale-[0.98]">
            <UserPlus className="w-4.5 h-4.5 mr-2" />
            Add New Driver
          </Button>
        </div>
      </div>

      {/* Fleet Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: "On-Duty Drivers", value: "112", sub: "84% Utilization", icon: Activity, color: "text-success", bg: "bg-success-light" },
          { label: "Off-Duty", value: "24", sub: "Available in 2h", icon: Clock, color: "text-text-muted", bg: "bg-muted" },
          { label: "New Applications", value: "18", sub: "Pending Review", icon: ShieldAlert, color: "text-warning", bg: "bg-warning-light" },
          { label: "Suspended", value: "6", sub: "Critical Violations", icon: ShieldMinus, color: "text-danger", bg: "bg-danger-light" },
        ].map((stat, i) => (
          <Card key={i} className="p-6 border-none bg-white rounded-[28px] shadow-xl shadow-black/[0.03] flex items-center space-x-5 group hover:shadow-black/[0.06] transition-all">
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", stat.bg, stat.color)}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
              <h3 className="text-2xl font-bold text-text-primary font-tabular tracking-tight">{stat.value}</h3>
              <p className="text-[10px] font-medium text-text-muted mt-1">{stat.sub}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Driver Table & Search */}
      <Card className="bg-white border-none rounded-[40px] shadow-xl shadow-black/[0.03] overflow-hidden">
        <div className="p-8 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/50 backdrop-blur-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
            <Input 
              placeholder="Search by name, ID, or plate..." 
              className="pl-12 h-12 bg-muted/40 border-none rounded-2xl font-medium focus-visible:ring-primary/10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 p-1.5 bg-muted/30 rounded-2xl">
            {["all", "online", "offline", "suspended"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={cn(
                  "px-5 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all",
                  filterStatus === status 
                    ? "bg-white text-primary shadow-sm" 
                    : "text-text-muted hover:text-text-primary"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/10">
                <th className="px-10 py-5 text-[10px] font-bold text-text-muted uppercase tracking-widest">Driver Identity</th>
                <th className="px-10 py-5 text-[10px] font-bold text-text-muted uppercase tracking-widest">Rating & Perf</th>
                <th className="px-10 py-5 text-[10px] font-bold text-text-muted uppercase tracking-widest">Trip History</th>
                <th className="px-10 py-5 text-[10px] font-bold text-text-muted uppercase tracking-widest">KYC Compliance</th>
                <th className="px-10 py-5 text-[10px] font-bold text-text-muted uppercase tracking-widest">Status</th>
                <th className="px-10 py-5 text-[10px] font-bold text-text-muted uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredDrivers.map((driver) => (
                <Sheet key={driver.id}>
                  <SheetTrigger asChild>
                    <tr className="hover:bg-muted/20 transition-all cursor-pointer group">
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12 border-2 border-white shadow-md">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                              {driver.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-0.5">
                            <p className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">{driver.name}</p>
                            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold opacity-60 font-tabular">{driver.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 text-warning fill-warning" />
                            <span className="text-sm font-bold text-text-primary font-tabular">{driver.rating}</span>
                          </div>
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Acceptance: {driver.acceptance}</p>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-text-primary font-tabular">{driver.trips.toLocaleString()}</p>
                          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest opacity-60">Total Rides</p>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                         <KYCBadge status={driver.kyc} />
                      </td>
                      <td className="px-10 py-6">
                        <Badge className={cn(
                          "uppercase text-[9px] font-bold px-3 py-1 rounded-full border-none",
                          driver.status === "online" ? "bg-success-light text-success" : 
                          driver.status === "offline" ? "bg-muted text-text-muted" : 
                          "bg-danger-light text-danger"
                        )}>
                          {driver.status}
                        </Badge>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-muted group-hover:bg-white transition-colors">
                           <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary" />
                        </Button>
                      </td>
                    </tr>
                   </SheetTrigger>
                   <DriverSheetContent driver={driver} />
                </Sheet>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function KYCBadge({ status }: { status: string }) {
  if (status === "verified") return (
    <div className="flex items-center gap-2 text-success">
       <ShieldCheck className="w-4 h-4" />
       <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Verified</span>
    </div>
  );
  if (status === "pending") return (
    <div className="flex items-center gap-2 text-warning">
       <ShieldAlert className="w-4 h-4" />
       <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Review Pending</span>
    </div>
  );
  return (
    <div className="flex items-center gap-2 text-danger">
       <ShieldMinus className="w-4 h-4" />
       <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Rejected</span>
    </div>
  );
}

function DriverSheetContent({ driver }: { driver: any }) {
  return (
    <SheetContent className="w-[100%] sm:max-w-[540px] bg-white border-l border-border p-0 rounded-l-[40px] overflow-hidden">
      <div className="h-full flex flex-col">
        <header className="p-10 bg-gradient-to-br from-primary to-primary/80 border-b border-white/10 flex items-center justify-between relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <Users className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10 space-y-2">
               <SheetTitle className="text-2xl font-bold text-white tracking-tight">{driver.name}</SheetTitle>
               <div className="flex items-center gap-3">
                 <Badge className="bg-white/20 text-white border-none uppercase text-[10px] font-bold tracking-widest">{driver.id}</Badge>
                 <span className="text-white/60 text-xs font-bold uppercase tracking-widest">{driver.city} Base</span>
               </div>
            </div>
            <div className="relative z-10">
              <Badge className={cn(
                 "uppercase text-[10px] font-bold px-4 py-2 rounded-full border-none shadow-lg",
                 driver.status === "online" ? "bg-success text-white" : "bg-white text-text-primary"
              )}>{driver.status}</Badge>
            </div>
        </header>

        <div className="flex-1 overflow-y-auto no-scrollbar p-10 space-y-10">
           {/* Stats Grid */}
           <div className="grid grid-cols-3 gap-6">
              <Card className="bg-muted/30 p-5 rounded-3xl text-center border-none shadow-none">
                 <Star className="w-6 h-6 text-warning mx-auto mb-2 fill-warning" />
                 <p className="text-xl font-bold text-text-primary font-tabular">{driver.rating}</p>
                 <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Avg Rating</p>
              </Card>
              <Card className="bg-muted/30 p-5 rounded-3xl text-center border-none shadow-none">
                 <Car className="w-6 h-6 text-primary mx-auto mb-2" />
                 <p className="text-xl font-bold text-text-primary font-tabular">{driver.trips}</p>
                 <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Total Rides</p>
              </Card>
              <Card className="bg-muted/30 p-5 rounded-3xl text-center border-none shadow-none">
                 <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                 <p className="text-xl font-bold text-text-primary font-tabular">{driver.acceptance}</p>
                 <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Acceptance</p>
              </Card>
           </div>

           {/* Vehicle Information */}
           <div className="space-y-6">
              <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-widest border-b border-border pb-3">Fleet Assets</h4>
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-muted rounded-[32px] flex items-center justify-center text-text-muted">
                  <Car className="w-10 h-10" />
                </div>
                <div className="space-y-1.5">
                  <p className="text-xl font-bold text-text-primary">{driver.vehicle}</p>
                  <p className="text-sm font-bold text-primary tracking-widest uppercase font-tabular">{driver.plate}</p>
                </div>
              </div>
           </div>

           {/* KYC Status Details */}
           <div className="space-y-6">
              <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-widest border-b border-border pb-3">KYC & Compliance</h4>
              <div className="grid grid-cols-1 gap-4">
                 {[
                   { name: "Aadhar Card Identity", status: "Verified" },
                   { name: "Driving License (HCV)", status: "Verified" },
                   { name: "Vehicle Fitness Certificate", status: "Verified" },
                   { name: "Background Verification", status: "In Progress" },
                 ].map((doc, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-white border border-border rounded-2xl group hover:border-primary/30 transition-colors">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4 text-text-muted" />
                         </div>
                         <span className="text-sm font-bold text-text-primary">{doc.name}</span>
                      </div>
                      <Badge className={cn(
                        "uppercase text-[9px] font-bold px-3 py-1 rounded-full",
                        doc.status === "Verified" ? "bg-success-light text-success" : "bg-warning-light text-warning"
                      )}>
                        {doc.status}
                      </Badge>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <footer className="p-10 bg-white border-t border-border grid grid-cols-2 gap-4 shrink-0">
           <Button variant="outline" className="h-14 border-2 border-danger/10 text-danger hover:bg-danger-light hover:border-danger hover:text-danger font-bold uppercase tracking-widest text-[11px] rounded-2xl transition-all">
             Permanent Suspend
           </Button>
           <Button className="h-14 bg-primary text-white font-bold uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary/90 transition-all">
             Message Driver
           </Button>
        </footer>
      </div>
    </SheetContent>
  );
}

