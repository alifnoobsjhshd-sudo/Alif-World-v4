import React from 'react';
import { motion, MotionValue, useTransform } from 'motion/react';

interface ScrollHintProps {
  smoothedDepth: MotionValue<number>;
}

export const ScrollHint = React.memo(({ smoothedDepth }: ScrollHintProps) => {
  // Fade out once the user has scrolled even a little in either direction
  const opacity = useTransform(smoothedDepth, (val: number) => {
    return Math.max(0, 1 - Math.abs(val) / 600);
  });

  return (
    <motion.div
      className="fixed bottom-6 sm:bottom-8 left-0 right-0 flex flex-col items-center gap-2 z-40 pointer-events-none select-none"
      style={{ opacity }}
    >
      {/* Floating "Scroll To Explore" */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        className="flex flex-col items-center gap-2"
      >
        <span className="font-display font-bold uppercase tracking-[0.22em] sm:tracking-[0.28em] text-gray-400 text-xs text-center px-4">
          Scroll or ↑ / ↓ to Explore
        </span>
        {/* Animated chevron */}
        <motion.svg
          width="18" height="12" viewBox="0 0 18 12" fill="none"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M1 1L9 10L17 1" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </motion.svg>
      </motion.div>
    </motion.div>
  );
});

ScrollHint.displayName = 'ScrollHint';
