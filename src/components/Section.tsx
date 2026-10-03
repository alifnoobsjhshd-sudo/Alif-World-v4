import React from 'react';
import { motion, useTransform, MotionValue } from 'motion/react';

interface SectionProps {
  children: React.ReactNode;
  startDepth: number;
  scrollProgress: MotionValue<number>;
}

export const Section = React.memo(({
  children,
  startDepth,
  scrollProgress,
}: SectionProps) => {
  // Linear continuous depth calculation with zero wrap jumps
  const relativeDepth = useTransform(scrollProgress, (val: number) => {
    return startDepth - val;
  });

  // Smooth perspective depth and scale curves across continuous scene cycle
  const z = useTransform(
    relativeDepth, 
    [-4500, -2200, 0, 2600, 5200], 
    [540, 260, 0, -850, -1800]
  );
  
  const scale = useTransform(
    relativeDepth, 
    [-4500, -2200, 0, 2600, 5200], 
    [1.16, 1.07, 1, 0.76, 0.48]
  );

  // High-clarity opacity curve with generous scene separation:
  // Ensures distinct breathing room so scenes never crowd or overlap
  const opacity = useTransform(
    relativeDepth,
    [-3800, -2600, -1200, 0, 1200, 2800, 4800],
    [0, 0.45, 0.98, 1, 0.98, 0.60, 0]
  );

  // Enable interaction when scene is in foreground focus
  const pointerEvents = useTransform(relativeDepth, (val) => {
    return Math.abs(val) < 1500 ? 'auto' : 'none';
  });

  // Occlusion culling: completely skip off-screen rendering when outside active range
  const visibility = useTransform(relativeDepth, (val) => {
    return (val < -4200 || val > 5000) ? 'hidden' : 'visible';
  });

  return (
    <motion.div
      style={{
        z,
        opacity,
        scale,
        visibility,
        willChange: 'transform, opacity',
      }}
      className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 sm:p-6 pointer-events-none"
    >
      <motion.div 
        style={{ pointerEvents }}
        className="w-full flex items-center justify-center md:scale-[0.88] lg:scale-[0.85] origin-center"
      >
        {children}
      </motion.div>
    </motion.div>
  );
});

Section.displayName = 'Section';
