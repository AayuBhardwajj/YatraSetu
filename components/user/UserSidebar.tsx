"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, 
  Navigation, 
  Radio, 
  Activity, 
  Clock, 
  Wallet, 
  User as UserIcon,
  LogOut,
  Zap,
  ChevronRight,
  ShieldCheck,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";

const NAV_ITEMS = [
  { label: "Home", icon: Home, href: "/home" },
  { label: "Book a Ride", icon: Navigation, href: "/booking" },
  { label: "Live Tracking", icon: Radio, href: "/tracking" },
  { label: "Activity", icon: Activity, href: "/activity" },
  { label: "Wallet", icon: Wallet, href: "/wallet" },
  { label: "Profile", icon: UserIcon, href: "/profile" },
];

export function UserSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <aside className="fixed left-4 top-4 bottom-4 w-[280px] bg-white/80 backdrop-blur-xl border border-white/20 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] flex flex-col z-50 rounded-[40px] overflow-hidden">
      {/* Brand & Identity */}
      <div className="p-8 space-y-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary rounded-[18px] flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-primary/20 transition-transform hover:rotate-6">
            Z
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tighter">Zipp</h1>
            <p className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] leading-none">Premium Rider</p>
          </div>
        </div>

        {/* Profile Identity Card */}
        <div 
          onClick={() => router.push("/profile")}
          className="flex items-center gap-4 bg-muted/40 p-4 rounded-[28px] border border-border/40 hover:bg-white hover:shadow-xl hover:shadow-black/[0.02] transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary font-bold text-sm shadow-inner group-hover:scale-105 transition-transform">
            AS
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text-primary truncate">Arjun Sharma</p>
            <div className="flex items-center gap-1.5">
              <Star className="w-3 h-3 text-warning fill-warning" />
              <span className="text-[10px] font-bold text-text-muted">4.9 Rating</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
        </div>
      </div>

      {/* Navigation Layer */}
      <nav className="flex-1 overflow-y-auto px-4 py-2 no-scrollbar space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-6 py-4 rounded-[24px] transition-all group relative overflow-hidden",
                isActive 
                  ? "bg-primary text-white shadow-xl shadow-primary/20" 
                  : "text-text-secondary hover:bg-muted/50 hover:text-text-primary"
              )}
            >
              <div className="flex items-center space-x-4 relative z-10">
                <Icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-text-secondary group-hover:text-primary")} />
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
              </div>
              {isActive && (
                 <div className="absolute inset-0 bg-gradient-to-r from-primary-light/10 to-transparent opacity-20" />
              )}
              {isActive && (
                 <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Premium Upgrade & Footer */}
      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-br from-text-primary to-text-secondary p-6 rounded-[34px] shadow-2xl relative overflow-hidden group mb-4">
           <Zap className="absolute top-[-10%] right-[-10%] w-24 h-24 text-white opacity-10 group-hover:rotate-12 transition-transform duration-1000" />
           <div className="relative z-10 space-y-4">
             <div>
               <p className="text-[10px] font-bold text-primary-light uppercase tracking-widest mb-1.5">ZippPass Elite</p>
               <h4 className="text-sm font-bold text-white tracking-tight leading-snug">Unlock 0% Surge Pricing today</h4>
             </div>
             <Button size="sm" className="w-full bg-white text-text-primary hover:bg-white/90 rounded-xl font-bold text-[11px] h-10 shadow-lg">
                View Membership
             </Button>
           </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center space-x-3 w-full p-4 text-danger hover:bg-danger-light rounded-[24px] transition-all group font-bold text-[11px] uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Logout Session</span>
        </button>
      </div>
    </aside>
  );
}
