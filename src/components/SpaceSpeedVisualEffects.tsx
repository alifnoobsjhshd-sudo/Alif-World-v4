import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SpaceSpeedVisualEffectsProps {
  isActive: boolean;
  direction?: 'forward' | 'backward';
}

interface WarpStar {
  x: number;
  y: number;
  z: number;
  prevZ: number;
  color: string;
}

export const SpaceSpeedVisualEffects: React.FC<SpaceSpeedVisualEffectsProps> = ({
  isActive,
  direction = 'forward',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const NUM_STREAKS = 140;
    const WARP_COLORS = ['#38bdf8', '#22d3ee', '#818cf8', '#ffffff', '#67e8f9'];
    const stars: WarpStar[] = [];

    for (let i = 0; i < NUM_STREAKS; i++) {
      stars.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * 1000 + 200,
        prevZ: 1000,
        color: WARP_COLORS[Math.floor(Math.random() * WARP_COLORS.length)],
      });
    }

    const cx = width / 2;
    const cy = height / 2;
    const isReverse = direction === 'backward';

    const render = () => {
      // Semi-transparent clear for smooth motion streak trails
      ctx.fillStyle = 'rgba(2, 6, 23, 0.35)';
      ctx.fillRect(0, 0, width, height);

      const fov = 400;

      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.prevZ = star.z;

        if (isReverse) {
          star.z += 48; // High-speed reverse warp
          if (star.z >= 1000) {
            star.x = (Math.random() - 0.5) * width * 2;
            star.y = (Math.random() - 0.5) * height * 2;
            star.z = 50;
            star.prevZ = 50;
          }
        } else {
          star.z -= 48; // High speed forward travel
          if (star.z <= 10) {
            star.x = (Math.random() - 0.5) * width * 2;
            star.y = (Math.random() - 0.5) * height * 2;
            star.z = 1000;
            star.prevZ = 1000;
          }
        }

        const k = fov / Math.max(10, star.z);
        const px = star.x * k + cx;
        const py = star.y * k + cy;

        const prevK = fov / Math.max(10, star.prevZ);
        const ppx = star.x * prevK + cx;
        const ppy = star.y * prevK + cy;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const alpha = Math.min(1, Math.max(0.1, 1 - star.z / 1000));
          ctx.beginPath();
          ctx.moveTo(ppx, ppy);
          ctx.lineTo(px, py);
          ctx.strokeStyle = star.color;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = Math.min(3.5, Math.max(1.2, (1 - star.z / 1000) * 4));
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive, direction]);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          id="space-speed-visual-effects"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
        >
          {/* 1. Fast Canvas Hyperspace Streaks */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full mix-blend-screen opacity-70"
          />

          {/* 2. Peripheral Speed Tunnel Vignette - Edge accents only, clear center */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at center, transparent 65%, rgba(6, 182, 212, 0.08) 85%, rgba(14, 165, 233, 0.18) 100%)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
