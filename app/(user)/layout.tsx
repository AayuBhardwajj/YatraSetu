"use client";

import React from "react";
import { UserSidebar } from "@/components/user/UserSidebar";
import { UserHeader } from "@/components/user/UserHeader";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Fixed Sidebar */}
      <UserSidebar />

      {/* Main Content Area — offset by sidebar width + sidebar margins */}
      <div className="flex-1 flex flex-col ml-[290px] min-h-screen">
        {/* Sticky Header */}
        <UserHeader />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
