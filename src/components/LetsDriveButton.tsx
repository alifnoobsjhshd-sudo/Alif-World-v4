import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
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
  const [conicAngle, setConicAngle] = useState(0);
  const [spread, setSpread] = useState(24);
  const [isHovered, setIsHovered] = useState(false);
  const [proximityFactor, setProximityFactor] = useState(0.1);

  // ── Global Mouse/Cursor Tracker: Nearest side lights up at all distances ──
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
      setSpread(360);
      setProximityFactor(1);
      return;
    }

    setIsHovered(false);

    // Compute closest distance from cursor to button rectangle edge
    const dx = Math.max(rect.left - mx, 0, mx - rect.right);
    const dy = Math.max(rect.top - my, 0, my - rect.bottom);
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Continuous proximity ratio from 0 (very far) to 1 (touching edge)
    const maxDistanceScale = 850;
    const prox = Math.max(0, Math.min(1, 1 - dist / maxDistanceScale));
    setProximityFactor(prox);

    // Calculate angle from button center to mouse (conic 0deg is top, 90deg is right)
    const angleRad = Math.atan2(my - cy, mx - cx);
    const angleDeg = (angleRad * 180) / Math.PI;
    const normConic = (angleDeg + 90 + 360) % 360;
    setConicAngle(normConic);

    // Light spread angle:
    // When farther: small lit up area (approx 22deg - 26deg focused strictly on nearest side)
    // When closer: expands up to ~150deg covering the nearest face
    const currentSpread = 22 + prox * 128;
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

  // Subtle magnetic hover state (button position and size remain strictly locked)
  const handlePointerEnter = () => {
    setIsHovered(true);
    setSpread(360);
    setProximityFactor(1);
    if (onMouseEnter) onMouseEnter();
  };

  const handlePointerLeave = () => {
    if (onMouseLeave) onMouseLeave();
  };

  // Gradient definitions:
  // 1. On button (hovered): Full 360deg vibrant rainbow emerald/cyan/amber outline
  // 2. Farther: Outline lights up on the nearest side facing the cursor, small lit area, expands as cursor gets closer
  const outlineGradient = isHovered
    ? 'conic-gradient(from 0deg at 50% 50%, #10b981, #34d399, #6ee7b7, #38bdf8, #a7f3d0, #fde047, #10b981)'
    : `conic-gradient(from ${conicAngle - spread / 2}deg at 50% 50%, rgba(52,211,153,0.2) 0deg, rgba(52,211,153,0.35) ${spread * 0.15}deg, #a7f3d0 ${spread * 0.35}deg, #ffffff ${spread * 0.5}deg, #6ee7b7 ${spread * 0.65}deg, rgba(52,211,153,0.35) ${spread * 0.85}deg, rgba(52,211,153,0.2) ${spread}deg, rgba(52,211,153,0.2) 360deg)`;

  const ambientGlow = isHovered
    ? 'radial-gradient(ellipse at 50% 50%, rgba(52,211,153,0.85) 0%, rgba(16,185,129,0.4) 65%, transparent 100%)'
    : `conic-gradient(from ${conicAngle - spread / 2}deg at 50% 50%, transparent 0deg, rgba(52,211,153,0.8) ${spread * 0.5}deg, transparent ${spread}deg, transparent 360deg)`;

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center justify-center p-[2.5px] rounded-2xl sm:rounded-3xl select-none group transition-shadow duration-200 pointer-events-auto ${className}`}
      style={{
        background: outlineGradient,
      }}
    >
      {/* ── 1. AMBIENT SOFT DIRECTIONAL GLOW (Casts emerald light facing the cursor) ── */}
      <div
        className="absolute -inset-[3.5px] rounded-2xl sm:rounded-3xl pointer-events-none filter blur-[8px] transition-opacity duration-150"
        style={{
          background: ambientGlow,
          opacity: isHovered ? 0.95 : Math.max(0.4, 0.35 + proximityFactor * 0.6),
        }}
      />

      {/* ── 2. BUTTON BODY: FIXED STABLE SIZE & POSITION (NO POSITION OR SIZE CHANGE IN ANY ANIMATION) ── */}
      <motion.button
        ref={buttonRef}
        type="button"
        onClick={onClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        title="LET'S DRIVE · Enter Alif's World"
        aria-label="LET'S DRIVE"
        style={{
          transform: 'none',
        }}
        whileTap={{ scale: 1 }}
        whileHover={{ scale: 1 }}
        className="relative w-56 xs:w-64 sm:w-72 md:w-76 lg:w-80 h-12 sm:h-14 rounded-[calc(1rem-2.5px)] sm:rounded-[calc(1.5rem-2.5px)] bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white font-display font-black tracking-wider uppercase text-xs xs:text-sm sm:text-base lg:text-lg flex items-center justify-center gap-2.5 overflow-hidden cursor-pointer shadow-[0_10px_28px_rgba(16,185,129,0.32)] active:shadow-sm select-none"
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

        {/* Button Content */}
        <Compass className="w-5 h-5 text-emerald-100 group-hover:rotate-45 transition-transform duration-500 shrink-0 drop-shadow" />
        <span className="drop-shadow-md whitespace-nowrap">
          LET'S DRIVE
        </span>
        <Sparkles className="w-4 h-4 text-amber-200 shrink-0 animate-pulse drop-shadow" />
      </motion.button>
    </div>
  );
};
