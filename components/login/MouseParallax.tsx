"use client";

import React, { useEffect, useMemo } from "react";
import { motion, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";

const Wave = ({ 
  className, 
  duration = 20, 
  opacity = 0.3, 
  delay = 0, 
}: { 
  className?: string; 
  duration?: number; 
  opacity?: number; 
  delay?: number;
}) => {
  return (
    <motion.div
      className={`absolute inset-0 ${className}`}
      initial={{ x: "-20%", opacity: 0 }}
      animate={{ 
        x: ["-20%", "0%", "-20%"],
        opacity: opacity
      }}
      transition={{
        x: {
          duration: duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay
        },
        opacity: { duration: 2 }
      }}
    >
      <svg
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        className="w-[300%] h-full opacity-50"
      >
        <path
          d="M0 50 C 150 0, 350 100, 500 50 C 650 0, 850 100, 1000 50 L 1000 100 L 0 100 Z"
          fill="currentColor"
        />
      </svg>
    </motion.div>
  );
};

export const MouseParallax: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const background = useMotionTemplate`radial-gradient(800px circle at ${springX}px ${springY}px, rgba(108, 71, 255, 0.15), transparent 80%)`;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#000000] flex items-center justify-center">
      {/* Animated Layered Waves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Wave 
          className="text-primary/40 blur-2xl" 
          duration={20} 
          opacity={0.2} 
          delay={0}
        />
        <Wave 
          className="text-primary/20 blur-3xl" 
          duration={30} 
          opacity={0.15} 
          delay={-5}
        />
        <Wave 
          className="text-primary/60 blur-xl" 
          duration={15} 
          opacity={0.1} 
          delay={-2}
        />
      </div>

      {/* Radial Glow Cursor Following Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background }}
      />
      
      {/* Dynamic Deep Aura Glow */}
      <motion.div
        className="absolute w-[1200px] h-[1200px] bg-primary/10 rounded-full blur-[160px] pointer-events-none opacity-50"
        style={{ 
          x: useSpring(mouseX, { stiffness: 30, damping: 25 }), 
          y: useSpring(mouseY, { stiffness: 30, damping: 25 }), 
          left: -600, 
          top: -600 
        }}
      />

      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};
