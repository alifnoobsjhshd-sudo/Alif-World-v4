import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MousePointer } from 'lucide-react';
import { useMobileVirtualCursor, isMobileDevice } from '../context/MobileVirtualCursorContext';
import { dreamAudio } from '../utils/audio';

interface MobileCursorToggleButtonProps {
  className?: string;
  size?: 'sm' | 'icon';
}

export const MobileCursorToggleButton: React.FC<MobileCursorToggleButtonProps> = ({
  className = '',
  size = 'icon',
}) => {
  const { isSupported, isCursorOn, toggleCursor } = useMobileVirtualCursor();

  // Screen ratio check: Strictly do NOT show in desktop screen ratio
  const [isDesktopRatio, setIsDesktopRatio] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 1024 || !isMobileDevice();
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkRatio = () => {
      setIsDesktopRatio(window.innerWidth >= 1024 || !isMobileDevice());
    };
    checkRatio();
    window.addEventListener('resize', checkRatio, { passive: true });
    window.addEventListener('orientationchange', checkRatio, { passive: true });
    return () => {
      window.removeEventListener('resize', checkRatio);
      window.removeEventListener('orientationchange', checkRatio);
    };
  }, []);

  // Strictly only for mobile and only if CURSER env is "true", never on desktop screen ratio
  if (!isSupported || isDesktopRatio) return null;

  const sizeClasses =
    size === 'sm'
      ? 'w-8 h-8 sm:w-9 sm:h-9'
      : 'w-10 h-10 sm:w-11 sm:h-11';

  const iconSizes =
    size === 'sm'
      ? 'w-3.5 h-3.5 sm:w-4 sm:h-4'
      : 'w-4 h-4 sm:w-5 sm:h-5';

  return (
    <motion.button
      type="button"
      data-cursor-ignore="true"
      onClick={toggleCursor}
      onMouseEnter={() => dreamAudio.playHover()}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className={`relative z-[99999] pointer-events-auto shrink-0 flex items-center justify-center rounded-full transition-all duration-200 select-none cursor-pointer border-[1.5px] overflow-hidden lg:hidden ${sizeClasses} ${
        isCursorOn
          ? 'bg-gradient-to-tr from-blue-600 via-sky-400 to-amber-300 border-amber-200 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.55),0_0_12px_rgba(251,191,36,0.6)]'
          : 'bg-gradient-to-tr from-blue-950/80 via-slate-900/90 to-amber-950/50 border-sky-400/40 hover:border-amber-300/60 text-sky-200 shadow-[0_4px_16px_rgba(0,0,0,0.3)] backdrop-blur-xl'
      } ${className}`}
      title={isCursorOn ? 'Virtual Cursor is ON (Tap to turn OFF)' : 'Virtual Cursor is OFF (Tap to turn ON)'}
      aria-label={isCursorOn ? 'Virtual Cursor is ON (Tap to turn OFF)' : 'Virtual Cursor is OFF (Tap to turn ON)'}
    >
      {/* ── 1. LIQUID SPECULAR SHIMMER SWEEP ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
        <motion.div
          animate={{ x: ['-120%', '220%'] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: [0.4, 0, 0.2, 1], repeatDelay: 1.6 }}
          className="absolute inset-y-0 w-16 -skew-x-12 opacity-35 bg-gradient-to-r from-transparent via-white to-transparent"
        />
      </div>

      {/* ── 2. TOP SPECULAR GLINT ── */}
      <div className="absolute top-0 inset-x-0 h-[45%] bg-gradient-to-b from-white/35 to-transparent pointer-events-none rounded-full" />

      {/* ── 3. CURSOR ICON WITH ACTIVE GLOW ── */}
      <div className="relative z-10 flex items-center justify-center">
        <MousePointer
          className={`${iconSizes} transition-transform duration-200 ${
            isCursorOn
              ? 'text-slate-950 fill-slate-950/20 stroke-[2.4] scale-110 drop-shadow-sm'
              : 'text-sky-300 stroke-[2] drop-shadow-[0_0_6px_rgba(56,189,248,0.4)]'
          }`}
        />

        {/* Active glowing indicator pill/dot */}
        {isCursorOn && (
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-80" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-300 shadow-[0_0_6px_#fde047]" />
          </span>
        )}
      </div>
    </motion.button>
  );
};
