import React from 'react';
import { motion } from 'motion/react';

/* ─── SceneCloud ────────────────────────────────────────────────────────────
 * A decorative cloud element placed in the 3D world — same pattern as Balloon.
 * Fixed x/y/z position in CSS perspective space, gentle idle float animation.
 * Use this for scene decoration, not scroll-driven flyby effects.
 * ─────────────────────────────────────────────────────────────────────────── */
export const SceneCloud = React.memo(({
  x, y, z, scale = 1, flip = false, duration = 7, delay = 0
}: {
  x: string; y: string; z: number; scale?: number; flip?: boolean; duration?: number; delay?: number;
}) => (
  <motion.div
    style={{ left: x, top: y, z, scale, willChange: 'transform' }}
    animate={{ y: [0, -18, 0], x: [0, flip ? -8 : 8, 0] }}
    transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    className="absolute pointer-events-none select-none gpu"
  >
    <svg
      width="320"
      height="160"
      viewBox="0 0 320 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', transform: flip ? 'scaleX(-1)' : undefined }}
    >
      {/* Main body */}
      <path
        d="M 54 120 C 34 120 14 104 14 86 C 14 64 36 50 64 50 C 76 28 112 16 144 34 C 168 18 218 22 242 54 C 268 54 304 72 302 102 C 300 124 268 144 238 144 C 200 144 74 148 54 120 Z"
        fill="white"
        stroke="#d1d5db"
        strokeWidth="1.6"
        strokeLinejoin="round"
        opacity="0.92"
      />
      {/* Top-left bump highlight */}
      <path
        d="M 90 50 C 76 34 58 32 54 44"
        stroke="#e5e7eb"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.7"
      />
      {/* Top-centre bump */}
      <path
        d="M 160 34 C 150 20 134 18 132 28"
        stroke="#e5e7eb"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
      {/* Soft underside shadow */}
      <path
        d="M 64 136 C 92 146 180 150 238 144 C 268 144 300 126 302 102"
        stroke="#e5e7eb"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      />
    </svg>
  </motion.div>
));
SceneCloud.displayName = 'SceneCloud';

export const Balloon = React.memo(({ x, y, z, color }: { x: string, y: string, z: number, color: string }) => (
  <motion.div
    style={{ left: x, top: y, z, willChange: 'transform' }}
    animate={{ y: [0, -20, 0], rotate: [-2, 2, -2] }}
    transition={{ duration: 5 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
    className="absolute pointer-events-none"
  >
    <div className={`w-12 h-16 ${color} rounded-full border-2 border-black/10 relative`}>
      <div className="absolute -bottom-1 left-1.2 -translate-x-1/2 w-3 h-3 bg-inherit rotate-45 border-b-2 border-r-2 border-black/5" />
      <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-0.5 h-10 bg-gray-300" />
    </div>
  </motion.div>
));
Balloon.displayName = 'Balloon';

export const Kite = React.memo(({ x, y, z }: { x: string, y: string, z: number }) => (
  <motion.div
    style={{ left: x, top: y, z, willChange: 'transform' }}
    animate={{ 
      y: [0, -30, 0], 
      x: [0, 20, 0],
      rotate: [-5, 10, -5] 
    }}
    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    className="absolute pointer-events-none"
  >
    <div className="w-16 h-16 border-2 border-blue-400 rotate-45 bg-blue-100/50 relative overflow-hidden">
      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-blue-300/50" />
      <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-blue-300/50" />
    </div>
    <div className="absolute top-full left-1/2 -translate-x-1/2 flex flex-col items-center">
       <div className="w-0.5 h-16 bg-gray-400/30" />
       <div className="flex gap-1 flex-col">
          {[1,2,3].map(i => <div key={i} className="w-3 h-1.5 bg-red-400 rounded-full rotate-45" />)}
       </div>
    </div>
  </motion.div>
));
Kite.displayName = 'Kite';

export const Cloud = React.memo(({ x, y, z, scale = 1, opacity = 0.4 }: { x: string, y: string, z: number, scale?: number, opacity?: number }) => (
  <motion.div
    style={{ left: x, top: y, z, scale, opacity, willChange: 'transform' }}
    className="absolute pointer-events-none select-none gpu"
  >
    <svg width="300" height="150" viewBox="0 0 200 100" fill="none">
      <path
        d="M30 70C20 70 10 60 10 50C10 35 25 25 45 25C55 10 85 5 105 20C125 10 160 15 175 40C190 45 195 65 180 80C165 95 30 95 30 70Z"
        fill="white"
        stroke="#e5e7eb"
        strokeWidth="1.5"
      />
    </svg>
  </motion.div>
));
Cloud.displayName = 'Cloud';
