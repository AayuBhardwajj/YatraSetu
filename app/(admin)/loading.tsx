"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-6 flex flex-col h-full overflow-hidden">
      <header className="flex items-center justify-between pb-4 border-b border-border">
        <div className="space-y-2">
           <Skeleton className="w-48 h-8 rounded-lg" />
           <Skeleton className="w-64 h-4 rounded" />
        </div>
        <div className="flex gap-3">
           <Skeleton className="w-32 h-10 rounded-lg" />
           <Skeleton className="w-32 h-10 rounded-lg" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <Skeleton key={i} className="h-32 rounded-card shadow-sm" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1">
        <div className="lg:col-span-3 h-full">
           <Skeleton className="w-full h-full rounded-card border" />
        </div>
        <div className="lg:col-span-2 space-y-6 h-full">
           <Skeleton className="w-full h-[320px] rounded-card border shadow-sm" />
           <Skeleton className="w-full h-40 rounded-card border shadow-sm" />
        </div>
      </div>
    </div>
  );
}
