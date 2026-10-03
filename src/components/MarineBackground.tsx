import React, { useMemo } from 'react';
import { motion, MotionValue, useTransform } from 'motion/react';
import underwaterBgImg from '../assets/images/underwater_realm_bg_1790932850703.jpg';

interface MarineBackgroundProps {
  smoothedDepth: MotionValue<number>;
  maxDepth: number;
}

export const MarineBackground: React.FC<MarineBackgroundProps> = ({
  smoothedDepth,
  maxDepth,
}) => {
  // Parallax subtle camera shift as fish swims deeper
  const bgY = useTransform(smoothedDepth, [0, maxDepth], [0, -70]);
  const bgScale = useTransform(smoothedDepth, [0, maxDepth], [1.02, 1.1]);

  // Color tone shift: Scene 1..6 (deep sapphire & cyan) -> Scene 7 (bright sunlit turquoise ocean canyon)
  const sunlitCanyonOpacity = useTransform(
    smoothedDepth,
    [maxDepth * 0.75, maxDepth * 0.92, maxDepth],
    [0, 0.45, 0.85]
  );

  // Background swimming school of small fish
  const backgroundFish = useMemo(() => {
    return [...Array(10)].map((_, i) => ({
      id: i,
      top: `${12 + (i * 8) % 75}%`,
      delay: i * 2.8,
      duration: 18 + (i % 4) * 4,
      scale: 0.4 + (i % 3) * 0.15,
      ySway: (i % 2 === 0 ? 1 : -1) * (15 + (i % 3) * 8),
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0 bg-[#020d1c]">
      {/* ── 1. CINEMATIC HIGH-FIDELITY UNDERWATER REALM BACKDROP ── */}
      <motion.div
        style={{
          y: bgY,
          scale: bgScale,
        }}
        className="absolute inset-0 will-change-transform"
      >
        <img
          src={underwaterBgImg}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/underwater-realm-bg.jpg';
          }}
          alt="Deep Ocean Realm"
          className="w-full h-full object-cover object-center"
        />

        {/* Deep Ocean Ambient Light & Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#04244a]/40 via-transparent to-[#020914]/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_35%,_#010712_100%)] opacity-75" />
      </motion.div>

      {/* ── 2. SUNLIT ILLUMINATION IN SCENE 7 (ENDING OCEAN CANYON) ── */}
      <motion.div
        style={{ opacity: sunlitCanyonOpacity }}
        className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-500/20 to-sky-300/35 pointer-events-none transition-opacity duration-700"
      >
        {/* Giant Gentle Blue Whale Silhouette in the sunlit distance */}
        <motion.div
          animate={{
            x: ['-20vw', '115vw'],
            y: [0, -18, 0, 12, 0],
          }}
          transition={{
            duration: 48,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-[22%] left-0 w-80 h-32 opacity-40 filter blur-xs"
        >
          <svg viewBox="0 0 240 90" className="w-full h-full fill-cyan-950/70">
            <path d="M 15 45 C 40 25, 110 18, 170 28 C 205 34, 230 42, 240 45 C 228 48, 200 56, 160 58 C 100 62, 45 60, 15 45 Z" />
            <path d="M 215 44 C 230 30, 245 15, 238 40 C 245 65, 230 52, 215 44 Z" />
            <path d="M 90 48 C 80 62, 70 74, 60 78 C 65 68, 75 56, 85 48 Z" />
          </svg>
        </motion.div>
      </motion.div>

      {/* ── 3. BEAUTIFUL SUNLIGHT RAYS & WATER CAUSTICS (Reference Style) ── */}
      <div className="absolute inset-0 overflow-hidden mix-blend-screen opacity-55 pointer-events-none">
        <motion.div
          animate={{
            x: [-20, 20, -20],
            rotate: [-1, 1, -1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -left-[10%] w-[120%] h-[65vh] flex justify-around"
        >
          <div className="w-28 h-full bg-gradient-to-b from-cyan-200/80 via-sky-300/30 to-transparent blur-3xl transform -rotate-15" />
          <div className="w-48 h-full bg-gradient-to-b from-white/90 via-cyan-200/40 to-transparent blur-3xl transform -rotate-6" />
          <div className="w-36 h-full bg-gradient-to-b from-sky-200/80 via-sky-400/30 to-transparent blur-3xl transform rotate-6" />
          <div className="w-32 h-full bg-gradient-to-b from-white/90 via-cyan-300/35 to-transparent blur-3xl transform rotate-16" />
        </motion.div>
      </div>

      {/* ── 4. MOVING BACKGROUND FISH SCHOOLS GLIDING ACROSS THE SEABED ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {backgroundFish.map((fish) => (
          <motion.div
            key={fish.id}
            style={{
              top: fish.top,
              transform: `scale(${fish.scale})`,
            }}
            animate={{
              x: ['-10vw', '110vw'],
              y: [0, fish.ySway, 0, -fish.ySway, 0],
            }}
            transition={{
              duration: fish.duration,
              delay: fish.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute left-0 opacity-45 filter blur-[0.5px]"
          >
            {/* Small glowing silhouette fish */}
            <svg width="36" height="18" viewBox="0 0 36 18" fill="none">
              <path
                d="M 2 9 C 8 4, 20 2, 28 7 C 32 4, 36 2, 34 9 C 36 16, 32 14, 28 11 C 20 16, 8 14, 2 9 Z"
                fill="#38bdf8"
                opacity="0.8"
              />
              <circle cx="8" cy="8" r="1" fill="#ffffff" />
            </svg>
          </motion.div>
        ))}
      </div>

      {/* ── 5. FLOATING PARTICLES & RISING WATER BUBBLES ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(24)].map((_, i) => (
          <motion.div
            key={`bubble-${i}`}
            className="absolute rounded-full border border-cyan-300/50 bg-cyan-200/25 backdrop-blur-xs shadow-[0_0_8px_rgba(56,189,248,0.5)]"
            style={{
              width: 4 + (i % 5) * 3,
              height: 4 + (i % 5) * 3,
              left: `${(i * 4.3 + 3) % 94}%`,
              bottom: '-30px',
            }}
            animate={{
              y: [0, -window.innerHeight - 100],
              x: [0, (i % 2 === 0 ? 30 : -30), 0],
              opacity: [0, 0.75, 0.75, 0],
            }}
            transition={{
              duration: 10 + (i % 4) * 3,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.7,
            }}
          />
        ))}

        {/* Bioluminescent Plankton & Marine Dust Particles */}
        {[...Array(28)].map((_, i) => (
          <motion.div
            key={`plankton-${i}`}
            className="absolute rounded-full bg-cyan-100 shadow-[0_0_8px_rgba(165,243,252,0.9)]"
            style={{
              width: 1.5 + (i % 3),
              height: 1.5 + (i % 3),
              left: `${(i * 3.7 + 2) % 96}%`,
              top: `${(i * 4.1 + 5) % 90}%`,
            }}
            animate={{
              y: [-16, 16, -16],
              x: [-12, 12, -12],
              opacity: [0.25, 0.85, 0.25],
            }}
            transition={{
              duration: 3.5 + (i % 3) * 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.25,
            }}
          />
        ))}
      </div>
    </div>
  );
};
