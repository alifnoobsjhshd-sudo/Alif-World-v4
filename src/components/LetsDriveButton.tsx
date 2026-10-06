import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Compass, Sparkles } from 'lucide-react';

export interface LetsDriveButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
}

export const LetsDriveButton: React.FC<LetsDriveButtonProps> = ({
  onClick,
  onMouseEnter,
  onMouseLeave,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Proximity lighting states
  const [proximity, setProximity] = useState(0);
  const [conicAngle, setConicAngle] = useState(0);
  const [spread, setSpread] = useState(35);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Magnetic spring physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 220, damping: 18, mass: 0.35 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const rotateX = useTransform(smoothY, [-18, 18], [6, -6]);
  const rotateY = useTransform(smoothX, [-18, 18], [-6, 6]);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window && window.innerWidth < 1024;
    setIsTouchDevice(isTouch);
  }, []);

  // ── Global Mouse/Cursor Tracker for Distance-Based Nearest-Side Lighting ──
  const handleGlobalPointerMove = useCallback((e: MouseEvent | PointerEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const mx = e.clientX;
    const my = e.clientY;

    // Check if cursor is directly on the button
    const inside = mx >= rect.left && mx <= rect.right && my >= rect.top && my <= rect.bottom;

    if (inside) {
      setIsHovered(true);
      setProximity(1);
      setSpread(360);
      return;
    }

    setIsHovered(false);

    // Compute closest distance from cursor to button rectangle edge
    const dx = Math.max(rect.left - mx, 0, mx - rect.right);
    const dy = Math.max(rect.top - my, 0, my - rect.bottom);
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Maximum influence distance (lights up gradually as cursor approaches within 420px)
    const maxDist = 420;
    const prox = Math.max(0, Math.min(1, 1 - dist / maxDist));
    setProximity(prox);

    // Calculate angle from button center to mouse
    // Conic gradient 0deg starts at 12 o'clock (top), 90deg is 3 o'clock (right)
    const angleRad = Math.atan2(my - cy, mx - cx);
    const angleDeg = (angleRad * 180) / Math.PI;
    const normConic = (angleDeg + 90 + 360) % 360;
    setConicAngle(normConic);

    // Dynamic light beam spread angle:
    // When far away: tight focus (approx 32deg) concentrated strictly on the closest edge
    // When closer: broadens up to ~155deg covering the near face and corners
    const currentSpread = 32 + prox * 125;
    setSpread(currentSpread);
  }, []);

  useEffect(() => {
    const handleVirtual = (e: Event) => {
      const ev = e as CustomEvent<{ x: number; y: number }>;
      if (!ev.detail) return;
      handleGlobalPointerMove({ clientX: ev.detail.x, clientY: ev.detail.y } as MouseEvent);
    };

    window.addEventListener('mousemove', handleGlobalPointerMove, { passive: true });
    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true });
    window.addEventListener('virtual-cursor-move', handleVirtual);
    return () => {
      window.removeEventListener('mousemove', handleGlobalPointerMove);
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('virtual-cursor-move', handleVirtual);
    };
  }, [handleGlobalPointerMove]);

  // Magnetic hover tracking inside button
  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (isTouchDevice) return;
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const diffX = e.clientX - (rect.left + centerX);
    const diffY = e.clientY - (rect.top + centerY);
    mouseX.set(Math.max(-18, Math.min(18, diffX * 0.3)));
    mouseY.set(Math.max(-18, Math.min(18, diffY * 0.3)));
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    setProximity(1);
    setSpread(360);
    if (onMouseEnter) onMouseEnter();
  };

  const handlePointerLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    if (onMouseLeave) onMouseLeave();
  };

  // Gradient definitions:
  // 1. Hovered: Full vibrant 360deg emerald/teal/amber outline
  // 2. Proximity: Conic gradient starting and ending transparent, with brilliant emerald peak facing cursor
  const outlineGradient = isHovered
    ? 'conic-gradient(from 0deg, #10b981, #34d399, #6ee7b7, #38bdf8, #a7f3d0, #10b981)'
    : proximity > 0.02
    ? `conic-gradient(from ${conicAngle - spread / 2}deg, transparent 0deg, rgba(52,211,153,0.15) ${spread * 0.15}deg, rgba(110,231,183,1) ${spread * 0.5}deg, rgba(52,211,153,0.15) ${spread * 0.85}deg, transparent ${spread}deg, transparent 360deg)`
    : 'rgba(52,211,153,0.22)';

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center justify-center p-[2.5px] rounded-2xl sm:rounded-3xl select-none group ${className}`}
    >
      {/* ── 1. AMBIENT SOFT DIRECTIONAL GLOW (Casts emerald light toward the cursor) ── */}
      <div
        className="absolute -inset-[3.5px] rounded-2xl sm:rounded-3xl pointer-events-none transition-opacity duration-150 filter blur-[9px]"
        style={{
          background: isHovered
            ? 'radial-gradient(ellipse at 50% 50%, rgba(52,211,153,0.7) 0%, rgba(16,185,129,0.35) 70%, transparent 100%)'
            : proximity > 0.05
            ? `conic-gradient(from ${conicAngle - spread / 2}deg, transparent 0deg, rgba(16,185,129,0.85) ${spread * 0.5}deg, transparent ${spread}deg, transparent 360deg)`
            : 'transparent',
          opacity: isHovered ? 0.95 : proximity * 0.85,
        }}
      />

      {/* ── 2. CURSOR-FOLLOW GRADIENT OUTLINE STROKE ───────────────────────────── */}
      {/* Lights up the nearest edge facing the cursor, expands with proximity, full on hover */}
      <div
        className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none transition-opacity duration-100 will-change-transform"
        style={{
          padding: '2.5px',
          background: outlineGradient,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          opacity: isHovered ? 1 : Math.max(0.2, proximity * 1.15),
        }}
      />

      {/* ── 3. BUTTON BODY: "LET'S DRIVE" WITH 3D MAGNETIC TILT & LIQUID SHIMMER ── */}
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={onClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
        title="LET'S DRIVE · Enter Alif's World"
        aria-label="LET'S DRIVE"
        style={{
          x: isTouchDevice ? 0 : smoothX,
          y: isTouchDevice ? 0 : smoothY,
          rotateX: isTouchDevice ? 0 : rotateX,
          rotateY: isTouchDevice ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileTap={{ scale: 0.94 }}
        className="relative w-56 xs:w-64 sm:w-72 md:w-76 lg:w-80 py-3.5 sm:py-4 px-5 sm:px-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white font-display font-black tracking-wider uppercase text-xs xs:text-sm sm:text-base lg:text-lg flex items-center justify-center gap-2.5 overflow-hidden cursor-pointer shadow-[0_12px_32px_rgba(16,185,129,0.38)] active:shadow-sm will-change-transform"
      >
        {/* Specular Liquid Wave Shimmer */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ borderRadius: 'inherit' }}>
          <motion.div
            animate={{
              x: ['-120%', '220%'],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: [0.4, 0, 0.2, 1],
              repeatDelay: 1.5,
            }}
            className="absolute inset-y-0 w-28 -skew-x-12 pointer-events-none opacity-45 bg-gradient-to-r from-transparent via-white to-transparent"
          />
        </div>

        {/* Top Glass Specular Glint */}
        <div
          className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/30 to-transparent pointer-events-none"
          style={{ borderRadius: 'inherit' }}
        />

        {/* Content */}
        <Compass className="w-5 h-5 text-emerald-100 group-hover:rotate-45 transition-transform duration-500 shrink-0 drop-shadow" />
        <span className="drop-shadow-md whitespace-nowrap">
          LET'S DRIVE
        </span>
        <Sparkles className="w-4 h-4 text-amber-200 shrink-0 animate-pulse drop-shadow" />
      </motion.button>
    </div>
  );
};
