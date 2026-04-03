"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  children: React.ReactNode;
  height?: "40%" | "60%" | "auto";
  className?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  height = "40%",
  className,
}) => {
  const heightClass = {
    "40%": "h-[40vh]",
    "60%": "h-[60vh]",
    auto: "h-auto",
  }[height];

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 bg-surface border-t border-border rounded-t-sheet shadow-2xl z-50 transform transition-transform duration-300",
        heightClass,
        className
      )}
    >
      {/* Drag Handle Bar */}
      <div className="flex justify-center p-2">
        <div className="w-8 h-1 bg-muted-foreground/30 rounded-full" />
      </div>

      {/* Content Area */}
      <div className="p-4 h-full overflow-y-auto">{children}</div>
    </div>
  );
};
