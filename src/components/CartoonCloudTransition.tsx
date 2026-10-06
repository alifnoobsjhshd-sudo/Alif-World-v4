import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface CartoonCloudTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

// Stylized, GPU-optimized cartoon cloud puffs with coordinates and scale targets (slowed & majestic)
const CLOUD_ITEMS = [
  // Bottom foundation billows
  { id: 'c-bot-l', left: '15%', top: '85%', size: 520, delay: 0.08, duration: 2.2, xOffset: -60, yOffset: 120 },
  { id: 'c-bot-r', left: '85%', top: '88%', size: 540, delay: 0.16, duration: 2.2, xOffset: 80, yOffset: 120 },
  { id: 'c-bot-c', left: '50%', top: '92%', size: 660, delay: 0.24, duration: 2.3, xOffset: 0, yOffset: 140 },

  // Flank billows
  { id: 'c-flank-l', left: '0%', top: '45%', size: 480, delay: 0.32, duration: 2.1, xOffset: -120, yOffset: 0 },
  { id: 'c-flank-r', left: '100%', top: '40%', size: 500, delay: 0.38, duration: 2.1, xOffset: 120, yOffset: 0 },

  // Top billows
  { id: 'c-top-l', left: '20%', top: '10%', size: 470, delay: 0.44, duration: 2.0, xOffset: -80, yOffset: -100 },
  { id: 'c-top-r', left: '80%', top: '12%', size: 490, delay: 0.50, duration: 2.0, xOffset: 80, yOffset: -100 },

  // Central embracing puffs (slowly envelope screen in cloud dream)
  { id: 'c-ctr-1', left: '38%', top: '42%', size: 600, delay: 0.62, duration: 2.2, xOffset: -40, yOffset: 30 },
  { id: 'c-ctr-2', left: '62%', top: '48%', size: 620, delay: 0.72, duration: 2.2, xOffset: 40, yOffset: 30 },
  { id: 'c-ctr-3', left: '50%', top: '50%', size: 760, delay: 0.85, duration: 2.0, xOffset: 0, yOffset: 0 },
];

