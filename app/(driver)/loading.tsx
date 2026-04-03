"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DriverLoading() {
  return (
    <div className="flex flex-col h-screen bg-muted/5 p-4 space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
           <Skeleton className="w-10 h-10 rounded-full" />
           <div className="space-y-2">
              <Skeleton className="w-20 h-3 rounded" />
              <Skeleton className="w-32 h-4 rounded" />
           </div>
        </div>
        <Skeleton className="w-24 h-8 rounded-full" />
      </div>

      <div className="flex justify-center">
         <Skeleton className="w-full max-w-[400px] h-20 rounded-pill" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[1,2,3,4].map(i => (
          <Skeleton key={i} className="h-24 rounded-card" />
        ))}
      </div>

      <div className="space-y-4 pt-6">
        <Skeleton className="w-32 h-4 rounded uppercase tracking-widest pl-1" />
        <Skeleton className="w-full h-48 rounded-card border-dashed" />
      </div>
    </div>
  );
}
