"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface PriceRangeBarProps {
  min: number;
  max: number;
  suggested: number;
  userOffer?: number;
  className?: string;
}

export const PriceRangeBar: React.FC<PriceRangeBarProps> = ({
  min,
  max,
  suggested,
  userOffer,
  className,
}) => {
  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const suggestedLeft = getPercentage(suggested);
  const userOfferLeft = userOffer ? getPercentage(userOffer) : null;

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative h-2 w-full rounded-full bg-gradient-to-r from-success via-warning to-danger opacity-80" />

      {/* Suggested Provider Marker */}
      <div
        className="absolute top-0 transition-all duration-300 transform -translate-x-1/2"
        style={{ left: `${suggestedLeft}%` }}
      >
        <div className="w-1 h-4 bg-primary rounded-full shadow-sm" />
        <div className="text-[10px] text-primary font-medium mt-1">Suggested</div>
      </div>

      {/* User Offer Marker */}
      {userOfferLeft !== null && (
        <div
          className="absolute top-0 transition-all duration-300 transform -translate-x-1/2"
          style={{ left: `${userOfferLeft}%` }}
        >
          <div className="w-3 h-3 bg-white border-2 border-primary rounded-full shadow-md -mt-0.5" />
          <div className="text-[10px] text-primary font-bold mt-2">You</div>
        </div>
      )}

      {/* Range Labels */}
      <div className="flex justify-between mt-4 text-[12px] text-muted-foreground font-tabular">
        <span>₹{min}</span>
        <span>₹{max}</span>
      </div>
    </div>
  );
};
