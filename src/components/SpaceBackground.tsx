import React, { useMemo } from 'react';
import { motion, MotionValue, useTransform } from 'motion/react';

interface SpaceBackgroundProps {
  smoothedDepth: MotionValue<number>;
}

export const SpaceBackground: React.FC<SpaceBackgroundProps> = ({ smoothedDepth }) => {
  // ── CINEMATIC PARALLAX DRIFT (Proportional to total depth of 36,000 so objects stay in view across all sectors) ──
  // Continuous starfield drift with wrap
  const deepStarsY = useTransform(smoothedDepth, (d: number) => -(d * 0.02) % 800);
  const midStarsY = useTransform(smoothedDepth, (d: number) => -(d * 0.04) % 800);
  const nearStarsY = useTransform(smoothedDepth, (d: number) => -(d * 0.07) % 800);
  const nebulaY = useTransform(smoothedDepth, (d: number) => -(d * 0.015) % 600);

  // Black hole: Slow, stately transit across the viewport from upper-left down smoothly without exiting the screen
  const blackHoleParallaxY = useTransform(smoothedDepth, [0, 36000], [0, 240]);
  const blackHoleScrollRotation = useTransform(smoothedDepth, [0, 36000], [0, 180]);

  // Planet 1 (Gas Giant with rings, top-right): Moves slowly across the entire voyage so it stays visible
  const gasGiantParallaxY = useTransform(smoothedDepth, [0, 36000], [0, 220]);

  // Planet 2 (Crimson Exoplanet, mid-right): Stately gentle drift so it never disappears off-screen
  const crimsonPlanetParallaxY = useTransform(smoothedDepth, [0, 36000], [0, -180]);

  // Planet 3 (Crescent Ice Moon, mid-left): Gentle subtle upward drift across the 36,000 journey
  const iceMoonParallaxY = useTransform(smoothedDepth, [0, 36000], [0, 160]);

  // ── MULTI-LAYER STAR GENERATION (Deterministic, zero runtime recomputation) ─
  const { deepStars, midStars, brightStars } = useMemo(() => {
    // 1. Deep faint stellar pinpricks (cool blues, warm ambers, crisp whites)
    const deep = [];
    const colors = ['#e2e8f0', '#93c5fd', '#fef08a', '#c7d2fe', '#ffffff'];
    for (let i = 0; i < 110; i++) {
      deep.push({
        x: ((i * 37.7 + 13) % 98) + 1,
        y: ((i * 53.3 + 29) % 98) + 1,
        r: (i % 5 === 0) ? 1.2 : 0.8,
        color: colors[i % colors.length],
        opacity: 0.25 + ((i % 7) * 0.09),
      });
    }

    // 2. Midground stars with varied twinkling rhythms
    const mid = [];
    for (let i = 0; i < 40; i++) {
      mid.push({
        x: ((i * 47.9 + 7) % 96) + 2,
        y: ((i * 61.1 + 19) % 96) + 2,
        r: i % 4 === 0 ? 1.8 : 1.4,
        color: i % 3 === 0 ? '#38bdf8' : i % 5 === 0 ? '#fde047' : '#ffffff',
        opacity: 0.5 + ((i % 4) * 0.12),
        duration: 3 + (i % 4) * 1.2,
        delay: (i % 5) * 0.7,
      });
    }

    // 3. Prominent foreground beacon stars with subtle 4-point cross diffraction spikes
    const bright = [
      { x: 18, y: 22, r: 2.5, color: '#e0f2fe' },
      { x: 82, y: 16, r: 2.2, color: '#fef08a' },
      { x: 28, y: 78, r: 2.0, color: '#bae6fd' },
      { x: 88, y: 72, r: 2.4, color: '#fbcfe8' },
    ];

    return { deepStars: deep, midStars: mid, brightStars: bright };
  }, []);

  return (
    <div
      id="cinematic-space-background"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#02040f]"
    >
      {/* ── 1. DEEP VOID BASE GRADIENT ────────────────────────────────────── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#080e28_0%,_#030617_45%,_#010208_100%)]" />

      {/* ── 2. VOLUMETRIC COSMIC NEBULAE & INTERSTELLAR DUST (High-Performance 0ms Radial Gradients) ── */}
      <motion.div
        className="absolute inset-0"
        style={{ y: nebulaY, willChange: 'transform' }}
      >
        {/* Upper Indigo / Deep Violet Stellar Cloud */}
        <div
          className="absolute -top-[5%] right-[12%] w-[650px] h-[550px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(79, 70, 229, 0.22) 0%, rgba(49, 46, 129, 0.10) 45%, transparent 70%)',
          }}
        />
        
        {/* Gravitational Black Hole Ambient Lens Light */}
        <div
          className="absolute top-[18%] left-[10%] w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(217, 119, 6, 0.16) 0%, rgba(180, 83, 9, 0.06) 50%, transparent 70%)',
          }}
        />
        
        {/* Mid Sapphire Dust Lane */}
        <div
          className="absolute top-[48%] right-[8%] w-[600px] h-[450px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(2, 132, 199, 0.18) 0%, rgba(12, 74, 110, 0.08) 50%, transparent 70%)',
          }}
        />
        
        {/* Deep Void Dark Purple Rim */}
        <div
          className="absolute bottom-[10%] left-[22%] w-[550px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, rgba(88, 28, 135, 0.05) 50%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* ── 2B. AUTONOMOUS COSMIC SHOOTING STARS (Continuous cycle, hardware accelerated) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        {/* Meteor 1: Upper-left to mid-right trajectory */}
        <motion.div
          initial={{ x: '-10%', y: '15%', opacity: 0 }}
          animate={{
            x: ['-10%', '65%', '85%'],
            y: ['15%', '55%', '70%'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            repeatDelay: 6.5,
            ease: 'easeOut',
          }}
          style={{ willChange: 'transform, opacity' }}
          className="absolute w-36 h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-white -rotate-[24deg] shadow-[0_0_8px_#38bdf8]"
        />

        {/* Meteor 2: Far upper-right to center trajectory */}
        <motion.div
          initial={{ x: '110%', y: '8%', opacity: 0 }}
          animate={{
            x: ['110%', '30%', '10%'],
            y: ['8%', '48%', '62%'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            repeatDelay: 9.5,
            delay: 3.2,
            ease: 'easeOut',
          }}
          style={{ willChange: 'transform, opacity' }}
          className="absolute w-44 h-[2px] bg-gradient-to-l from-transparent via-sky-200 to-white rotate-[28deg] shadow-[0_0_10px_#bae6fd]"
        />

        {/* Meteor 3: Deep space high-velocity micro-flare */}
        <motion.div
          initial={{ x: '20%', y: '-5%', opacity: 0 }}
          animate={{
            x: ['20%', '80%', '95%'],
            y: ['-5%', '45%', '60%'],
            opacity: [0, 0.9, 0],
          }}
          transition={{
            duration: 1.3,
            repeat: Infinity,
            repeatDelay: 13,
            delay: 7.8,
            ease: 'easeOut',
          }}
          style={{ willChange: 'transform, opacity' }}
          className="absolute w-28 h-[1.5px] bg-gradient-to-r from-transparent via-amber-200 to-white -rotate-[32deg] shadow-[0_0_6px_#fef08a]"
        />
      </div>

      {/* ── 2C. AUTONOMOUS FLOATING COSMIC DUST (Subtle drifting ambient specks) ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { x: 12, y: 35, size: 2 },
          { x: 28, y: 65, size: 1.8 },
          { x: 45, y: 22, size: 2.2 },
          { x: 62, y: 78, size: 1.6 },
          { x: 74, y: 40, size: 2.0 },
          { x: 88, y: 18, size: 1.8 },
          { x: 82, y: 85, size: 2.2 },
          { x: 38, y: 90, size: 1.6 },
        ].map((dust, i) => (
          <div
            key={`dust-${i}`}
            className="absolute rounded-full bg-cyan-300/60 shadow-[0_0_6px_rgba(56,189,248,0.6)]"
            style={{
              left: `${dust.x}%`,
              top: `${dust.y}%`,
              width: `${dust.size}px`,
              height: `${dust.size}px`,
            }}
          />
        ))}
      </div>

      {/* ── 3. DISTANT FAINT STARFIELD (Layer 1) ──────────────────────────── */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        style={{ y: deepStarsY, willChange: 'transform' }}
      >
        {deepStars.map((s, idx) => (
          <circle
            key={`deep-${idx}`}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.r}
            fill={s.color}
            opacity={s.opacity}
          />
        ))}
      </motion.svg>

      {/* ── 4. CINEMATIC BLACK HOLE (GRAVITATIONAL LENSING & ROTATING ACCRETION DISK) ── */}
      <motion.div
        className="absolute top-[14%] sm:top-[16%] left-[6%] sm:left-[12%] w-[260px] sm:w-[340px] h-[260px] sm:h-[340px] flex items-center justify-center pointer-events-none"
        style={{
          y: blackHoleParallaxY,
          willChange: 'transform',
        }}
      >
        {/* Distant Gravitational Lensing Ambient Halo (0ms radial gradient) */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(245,158,11,0.18) 0%, rgba(14,165,233,0.12) 45%, transparent 70%)',
          }}
        />

        {/* ── ROTATING ACCRETION DISK & RELATIVISTIC JETS (Decoupled transforms for 60fps) ── */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            rotate: blackHoleScrollRotation,
            willChange: 'transform',
          }}
        >
          <motion.div
            className="w-full h-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            style={{ willChange: 'transform' }}
          >
            {/* Gravitational Lensing Upper & Lower Warped Light Arcs */}
            <svg viewBox="0 0 340 340" className="w-full h-full opacity-90">
              <defs>
                <linearGradient id="bhAccretionGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="20%" stopColor="#fed7aa" stopOpacity="0.9" />
                  <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="75%" stopColor="#ea580c" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.75" />
                </linearGradient>

                <radialGradient id="bhLensingArc" cx="50%" cy="50%" r="50%">
                  <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="78%" stopColor="#fef08a" stopOpacity="0.85" />
                  <stop offset="88%" stopColor="#f97316" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#000000" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Warped Gravitational Lensing Outer Halo */}
              <ellipse cx="170" cy="170" rx="145" ry="145" fill="none" stroke="url(#bhLensingArc)" strokeWidth="16" opacity="0.4" />

              {/* Upper Warped Light Arc */}
              <path
                d="M 45,170 C 45,75 295,75 295,170"
                fill="none"
                stroke="url(#bhAccretionGrad)"
                strokeWidth="9"
                strokeLinecap="round"
                className="opacity-80"
              />

              {/* Lower Warped Light Arc */}
              <path
                d="M 55,170 C 55,255 285,255 285,170"
                fill="none"
                stroke="url(#bhAccretionGrad)"
                strokeWidth="6.5"
                strokeLinecap="round"
                className="opacity-70"
              />

              {/* Primary Equatorial Swirling Accretion Disk */}
              <ellipse
                cx="170"
                cy="170"
                rx="160"
                ry="46"
                fill="none"
                stroke="url(#bhAccretionGrad)"
                strokeWidth="13"
              />
              
              {/* Intense Razor-Thin Inner Accretion Filament */}
              <ellipse
                cx="170"
                cy="170"
                rx="148"
                ry="40"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2.5"
                opacity="0.9"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* ── PHOTON SPHERE (Razor-sharp glowing boundary) ── */}
        <div className="absolute w-[98px] h-[98px] rounded-full border border-amber-200/90 shadow-[0_0_18px_#fde68a,inset_0_0_12px_#f59e0b] pointer-events-none" />

        {/* ── EVENT HORIZON (Absolute pitch-black void swallowing all light) ── */}
        <div className="relative w-[90px] h-[90px] rounded-full bg-black shadow-[0_0_24px_rgba(0,0,0,1)] border border-black z-10 flex items-center justify-center">
          <div className="w-[84px] h-[84px] rounded-full bg-black" />
        </div>
      </motion.div>

      {/* ── 5. CINEMATIC PLANETS (Zero SVG drop-shadow filters) ──────────── */}
      {/* PLANET 1: Majestic Azure-Gold Ringed Gas Giant (Upper Right) */}
      <motion.div
        className="absolute top-[8%] sm:top-[11%] right-[5%] sm:right-[10%] w-[180px] sm:w-[240px] h-[180px] sm:h-[240px] pointer-events-none"
        style={{ y: gasGiantParallaxY, willChange: 'transform' }}
      >
        <svg viewBox="0 0 240 240" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gasPlanetTexture" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bae6fd" />
              <stop offset="25%" stopColor="#38bdf8" />
              <stop offset="45%" stopColor="#0369a1" />
              <stop offset="68%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#090d16" />
            </linearGradient>

            <radialGradient id="gasAtmosphereGlow" cx="28%" cy="28%" r="65%">
              <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
            </radialGradient>

            <linearGradient id="ringTexture" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.75" />
              <stop offset="25%" stopColor="#7dd3fc" stopOpacity="0.65" />
              <stop offset="50%" stopColor="#1e293b" stopOpacity="0.1" />
              <stop offset="65%" stopColor="#38bdf8" stopOpacity="0.5" />
              <stop offset="90%" stopColor="#cbd5e1" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 1. Back Half of Tilted Planetary Rings */}
          <g transform="rotate(-26 120 120)">
            <ellipse
              cx="120"
              cy="120"
              rx="135"
              ry="32"
              fill="none"
              stroke="url(#ringTexture)"
              strokeWidth="22"
              strokeDasharray="420"
              strokeDashoffset="210"
              className="opacity-75"
            />
          </g>

          {/* 2. Main Spherical Planet Body */}
          <circle cx="120" cy="120" r="54" fill="url(#gasPlanetTexture)" />

          {/* Cloud Band Stratification details */}
          <path
            d="M 70,105 C 95,115 145,115 170,105 C 145,110 95,110 70,105"
            fill="#7dd3fc"
            opacity="0.3"
          />
          <path
            d="M 68,125 C 95,135 145,135 172,125 C 145,130 95,130 68,125"
            fill="#0284c7"
            opacity="0.25"
          />

          {/* Atmospheric Limb Scatter / Crescent Illumination Glow */}
          <circle cx="120" cy="120" r="54" fill="url(#gasAtmosphereGlow)" />
          
          {/* Subtle Outer Atmospheric Halo Ring */}
          <circle
            cx="120"
            cy="120"
            r="55.5"
            fill="none"
            stroke="#7dd3fc"
            strokeWidth="1.2"
            opacity="0.45"
          />

          {/* 3. Front Half of Planetary Rings */}
          <g transform="rotate(-26 120 120)">
            <ellipse
              cx="120"
              cy="120"
              rx="135"
              ry="32"
              fill="none"
              stroke="url(#ringTexture)"
              strokeWidth="22"
              strokeDasharray="420"
              strokeDashoffset="0"
              className="opacity-85"
            />
            <ellipse
              cx="120"
              cy="120"
              rx="116"
              ry="26"
              fill="none"
              stroke="#fef08a"
              strokeWidth="1.5"
              opacity="0.6"
            />
          </g>
        </svg>
      </motion.div>

      {/* PLANET 2: Distant Warm Crimson/Terracotta Exoplanet (Mid-Right Horizon) */}
      <motion.div
        className="absolute top-[52%] right-[18%] sm:right-[24%] w-[72px] h-[72px] pointer-events-none"
        style={{ y: crimsonPlanetParallaxY, willChange: 'transform' }}
      >
        <svg viewBox="0 0 72 72" className="w-full h-full">
          <defs>
            <linearGradient id="crimsonPlanetGrad" x1="15%" y1="15%" x2="85%" y2="85%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="35%" stopColor="#ea580c" />
              <stop offset="70%" stopColor="#7c2d12" />
              <stop offset="100%" stopColor="#180c06" />
            </linearGradient>
          </defs>
          <circle cx="36" cy="36" r="32" fill="url(#crimsonPlanetGrad)" />
          <circle
            cx="36"
            cy="36"
            r="32.8"
            fill="none"
            stroke="#fdba74"
            strokeWidth="1.2"
            opacity="0.45"
          />
        </svg>
      </motion.div>

      {/* PLANET 3: Distant Crescent Ice Moon / Turquoise Sphere (Mid-Left Horizon) */}
      <motion.div
        className="absolute top-[68%] left-[8%] sm:left-[14%] w-[48px] h-[48px] pointer-events-none"
        style={{ y: iceMoonParallaxY, willChange: 'transform' }}
      >
        <svg viewBox="0 0 48 48" className="w-full h-full">
          <defs>
            <linearGradient id="iceMoonGrad" x1="20%" y1="20%" x2="80%" y2="80%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="40%" stopColor="#38bdf8" />
              <stop offset="75%" stopColor="#0c4a6e" />
              <stop offset="100%" stopColor="#031524" />
            </linearGradient>
          </defs>
          <circle cx="24" cy="24" r="22" fill="url(#iceMoonGrad)" />
          <circle
            cx="24"
            cy="24"
            r="22.5"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="0.8"
            opacity="0.5"
          />
        </svg>
      </motion.div>

      {/* ── 6. MIDGROUND TWINKLING STARS (Layer 2 - Hardware Accelerated) ── */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        style={{ y: midStarsY, willChange: 'transform' }}
      >
        {midStars.map((s, idx) => (
          <circle
            key={`mid-${idx}`}
            cx={`${s.x}%`}
            cy={`${s.y}%`}
            r={s.r}
            fill={s.color}
            opacity={s.opacity}
          />
        ))}
      </motion.svg>

      {/* ── 7. BRIGHT FOREGROUND BEACON STARS WITH DIFFRACTION SPIKES (Layer 3) ── */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        style={{ y: nearStarsY, willChange: 'transform' }}
      >
        {brightStars.map((b, idx) => (
          <g key={`bright-${idx}`}>
            <line
              x1={`${b.x - 1.5}%`}
              y1={`${b.y}%`}
              x2={`${b.x + 1.5}%`}
              y2={`${b.y}%`}
              stroke={b.color}
              strokeWidth="0.8"
              opacity="0.6"
            />
            <line
              x1={`${b.x}%`}
              y1={`${b.y - 1.8}%`}
              x2={`${b.x}%`}
              y2={`${b.y + 1.8}%`}
              stroke={b.color}
              strokeWidth="0.8"
              opacity="0.6"
            />
            <circle
              cx={`${b.x}%`}
              cy={`${b.y}%`}
              r={b.r}
              fill={b.color}
              opacity="0.95"
            />
          </g>
        ))}
      </motion.svg>

      {/* ── 8. CINEMATIC AMBIENT VIGNETTE ─────────────────────────────────── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_45%,_rgba(1,2,8,0.75)_100%)] pointer-events-none" />
    </div>
  );
};
