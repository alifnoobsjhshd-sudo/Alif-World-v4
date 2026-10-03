import React from 'react';
import { motion, useTransform } from 'motion/react';

interface FloatingCloudProps {
  x: string;
  y: string;
  startDepth: number;
  scrollProgress: any;
  totalCycle: number;
  scale?: number;
  flip?: boolean;
}

export const FloatingCloud = React.memo(({
  x, y, startDepth, scrollProgress, totalCycle, scale: baseScale = 1, flip = false
}: FloatingCloudProps) => {
  const relativeDepth = useTransform(scrollProgress, (val: any) => {
    let diff = (startDepth - (val % totalCycle) + totalCycle) % totalCycle;
    if (diff > totalCycle / 2) diff -= totalCycle;
    return diff;
  });

  // Clouds appear from far away, soften as the camera gets close, and fade
  // completely after flying past the viewer.
  const z       = useTransform(relativeDepth, [-2500, 0, 6000], [1200, 0, -2800]);
  const scale   = useTransform(relativeDepth, [-2500, 0, 6000], [3.5 * baseScale, baseScale, 0.04]);
  const opacity = useTransform(relativeDepth, [-2000, -800, 0, 700, 1800, 3000, 6000], [0, 0.55, 0.3, 0.48, 0.62, 0.42, 0]);

  return (
    <motion.div
      style={{ left: x, top: y, z, opacity, scale }}
      animate={{
        x: [0, flip ? -18 : 18, 0],
        y: [0, -12, 0]
      }}
      transition={{
        duration: 9 + Math.random() * 5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className="absolute pointer-events-none select-none gpu preserve-3d"
    >
      <SketchCloud flip={flip} />
    </motion.div>
  );
});

FloatingCloud.displayName = 'FloatingCloud';

/* Sketch-style cloud SVG matching the site's pixel-art aesthetic */
const SketchCloud = React.memo(({ flip = false }: { flip?: boolean }) => (
  <svg
    width="260"
    height="140"
    viewBox="0 0 260 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: 'block', transform: flip ? 'scaleX(-1)' : undefined }}
  >
    {/* Main cloud body */}
    <path
      d="M 42 98 C 28 98 14 86 14 72 C 14 54 30 42 52 42 C 60 24 88 14 114 28 C 134 16 174 20 192 46 C 210 46 240 60 238 84 C 236 102 210 118 186 118 C 160 118 60 120 42 98 Z"
      fill="white"
      stroke="#d1d5db"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    {/* Sketchy inner bump top-left */}
    <path
      d="M 70 42 C 60 30 48 28 44 36"
      stroke="#d1d5db"
      strokeWidth="1.4"
      strokeLinecap="round"
      fill="none"
      opacity="0.6"
    />
    {/* Sketchy inner bump center */}
    <path
      d="M 128 28 C 120 18 108 16 106 24"
      stroke="#d1d5db"
      strokeWidth="1.4"
      strokeLinecap="round"
      fill="none"
      opacity="0.5"
    />
    {/* Soft shadow underside */}
    <path
      d="M 50 110 C 70 118 130 122 186 118 C 210 118 236 104 238 84"
      stroke="#e5e7eb"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
      opacity="0.5"
    />
  </svg>
));
SketchCloud.displayName = 'SketchCloud';
