"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { Home, Activity, Wallet, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home, path: "/home" },
  { id: "activity", label: "Activity", icon: Activity, path: "/activity" },
  { id: "wallet", label: "Wallet", icon: Wallet, path: "/wallet" },
  { id: "profile", label: "Profile", icon: UserIcon, path: "/profile" },
];

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path: string) => {
    if (path === "/home") return pathname === "/home" || pathname === "/booking";
    return pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-muted flex justify-center">
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
