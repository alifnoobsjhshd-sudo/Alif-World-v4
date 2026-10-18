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

  // ── Global Mouse & Virtual Cursor Tracker: Nearest side lights up at all distances ──
  const updatePointerTracker = useCallback((stageCursorX: number, stageCursorY: number) => {
    if (!containerRef.current) return;

    const container = document.getElementById('auto-landscape-container');
    const bounds = container?.getBoundingClientRect();
    const isAutoRotated = Boolean(container?.style.transform.includes('rotate(90deg)'));
    const rect = containerRef.current.getBoundingClientRect();

    let btnX: number;
    let btnY: number;
    let btnW: number;
    let btnH: number;

    if (isAutoRotated && bounds && bounds.height > 0 && bounds.width > 0) {
      // In 90deg clockwise auto-landscape:
      // Physical Y maps to Stage X, and (bounds.right - physical X) maps to Stage Y
      const stageWidth = container.clientWidth || bounds.height;
      const stageHeight = container.clientHeight || bounds.width;
      const cx_phys = rect.left + rect.width / 2;
      const cy_phys = rect.top + rect.height / 2;
      btnX = ((cy_phys - bounds.top) / bounds.height) * stageWidth;
      btnY = ((bounds.right - cx_phys) / bounds.width) * stageHeight;
      btnW = (rect.height / bounds.height) * stageWidth;
      btnH = (rect.width / bounds.width) * stageHeight;
    } else if (bounds) {
      btnX = rect.left - bounds.left + rect.width / 2;
      btnY = rect.top - bounds.top + rect.height / 2;
      btnW = rect.width;
      btnH = rect.height;
    } else {
      btnX = rect.left + rect.width / 2;
      btnY = rect.top + rect.height / 2;
      btnW = rect.width;
      btnH = rect.height;
    }

    const mx = stageCursorX;
    const my = stageCursorY;

    // Check if cursor is directly on the button in stage coordinates
    const dxFromCenter = Math.abs(mx - btnX);
    const dyFromCenter = Math.abs(my - btnY);
    const inside = dxFromCenter <= btnW / 2 && dyFromCenter <= btnH / 2;

    if (inside) {
      setIsHovered(true);
      setSpread(360);
      setProximityFactor(1);
      return;
    }

    setIsHovered(false);

    // Compute closest distance from cursor to button rectangle edge
    const dx = Math.max(dxFromCenter - btnW / 2, 0);
    const dy = Math.max(dyFromCenter - btnH / 2, 0);
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Continuous proximity ratio from 0 (very far) to 1 (touching edge)
    const maxDistanceScale = 850;
    const prox = Math.max(0, Math.min(1, 1 - dist / maxDistanceScale));
    setProximityFactor(prox);

    // Calculate angle from button center to cursor in landscape coordinate space (conic 0deg is top, 90deg is right)
    const angleRad = Math.atan2(my - btnY, mx - btnX);
    const angleDeg = (angleRad * 180) / Math.PI;
    const normConic = (angleDeg + 90 + 360) % 360;
    setConicAngle(normConic);

    // Light spread angle:
    // When farther: small lit up area (approx 22deg - 26deg focused strictly on nearest side)
    // When closer: expands up to ~150deg covering the nearest face
    const currentSpread = 22 + prox * 128;
    setSpread(currentSpread);
  }, []);

  const handleGlobalPointerMove = useCallback((e: MouseEvent | PointerEvent) => {
    // If mobile virtual cursor is active, skip pointermove/mousemove since virtual-cursor-move supplies exact stage coordinates
    if (document.body.classList.contains('mobile-virtual-cursor-active')) return;

    const container = document.getElementById('auto-landscape-container');
    const bounds = container?.getBoundingClientRect();
    const isAutoRotated = Boolean(container?.style.transform.includes('rotate(90deg)'));
    let stageX = e.clientX;
    let stageY = e.clientY;

    if (container && bounds && bounds.width > 0 && bounds.height > 0) {
      const stageWidth = container.clientWidth || bounds.width;
      const stageHeight = container.clientHeight || bounds.height;
      if (isAutoRotated) {
        stageX = ((e.clientY - bounds.top) / bounds.height) * stageWidth;
        stageY = ((bounds.right - e.clientX) / bounds.width) * stageHeight;
      } else {
        stageX = ((e.clientX - bounds.left) / bounds.width) * stageWidth;
        stageY = ((e.clientY - bounds.top) / bounds.height) * stageHeight;
      }
    }
    updatePointerTracker(stageX, stageY);
  }, [updatePointerTracker]);

  useEffect(() => {
    const handleVirtual = (e: Event) => {
      const ev = e as CustomEvent<{ x: number; y: number }>;
      if (!ev.detail || typeof ev.detail.x !== 'number') return;
      // Virtual cursor coordinates are already provided in stage coordinates!
      updatePointerTracker(ev.detail.x, ev.detail.y);
    };

    // Initialize initial cursor facing direction immediately on mount
    const container = document.getElementById('auto-landscape-container');
    const bounds = container?.getBoundingClientRect();
    const initW = container?.clientWidth || bounds?.width || (typeof window !== 'undefined' ? window.innerWidth : 800);
    const initH = container?.clientHeight || bounds?.height || (typeof window !== 'undefined' ? window.innerHeight : 600);
    updatePointerTracker(initW / 2, initH / 2);

    window.addEventListener('mousemove', handleGlobalPointerMove, { passive: true });
    window.addEventListener('pointermove', handleGlobalPointerMove, { passive: true });
    window.addEventListener('virtual-cursor-move', handleVirtual);
    return () => {
      window.removeEventListener('mousemove', handleGlobalPointerMove);
      window.removeEventListener('pointermove', handleGlobalPointerMove);
      window.removeEventListener('virtual-cursor-move', handleVirtual);
    };
  }, [handleGlobalPointerMove, updatePointerTracker]);

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
      className={`relative inline-flex items-center justify-center p-[2.5px] lg:p-[4.5px] rounded-2xl sm:rounded-3xl lg:rounded-[32px] select-none group transition-shadow duration-200 pointer-events-auto ${className}`}
      style={{
        background: outlineGradient,
      }}
    >
      {/* ── 1. AMBIENT SOFT DIRECTIONAL GLOW (Casts emerald light facing the cursor) ── */}
      <div
        className="absolute -inset-[3.5px] lg:-inset-[5.5px] rounded-2xl sm:rounded-3xl lg:rounded-[32px] pointer-events-none filter blur-[8px] lg:blur-[12px] transition-opacity duration-150"
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
        className="relative w-56 xs:w-64 sm:w-72 md:w-76 lg:w-[356px] h-12 sm:h-14 lg:h-[64px] rounded-[calc(1rem-2.5px)] sm:rounded-[calc(1.5rem-2.5px)] lg:rounded-[calc(2rem-4.5px)] bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 text-white font-display font-black tracking-wider uppercase text-xs xs:text-sm sm:text-base lg:text-[19px] flex items-center justify-center gap-2.5 lg:gap-3.5 overflow-hidden cursor-pointer shadow-[0_10px_28px_rgba(16,185,129,0.32)] active:shadow-sm select-none"
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
            className="absolute inset-y-0 w-28 lg:w-36 -skew-x-12 pointer-events-none opacity-45 bg-gradient-to-r from-transparent via-white to-transparent"
          />
        </div>

        {/* Top Glass Specular Glint */}
        <div
          className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/30 to-transparent pointer-events-none"
          style={{ borderRadius: 'inherit' }}
        />

        {/* Button Content */}
        <Compass className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-emerald-100 group-hover:rotate-45 transition-transform duration-500 shrink-0 drop-shadow" />
        <span className="drop-shadow-md whitespace-nowrap">
          LET'S DRIVE
        </span>
        <Sparkles className="w-4 h-4 sm:w-4.5 sm:h-4.5 lg:w-5 lg:h-5 text-amber-200 shrink-0 animate-pulse drop-shadow" />
      </motion.button>
    </div>
  );
};
