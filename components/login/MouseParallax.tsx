"use client";

import React, { useEffect, useMemo } from "react";
import { motion, useSpring, useMotionValue, useMotionTemplate } from "framer-motion";

/* Floating animated car silhouettes */
const FloatingVehicle = ({ delay, x, y, scale, rotate }: { delay: number; x: string; y: string; scale: number; rotate: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: [0, 0.15, 0.15, 0], x: [-30, 0, 200, 400] }}
    transition={{ duration: 12, delay, repeat: Infinity, ease: "linear" }}
  >
    <svg width={48 * scale} height={24 * scale} viewBox="0 0 48 24" fill="none" className="text-white">
      <path d="M8 18h4a3 3 0 006 0h8a3 3 0 006 0h4v-4l-4-8H14l-6 8v4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="14" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="34" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 10l4-4h12l4 4" stroke="currentColor" strokeWidth="1" opacity="0.5" />
    </svg>
  </motion.div>
);

/* Road lines animation */
const RoadLine = ({ delay, top }: { delay: number; top: string }) => (
  <motion.div
    className="absolute h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
    style={{ top, left: "0%", width: "40%" }}
    initial={{ x: "-100%" }}
    animate={{ x: "300%" }}
    transition={{ duration: 6, delay, repeat: Infinity, ease: "linear" }}
  />
);

/* Glowing orb */
const GlowOrb = ({ color, size, x, y, delay }: { color: string; size: number; x: string; y: string; delay: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: size,
      height: size,
      left: x,
      top: y,
      background: color,
      filter: `blur(${size / 2}px)`,
    }}
    animate={{
      scale: [1, 1.3, 1],
      opacity: [0.3, 0.6, 0.3],
    }}
    transition={{ duration: 5, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

/* Grid pattern */
const GridPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

interface AuthBackgroundProps {
  children: React.ReactNode;
}

export const AuthBackground: React.FC<AuthBackgroundProps> = ({ children }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const cursorGlow = useMotionTemplate`radial-gradient(600px circle at ${springX}px ${springY}px, rgba(108, 71, 255, 0.08), transparent 70%)`;

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#07070F] flex">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1a] via-[#07070F] to-[#100a20]" />

      {/* Grid */}
      <GridPattern />

      {/* Animated orbs */}
      <GlowOrb color="rgba(108, 71, 255, 0.4)" size={400} x="10%" y="20%" delay={0} />
      <GlowOrb color="rgba(0, 200, 83, 0.2)" size={300} x="70%" y="60%" delay={2} />
      <GlowOrb color="rgba(108, 71, 255, 0.15)" size={500} x="50%" y="80%" delay={4} />

      {/* Road lines */}
      <RoadLine delay={0} top="30%" />
      <RoadLine delay={2} top="50%" />
      <RoadLine delay={4} top="70%" />

      {/* Floating vehicles */}
      <FloatingVehicle delay={0} x="5%" y="25%" scale={1} rotate={0} />
      <FloatingVehicle delay={4} x="15%" y="55%" scale={0.8} rotate={0} />
      <FloatingVehicle delay={8} x="10%" y="75%" scale={1.2} rotate={0} />

      {/* Cursor glow follower */}
      <motion.div className="absolute inset-0 pointer-events-none" style={{ background: cursorGlow }} />

      {/* Content */}
      <div className="relative z-10 w-full min-h-screen flex">
        {children}
      </div>
    </div>
  );
};
