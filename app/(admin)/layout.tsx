"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  ListOrdered, 
  Users, 
  Settings2, 
  BarChart3, 
  AlertCircle, 
  Settings,
  LogOut,
  Bell,
  Search,
  Zap,
  Globe,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { id: "map", label: "Live Network", icon: MapIcon, path: "/admin/live-map" },
  { id: "drivers", label: "Fleet Management", icon: Users, path: "/admin/drivers" },
  { id: "analytics", label: "Intelligence", icon: BarChart3, path: "/admin/analytics" },
  { id: "disputes", label: "Resolutions", icon: AlertCircle, path: "/admin/disputes" },
  { id: "pricing", label: "Economic Config", icon: Settings2, path: "/admin/pricing" },
  { id: "settings", label: "System Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-[280px] h-full bg-white border-r border-border/50 flex flex-col z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        {/* Logo Section */}
        <div className="p-8 pb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 transition-transform hover:scale-105">
            Z
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight text-text-primary leading-none">Zipp Admin</span>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mt-1">Command Center</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300 group",
                  isActive 
                    ? "bg-primary text-white shadow-xl shadow-primary/15 translate-x-1" 
                    : "text-text-muted hover:bg-muted/50 hover:text-text-primary"
                )}
              >
                <div className="flex items-center gap-3.5">
                  <Icon className={cn("w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-white" : "text-text-muted")} />
                  <span className="text-[15px] font-bold tracking-tight">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 opacity-70" />}
              </button>
            );
          })}
        </nav>

        {/* System Health Card */}
        <div className="px-6 py-6 border-t border-border/50">
          <div className="bg-muted/30 rounded-3xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none">System Health</span>
              <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-text-secondary">
                <span>Network Load</span>
                <span>24%</span>
              </div>
              <div className="h-1.5 bg-white rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[24%]" />
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="p-6 pt-2 border-t border-border/50">
          <button className="w-full flex items-center gap-3 p-2 rounded-2xl hover:bg-muted/50 transition-all text-left">
            <Avatar className="w-10 h-10 border-2 border-white shadow-md">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                {user?.name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-primary truncate">{user?.name || "Arjun Sharma"}</p>
              <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Ops Lead</p>
            </div>
          </button>
          
          <Button 
            onClick={handleLogout}
            variant="ghost"
            className="w-full mt-4 flex items-center justify-start gap-3 px-3 py-2 text-sm font-bold text-danger hover:text-danger hover:bg-danger-light rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout System
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-xl border-b border-border/40 px-10 flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-6 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-text-muted" />
              <Input 
                placeholder="Search rides, drivers, or system logs..." 
                className="w-full pl-12 h-11 bg-muted/40 border-none rounded-2xl font-medium focus-visible:ring-primary/10 placeholder:text-text-muted/60"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-success-light rounded-2xl border border-success/10">
              <Zap className="w-4 h-4 text-success fill-success" />
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-success uppercase tracking-widest leading-none mb-0.5">Live Data</span>
                <span className="text-xs font-bold text-text-primary">Synced 2s ago</span>
              </div>
            </div>

            <div className="h-10 w-[1px] bg-border/50" />

            <div className="flex items-center gap-3">
              <button className="w-11 h-11 flex items-center justify-center bg-white border border-border/60 hover:border-primary/30 rounded-2xl transition-all relative group">
                <Bell className="w-5.5 h-5.5 text-text-muted group-hover:text-primary transition-colors" />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-danger rounded-full ring-4 ring-white" />
              </button>
              <button className="w-11 h-11 flex items-center justify-center bg-white border border-border/60 hover:border-primary/30 rounded-2xl transition-all group">
                <Globe className="w-5.5 h-5.5 text-text-muted group-hover:text-primary transition-colors" />
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto no-scrollbar bg-[#f8fafc]">
          <div className="p-10 min-h-full">
            {children}
          </div>
        </main>

        {/* Floating System Notification (Subtle) */}
        <div className="absolute bottom-8 right-8 z-40 animate-in slide-in-from-right-10 duration-700">
          <div className="bg-white/90 backdrop-blur-md border border-border/50 px-6 py-4 rounded-[28px] shadow-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">System Secure</p>
              <p className="text-[11px] text-text-muted font-medium">All nodes operational</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
