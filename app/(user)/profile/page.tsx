"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Home, 
  Briefcase, 
  Edit2, 
  Check, 
  LogOut,
  Camera,
  ChevronRight,
  ShieldCheck,
  Star,
  Settings,
  Bell,
  CreditCard,
  History,
  Lock,
  Smartphone,
  Plus
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Arjun Sharma",
    email: "arjun.sharma@zipp.com",
    phone: "+91 98765 43210",
    location: "Chandigarh, India"
  });

  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="max-w-[1100px] mx-auto p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Account Settings</h1>
          <p className="text-sm text-text-muted font-medium mt-1">Manage your identity, security, and preferences.</p>
        </div>
        <Button 
          variant="outline" 
          className="h-10 border-danger/20 text-danger hover:bg-danger/5 hover:border-danger rounded-xl font-bold px-5 transition-all text-sm"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-1.5" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: ID Card */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 border-none bg-white rounded-3xl shadow-lg shadow-black/[0.02] flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-28 bg-gradient-to-br from-primary to-primary/80" />
            
            <div className="relative mt-6">
              <div className="w-28 h-28 rounded-3xl bg-white p-1 shadow-xl">
                 <div className="w-full h-full rounded-[20px] bg-primary-light flex items-center justify-center text-primary font-bold text-3xl">
                   AS
                 </div>
              </div>
              <button className="absolute bottom-0 right-0 p-2.5 bg-white text-primary rounded-xl shadow-lg hover:scale-105 transition-all border border-border/30">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <div className="mt-5 space-y-2">
              <h2 className="text-xl font-bold text-text-primary tracking-tight">{profile.name}</h2>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5">A-List</Badge>
                <div className="flex items-center gap-1 text-warning font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-warning" />
                  4.9
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full mt-6 p-2 bg-muted/30 rounded-2xl">
              <div className="p-3 text-center">
                <p className="text-lg font-bold text-text-primary font-tabular">128</p>
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-tight whitespace-nowrap">Rides</p>
              </div>
              <div className="p-3 text-center">
                <p className="text-lg font-bold text-text-primary font-tabular">2.4k</p>
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-tight whitespace-nowrap">KM Travelled</p>
              </div>
            </div>

            <nav className="w-full mt-6 space-y-1.5">
              {[
                { label: "Personal Info", icon: UserIcon, active: true },
                { label: "Payment Methods", icon: CreditCard },
                { label: "Ride History", icon: History },
                { label: "Notifications", icon: Bell },
                { label: "Security & Privacy", icon: Lock },
              ].map((item, i) => (
                <button 
                  key={i}
                  className={cn(
                    "w-full flex items-center justify-between p-3.5 rounded-xl transition-all font-bold text-sm",
                    item.active ? "bg-primary text-white shadow-lg shadow-primary/15" : "text-text-secondary hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </div>
                  <ChevronRight className={cn("w-4 h-4", item.active ? "text-white" : "text-text-muted")} />
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Right Column: Content */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Personal Information */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-text-secondary uppercase tracking-[0.15em] flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                Personal Information
              </h3>
              <Button 
                variant="ghost" 
                onClick={() => setIsEditing(!isEditing)}
                className={cn("h-9 rounded-xl px-4 font-bold transition-all text-sm", isEditing ? "bg-success/10 text-success hover:bg-success/10" : "bg-primary-light text-primary hover:bg-primary-light")}
              >
                {isEditing ? <><Check className="w-3.5 h-3.5 mr-1.5" /> Save</> : <><Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit</>}
              </Button>
            </div>

            <Card className="p-7 border-none bg-white rounded-3xl shadow-lg shadow-black/[0.02] space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <Input 
                      value={profile.name}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="pl-10 h-12 bg-muted/40 border-none rounded-xl font-semibold text-sm focus-visible:ring-primary/10 disabled:opacity-100"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <Input 
                      value={profile.email}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="pl-10 h-12 bg-muted/40 border-none rounded-xl font-semibold text-sm focus-visible:ring-primary/10 disabled:opacity-100"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">Phone</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <Input 
                      value={profile.phone}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="pl-10 h-12 bg-muted/40 border-none rounded-xl font-semibold text-sm focus-visible:ring-primary/10 disabled:opacity-100"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <Input 
                      value={profile.location}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      className="pl-10 h-12 bg-muted/40 border-none rounded-xl font-semibold text-sm focus-visible:ring-primary/10 disabled:opacity-100"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Saved Destinations */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-[0.15em] flex items-center gap-2 px-1">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              Saved Destinations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Home", address: "A-12, Green Park, Chandigarh", icon: Home, bg: "bg-primary-light", color: "text-primary" },
                { label: "Work", address: "Tech Tower, Sector 67, Mohali", icon: Briefcase, bg: "bg-blue-50", color: "text-blue-500" },
              ].map((dest, i) => (
                <Card key={i} className="p-5 border-none bg-white rounded-2xl shadow-lg shadow-black/[0.02] flex items-center justify-between hover:shadow-primary/5 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 flex-shrink-0", dest.bg, dest.color)}>
                      <dest.icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base font-bold text-text-primary tracking-tight group-hover:text-primary transition-colors">{dest.label}</h4>
                      <p className="text-sm text-text-muted font-medium mt-0.5 truncate">{dest.address}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                </Card>
              ))}
            </div>
            <Button variant="outline" className="w-full h-14 border-dashed border-2 border-border text-text-muted hover:text-primary hover:border-primary hover:bg-primary-light rounded-2xl font-bold text-sm transition-all">
              <Plus className="w-4 h-4 mr-1.5" />
              Add Frequent Destination
            </Button>
          </section>

          {/* Security Banner */}
          <div className="p-7 bg-gradient-to-br from-text-primary to-text-secondary rounded-3xl shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md flex-shrink-0">
                <ShieldCheck className="w-7 h-7 text-white/80" />
              </div>
              <div className="min-w-0">
                <h4 className="text-lg font-bold tracking-tight">Security Hardening</h4>
                <p className="text-sm text-white/50 font-medium">End-to-end encrypted credentials and ride history.</p>
              </div>
            </div>
            <Button className="h-11 bg-white text-text-primary hover:bg-white/90 font-bold rounded-xl px-6 text-sm flex-shrink-0">
              Security Audit
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
