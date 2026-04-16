"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

const RoadDash = ({ delay, top, width }: { delay: number; top: string; width: string }) => (
  <motion.div
    className="absolute h-[2px] rounded-full"
    style={{
      top, left: "-10%", width,
      background: "linear-gradient(90deg, transparent, rgba(0,210,180,0.35), transparent)",
    }}
    initial={{ x: "-10%" }}
    animate={{ x: "120vw" }}
    transition={{ duration: 7 + delay, delay, repeat: Infinity, ease: "linear" }}
  />
);

const FloatingCar = ({ delay, top, scale }: { delay: number; top: string; scale: number }) => (
  <motion.div
    className="absolute pointer-events-none"
    style={{ top, left: "-80px" }}
    initial={{ x: -80, opacity: 0 }}
    animate={{ x: "110vw", opacity: [0, 0.18, 0.18, 0] }}
    transition={{ duration: 14 + delay * 2, delay, repeat: Infinity, ease: "linear" }}
  >
    <svg width={56 * scale} height={28 * scale} viewBox="0 0 56 28" fill="none">
      <rect x="8" y="10" width="40" height="12" rx="4" stroke="rgba(0,210,180,0.6)" strokeWidth="1.5" />
      <path d="M14 10 L20 4 H36 L42 10" stroke="rgba(0,210,180,0.4)" strokeWidth="1.2" />
      <circle cx="16" cy="22" r="3" stroke="rgba(0,210,180,0.6)" strokeWidth="1.5" />
      <circle cx="40" cy="22" r="3" stroke="rgba(0,210,180,0.6)" strokeWidth="1.5" />
      <rect x="44" y="13" width="6" height="3" rx="1" fill="rgba(251,191,36,0.5)" />
      <rect x="6" y="13" width="4" height="3" rx="1" fill="rgba(251,191,36,0.3)" />
    </svg>
  </motion.div>
);

const GlowOrb = ({ color, size, x, y, delay }: { color: string; size: number; x: string; y: string; delay: number }) => (
  <motion.div
    className="absolute rounded-full pointer-events-none"
    style={{ width: size, height: size, left: x, top: y, background: color, filter: `blur(${size / 2.2}px)` }}
    animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.5, 0.25] }}
    transition={{ duration: 6 + delay, delay, repeat: Infinity, ease: "easeInOut" }}
  />
);

const DotGrid = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.045] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse">
        <circle cx="1" cy="1" r="1" fill="white" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dots)" />
  </svg>
);

const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // ✅ Defer heavy work so it doesn't block initial paint
    const timer = setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles: { x: number; y: number; r: number; alpha: number; vx: number; vy: number }[] = [];
      for (let i = 0; i < 55; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.8 + 0.4,
          alpha: Math.random() * 0.4 + 0.1,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
        });
      }

      let animId: number;
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0,210,180,${p.alpha})`;
          ctx.fill();
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
        });
        animId = requestAnimationFrame(draw);
      };
      draw();

      const onResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      window.addEventListener("resize", onResize);

      // store cleanup on canvas element for the outer effect's return
      (canvas as any)._cleanup = () => {
        cancelAnimationFrame(animId);
        window.removeEventListener("resize", onResize);
      };
    }, 300); // ✅ 300ms delay — login card paints first

    return () => {
      clearTimeout(timer);
      const canvas = canvasRef.current;
      if (canvas && (canvas as any)._cleanup) (canvas as any)._cleanup();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};

interface AuthBackgroundProps {
  children: React.ReactNode;
}

export const AuthBackground: React.FC<AuthBackgroundProps> = ({ children }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 35, damping: 22 });
  const springY = useSpring(mouseY, { stiffness: 35, damping: 22 });

  // ✅ Track whether mouse has ever moved (desktop only)
  const [hasMoused, setHasMoused] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setHasMoused(true);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden flex" style={{ background: "#060D1F" }}>
      <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #060D1F 0%, #0A1628 50%, #060D1F 100%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 20% 50%, rgba(0,210,180,0.06) 0%, transparent 60%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 80% at 80% 30%, rgba(99,102,241,0.08) 0%, transparent 60%)" }} />

      <DotGrid />
      <ParticleCanvas />

      <GlowOrb color="rgba(0,210,180,0.35)" size={380} x="5%" y="15%" delay={0} />
      <GlowOrb color="rgba(99,102,241,0.25)" size={320} x="65%" y="55%" delay={2.5} />
      <GlowOrb color="rgba(251,191,36,0.12)" size={260} x="45%" y="75%" delay={5} />

      <RoadDash delay={0} top="28%" width="35%" />
      <RoadDash delay={2.5} top="52%" width="28%" />
      <RoadDash delay={5} top="72%" width="40%" />

      <FloatingCar delay={0} top="22%" scale={1} />
      <FloatingCar delay={5} top="50%" scale={0.75} />
      <FloatingCar delay={10} top="70%" scale={1.1} />

      {/* ✅ Only render cursor glow on desktop after mouse has moved */}
      {hasMoused && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(520px circle at ${springX}px ${springY}px, rgba(0,210,180,0.07), transparent 65%)`,
          }}
        />
      )}

      <div className="relative z-10 w-full min-h-screen flex">
        {children}
      </div>
    </div>
  );
};