export const CartoonCloudTransition: React.FC<CartoonCloudTransitionProps> = ({
  isActive,
  onComplete,
}) => {
  // Stages: 'idle' -> 'blueIn' -> 'cloudsIn' -> 'covered'
  const [stage, setStage] = useState<'idle' | 'blueIn' | 'cloudsIn' | 'covered'>('idle');

  useEffect(() => {
    if (!isActive) {
      setStage('idle');
      return;
    }

    // Step 1: Transparent blue tint fades in smoothly and gently (at ~700ms)
    const blueTimer = setTimeout(() => {
      setStage('blueIn');
    }, 700);

    // Step 2: Stylized clouds billow in cinematically & slowly (at ~2000ms)
    const cloudTimer = setTimeout(() => {
      setStage('cloudsIn');
    }, 2000);

    // Step 3: Screen is seamlessly filled with clean sky atmosphere (at ~4200ms)
    const coverTimer = setTimeout(() => {
      setStage('covered');
    }, 4200);

    // Step 4: Trigger page navigation (at ~4700ms)
    const finishTimer = setTimeout(() => {
      onComplete();
    }, 4700);

    return () => {
      clearTimeout(blueTimer);
      clearTimeout(cloudTimer);
      clearTimeout(coverTimer);
      clearTimeout(finishTimer);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <div
        id="cinematic-journey-transition-overlay"
        className="fixed inset-0 z-[120] pointer-events-auto select-none overflow-hidden"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* ── 1. TRANSPARENT BLUE COLOR FADE (Hardware-accelerated opacity) ── */}
        <motion.div
          id="transparent-blue-fade-overlay"
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: stage === 'idle' ? 0 : 1,
          }}
          transition={{
            duration: 1.4,
            ease: [0.25, 1, 0.4, 1],
          }}
          style={{ willChange: 'opacity' }}
        >
          {/* Deep cinematic sky-blue gradient wash */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 40% 35%, rgba(56, 189, 248, 0.48) 0%, rgba(14, 165, 233, 0.62) 50%, rgba(3, 105, 161, 0.75) 100%)',
            }}
          />

          {/* Central dream bloom (Pure CSS radial glow without runtime filter blurs) */}
          <motion.div
            className="absolute left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2 w-[520px] sm:w-[720px] h-[320px] sm:h-[420px] rounded-full pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.75) 0%, rgba(186, 230, 253, 0.45) 45%, transparent 75%)',
              willChange: 'transform, opacity',
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: [0.5, 1.25, 1.45],
              opacity: [0, 0.9, 0.6],
            }}
            transition={{ duration: 3.4, ease: 'easeOut' }}
          />

          {/* Anamorphic Cyan Flare Line across dream bubble horizon */}
          <motion.div
            className="absolute top-[36%] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-200 to-transparent pointer-events-none opacity-80"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: [0, 1.2, 1.6] }}
            transition={{ duration: 2.8, ease: 'easeOut' }}
            style={{ willChange: 'transform' }}
          />
        </motion.div>

        {/* ── 2. CINEMATIC BILLOWING CLOUDS (Pure scale & translate transforms) ── */}
        {(stage === 'cloudsIn' || stage === 'covered') && (
          <div id="cinematic-clouds-container" className="absolute inset-0 pointer-events-none">
            {CLOUD_ITEMS.map((c) => (
              <motion.div
                key={c.id}
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: c.left,
                  top: c.top,
                  width: c.size,
                  height: c.size * 0.72,
                  marginLeft: -(c.size / 2),
                  marginTop: -((c.size * 0.72) / 2),
                  willChange: 'transform, opacity',
                  boxShadow: '0 20px 40px rgba(14, 165, 233, 0.16)',
                }}
                initial={{
                  scale: 0.15,
                  opacity: 0,
                  x: c.xOffset,
                  y: c.yOffset,
                }}
                animate={{
                  scale: [0.15, 0.8, 1.6, 2.3],
                  opacity: [0, 0.9, 1, 1],
                  x: [c.xOffset, c.xOffset * 0.3, 0, 0],
                  y: [c.yOffset, c.yOffset * 0.2, 0, 0],
                }}
                transition={{
                  duration: c.duration,
                  delay: c.delay,
                  ease: [0.2, 1, 0.35, 1],
                }}
              >
                {/* 3.5D Cartoon Volumetric Cloud Shading (Gradients only, zero filters) */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white via-white to-sky-100" />
                <div className="absolute inset-4 rounded-full bg-gradient-to-b from-white/95 to-transparent" />
                <div className="absolute top-4 left-8 right-8 h-1/3 rounded-full bg-white/70" />
              </motion.div>
            ))}

            {/* Gliding Paper Airplane into the clouds */}
            <motion.div
              className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
              initial={{ scale: 0.7, opacity: 0, x: -90, y: 35, rotate: -6 }}
              animate={{
                scale: [0.7, 1.25, 2.0],
                opacity: [0, 1, 0],
                x: [-90, 20, 160],
                y: [35, -10, -50],
                rotate: [-6, 10, 16],
              }}
              transition={{
                duration: 2.6,
                delay: 0.35,
                ease: [0.25, 1, 0.45, 1],
              }}
              style={{ willChange: 'transform, opacity' }}
            >
              <div className="relative drop-shadow-[0_8px_16px_rgba(14,165,233,0.35)]">
                <svg width="68" height="42" viewBox="0 0 56 36" fill="none" className="w-16 h-auto">
                  <path d="M54 16 L4 2 L18 16 Z" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.2" />
                  <path d="M54 16 L18 16 L4 30 Z" fill="#f0f9ff" stroke="#60a5fa" strokeWidth="1.2" />
                  <path d="M18 16 L22 30 L4 30 Z" fill="#38bdf8" opacity="0.85" />
                  <line x1="54" y1="16" x2="18" y2="16" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <Sparkles className="w-5 h-5 text-amber-300 absolute -top-2 -right-2 animate-spin" />
              </div>
            </motion.div>
          </div>
        )}

        {/* ── 3. SEAMLESS CLEAN WHITE/SKY BLANKET (Handoff to /journey) ── */}
        <motion.div
          id="final-sky-blanket"
          className="absolute inset-0 bg-gradient-to-b from-white via-sky-50 to-white flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: stage === 'covered' ? 1 : 0,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ willChange: 'opacity' }}
        >
          <motion.div
            className="flex items-center justify-center w-11 h-11 rounded-full bg-white/95 border border-sky-100 shadow-md"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={
              stage === 'covered'
                ? { opacity: 1, scale: 1 }
                : { opacity: 0, scale: 0.85 }
            }
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="w-5 h-5 text-sky-500 animate-spin" />
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
