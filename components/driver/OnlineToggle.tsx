"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface OnlineToggleProps {
  onToggle?: (isOnline: boolean) => void;
  initialState?: boolean;
  className?: string;
}

export const OnlineToggle: React.FC<OnlineToggleProps> = ({
  onToggle,
  initialState = false,
  className,
}) => {
  const [isOnline, setIsOnline] = useState(initialState);

  const handleToggle = () => {
    const newState = !isOnline;
    setIsOnline(newState);
    onToggle?.(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "relative w-full max-w-[400px] h-20 rounded-pill transition-all duration-500 ease-in-out px-4 py-2 ring-offset-2 focus:outline-none focus:ring-2 focus:ring-primary shadow-lg",
        isOnline ? "bg-success" : "bg-muted-foreground/30",
        className
      )}
    >
      {/* Background Pulse Effect (Online Only) */}
      {isOnline && (
        <div className="absolute inset-0 rounded-pill bg-success animate-ping opacity-20 pointer-events-none" />
      )}

      {/* Toggle Knob Container */}
      <div className="relative flex items-center justify-between w-full h-full">
        {/* Toggle Indicator Text (Offline) */}
        {!isOnline && (
          <span className="flex-1 text-center font-medium text-muted-foreground mr-16">
            You&apos;re Offline
          </span>
        )}

        {/* The Toggle Knob */}
        <div
          className={cn(
            "h-12 w-32 bg-white rounded-pill flex items-center justify-center shadow-md transition-all duration-500 ease-in-out absolute",
            isOnline ? "translate-x-[calc(100%-80px)]" : "translate-x-0"
          )}
        >
          <span
            className={cn(
              "font-bold text-sm uppercase tracking-wider",
              isOnline ? "text-success" : "text-muted-foreground"
            )}
          >
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>

        {/* Toggle Indicator Text (Online) */}
        {isOnline && (
          <span className="flex-1 text-center font-medium text-white ml-24">
            Finding Rides...
          </span>
        )}
      </div>
    </button>
  );
};
