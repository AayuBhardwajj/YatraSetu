"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserLoading() {
  return (
    <div className="flex flex-col h-screen bg-muted/10 p-4 space-y-6">
      <div className="h-[60%] w-full rounded-2xl overflow-hidden relative">
        <Skeleton className="w-full h-full bg-muted" />
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Skeleton className="w-12 h-12 rounded-xl" />
          <Skeleton className="w-40 h-10 rounded-full" />
          <Skeleton className="w-12 h-12 rounded-xl" />
        </div>
      </div>
      <div className="flex-1 space-y-6 p-2">
        <Skeleton className="w-full h-14 rounded-xl" />
        <div className="flex gap-4">
           <Skeleton className="w-24 h-10 rounded-full" />
           <Skeleton className="w-24 h-10 rounded-full" />
           <Skeleton className="w-24 h-10 rounded-full" />
        </div>
        <div className="space-y-3">
           <Skeleton className="w-full h-20 rounded-2xl" />
           <Skeleton className="w-full h-20 rounded-2xl" />
        </div>
        <Skeleton className="w-full h-24 rounded-2xl" />
      </div>
    </div>
  );
}
