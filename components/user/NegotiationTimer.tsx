"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NegotiationTimerProps {
  duration?: number;
  onTimeout?: () => void;
  size?: number;
  strokeWidth?: number;
}

export const NegotiationTimer: React.FC<NegotiationTimerProps> = ({
  duration = 30,
  onTimeout,
  size = 64,
  strokeWidth = 6,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout?.();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);

  const offset = circumference - (timeLeft / duration) * circumference;

  const getColor = () => {
    if (timeLeft > duration * 0.6) return "stroke-success";
    if (timeLeft > duration * 0.3) return "stroke-warning";
    return "stroke-danger";
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("transition-all duration-1000 ease-linear", getColor())}
        />
      </svg>
      <span className="absolute text-lg font-medium tabular-nums">{timeLeft}</span>
    </div>
  );
};
