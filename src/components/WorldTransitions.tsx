import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { dreamAudio } from '../utils/audio';

// ── 1. THE STORY: CLOUD COVERING TRANSITION ─────────────────────────────────
export interface StoryCloudCoverProps {
  isActive: boolean;
  onComplete: () => void;
}

const CLOUD_BILLOWS = [
  { id: 'b1', left: '10%', top: '85%', size: 480, delay: 0.04, x: -50, y: 80 },
  { id: 'b2', left: '85%', top: '88%', size: 500, delay: 0.08, x: 60, y: 90 },
  { id: 'b3', left: '50%', top: '90%', size: 600, delay: 0.12, x: 0, y: 100 },
  { id: 'b4', left: '5%', top: '35%', size: 450, delay: 0.16, x: -100, y: 0 },
  { id: 'b5', left: '95%', top: '35%', size: 480, delay: 0.20, x: 100, y: 0 },
  { id: 'b6', left: '20%', top: '8%', size: 440, delay: 0.24, x: -60, y: -70 },
  { id: 'b7', left: '80%', top: '8%', size: 460, delay: 0.28, x: 60, y: -70 },
  { id: 'b8', left: '35%', top: '45%', size: 550, delay: 0.36, x: -30, y: 20 },
  { id: 'b9', left: '65%', top: '48%', size: 580, delay: 0.42, x: 30, y: 20 },
  { id: 'b10', left: '50%', top: '50%', size: 720, delay: 0.50, x: 0, y: 0 },
];

export const StoryCloudCoverTransition: React.FC<StoryCloudCoverProps> = ({
  isActive,
  onComplete,
}) => {
  const [covered, setCovered] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setCovered(false);
      return;
    }

    // Play cloud rushing wind sound while animation runs
    dreamAudio.playCloudWhoosh();

    const tCover = setTimeout(() => {
      setCovered(true);
    }, 1050);

    const tComplete = setTimeout(() => {
      onComplete();
    }, 1550);

    return () => {
      clearTimeout(tCover);
      clearTimeout(tComplete);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto select-none overflow-hidden">
      {/* Billowing volumetric cloud puffs expanding across screen */}
      <div className="absolute inset-0 pointer-events-none">
        {CLOUD_BILLOWS.map((c) => (
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
              boxShadow: '0 20px 40px rgba(14, 165, 233, 0.18)',
            }}
            initial={{ scale: 0.15, opacity: 0, x: c.x, y: c.y }}
            animate={{
              scale: [0.15, 0.85, 1.8, 2.6],
              opacity: [0, 0.85, 1, 1],
              x: [c.x, c.x * 0.3, 0, 0],
              y: [c.y, c.y * 0.2, 0, 0],
            }}
            transition={{
              duration: 1.45,
              delay: c.delay,
              ease: [0.2, 1, 0.35, 1],
            }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white via-white to-sky-100" />
            <div className="absolute inset-3 rounded-full bg-gradient-to-b from-white/95 to-transparent" />
          </motion.div>
        ))}
      </div>

      {/* Seamless full screen cloud blanket fade (Connects with JourneyCloudOut) */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-white via-sky-50 to-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: covered ? 1 : 0 }}
        transition={{ duration: 0.45 }}
      />
    </div>
  );
};

// ── 2. ABOUT ME: RISING BUBBLE SCREEN COVER TRANSITION ──────────────────────
export interface AboutBubbleCoverProps {
  isActive: boolean;
  onComplete: () => void;
}

const BUBBLE_ITEMS = [...Array(44)].map((_, i) => ({
  id: i,
  left: `${2 + (i * 2.3) % 96}%`,
  size: 22 + (i % 6) * 16 + Math.floor(i * 1.3),
  delay: 0.04 + (i * 0.038),
  duration: 1.3 + (i % 5) * 0.22,
  wobble: (i % 2 === 0 ? 1 : -1) * (14 + (i % 4) * 12),
}));

