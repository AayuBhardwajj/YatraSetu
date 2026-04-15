"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface MapPlaceholderProps {
  className?: string;
  height?: string;
  showDriverDots?: boolean;
  showRoute?: boolean;
  showRequestPins?: boolean;
}

export const MapPlaceholder: React.FC<MapPlaceholderProps> = ({
  className,
  height = "100%",
  showDriverDots = true,
  showRoute = false,
  showRequestPins = false,
}) => {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden bg-[#1a1a2e] flex items-center justify-center",
        className
      )}
      style={{ height }}
    >
      {/* Animated Grid of Dots */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-4 p-4">
        {Array.from({ length: 144 }).map((_, i) => (
          <div
            key={i}
            className="w-1 h-1 bg-success/40 rounded-full animate-pulse-green"
            style={{
              animationDelay: `${(i * 0.11) % 3}s`,
            }}
          />
        ))}
      </div>

      {/* Driver Dots (Green) */}
      {showDriverDots && (
        <>
          <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-success rounded-full border-2 border-white/20 animate-bounce" />
          <div className="absolute top-2/3 left-1/2 w-3 h-3 bg-success rounded-full border-2 border-white/20 animate-bounce delay-150" />
          <div className="absolute top-1/2 left-3/4 w-3 h-3 bg-success rounded-full border-2 border-white/20 animate-bounce delay-300" />
        </>
      )}

      {/* Request Pins (Amber) */}
      {showRequestPins && (
        <>
          <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-warning rounded-full border-2 border-white/20 pulse-amber" />
          <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-warning rounded-full border-2 border-white/20 pulse-amber" />
        </>
      )}

      {/* Route Line (Dashed Green) */}
      {showRoute && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <path
            d="M 200,200 Q 400,300 600,200"
            stroke="#00C853"
            strokeWidth="3"
            fill="transparent"
            strokeDasharray="8 8"
            className="animate-dash"
          />
        </svg>
      )}

      {/* Center Location Pin */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="bg-primary/30 w-16 h-16 rounded-full animate-ping absolute -inset-0" />
        <div className="bg-primary p-3 rounded-full shadow-lg border-2 border-white/20">
          <MapPin className="w-8 h-8 text-white fill-white/20" />
        </div>
      </div>

      {/* Subtle Map Lines (SVG) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 100 H1200 M0 300 H1200 M0 500 H1200 M200 0 V800 M500 0 V800 M800 0 V800" stroke="white" strokeWidth="1" />
        <path d="M100 0 L1100 800 M1100 0 L100 800" stroke="white" strokeWidth="0.5" />
      </svg>
    </div>
  );
};
