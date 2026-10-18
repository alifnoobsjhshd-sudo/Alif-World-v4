import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MousePointer, Smartphone, Sparkles, Zap } from 'lucide-react';
import { useMobileVirtualCursor } from '../context/MobileVirtualCursorContext';

export const MobileCursorModeSwitchOverlay: React.FC = () => {
  const { isTransitioning, transitionMode } = useMobileVirtualCursor();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isTransitioning) {
      setProgress(0);
      return;
    }

    setProgress(5);
    const t1 = setTimeout(() => setProgress(35), 250);
    const t2 = setTimeout(() => setProgress(72), 650);
    const t3 = setTimeout(() => setProgress(96), 1100);
    const t4 = setTimeout(() => setProgress(100), 1350);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [isTransitioning]);

  const isCursor = transitionMode === 'cursor';

  return (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          key="mobile-cursor-switch-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
          data-cursor-ignore="true"
          className="fixed inset-0 z-[999999] pointer-events-auto select-none flex flex-col items-center justify-center overflow-hidden bg-slate-950/92 backdrop-blur-2xl"
          aria-live="polite"
        >
          {/* ── 1. AMBIENT CYBER / COSMIC RADIAL GLOW ── */}
          <div
            className={`absolute w-[480px] h-[480px] rounded-full blur-[90px] pointer-events-none transition-all duration-700 animate-pulse ${
              isCursor
                ? 'bg-gradient-to-tr from-blue-600/35 via-sky-400/30 to-amber-400/25'
                : 'bg-gradient-to-tr from-emerald-600/30 via-teal-400/25 to-sky-400/20'
            }`}
          />

          {/* Subtle grid texture lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />

          {/* ── 2. CENTRAL ORBITAL CORE ── */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-sm">
            {/* Spinning orbital ring */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center mb-6">
              {/* Outer dashed spinning ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
                className={`absolute inset-0 rounded-full border border-dashed ${
                  isCursor ? 'border-sky-400/60' : 'border-emerald-400/60'
                }`}
              />

              {/* Inner glowing pulse ring */}
              <motion.div
                animate={{ scale: [0.94, 1.06, 0.94] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className={`absolute inset-2 rounded-full border border-current opacity-70 shadow-lg ${
                  isCursor
                    ? 'border-amber-300 text-sky-400 shadow-[0_0_24px_rgba(56,189,248,0.45)]'
                    : 'border-teal-300 text-emerald-400 shadow-[0_0_24px_rgba(52,211,153,0.45)]'
                }`}
              />

              {/* Center icon representation */}
              <div className="relative z-10 flex items-center justify-center">
                {isCursor ? (
                  <motion.div
                    animate={{ y: [-2, 2, -2], rotate: [-2, 3, -2] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex items-center justify-center"
                  >
                    <MousePointer className="w-10 h-10 sm:w-12 sm:h-12 text-amber-300 fill-amber-300/20 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ scale: [0.96, 1.04, 0.96] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex items-center justify-center"
                  >
                    <Smartphone className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-300 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                  </motion.div>
                )}
              </div>

              {/* Floating decorative sparks */}
              <Sparkles
                className={`absolute -top-1 -right-1 w-5 h-5 animate-bounce ${
                  isCursor ? 'text-amber-300' : 'text-teal-300'
                }`}
              />
            </div>

            {/* ── 3. HEADING & DESCRIPTIVE COPY ── */}
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl font-bold tracking-tight text-white mb-2"
            >
              {isCursor ? 'Switching to curser mode' : 'Switching to normal mode'}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.18 }}
              className="text-xs sm:text-sm text-slate-300/90 font-mono tracking-wide mb-6"
            >
              {isCursor
                ? 'Activating virtual precision controller & 3D desktop effects...'
                : 'Restoring standard fluid touch navigation...'}
            </motion.p>

            {/* ── 4. ENERGY PROGRESS BAR & TICKER ── */}
            <div className="w-64 sm:w-72 flex flex-col gap-2">
              <div className="w-full h-1.5 sm:h-2 rounded-full bg-slate-800/80 overflow-hidden border border-slate-700/60 p-0.5">
                <motion.div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isCursor
                      ? 'bg-gradient-to-r from-blue-500 via-sky-400 to-amber-300 shadow-[0_0_10px_#38bdf8]'
                      : 'bg-gradient-to-r from-teal-500 via-emerald-400 to-sky-300 shadow-[0_0_10px_#34d399]'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono font-medium text-slate-400">
                <span className="flex items-center gap-1">
                  <Zap className="w-3 h-3 text-amber-400 animate-pulse" />
                  <span>CALIBRATING</span>
                </span>
                <span className="text-amber-300 font-bold">{progress}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