export const AboutBubbleCoverTransition: React.FC<AboutBubbleCoverProps> = ({
  isActive,
  onComplete,
}) => {
  const [oceanCover, setOceanCover] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setOceanCover(false);
      return;
    }

    // Aquatic bubble bloops sound while animation runs
    dreamAudio.playSubmergedBubbleCover();

    const tCover = setTimeout(() => {
      setOceanCover(true);
    }, 1150);

    const tComplete = setTimeout(() => {
      onComplete();
    }, 1680);

    return () => {
      clearTimeout(tCover);
      clearTimeout(tComplete);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto select-none overflow-hidden">
      {/* Deep Ocean Wash rising from bottom */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-[#021833] via-[#032a59]/90 to-[#03447a]/70"
        initial={{ y: '100%', opacity: 0.3 }}
        animate={{ y: ['100%', '30%', '0%'], opacity: [0.3, 0.85, 1] }}
        transition={{ duration: 1.45, ease: [0.2, 0.85, 0.25, 1] }}
      />

      {/* Massive Rising Bubble Surge from the Bottom */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {BUBBLE_ITEMS.map((b) => (
          <motion.div
            key={b.id}
            className="absolute rounded-full border border-white/80 bg-gradient-to-tr from-cyan-400/40 via-sky-200/50 to-white/70 shadow-[0_0_15px_rgba(56,189,248,0.7),inset_0_0_8px_rgba(255,255,255,0.7)]"
            style={{
              left: b.left,
              bottom: '-60px',
              width: b.size,
              height: b.size,
            }}
            initial={{ y: 0, opacity: 0, scale: 0.6 }}
            animate={{
              y: '-125vh',
              x: [0, b.wobble, -b.wobble * 0.5, b.wobble * 0.8],
              opacity: [0, 0.95, 0.95, 0.8],
              scale: [0.6, 1.15, 1.4],
            }}
            transition={{
              duration: b.duration,
              delay: b.delay,
              ease: 'easeOut',
            }}
          >
            {/* Bubble Specular Glint */}
            <div className="absolute top-[18%] left-[22%] w-[28%] h-[28%] rounded-full bg-white/90 blur-[0.3px]" />
          </motion.div>
        ))}
      </div>

      {/* Final Deep Sapphire Underwater Blanket (#020d1c matches AboutMePage background) */}
      <motion.div
        className="absolute inset-0 bg-[#020d1c]"
        initial={{ opacity: 0 }}
        animate={{ opacity: oceanCover ? 1 : 0 }}
        transition={{ duration: 0.45 }}
      />
    </div>
  );
};

// ── 3. MY WORKS: ROCKET LAUNCH & SPACE BACKGROUND TRANSITION ────────────────
export interface WorksRocketLaunchProps {
  isActive: boolean;
  onComplete: () => void;
}

const STARS = [...Array(55)].map((_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2.5 + 1.2,
  delay: Math.random() * 0.7,
}));

export const WorksRocketLaunchTransition: React.FC<WorksRocketLaunchProps> = ({
  isActive,
  onComplete,
}) => {
  const [inSpace, setInSpace] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setInSpace(false);
      return;
    }

    // Rocket thruster roar & launch sound while animation runs
    dreamAudio.playRocketLaunch();

    // As rocket speeds up, space background and stars take over
    const tSpace = setTimeout(() => {
      setInSpace(true);
    }, 700);

    const tComplete = setTimeout(() => {
      onComplete();
    }, 2050);

    return () => {
      clearTimeout(tSpace);
      clearTimeout(tComplete);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-auto select-none overflow-hidden">
      {/* ── BACKGROUND: GRADUAL SHIFT FROM DAY SKY TO DEEP SPACE ── */}
      <motion.div
        className="absolute inset-0"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{ duration: 0.7, ease: 'easeIn', delay: 0.35 }}
      >
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            inSpace ? 'opacity-100' : 'opacity-70'
          }`}
          style={{
            background: inSpace
              ? 'radial-gradient(ellipse at 50% 40%, #050a24 0%, #030718 60%, #010410 100%)'
              : 'radial-gradient(ellipse at 50% 60%, #1e1b4b 0%, #0f172a 60%, #020617 100%)',
          }}
        />

        {/* Twinkling Deep Space Stars appearing as rocket speeds up */}
        <div
          className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
            inSpace ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {STARS.map((s) => (
            <motion.div
              key={s.id}
              className="absolute rounded-full bg-white shadow-[0_0_6px_#ffffff]"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0.3, 0.95, 0.5, 1], scale: [0.8, 1.2, 1] }}
              transition={{ duration: 1.2, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          {/* Glowing Cosmic Nebula */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/35 via-transparent to-cyan-900/30 pointer-events-none" />
        </div>
      </motion.div>

      {/* ── LAUNCHING ROCKET WITH ACCELERATING SPEED ── */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20"
        initial={{ y: '108vh', scale: 0.85 }}
        animate={{
          y: ['108vh', '48vh', '-45vh'],
          scale: [0.85, 1.15, 1.4],
        }}
        transition={{
          duration: 1.95,
          ease: [0.35, 0, 0.2, 1], // Slow start with explosive upward acceleration
        }}
      >
        <div className="relative">
          {/* Retro-Futuristic Rocket SVG */}
          <svg
            width="82"
            height="134"
            viewBox="0 0 80 130"
            fill="none"
            className="drop-shadow-[0_0_30px_rgba(56,189,248,0.95)]"
          >
            {/* Rocket Body */}
            <path
              d="M40 5 C24 25, 20 65, 20 95 L60 95 C60 65, 56 25, 40 5 Z"
              fill="url(#rocketBody)"
              stroke="#e2e8f0"
              strokeWidth="2"
            />
            {/* Nose Cone */}
            <path d="M40 5 C32 18, 28 32, 28 42 L52 42 C52 32, 48 18, 40 5 Z" fill="#a855f7" />
            {/* Cabin Window */}
            <circle cx="40" cy="55" r="9" fill="#38bdf8" stroke="#ffffff" strokeWidth="2.5" />
            <circle cx="38" cy="53" r="3" fill="#ffffff" />
            {/* Left Fin */}
            <path d="M20 75 L4 105 L20 100 Z" fill="#9333ea" stroke="#7e22ce" strokeWidth="1.5" />
            {/* Right Fin */}
            <path d="M60 75 L76 105 L60 100 Z" fill="#9333ea" stroke="#7e22ce" strokeWidth="1.5" />
            {/* Thruster Nozzle */}
            <path d="M30 95 L50 95 L46 108 L34 108 Z" fill="#334155" />

            <defs>
              <linearGradient id="rocketBody" x1="20" y1="5" x2="60" y2="95" gradientUnits="userSpaceOnUse">
                <stop stopColor="#ffffff" />
                <stop offset="0.6" stopColor="#f8fafc" />
                <stop offset="1" stopColor="#e2e8f0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Fiery Thruster Exhaust Plume (Flaring as rocket accelerates) */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 top-[92%] flex flex-col items-center pointer-events-none"
            animate={{
              scaleY: [1, 1.5, 1.2, 1.7],
              opacity: [0.92, 1, 0.95],
            }}
            transition={{ duration: 0.16, repeat: Infinity }}
          >
            {/* Outer Flame */}
            <div className="w-12 h-32 bg-gradient-to-b from-amber-400 via-purple-500 to-transparent rounded-full blur-[2.5px]" />
            {/* Core Plasma Jet */}
            <div className="absolute top-0 w-5 h-20 bg-gradient-to-b from-white via-cyan-200 to-transparent rounded-full" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
