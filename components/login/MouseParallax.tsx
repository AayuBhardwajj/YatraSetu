"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";

const Wave = ({ 
  className, 
  duration = 20, 
  opacity = 0.3, 
  delay = 0, 
  height = 40,
  points = 5
}: { 
  className?: string; 
  duration?: number; 
  opacity?: number; 
  delay?: number;
  height?: number;
  points?: number;
}) => {
  const path = useMemo(() => {
    const segments = [];
    const step = 100 / (points - 1);
    for (let i = 0; i < points; i++) {
        segments.push(`${i * step}% ${50 + (i % 2 === 0 ? height : -height)}%`);
    }
    return `M -10% 50% Q 25% ${50 + height}% 50% 50% T 110% 50% V 110% H -10% Z`;
  }, [height, points]);

  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      initial={{ x: "-10%", opacity: 0 }}
      animate={{ 
        x: ["-10%", "0%", "-10%"],
        opacity: opacity
      }}
      transition={{
        x: {
          duration: duration,
          repeat: Infinity,
          ease: "linear",
          delay: delay
        },
        opacity: { duration: 2 }
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-[200%] h-full"
      >
        <path
          d="M 0 50 C 20 20 40 80 60 50 C 80 20 100 80 120 50 C 140 20 160 80 180 50 V 100 H 0 Z"
          fill="currentColor"
        />
      </svg>
    </motion.div>
  );
};

export const MouseParallax: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#000000] flex items-center justify-center">
      {/* Animated Layered Waves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <Wave 
          className="text-primary/20 blur-xl" 
          duration={25} 
          opacity={0.15} 
          delay={0}
        />
        <Wave 
          className="text-primary/10 blur-2xl" 
          duration={35} 
          opacity={0.1} 
          delay={-5}
        />
        <Wave 
          className="text-primary/30 blur-3xl" 
          duration={18} 
          opacity={0.08} 
          delay={-2}
        />
      </div>

      {/* Radial Glow Cursor Following Effect (Illuminates waves) */}
      <motion.div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          background: `radial-gradient(800px circle at var(--x) var(--y), rgba(108, 71, 255, 0.4), transparent 80%)`,
          "--x": springX.get() + "px",
          "--y": springY.get() + "px"
        } as any}
      />
      
      {/* Dynamic Deep Aura Glow */}
      <motion.div
        className="absolute w-[1000px] h-[1000px] bg-primary/10 rounded-full blur-[150px] pointer-events-none opacity-40 mix-blend-screen"
        style={{ x: useSpring(mouseX, { stiffness: 40 }), y: useSpring(mouseY, { stiffness: 40 }), left: -500, top: -500 }}
      />

      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
