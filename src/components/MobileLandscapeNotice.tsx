import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, RotateCw } from 'lucide-react';

interface MobileLandscapeNoticeProps {
  onDismiss?: () => void;
}

export const MobileLandscapeNotice: React.FC<MobileLandscapeNoticeProps> = ({ onDismiss }) => {
  const [isPortraitMobile, setIsPortraitMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const isMobileWidth = window.innerWidth <= 840 || window.innerHeight > window.innerWidth;
    return isMobileWidth && window.innerHeight > window.innerWidth;
  });

  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    const checkOrientation = () => {
      if (typeof window === 'undefined') return;
      const isPortrait = window.innerHeight > window.innerWidth;
      const isMobileScreen = Math.min(window.innerWidth, window.innerHeight) <= 840;
      setIsPortraitMobile(isMobileScreen && isPortrait);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const handleTap = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  if (!isPortraitMobile || dismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <div
        onClick={handleTap}
        onTouchStart={handleTap}
        className="fixed inset-0 z-[999999] bg-[#0c101c]/95 backdrop-blur-2xl flex flex-col items-center justify-between py-12 px-6 select-none cursor-pointer touch-none"
        style={{ pointerEvents: 'auto' }}
        role="dialog"
        aria-modal="true"
        aria-label="Rotate device to landscape"
      >
        {/* Ambient background glow rings */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
          <div className="w-80 h-80 rounded-full bg-sky-500/15 blur-3xl" />
          <div className="w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        {/* Top subtle branding badge */}
        <div className="relative z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-sky-300 text-xs font-display tracking-widest uppercase">
          <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Optimal View Experience</span>
        </div>

        {/* Center: Repeating Phone Rotation Animation (Default Portrait to Landscape) */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto">
          {/* Glowing pedestal under the phone */}
          <div className="relative w-44 h-44 flex items-center justify-center">
            <motion.div
              className="absolute inset-2 rounded-full border-2 border-dashed border-sky-400/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
            />

            {/* Rotating Phone Animation */}
            <motion.div
              className="relative w-20 h-36 rounded-2xl border-[3px] border-white/90 bg-gradient-to-b from-slate-900 to-slate-950 shadow-[0_0_35px_rgba(56,189,248,0.5),inset_0_0_15px_rgba(255,255,255,0.15)] flex flex-col items-center justify-between p-2"
              animate={{
                rotate: [0, 0, 90, 90, 0],
                scale: [1, 1.05, 1.08, 1, 1],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [0, 0.2, 0.55, 0.8, 1],
              }}
            >
              {/* Speaker / Camera Notch */}
              <div className="w-6 h-1 rounded-full bg-white/60" />

              {/* Screen Preview Graphic */}
              <div className="w-full flex-1 my-1.5 rounded-lg bg-sky-500/20 border border-sky-300/30 flex flex-col items-center justify-center overflow-hidden relative">
                <div className="w-8 h-2 rounded-full bg-sky-300/70 mb-1" />
                <div className="w-5 h-1.5 rounded-full bg-cyan-200/50" />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>

              {/* Home Indicator Bar */}
              <div className="w-7 h-1 rounded-full bg-white/60" />
            </motion.div>

            {/* Curving rotation arrows indicator */}
            <motion.div
              className="absolute pointer-events-none text-sky-400"
              animate={{
                opacity: [0.3, 0.9, 0.3],
                scale: [0.95, 1.08, 0.95],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg width="170" height="170" viewBox="0 0 160 160" fill="none">
                <path
                  d="M 130 50 A 55 55 0 0 1 125 115"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeDasharray="5 5"
                />
                <polygon points="125,122 135,112 118,110" fill="currentColor" />
              </svg>
            </motion.div>
          </div>

          {/* Requested Text: "please rotate your phone for the best experience." */}
          <motion.div
            className="text-center mt-6 px-4 max-w-xs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl sm:text-2xl font-display font-black text-white tracking-tight drop-shadow-md">
              Please rotate your phone
            </h3>
            <p className="mt-1 text-sm text-sky-200 font-display font-medium">
              for the best experience.
            </p>
          </motion.div>
        </div>

        {/* Bottom Requested Text: "tap anywhere to continue" */}
        <motion.div
          className="relative z-10 flex flex-col items-center gap-2"
          animate={{ opacity: [0.55, 1, 0.55], y: [0, -3, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 backdrop-blur-md shadow-lg flex items-center gap-2 text-white font-display font-bold text-xs uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Tap anywhere to continue</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
