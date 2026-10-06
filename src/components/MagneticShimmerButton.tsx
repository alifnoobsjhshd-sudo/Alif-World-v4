import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

export interface MagneticShimmerButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  className?: string;
  variant?: 'emerald' | 'cyan' | 'amber' | 'rose' | 'glass' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  magneticStrength?: number;
  disabled?: boolean;
  title?: string;
  'aria-label'?: string;
  style?: React.CSSProperties;
}

export const MagneticShimmerButton: React.FC<MagneticShimmerButtonProps> = ({
  children,
  onClick,
  onMouseEnter,
  onMouseLeave,
  className = '',
  variant = 'cyan',
  size = 'md',
  magneticStrength = 0.3,
  disabled = false,
  title,
  'aria-label': ariaLabel,
  style,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Spring physics for smooth magnetic movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 200, damping: 16, mass: 0.35 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);
  const rotateX = useTransform(smoothY, [-18, 18], [6, -6]);
  const rotateY = useTransform(smoothX, [-18, 18], [-6, 6]);

  useEffect(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || window.innerWidth < 1024;
    setIsTouchDevice(isTouch);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled || isTouchDevice) return;
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    setMousePos({
      x: (relX / rect.width) * 100,
      y: (relY / rect.height) * 100,
    });

    const diffX = e.clientX - (rect.left + centerX);
    const diffY = e.clientY - (rect.top + centerY);
    const clampedX = Math.max(-18, Math.min(18, diffX * magneticStrength));
    const clampedY = Math.max(-18, Math.min(18, diffY * magneticStrength));
    mouseX.set(clampedX);
    mouseY.set(clampedY);
  };

  const handlePointerEnter = () => {
    if (disabled) return;
    setIsHovered(true);
    if (onMouseEnter) onMouseEnter();
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    if (onMouseLeave) onMouseLeave();
  };

  // Determine explicit rounded class based on size to completely avoid any square box artifacts
  const roundedClass = size === 'lg' ? 'rounded-2xl sm:rounded-3xl' : 'rounded-full';

  // Variant color definitions
  const variantConfig = {
    emerald: {
      borderColor: 'border-emerald-400/60 hover:border-emerald-300',
      glowShadow: 'shadow-[0_10px_28px_rgba(16,185,129,0.35)] hover:shadow-[0_14px_38px_rgba(16,185,129,0.55)]',
      bgGradient: 'bg-gradient-to-r from-emerald-500/95 via-teal-600/95 to-sky-600/95 text-white',
      accentColor: 'rgba(52, 211, 153, 0.45)',
    },
    cyan: {
      borderColor: 'border-cyan-400/60 hover:border-cyan-300',
      glowShadow: 'shadow-[0_10px_28px_rgba(6,182,212,0.35)] hover:shadow-[0_14px_38px_rgba(6,182,212,0.55)]',
      bgGradient: 'bg-gradient-to-r from-sky-600/95 via-cyan-500/95 to-teal-500/95 text-white',
      accentColor: 'rgba(56, 189, 248, 0.5)',
    },
    amber: {
      borderColor: 'border-amber-300/70 hover:border-amber-200',
      glowShadow: 'shadow-[0_10px_28px_rgba(245,158,11,0.4)] hover:shadow-[0_14px_38px_rgba(245,158,11,0.6)]',
      bgGradient: 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 font-black',
      accentColor: 'rgba(251, 191, 36, 0.5)',
    },
    rose: {
      borderColor: 'border-rose-400/60 hover:border-rose-300',
      glowShadow: 'shadow-[0_10px_28px_rgba(244,63,94,0.35)] hover:shadow-[0_14px_38px_rgba(244,63,94,0.55)]',
      bgGradient: 'bg-gradient-to-r from-rose-500/95 via-pink-600/95 to-indigo-600/95 text-white',
      accentColor: 'rgba(251, 113, 133, 0.5)',
    },
    glass: {
      borderColor: 'border-white/70 hover:border-white',
      glowShadow: 'shadow-[0_6px_22px_rgba(0,0,0,0.12),0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.16),0_0_20px_rgba(56,189,248,0.35)]',
      bgGradient: 'bg-white/85 hover:bg-white/95 text-slate-800 backdrop-blur-2xl',
      accentColor: 'rgba(255, 255, 255, 0.65)',
    },
    white: {
      borderColor: 'border-white hover:border-cyan-200',
      glowShadow: 'shadow-[0_8px_25px_rgba(255,255,255,0.35)] hover:shadow-[0_12px_32px_rgba(255,255,255,0.5)]',
      bgGradient: 'bg-white text-slate-900',
      accentColor: 'rgba(255, 255, 255, 0.8)',
    },
  }[variant];

  const sizeClasses = {
    sm: 'px-3.5 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm sm:text-base',
    lg: 'px-7 py-3.5 text-base sm:text-lg',
    icon: 'w-10 h-10 sm:w-11 sm:h-11 p-0 flex items-center justify-center',
  }[size];

  return (
    <motion.button
      ref={buttonRef}
      disabled={disabled}
      onClick={onClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerMove={handlePointerMove}
      title={title}
      aria-label={ariaLabel}
      style={{
        x: isTouchDevice ? 0 : smoothX,
        y: isTouchDevice ? 0 : smoothY,
        rotateX: isTouchDevice ? 0 : rotateX,
        rotateY: isTouchDevice ? 0 : rotateY,
        transformStyle: 'preserve-3d',
        ...style,
      }}
      whileTap={{ scale: 0.94 }}
      className={`relative inline-flex items-center justify-center font-display font-bold select-none cursor-pointer border-[1.5px] overflow-hidden will-change-transform transition-all duration-200 ${roundedClass} ${sizeClasses} ${variantConfig.bgGradient} ${variantConfig.borderColor} ${variantConfig.glowShadow} ${className}`}
    >
      {/* ── 1. LIQUID SHIMMER SWEEP (Smooth specular wave across button) ── */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{ borderRadius: 'inherit' }}
      >
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
          className="absolute inset-y-0 w-24 -skew-x-12 pointer-events-none opacity-40 bg-gradient-to-r from-transparent via-white to-transparent"
        />
      </div>

      {/* ── 2. DYNAMIC CURSOR SPOTLIGHT (Follows cursor smoothly without box artifacts) ── */}
      {isHovered && !isTouchDevice && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-200"
          style={{
            borderRadius: 'inherit',
            background: `radial-gradient(110px circle at ${mousePos.x}% ${mousePos.y}%, ${variantConfig.accentColor}, transparent 70%)`,
          }}
        />
      )}

      {/* ── 3. TOP GLASS SPECULAR GLINT ── */}
      <div
        className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/30 to-transparent pointer-events-none"
        style={{ borderRadius: 'inherit' }}
      />

      {/* ── 4. CONTENT ── */}
      <div className="relative z-10 flex items-center justify-center gap-2 drop-shadow-sm pointer-events-none">
        {children}
      </div>
    </motion.button>
  );
};
