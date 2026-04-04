"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  MapPin, 
  IndianRupee, 
  User as UserIcon,
  LogOut,
  Power,
  Bell,
  Settings,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/store/useAuthStore";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/driver/dashboard" },
  { label: "Ride Requests", icon: MapPin, href: "/driver/requests" },
  { label: "Earnings", icon: IndianRupee, href: "/driver/earnings" },
  { label: "Profile", icon: UserIcon, href: "/driver/profile" },
];

export function DriverSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);

  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <aside className="fixed left-0 top-0 w-[260px] h-screen bg-white border-r border-border flex flex-col z-50">
      {/* Top section: Logo & Status */}
      <div className="p-6 space-y-8">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-success rounded-lg flex items-center justify-center text-white font-bold text-xl">
            Z
          </div>
          <span className="text-xl font-bold text-text-primary tracking-tight">Zipp <span className="text-success text-xs font-bold uppercase ml-1 tracking-widest">Driver</span></span>
        </div>

        {/* Online/Offline Toggle Card */}
        <div className={cn(
          "p-5 rounded-2xl border transition-all duration-300 space-y-4",
          isOnline ? "bg-success-light border-success/20 shadow-lg shadow-success/10" : "bg-muted border-border"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Status</span>
              <span className={cn("text-lg font-bold", isOnline ? "text-success" : "text-text-secondary")}>
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
            <Switch 
              checked={isOnline} 
              onCheckedChange={setIsOnline}
              className="data-[state=checked]:bg-success"
            />
          </div>
          <p className="text-[11px] font-medium text-text-muted leading-relaxed">
            {isOnline ? "You're visible to riders and can receive ride requests." : "Go online to start receiving requests and earning money."}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto pt-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/driver/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-6 py-4 transition-all relative group",
                isActive 
                  ? "bg-success-light text-success" 
                  : "text-text-secondary hover:bg-gray-50"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-success rounded-r-full" />
              )}
              <Icon className={cn("w-5 h-5", isActive ? "text-success" : "text-text-secondary")} />
              <span className="text-[14px] font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section: Profile & Settings */}
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-3 p-2 bg-muted/50 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-success text-white flex items-center justify-center font-bold text-sm">
            RK
          </div>
          <div className="flex flex-col truncate">
            <span className="text-sm font-bold text-text-primary truncate">Rajesh Kumar</span>
            <div className="flex items-center text-[10px] text-warning font-bold">
              ★ 4.8 Rating
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors w-full group"
        >
          <div className="p-2 bg-red-50 group-hover:bg-red-100 rounded-lg transition-all">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="text-sm font-bold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
