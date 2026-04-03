"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NegotiationTimerProps {
  duration?: number;
  onTimeout?: () => void;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const NegotiationTimer: React.FC<NegotiationTimerProps> = ({
  duration = 30,
  onTimeout,
  size = 120,
  strokeWidth = 8,
  className,
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
    if (timeLeft > 20) return "text-success";
    if (timeLeft > 10) return "text-warning";
    return "text-danger";
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90 drop-shadow-sm">
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
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold font-tabular text-text-primary">{formatTime(timeLeft)}</span>
      </div>
    </div>
  );
};
