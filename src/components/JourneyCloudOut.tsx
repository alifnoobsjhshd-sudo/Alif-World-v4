import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

// Volumetric clouds parting outward gracefully to reveal Scene 01 (GPU optimized)
const PARTING_CLOUD_CLUSTERS = [
  // Top-left
  { id: 'part-tl', initialX: '20%', initialY: '25%', targetX: '-55%', targetY: '-55%', size: 680, delay: 0.04 },
  // Top-right
  { id: 'part-tr', initialX: '80%', initialY: '22%', targetX: '155%', targetY: '-50%', size: 720, delay: 0.06 },
  // Bottom-left
  { id: 'part-bl', initialX: '25%', initialY: '78%', targetX: '-50%', targetY: '155%', size: 700, delay: 0.08 },
  // Bottom-right
  { id: 'part-br', initialX: '78%', initialY: '80%', targetX: '150%', targetY: '160%', size: 740, delay: 0.08 },
  // Far-left
  { id: 'part-fl', initialX: '10%', initialY: '50%', targetX: '-80%', targetY: '50%', size: 620, delay: 0.1 },
  // Far-right
  { id: 'part-fr', initialX: '90%', initialY: '50%', targetX: '180%', targetY: '50%', size: 640, delay: 0.1 },
  // Top-center
  { id: 'part-tc', initialX: '50%', initialY: '20%', targetX: '50%', targetY: '-85%', size: 780, delay: 0.12 },
  // Bottom-center
  { id: 'part-bc', initialX: '50%', initialY: '82%', targetX: '50%', targetY: '185%', size: 820, delay: 0.12 },
];

export const JourneyCloudOut: React.FC = () => {
  const [stage, setStage] = useState<'covering' | 'parting' | 'done'>('covering');

  useEffect(() => {
    // Begin parting clouds quickly after mount (~200ms)
    const partTimer = setTimeout(() => {
      setStage('parting');
    }, 200);

    // Completely unmount after clouds have cleared the viewport (~2200ms)
    const doneTimer = setTimeout(() => {
      setStage('done');
    }, 2200);

    return () => {
      clearTimeout(partTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  if (stage === 'done') return null;

  return (
    <AnimatePresence>
      <div
        id="journey-cloud-out-transition"
        className="fixed inset-0 z-[110] pointer-events-none select-none overflow-hidden"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Base white background dissolving smoothly to reveal the blue sky underneath */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-white via-sky-50 to-white"
          initial={{ opacity: 1 }}
          animate={{ opacity: stage === 'parting' ? 0 : 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          style={{ willChange: 'opacity' }}
        />

        {/* Cinematic Clouds Parting gracefully outward */}
        {PARTING_CLOUD_CLUSTERS.map((cloud) => (
          <motion.div
            key={cloud.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: cloud.size,
              height: cloud.size * 0.72,
              marginLeft: -(cloud.size / 2),
              marginTop: -((cloud.size * 0.72) / 2),
              backgroundColor: '#ffffff',
              boxShadow: '0 20px 40px rgba(14, 165, 233, 0.12)',
              willChange: 'transform, opacity',
            }}
            initial={{
              left: cloud.initialX,
              top: cloud.initialY,
              scale: 1.8,
              opacity: 1,
            }}
            animate={
              stage === 'parting'
                ? {
                    left: cloud.targetX,
                    top: cloud.targetY,
                    scale: 2.6,
                    opacity: 0,
                  }
                : {
                    left: cloud.initialX,
                    top: cloud.initialY,
                    scale: 1.8,
                    opacity: 1,
                  }
            }
            transition={{
              duration: 1.8,
              delay: cloud.delay * 1.5,
              ease: [0.2, 1, 0.35, 1],
            }}
          >
            {/* Subtle inner shading for volume */}
            <div className="absolute inset-3 rounded-full bg-gradient-to-b from-white via-white to-sky-50" />
            <div className="absolute top-4 left-8 right-8 h-1/3 rounded-full bg-white/70" />
          </motion.div>
        ))}

        {/* Center welcome sparkles dissolving */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 1.15, y: -15 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          style={{ willChange: 'transform, opacity' }}
        >
          <div className="flex items-center gap-2 text-sky-600/80">
            <Sparkles className="w-6 h-6 text-sky-400 animate-spin" />
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
