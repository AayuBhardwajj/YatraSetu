"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapPlaceholderProps {
  className?: string;
  showDriverDots?: boolean;
}

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  className,
  showDriverDots = true,
}) => {
  return (
    <div
      className={cn(
        "relative w-full h-full bg-[#1a1a2e] overflow-hidden flex items-center justify-center",
        className
      )}
    >
      {/* Animated Grid of Dots */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-4 p-4 opacity-20">
        {Array.from({ length: 144 }).map((_, i) => (
          <div
            key={i}
            className="w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Driver Dots */}
      {showDriverDots && (
        <>
          <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-success rounded-full shadow-[0_0_8px_#00C853] animate-bounce" />
          <div className="absolute top-2/3 left-1/2 w-2 h-2 bg-success rounded-full shadow-[0_0_8px_#00C853] animate-bounce delay-150" />
          <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-success rounded-full shadow-[0_0_8px_#00C853] animate-bounce delay-300" />
        </>
      )}

      {/* Center Location Pin */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="bg-primary/20 p-4 rounded-full animate-ping absolute -inset-2" />
        <MapPin className="w-10 h-10 text-primary fill-primary/20" />
      </div>

      {/* Subtle Map Lines (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 100 Q 250 50 500 100 T 1000 100"
          stroke="white"
          fill="transparent"
          strokeWidth="1"
        />
        <path
          d="M100 0 Q 150 250 100 500 T 100 1000"
          stroke="white"
          fill="transparent"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};
