"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ListOrdered, IndianRupee, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/driver/dashboard" },
  { id: "requests", label: "Requests", icon: ListOrdered, path: "/driver/requests" },
  { id: "earnings", label: "Earnings", icon: IndianRupee, path: "/driver/earnings" },
  { id: "profile", label: "Profile", icon: UserIcon, path: "/driver/profile" },
];

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <div className="min-h-screen bg-muted/30 flex justify-center">
      {/* Mobile Frame */}
      <div className="w-full max-w-[430px] min-h-screen bg-surface relative flex flex-col shadow-xl">
        {/* Content */}
        <main className="flex-1 pb-20">{children}</main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-[430px] bg-surface border-t border-border px-6 py-3 flex items-center justify-between z-40">
          {NAV_ITEMS.map((item) => {
            const Active = isActive(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.path)}
                className="flex flex-col items-center space-y-1 transition-colors group"
              >
                <Icon
                  className={cn(
                    "w-6 h-6 transition-transform group-active:scale-90",
                    Active ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-[10px] font-medium transition-colors",
                    Active ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
