"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Star, 
  Car, 
  ShieldCheck, 
  ShieldAlert,
  LogOut,
  Camera,
  Globe,
  Building2,
  CreditCard,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { createClient } from "@/lib/supabase/client";

export default function DriverProfilePage() {
  const router = useRouter();
  
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const supabase = createClient();
  const [formData, setFormData] = useState({
    name: "Loading...",
    email: "Loading...",
    phone: "",
    language: "Hindi, English",
    bankName: "HDFC Bank",
    accountNo: "•••• •••• 4231",
    ifsc: "HDFC0001234"
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadDriver() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setFormData(prev => ({ ...prev, email: user.email || prev.email }));
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile) {
          setFormData(prev => ({
            ...prev,
            name: profile.full_name || user.user_metadata?.full_name || prev.name,
            phone: profile.phone || prev.phone
          }));
        }
      }
    }
    loadDriver();
  }, []);

  const saveProfile = async () => {
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('profiles').update({
        phone: formData.phone
      }).eq('id', user.id);
      
      await supabase.auth.updateUser({
        data: { full_name: formData.name }
      });
    }
    setIsSaving(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-muted/30 flex justify-center p-8 overflow-y-auto no-scrollbar">
      <div className="w-full max-w-[900px] grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Left Column (40%): Driver & Vehicle Info */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-8 border-none bg-white rounded-[32px] shadow-xl shadow-black/5 flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="w-32 h-32 bg-primary-light rounded-[40px] flex items-center justify-center text-primary text-4xl font-bold border-4 border-white shadow-xl">
                RK
              </div>
              <button className="absolute bottom-0 right-0 p-2.5 bg-white rounded-2xl shadow-lg border border-border text-text-muted hover:text-primary transition-colors">
                <Camera className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-text-primary tracking-tight">{formData.name}</h2>
              <div className="flex items-center justify-center space-x-2">
                <div className="flex items-center text-warning font-bold">
                  <Star className="w-4 h-4 mr-1 fill-warning" />
                  4.8
                </div>
                <span className="text-text-muted opacity-40">·</span>
                <span className="text-xs font-bold text-text-muted uppercase tracking-widest">Premium Driver</span>
              </div>
            </div>

            <Badge className="bg-success-light text-success border-transparent px-6 py-1.5 rounded-full font-bold flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Identity Verified</span>
            </Badge>
          </Card>

          <Card className="p-8 border-none bg-white rounded-[32px] shadow-xl shadow-black/5 space-y-6">
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest pl-1">Vehicle Details</h3>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-muted rounded-2xl flex items-center justify-center text-text-muted flex-shrink-0">
                <Car className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-bold text-text-primary leading-none">Toyota Camry</p>
                <p className="text-sm font-medium text-text-muted">PB 65 AC 1234 · White</p>
              </div>
            </div>
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-text-muted uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-success" />
                <span>Insurance Active</span>
              </div>
              <Button variant="link" className="text-primary font-bold text-xs p-0 h-auto">Update</Button>
            </div>
          </Card>
        </div>

        {/* Right Column (60%): Forms */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-8 border-none bg-white rounded-[32px] shadow-xl shadow-black/5 space-y-8">
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest pl-1">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <Input 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="pl-11 h-12 bg-muted/40 border-none rounded-xl font-medium focus-visible:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <Input 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="pl-11 h-12 bg-muted/40 border-none rounded-xl font-medium focus-visible:ring-primary/20"
                    />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Preferred Languages</label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <Input 
                      value={formData.language}
                      onChange={(e) => setFormData({...formData, language: e.target.value})}
                      className="pl-11 h-12 bg-muted/40 border-none rounded-xl font-medium focus-visible:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4 border-t border-border">
              <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest pl-1">Settlement Bank Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Bank Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <Input 
                      value={formData.bankName}
                      className="pl-11 h-12 bg-muted/40 border-none rounded-xl font-medium"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">Account Number</label>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <Input 
                      value={formData.accountNo}
                      className="pl-11 h-12 bg-muted/40 border-none rounded-xl font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6">
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="h-12 border-danger/20 text-danger hover:bg-danger-light hover:border-danger/40 font-bold rounded-xl space-x-2 transition-all px-8"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
              <Button onClick={saveProfile} disabled={isSaving} className="h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-10 shadow-lg shadow-primary/10 transition-all active:scale-[0.98]">
                {isSaving ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-none bg-primary-light rounded-[32px] flex items-center justify-between group cursor-pointer hover:bg-primary/10 transition-all text-primary">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold">Manage Documents</span>
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">All documents are up to date</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Card>
        </div>

      </div>
    </div>
  );
}
