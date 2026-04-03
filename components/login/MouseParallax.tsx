"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

export const MouseParallax: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const x = useSpring(mousePosition.x, { stiffness: 50, damping: 20 });
  const y = useSpring(mousePosition.y, { stiffness: 50, damping: 20 });

  // Map mouse position to parallax offset
  const moveX = useTransform(x, [0, 2000], [-20, 20]);
  const moveY = useTransform(y, [0, 1000], [-20, 20]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#0D0D0D]">
      {/* Background Grid Pattern */}
      <motion.div
        style={{ x: moveX, y: moveY }}
        className="absolute inset-[-100px] opacity-20"
      >
        <div 
          className="w-full h-full" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 2px 2px, #6C47FF 1px, transparent 0)`,
            backgroundSize: '40px 40px' 
          }} 
        />
      </motion.div>

      {/* Floating Geometric Shapes */}
      <motion.div
        style={{ x: useTransform(x, [0, 2000], [-40, 40]), y: useTransform(y, [0, 1000], [-40, 40]) }}
        className="absolute top-1/4 left-1/4 w-64 h-64 border border-primary/30 rounded-full blur-3xl opacity-30"
      />
      <motion.div
        style={{ x: useTransform(x, [0, 2000], [40, -40]), y: useTransform(y, [0, 1000], [40, -40]) }}
        className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-primary/20 rounded-full blur-3xl opacity-20"
      />

      {children}
    </div>
  );
};
