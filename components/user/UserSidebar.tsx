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
  const { logout, user } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <aside className="fixed left-3 top-3 bottom-3 w-[272px] bg-white/90 backdrop-blur-xl border border-white/30 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] flex flex-col z-50 rounded-[32px] overflow-hidden">
      {/* Brand & Identity */}
      <div className="px-6 pt-6 pb-4 space-y-5 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20 transition-transform hover:rotate-6">
            Z
          </div>
          <div>
            <h1 className="text-xl font-bold text-text-primary tracking-tight leading-none">Zipp</h1>
            <p className="text-[9px] font-bold text-primary uppercase tracking-[0.15em] mt-0.5">Premium Rider</p>
          </div>
        </div>

        {/* Profile Identity Card */}
        <div 
          onClick={() => router.push("/profile")}
          className="flex items-center gap-3 bg-muted/40 p-3 rounded-2xl border border-border/30 hover:bg-white hover:shadow-lg hover:shadow-black/[0.02] transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-primary-light flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
            {user?.name?.split(' ').map(n => n[0]).join('') || 'AS'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text-primary truncate">{user?.name || 'Arjun Sharma'}</p>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-warning fill-warning flex-shrink-0" />
              <span className="text-[10px] font-bold text-text-muted">4.9 Rating</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors flex-shrink-0" />
        </div>
      </div>

      {/* Navigation Layer */}
      <nav className="flex-1 overflow-y-auto px-3 py-1 no-scrollbar space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all group relative overflow-hidden",
                isActive 
                  ? "bg-primary text-white shadow-lg shadow-primary/15" 
                  : "text-text-secondary hover:bg-muted/50 hover:text-text-primary"
              )}
            >
              <div className="flex items-center space-x-3.5 relative z-10">
                <Icon className={cn("w-[18px] h-[18px] transition-transform group-hover:scale-110 flex-shrink-0", isActive ? "text-white" : "text-text-secondary group-hover:text-primary")} />
                <span className="text-[13px] font-bold tracking-tight">{item.label}</span>
              </div>
              {isActive && (
                 <div className="w-1.5 h-1.5 bg-white rounded-full flex-shrink-0" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Premium Upgrade & Footer */}
      <div className="p-3 mt-auto flex-shrink-0">
        <div className="bg-gradient-to-br from-text-primary to-text-secondary p-5 rounded-2xl shadow-xl relative overflow-hidden group mb-3">
           <Zap className="absolute top-[-10%] right-[-10%] w-20 h-20 text-white opacity-[0.06] group-hover:rotate-12 transition-transform duration-1000" />
           <div className="relative z-10 space-y-3">
             <div>
               <p className="text-[9px] font-bold text-primary-light uppercase tracking-widest mb-1">ZippPass Elite</p>
               <h4 className="text-[13px] font-bold text-white tracking-tight leading-snug">Unlock 0% Surge Pricing today</h4>
             </div>
             <Button size="sm" className="w-full bg-white text-text-primary hover:bg-white/90 rounded-xl font-bold text-[11px] h-9 shadow-md">
                View Membership
             </Button>
           </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center space-x-2.5 w-full p-3 text-danger hover:bg-danger/5 rounded-xl transition-all group font-bold text-[11px] uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
