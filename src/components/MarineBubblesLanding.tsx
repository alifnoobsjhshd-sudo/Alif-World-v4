import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { dreamAudio } from '../utils/audio';

interface MarineBubblesLandingProps {
  isActive: boolean;
  onComplete: () => void;
}

export const MarineBubblesLanding: React.FC<MarineBubblesLandingProps> = ({
  isActive,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    // Start ambient underwater audio and trigger introductory bubble bloops
    dreamAudio.startUnderwaterAmbience();
    dreamAudio.playUnderwaterBubble(0.9);

    const b1 = setTimeout(() => dreamAudio.playUnderwaterBubble(1.15), 400);
    const b2 = setTimeout(() => dreamAudio.playUnderwaterBubble(1.3), 850);
    const b3 = setTimeout(() => dreamAudio.playUnderwaterBubble(1.0), 1400);

    const startTime = performance.now();
    const TARGET_DURATION = 2400; // 2.4 seconds

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / TARGET_DURATION) * 100));
      setProgress(pct);

      if (elapsed >= TARGET_DURATION && pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 300);
      }
    }, 35);

    return () => {
      clearInterval(interval);
      clearTimeout(b1);
      clearTimeout(b2);
      clearTimeout(b3);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        id="marine-bubbles-landing"
        initial={{ opacity: 1 }}
        exit={{
          opacity: 0,
          scale: 1.05,
          transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] },
        }}
        className="fixed inset-0 z-[100] bg-[#020d1c] flex flex-col items-center justify-center select-none overflow-hidden font-display pointer-events-auto will-change-[opacity,transform]"
      >
        {/* Deep Ocean Ambient Light & Water Caustics Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#043363_0%,_#021b3a_45%,_#010914_100%)] pointer-events-none" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-400/15 blur-[140px] pointer-events-none animate-pulse" />

        {/* ── ASCENDING EFFERVESCENT WATER BUBBLES ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(30)].map((_, i) => {
            const size = 10 + (i % 6) * 9;
            const leftPct = (i * 3.4 + ((i * 17) % 30)) % 96 + 2;
            const duration = 2.2 + (i % 5) * 0.5;
            const delay = (i % 7) * 0.25;

            return (
              <motion.div
                key={i}
                initial={{
                  y: '105vh',
                  opacity: 0,
                  scale: 0.4,
                  x: 0,
                }}
                animate={{
                  y: '-20vh',
                  opacity: [0, 0.85, 0.95, 0],
                  scale: [0.4, 1.1, 1.2, 0.8],
                  x: [(i % 2 === 0 ? 15 : -15), (i % 2 === 0 ? -20 : 20), (i % 2 === 0 ? 25 : -25)],
                }}
                transition={{
                  duration: duration,
                  delay: delay,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  left: `${leftPct}%`,
                  width: size,
                  height: size,
                }}
                className="absolute rounded-full border border-cyan-200/60 bg-gradient-to-tr from-cyan-400/30 via-sky-300/40 to-white/70 shadow-[0_0_12px_rgba(56,189,248,0.7)] backdrop-blur-xs"
              >
                {/* Bubble highlight reflection */}
                <div className="absolute top-1 left-1.5 w-1/3 h-1/3 rounded-full bg-white/80" />
              </motion.div>
            );
          })}
        </div>

        {/* ── CENTER MARINE WATER RADAR / DIVING COMPASS ── */}
        <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center max-w-sm">
          {/* Glowing Animated Compass Core */}
          <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
            {/* Outer expanding ripple */}
            <motion.div
              animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border border-cyan-400/50"
            />
            {/* Rotating sonar dial */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-1.5 rounded-full border-t-2 border-r-2 border-transparent border-t-cyan-300 border-r-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.5)]"
            />
            <div className="absolute inset-4 rounded-full border border-slate-700/60 bg-[#021833]/80 backdrop-blur-md" />

            {/* Center Marine Fish Glyph */}
            <svg
              viewBox="0 0 24 24"
              className="relative w-10 h-10 text-cyan-300 drop-shadow-[0_0_10px_rgba(56,189,248,0.9)] animate-pulse"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6s-7.56-2.54-8.5-6Z" />
              <path d="M18 12v.5" />
              <path d="M16 17.93a11.9 11.9 0 0 1-4-.93" />
              <path d="M2 16l4.5-4L2 8" />
            </svg>
          </div>

          {/* Title & Progress Bar */}
          <h2 className="font-display font-black text-lg sm:text-xl text-white tracking-wider uppercase mb-1">
            Entering Marine Realm
          </h2>
          <p className="font-mono text-xs text-cyan-300/80 tracking-widest uppercase mb-5">
            {progress < 30
              ? 'CALIBRATING WATER CAUSTICS...'
              : progress < 65
              ? 'SYNCHRONIZING FISH AVIONICS...'
              : progress < 90
              ? 'DESCENDING TO SUNLIT SHALLOWS...'
              : 'DIVE COMPLETE // WELCOME'}
          </p>

          {/* Progress track */}
          <div className="w-56 sm:w-64 h-2 rounded-full bg-slate-800/80 overflow-hidden border border-cyan-500/30 p-0.5 shadow-inner">
            <motion.div
              style={{ width: `${progress}%` }}
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.8)]"
            />
          </div>

          <div className="mt-2 font-mono text-[10px] text-cyan-400/60 tracking-wider">
            DEPTH READY: {progress}%
          </div>

          {/* Quick Skip Button */}
          <button
            onClick={() => {
              dreamAudio.playPop();
              onComplete();
            }}
            className="mt-6 px-4 py-1.5 rounded-full bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/30 text-cyan-300 text-xs font-mono tracking-wider hover:text-white transition-all cursor-pointer"
          >
            SKIP DIVE &rarr;
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
