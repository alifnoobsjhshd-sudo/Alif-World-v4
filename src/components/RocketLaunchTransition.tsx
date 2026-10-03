import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { dreamAudio } from '../utils/audio';

interface RocketLaunchTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

export const RocketLaunchTransition: React.FC<RocketLaunchTransitionProps> = ({
  isActive,
  onComplete,
}) => {
  const [phase, setPhase] = useState<'idle' | 'ignition' | 'liftoff' | 'stratosphere' | 'deepspace' | 'warp'>('idle');
  const [telemetryText, setTelemetryText] = useState('ALL SYSTEMS READY');

  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      return;
    }

    // Play powerful rocket launch sound
    dreamAudio.playRocketLaunch();
    setPhase('ignition');
    setTelemetryText('THRUSTER IGNITION INITIATED');

    const t1 = setTimeout(() => {
      setPhase('liftoff');
      setTelemetryText('LIFTOFF! BREAKING ATMOSPHERIC BOUNDARY');
    }, 1100);

    const t2 = setTimeout(() => {
      setPhase('stratosphere');
      setTelemetryText('PUNCHING STRATOSPHERE — MACH 3.2');
    }, 2200);

    const t3 = setTimeout(() => {
      setPhase('deepspace');
      setTelemetryText('ORBITAL INSERTION ACHIEVED — ENTERING DEEP SPACE');
    }, 3200);

    const t4 = setTimeout(() => {
      setPhase('warp');
      setTelemetryText('CALCULATING WORK SECTOR COORDINATES...');
    }, 3900);

    const tEnd = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(tEnd);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] overflow-hidden pointer-events-auto select-none flex items-center justify-center font-display"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Dynamic Sky-to-Space Gradient Background */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background:
              phase === 'ignition' || phase === 'idle'
                ? 'linear-gradient(to bottom, #7dd3fc 0%, #bae6fd 60%, #e0f2fe 100%)'
                : phase === 'liftoff'
                ? 'linear-gradient(to bottom, #0284c7 0%, #38bdf8 50%, #bae6fd 100%)'
                : phase === 'stratosphere'
                ? 'linear-gradient(to bottom, #0f172a 0%, #1e1b4b 40%, #0369a1 100%)'
                : 'linear-gradient(to bottom, #020617 0%, #090a1e 50%, #030712 100%)',
          }}
          transition={{ duration: 1.0, ease: 'easeInOut' }}
        />

        {/* Dense Starfield Emerging in Stratosphere/Deepspace */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{
            opacity: phase === 'stratosphere' ? 0.6 : phase === 'deepspace' || phase === 'warp' ? 1 : 0,
          }}
          transition={{ duration: 0.8 }}
        >
          {/* Radial Nebula Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.18)_0%,transparent_70%)]" />
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Procedural Stars */}
          <svg className="w-full h-full opacity-80" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </radialGradient>
            </defs>
            {Array.from({ length: 90 }).map((_, i) => {
              const x = (i * 37) % 100;
              const y = (i * 53) % 100;
              const r = ((i % 5) + 1) * 0.7;
              return (
                <circle
                  key={i}
                  cx={`${x}%`}
                  cy={`${y}%`}
                  r={r}
                  fill={i % 3 === 0 ? '#38bdf8' : '#ffffff'}
                  opacity={0.4 + ((i % 6) / 10)}
                  className="animate-pulse"
                  style={{ animationDuration: `${1.5 + (i % 3)}s` }}
                />
              );
            })}
          </svg>
        </motion.div>

        {/* Warp Streak Lines (Streaking Downward when accelerating to space) */}
        {(phase === 'stratosphere' || phase === 'deepspace' || phase === 'warp') && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => {
              const left = (i * 3.3) % 100;
              const delay = (i * 0.05) % 0.6;
              const duration = 0.35 + ((i % 4) * 0.08);
              return (
                <motion.div
                  key={i}
                  className="absolute w-[2px] rounded-full bg-gradient-to-b from-transparent via-cyan-300 to-white"
                  style={{
                    left: `${left}%`,
                    height: '140px',
                  }}
                  initial={{ y: -160, opacity: 0 }}
                  animate={{ y: '120vh', opacity: [0, 0.9, 0] }}
                  transition={{
                    duration,
                    repeat: Infinity,
                    delay,
                    ease: 'linear',
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Supersonic Shockwave Condensation Rings */}
        {phase === 'stratosphere' && (
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-cyan-300/80 pointer-events-none"
            initial={{ width: 40, height: 40, opacity: 1, scale: 0.2 }}
            animate={{ width: 900, height: 900, opacity: 0, scale: 2.2 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        )}

        {/* ── THE ROCKET VEHICLE (Enters, Ignites, and Blasts Off) ────────────── */}
        <motion.div
          className="relative z-30 flex flex-col items-center"
          initial={{ y: 80, scale: 0.85, opacity: 0 }}
          animate={
            phase === 'ignition'
              ? { y: [0, -3, 2, -2, 1, 0], scale: 1, opacity: 1 }
              : phase === 'liftoff'
              ? { y: -80, scale: 1.05, opacity: 1 }
              : phase === 'stratosphere'
              ? { y: -380, scale: 0.95, opacity: 1 }
              : phase === 'deepspace'
              ? { y: -720, scale: 0.75, opacity: 0.9 }
              : { y: -1400, scale: 0.4, opacity: 0 }
          }
          transition={{
            duration: phase === 'ignition' ? 1.0 : 1.2,
            ease: phase === 'ignition' ? 'easeInOut' : [0.25, 0.1, 0.25, 1],
          }}
        >
          {/* Detailed Futuristic Space Rocket */}
          <div className="relative w-28 sm:w-36 flex flex-col items-center">
            
            {/* Nosecone & Body SVG */}
            <svg
              viewBox="0 0 160 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]"
            >
              <defs>
                <linearGradient id="rocketBody" x1="0" y1="0" x2="160" y2="320" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="45%" stopColor="#f8fafc" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
                <linearGradient id="cockpitGlass" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>
                <linearGradient id="wingGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="boosterMetal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>
              </defs>

              {/* Left Wing / Fin */}
              <path
                d="M42 180 L10 240 L18 260 L42 245 Z"
                fill="url(#wingGradient)"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />
              {/* Right Wing / Fin */}
              <path
                d="M118 180 L150 240 L142 260 L118 245 Z"
                fill="url(#wingGradient)"
                stroke="#38bdf8"
                strokeWidth="1.5"
              />

              {/* Main Fuselage */}
              <path
                d="M80 15 C62 60 42 120 42 240 L118 240 C118 120 98 60 80 15 Z"
                fill="url(#rocketBody)"
                stroke="#94a3b8"
                strokeWidth="2"
              />

              {/* Heat Shield Nose Cap */}
              <path
                d="M80 15 C72 38 65 65 65 72 L95 72 C95 65 88 38 80 15 Z"
                fill="#0f172a"
              />

              {/* Cockpit Canopy Window */}
              <ellipse
                cx="80"
                cy="110"
                rx="14"
                ry="22"
                fill="url(#cockpitGlass)"
                stroke="#e0f2fe"
                strokeWidth="2"
              />
              <ellipse
                cx="77"
                cy="104"
                rx="5"
                ry="9"
                fill="#ffffff"
                opacity="0.75"
              />

              {/* Alif Insignia / Star Logo */}
              <circle cx="80" cy="165" r="9" fill="#0284c7" />
              <path
                d="M80 158 L82.5 163 L88 163.5 L84 167 L85 172 L80 169.5 L75 172 L76 167 L72 163.5 L77.5 163 Z"
                fill="#ffffff"
              />

              {/* Rocket Body Panels */}
              <line x1="48" y1="140" x2="112" y2="140" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 2" />
              <line x1="44" y1="190" x2="116" y2="190" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4 2" />

              {/* Main Engine Nozzle Ring */}
              <rect x="52" y="240" width="56" height="18" rx="4" fill="url(#boosterMetal)" stroke="#94a3b8" strokeWidth="1.5" />
              <rect x="58" y="258" width="44" height="12" rx="3" fill="#0f172a" />
            </svg>

            {/* ── FIREBLAST PLASMA THRUSTER EFFECT ───────────────────────── */}
            <div className="relative -mt-3 flex flex-col items-center pointer-events-none">
              {/* Core Plasma Jet Flame */}
              <motion.div
                className="w-12 sm:w-16 rounded-b-full bg-gradient-to-b from-white via-yellow-300 to-orange-500 blur-[1px] origin-top"
                animate={{
                  height: phase === 'ignition' ? [45, 65, 50] : [90, 160, 120, 180],
                  scaleX: [0.9, 1.15, 0.95],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.18,
                  ease: 'easeInOut',
                }}
                style={{
                  boxShadow: '0 0 45px rgba(249, 115, 22, 0.95), 0 0 80px rgba(56, 189, 248, 0.8)',
                }}
              />

              {/* Outer Blue Shock-Diamond Exhaust */}
              <motion.div
                className="absolute -top-1 w-16 sm:w-20 rounded-b-full bg-gradient-to-b from-cyan-300/90 via-blue-500/80 to-transparent blur-sm origin-top"
                animate={{
                  height: phase === 'ignition' ? [70, 95] : [140, 220, 170],
                  opacity: [0.8, 1, 0.85],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.22,
                  ease: 'easeInOut',
                }}
              />

              {/* Exhaust Spark Particles */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-yellow-200"
                  style={{
                    boxShadow: '0 0 10px #fef08a',
                  }}
                  animate={{
                    y: [0, 120 + i * 20],
                    x: [(i - 4) * 4, (i - 4) * 18],
                    opacity: [1, 0],
                    scale: [1.2, 0.2],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.35 + (i * 0.05),
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>

          </div>
        </motion.div>

        {/* ── Billowing Smoke Cloud Rings (Ignition Pad & Sky Boundary) ─────── */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 flex justify-center items-end pointer-events-none z-20"
          animate={{
            y: phase === 'liftoff' ? [0, 80] : 0,
            opacity: phase === 'deepspace' || phase === 'warp' ? 0 : 1,
          }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative w-full max-w-4xl h-48 sm:h-64 flex items-end justify-center">
            {/* Billowing cloud puffs */}
            {[-180, -90, 0, 90, 180].map((offset, idx) => (
              <motion.div
                key={idx}
                className="absolute bottom-0 w-64 h-64 rounded-full bg-gradient-to-t from-white/95 via-slate-100/90 to-transparent blur-xl"
                style={{
                  left: `calc(50% + ${offset}px - 128px)`,
                  boxShadow: '0 -15px 40px rgba(255,255,255,0.7)',
                }}
                animate={{
                  scale: [1, 1.35, 1.2],
                  opacity: [0.6, 0.9, 0.7],
                  y: [0, -20, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8 + idx * 0.1,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* ── TOP & BOTTOM FUTURISTIC TELEMETRY HUD ───────────────────────── */}
        <div className="absolute top-6 left-0 right-0 flex flex-col items-center z-40 px-4">
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-500/40 text-cyan-400 text-xs sm:text-sm font-bold tracking-widest uppercase shadow-lg shadow-cyan-950/40"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>{telemetryText}</span>
          </motion.div>
        </div>

        {/* Bottom Orbit Coordinate Status */}
        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-between px-6 sm:px-12 z-40 text-xs tracking-widest text-slate-400 uppercase font-mono">
          <div className="flex items-center gap-2 bg-slate-900/70 px-3 py-1.5 rounded-lg border border-slate-700/60 backdrop-blur-sm">
            <span className="text-cyan-400">DESTINATION:</span>
            <span className="text-white font-bold">EXPLORE WORKS SECTOR</span>
          </div>

          {/* Quick Skip Button */}
          <button
            onClick={() => {
              dreamAudio.playPop();
              onComplete();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-colors cursor-pointer text-xs uppercase"
            title="Skip Launch Animation"
          >
            <span>Skip</span>
            <span>⚡</span>
          </button>
        </div>

      </motion.div>
    </AnimatePresence>
  );
};
