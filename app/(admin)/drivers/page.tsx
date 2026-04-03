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
  AlertCircle
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
  { id: "D-1021", name: "Rajesh Kumar", rating: 4.8, status: "online", acceptance: "94%", trips: 1420, kyc: "verified", vehicle: "Maruti Swift", plate: "PB-10-AB-1234" },
  { id: "D-1022", name: "Gurpreet Singh", rating: 4.9, status: "online", acceptance: "98%", trips: 2150, kyc: "verified", vehicle: "Honda Amaze", plate: "PB-01-XY-5678" },
  { id: "D-1023", name: "Suresh Pal", rating: 4.5, status: "offline", acceptance: "82%", trips: 430, kyc: "pending", vehicle: "Hyundai i10", plate: "PB-65-CZ-9012" },
  { id: "D-1024", name: "Vikram R.", rating: 3.2, status: "suspended", acceptance: "45%", trips: 120, kyc: "rejected", vehicle: "Swift Dzire", plate: "PB-11-MK-3456" },
  { id: "D-1025", name: "Amit Verma", rating: 4.7, status: "online", acceptance: "91%", trips: 890, kyc: "verified", vehicle: "Toyota Etios", plate: "PB-02-LL-7890" },
];

export default function AdminDriversPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredDrivers = DRIVERS.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || d.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Driver Management</h1>
        <Button className="h-10 bg-primary text-white font-bold px-6 rounded-lg uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20">
           Add Driver
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-3 bg-white border-border rounded-xl flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search drivers by name or ID..." 
            className="pl-10 h-11 bg-muted/30 border-none rounded-lg text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="h-8 w-[1px] bg-border mx-2" />
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {["all", "online", "offline", "suspended"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={cn(
                "px-4 py-2 rounded-lg text-[11px] font-bold uppercase tracking-widest transition-all",
                filterStatus === status 
                  ? "bg-primary text-white" 
                  : "bg-white text-muted-foreground hover:bg-muted"
              )}
            >
              {status}
            </button>
          ))}
        </div>
      </Card>

      {/* Driver Table */}
      <Card className="bg-white border-border rounded-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-muted/10">
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Driver</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Rating</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Acceptance</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">KYC Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredDrivers.map((driver) => (
                <Sheet key={driver.id}>
                  <SheetTrigger asChild>
                    <tr className="hover:bg-muted/40 transition-colors cursor-pointer group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 border border-border">
                            <AvatarFallback className="bg-muted text-foreground font-bold text-xs uppercase">
                              {driver.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-bold text-foreground">{driver.name}</p>
                            <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-bold opacity-60">{driver.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <span className="text-sm font-bold text-foreground font-tabular">{driver.rating}</span>
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-foreground font-tabular">{driver.acceptance}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={cn(
                          "uppercase text-[9px] font-bold border-none",
                          driver.status === "online" ? "bg-success/10 text-success" : 
                          driver.status === "offline" ? "bg-muted text-muted-foreground" : 
                          "bg-danger/10 text-danger"
                        )}>
                          {driver.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <KYCBadge status={driver.kyc} />
                      </td>
                      <td className="px-6 py-4">
                        <Button variant="ghost" size="icon" className="group-hover:bg-muted rounded-full">
                           <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
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
    <div className="flex items-center gap-1.5 text-success">
       <ShieldCheck className="w-4 h-4" />
       <span className="text-[10px] font-bold uppercase tracking-widest">Verified</span>
    </div>
  );
  if (status === "pending") return (
    <div className="flex items-center gap-1.5 text-amber-500">
       <ShieldAlert className="w-4 h-4" />
       <span className="text-[10px] font-bold uppercase tracking-widest">Pending</span>
    </div>
  );
  return (
    <div className="flex items-center gap-1.5 text-danger">
       <ShieldMinus className="w-4 h-4" />
       <span className="text-[10px] font-bold uppercase tracking-widest">Rejected</span>
    </div>
  );
}

function DriverSheetContent({ driver }: { driver: any }) {
  return (
    <SheetContent className="w-[400px] sm:w-[540px] bg-white border-l border-border p-0">
      <div className="h-full flex flex-col">
        <header className="p-8 bg-muted/20 border-b border-border flex items-center justify-between">
            <div className="space-y-1">
               <SheetTitle className="text-xl font-bold text-foreground">{driver.name}</SheetTitle>
               <SheetDescription className="text-xs uppercase font-bold tracking-widest text-primary">{driver.id}</SheetDescription>
            </div>
            <Badge className={cn(
               "uppercase text-[10px] font-bold px-3 py-1 border-none",
               driver.status === "online" ? "bg-success text-white" : "bg-muted text-muted-foreground"
            )}>{driver.status}</Badge>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
           {/* Profile Stats */}
           <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/30 p-4 rounded-xl text-center">
                 <Star className="w-5 h-5 text-amber-500 mx-auto mb-2 fill-amber-500" />
                 <p className="text-lg font-bold text-foreground font-tabular">{driver.rating}</p>
                 <p className="text-[10px] text-muted-foreground uppercase font-bold">Rating</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-xl text-center">
                 <Car className="w-5 h-5 text-primary mx-auto mb-2" />
                 <p className="text-lg font-bold text-foreground font-tabular">{driver.trips}</p>
                 <p className="text-[10px] text-muted-foreground uppercase font-bold">Trips</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-xl text-center">
                 <Users className="w-5 h-5 text-blue-500 mx-auto mb-2" />
                 <p className="text-lg font-bold text-foreground font-tabular">{driver.acceptance}</p>
                 <p className="text-[10px] text-muted-foreground uppercase font-bold">Acceptance</p>
              </div>
           </div>

           {/* Contact & Docs */}
           <div className="space-y-4">
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2">Profile Information</h4>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Car className="w-4 h-4 text-muted-foreground" />
                       <span className="text-sm font-medium text-foreground">Vehicle Details</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">{driver.vehicle} · {driver.plate}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Phone className="w-4 h-4 text-muted-foreground" />
                       <span className="text-sm font-medium text-foreground">Phone</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">+91 98765 43210</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <Mail className="w-4 h-4 text-muted-foreground" />
                       <span className="text-sm font-medium text-foreground">Email</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">{driver.name.toLowerCase().replace(' ', '.')}@zipp.com</span>
                 </div>
              </div>
           </div>

           {/* KYC Documents Panel */}
           <div className="space-y-4">
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-2">Compliance & KYC</h4>
              <div className="space-y-3">
                 {[
                   { name: "Aadhar Card", status: "Verified" },
                   { name: "Driving License", status: "Verified" },
                   { name: "Vehicle Registration", status: "Verified" },
                   { name: "Insurance Certificate", status: "Verified" },
                 ].map((doc, i) => (
                   <div key={i} className="flex items-center justify-between p-3 border border-border rounded-xl">
                      <span className="text-sm font-bold text-foreground">{doc.name}</span>
                      <div className="flex items-center gap-1.5 text-success">
                         <ShieldCheck className="w-3.5 h-3.5" />
                         <span className="text-[10px] font-bold uppercase tracking-widest">{doc.status}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <footer className="p-8 bg-muted/20 border-t border-border grid grid-cols-2 gap-4">
           <Button variant="outline" className="h-12 border-danger text-danger hover:bg-danger/5 font-bold uppercase tracking-widest text-[11px]">Suspend Driver</Button>
           <Button className="h-12 bg-primary text-white font-bold uppercase tracking-widest text-[11px]">Message Driver</Button>
        </footer>
      </div>
    </SheetContent>
  );
}
