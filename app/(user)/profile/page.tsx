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
    <div className="max-w-[1200px] mx-auto p-12 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-text-primary tracking-tight">Account Settings</h1>
          <p className="text-sm text-text-muted font-medium mt-2">Manage your identity, security, and personal preferences.</p>
        </div>
        <Button 
          variant="outline" 
          className="h-12 border-danger/10 text-danger hover:bg-danger-light hover:border-danger hover:text-danger rounded-2xl font-bold px-8 transition-all"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: ID Card (4 Columns) */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="p-10 border-none bg-white rounded-[40px] shadow-2xl shadow-black/[0.03] flex flex-col items-center text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary to-primary/80" />
            
            <div className="relative mt-8">
              <div className="w-32 h-32 rounded-[40px] bg-white p-1.5 shadow-2xl">
                 <div className="w-full h-full rounded-[34px] bg-primary-light flex items-center justify-center text-primary font-bold text-4xl">
                   AS
                 </div>
              </div>
              <button className="absolute bottom-1 right-1 p-3 bg-white text-primary rounded-2xl shadow-xl hover:scale-110 transition-all border border-border/50">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-8 space-y-2">
              <h2 className="text-2xl font-bold text-text-primary tracking-tight">{profile.name}</h2>
              <div className="flex items-center justify-center gap-2">
                <Badge className="bg-primary/10 text-primary border-none text-[10px] font-bold uppercase tracking-widest px-3 py-1">A-List Member</Badge>
                <div className="flex items-center gap-1 text-warning font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-warning" />
                  4.9
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mt-10 p-2 bg-muted/30 rounded-3xl">
              <div className="p-4 text-center">
                <p className="text-xl font-bold text-text-primary font-tabular tracking-tight">128</p>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Total Rides</p>
              </div>
              <div className="p-4 text-center">
                <p className="text-xl font-bold text-text-primary font-tabular tracking-tight">2.4k</p>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">KM Travelled</p>
              </div>
            </div>

            <nav className="w-full mt-10 space-y-2">
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
                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all font-bold text-sm",
                    item.active ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-text-secondary hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <item.icon className="w-4.5 h-4.5" />
                    {item.label}
                  </div>
                  <ChevronRight className={cn("w-4 h-4", item.active ? "text-white" : "text-text-muted")} />
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Right Column: Content (8 Columns) */}
        <div className="lg:col-span-8 space-y-12">
          
          {/* Personal Information */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-sm font-bold text-text-secondary uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full" />
                Personal Information
              </h3>
              <Button 
                variant="ghost" 
                onClick={() => setIsEditing(!isEditing)}
                className={cn("h-11 rounded-xl px-6 font-bold transition-all", isEditing ? "bg-success-light text-success hover:bg-success-light" : "bg-primary-light text-primary hover:bg-primary-light")}
              >
                {isEditing ? <><Check className="w-4 h-4 mr-2" /> Save Changes</> : <><Edit2 className="w-4 h-4 mr-2" /> Edit Profile</>}
              </Button>
            </div>

            <Card className="p-10 border-none bg-white rounded-[40px] shadow-xl shadow-black/[0.03] space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">Legal Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                    <Input 
                      value={profile.name}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="pl-12 h-14 bg-muted/40 border-none rounded-2xl font-bold focus-visible:ring-primary/10 disabled:opacity-100 placeholder:text-text-muted/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">Email Identifier</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                    <Input 
                      value={profile.email}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="pl-12 h-14 bg-muted/40 border-none rounded-2xl font-bold focus-visible:ring-primary/10 disabled:opacity-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">Mobile Connection</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                    <Input 
                      value={profile.phone}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="pl-12 h-14 bg-muted/40 border-none rounded-2xl font-bold focus-visible:ring-primary/10 disabled:opacity-100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider ml-1">Home Base</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
                    <Input 
                      value={profile.location}
                      disabled={!isEditing}
                      onChange={(e) => setProfile({...profile, location: e.target.value})}
                      className="pl-12 h-14 bg-muted/40 border-none rounded-2xl font-bold focus-visible:ring-primary/10 disabled:opacity-100"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* Saved Destinations */}
          <section className="space-y-6">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-[0.2em] flex items-center gap-3 px-2">
              <div className="w-2 h-2 bg-primary rounded-full" />
              Intelligence Destinations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: "Home", address: "A-12, Green Park, Chandigarh", icon: Home, bg: "bg-primary-light", color: "text-primary" },
                { label: "Work", address: "Tech Tower, Sector 67, Mohali", icon: Briefcase, bg: "bg-blue-50", color: "text-blue-500" },
              ].map((dest, i) => (
                <Card key={i} className="p-8 border-none bg-white rounded-[32px] shadow-xl shadow-black/[0.03] flex items-center justify-between hover:shadow-primary/5 transition-all cursor-pointer group">
                  <div className="flex items-center gap-6">
                    <div className={cn("w-16 h-16 rounded-[24px] flex items-center justify-center transition-transform group-hover:scale-110", dest.bg, dest.color)}>
                      <dest.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-text-primary tracking-tight group-hover:text-primary transition-colors">{dest.label}</h4>
                      <p className="text-sm text-text-muted font-medium mt-1">{dest.address}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Card>
              ))}
            </div>
            <Button variant="outline" className="w-full h-16 border-dashed border-2 border-border text-text-muted hover:text-primary hover:border-primary hover:bg-primary-light rounded-[32px] font-bold text-sm transition-all">
              <Plus className="w-5 h-5 mr-2" />
              Add Frequent Destination
            </Button>
          </section>

          {/* Security Banner */}
          <div className="p-10 bg-gradient-to-br from-text-primary to-text-secondary rounded-[40px] shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-white/10 rounded-[32px] flex items-center justify-center backdrop-blur-md">
                <ShieldCheck className="w-10 h-10 text-white/80" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-bold tracking-tight">Security Hardening</h4>
                <p className="text-sm text-white/60 font-medium">Your credentials and ride history are protected with end-to-end encryption.</p>
              </div>
            </div>
            <Button className="h-14 bg-white text-text-primary hover:bg-white/90 font-bold rounded-2xl px-10 transition-all active:scale-[0.95] whitespace-nowrap">
              Security Audit
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
