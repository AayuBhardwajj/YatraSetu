"use client";

import React from "react";
import { DriverSidebar } from "@/components/driver/DriverSidebar";
import { DriverHeader } from "@/components/driver/DriverHeader";

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Sidebar - Fixed */}
      <DriverSidebar />

      {/* Main Content Area */}
      <div className="pl-[260px] flex flex-col min-h-screen">
        {/* Header - Sticky */}
        <DriverHeader />

        {/* Dynamic Content */}
        <main className="flex-1 w-full bg-[#FAFBFF]">
          {children}
        </main>
      </div>
    </div>
  );
}
