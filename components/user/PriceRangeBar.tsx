"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PriceRangeBarProps {
  min: number;
  max: number;
  suggested: number;
  className?: string;
}

export const PriceRangeBar: React.FC<PriceRangeBarProps> = ({
  min,
  max,
  suggested,
  className,
}) => {
  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const percentage = getPercentage(suggested);

  return (
    <div className={cn("w-full py-6", className)}>
      <div className="relative pt-6">
        {/* Suggested Marker (Triangle Pointer) */}
        <div
          className="absolute top-0 transition-all duration-300 transform -translate-x-1/2 flex flex-col items-center"
          style={{ left: `${percentage}%` }}
        >
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-primary" />
        </div>

        {/* Gradient Bar */}
        <div className="relative h-2 w-full rounded-full overflow-hidden bg-muted">
          <div className="absolute inset-0 bg-gradient-to-r from-success via-warning to-danger" />
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-3 text-[12px] font-medium text-text-secondary font-tabular">
          <span>Min ₹{min}</span>
          <span>Max ₹{max}</span>
        </div>
      </div>
    </div>
  );
};
