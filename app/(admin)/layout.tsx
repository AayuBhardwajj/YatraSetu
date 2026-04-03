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
  Bell
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
  { id: "map", label: "Live Map", icon: MapIcon, path: "/admin/live-map" },
  { id: "rides", label: "All Rides", icon: ListOrdered, path: "/admin/rides" },
  { id: "drivers", label: "Drivers", icon: Users, path: "/admin/drivers" },
  { id: "pricing", label: "Pricing Config", icon: Settings2, path: "/admin/pricing" },
  { id: "analytics", label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { id: "disputes", label: "Disputes", icon: AlertCircle, path: "/admin/disputes" },
  { id: "settings", label: "Settings", icon: Settings, path: "/admin/settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-[#F7F7FA] overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[240px] h-full bg-white border-r border-border flex flex-col z-20">
        {/* Logo Section */}
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-lg">
            Z
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">Zipp Admin</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Active = pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                  Active 
                    ? "bg-primary text-white shadow-md shadow-primary/20" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5", Active ? "text-white" : "text-muted-foreground")} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-border space-y-4">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="w-9 h-9 border border-border">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold uppercase">
                {user?.name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-foreground truncate">{user?.name || "Admin Arjun"}</p>
              <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Ops Manager</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-danger hover:bg-danger/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar header */}
        <header className="h-16 bg-white border-b border-border px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
             <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Live System Status</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted rounded-full relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full ring-2 ring-white" />
            </button>
            <div className="h-8 w-[1px] bg-border" />
            <div className="text-right">
              <p className="text-xs font-bold text-foreground">Next Data Refresh</p>
              <p className="text-[10px] text-muted-foreground">in 24 seconds</p>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
