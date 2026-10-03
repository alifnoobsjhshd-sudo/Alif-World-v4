import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface SpaceLoadingScreenProps {
  onComplete: () => void;
}

export const SpaceLoadingScreen: React.FC<SpaceLoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let active = true;

    // Extended, cinematic cosmic loading cycle (~3.2s total)
    // Ensures all 3D canvas textures, sectors, and shaders are fully mounted & warmed
    const startTime = performance.now();
    const TARGET_SPACE_DURATION = 3200; // 3.2 seconds

    const interval = setInterval(() => {
      if (!active) return;
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / TARGET_SPACE_DURATION) * 100));

      setProgress(pct);

      if (elapsed >= TARGET_SPACE_DURATION && pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          if (active) onComplete();
        }, 350);
      }
    }, 35);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [onComplete]);

  // Dynamic telemetry status readout
  const statusMessage =
    progress < 25
      ? 'CALIBRATING STARFIELD VECTORS & ASTROMETRY...'
      : progress < 50
      ? 'WARPING TO ORBITAL APEX...'
      : progress < 75
      ? 'PRE-CACHING DEEP SPACE SECTORS & SHADERS...'
      : progress < 95
      ? 'ACQUIRING COMMAND-CLASS WORK WAYPOINTS...'
      : 'WARP COMPLETE // ENTERING DEEP SPACE';

  return (
    <motion.div
      id="space-loading-screen"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        scale: 1.03,
        transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
      }}
      className="fixed inset-0 z-[100] bg-[#02040f] flex flex-col items-center justify-center select-none overflow-hidden font-display pointer-events-auto will-change-[opacity,transform]"
    >
      {/* ── AMBIENT COSMIC GLOW (Subtle radial lighting, 0ms blur overhead) ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#0c1938_0%,_#030718_50%,_#010208_100%)] pointer-events-none" />
      <div
        className="absolute w-[450px] h-[450px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%)',
        }}
      />

      {/* ── HIGH-TECH RADAR / WARP RETICLE ── */}
      <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
        {/* Outer rotating dashed tracking circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border border-dashed border-sky-400/30"
        />

        {/* Counter-rotating cyan telemetry ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 rounded-full border-t-2 border-b-2 border-transparent border-t-sky-400 border-b-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.4)]"
        />

        {/* Inner concentric ring */}
        <div className="absolute inset-6 rounded-full border border-slate-700/60" />

        {/* Center glowing core / miniature spacecraft glyph */}
        <div className="relative flex flex-col items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 text-sky-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.9)] animate-pulse"
            fill="currentColor"
          >
            <path d="M12 2L15 8L19 12L15 14L16 22L12 18L8 22L9 14L5 12L9 8L12 2Z" />
          </svg>
        </div>
      </div>

      {/* ── MISSION / SECTOR LABEL ── */}
      <div className="text-center mb-4 z-10">
        <div className="text-sky-400/80 text-[11px] font-mono tracking-[0.28em] uppercase mb-1">
          Deep Space Transit
        </div>
        <h2 className="text-white text-lg font-semibold tracking-wider font-sans">
          EXPLORE WORKS SECTOR
        </h2>
      </div>

      {/* ── PROGRESS BAR (Cyan laser line) ── */}
      <div className="relative w-64 sm:w-80 h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/50 mb-3 z-10 shadow-[0_0_12px_rgba(0,0,0,0.8)]">
        <motion.div
          className="h-full bg-gradient-to-r from-sky-500 via-cyan-300 to-white shadow-[0_0_12px_#38bdf8]"
          style={{ width: `${progress}%` }}
          transition={{ ease: 'easeOut', duration: 0.1 }}
        />
      </div>

      {/* ── TELEMETRY READOUT & PERCENTAGE ── */}
      <div className="w-64 sm:w-80 flex items-center justify-between text-[11px] font-mono text-slate-400 z-10">
        <span className="text-slate-400/90 tracking-wide truncate pr-2">
          {statusMessage}
        </span>
        <span className="text-sky-300 font-bold tracking-wider shrink-0">
          {progress}%
        </span>
      </div>
    </motion.div>
  );
};
