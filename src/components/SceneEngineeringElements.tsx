import React from 'react';
import { motion } from 'motion/react';
import { StoryScene } from '../data/storyline';
import { 
  Compass, 
  Sparkles, 
  Cpu, 
  Layers, 
  Terminal, 
  Code2, 
  Gauge, 
  Zap, 
  GitBranch, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Activity, 
  Globe, 
  Atom, 
  Palette,
  Eye,
  Sliders,
  Plane
} from 'lucide-react';

interface SceneEngineeringElementsProps {
  scene: StoryScene;
}

export const SceneEngineeringElements: React.FC<SceneEngineeringElementsProps> = React.memo(({ scene }) => {
  const { id } = scene;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center select-none overflow-visible z-0">
      
      {/* ── SCENE 01: THE BEGINNING (Bubble is Top-Right) ── */}
      {id === 1 && (
        <>
          {/* Mid-Left: Flight Telemetry HUD Pill (layering behind character's left side) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0, y: [-4, 4, -4] }}
            transition={{ y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' } }}
            className="absolute top-4 sm:top-2 -left-2 sm:-left-16 md:-left-26 px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-sky-200 shadow-[0_8px_22px_rgba(56,189,248,0.18)] flex items-center gap-2 font-mono text-[11px] font-bold text-slate-700 pointer-events-auto hover:scale-105 transition-transform"
          >
            <Gauge className="w-3.5 h-3.5 text-sky-500" />
            <span>ALT: 8,500 FT</span>
            <span className="text-sky-300">|</span>
            <span>V: 180 KTS</span>
          </motion.div>

          {/* Bottom-Right: Origami Aerodynamic Fold Axis (layering behind lower-right cloud) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0, y: [4, -4, 4] }}
            transition={{ y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
            className="absolute bottom-1 sm:-bottom-3 -right-2 sm:-right-14 md:-right-22 px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-sky-200 shadow-[0_8px_20px_rgba(56,189,248,0.16)] flex items-center gap-2 font-mono text-[11px] font-bold text-slate-700 pointer-events-auto hover:scale-105 transition-transform"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-500" />
            <span>ORIGAMI WING: ∠45°</span>
          </motion.div>

          {/* Wind Streamline SVG Vectors */}
          <div className="absolute inset-0 pointer-events-none opacity-45">
            <svg className="w-full h-full overflow-visible">
              <motion.path
                d="M -160 80 Q -60 70 80 85 T 260 75"
                fill="none"
                stroke="url(#windGradient)"
                strokeWidth="1.5"
                strokeDasharray="6 8"
                animate={{ strokeDashoffset: [0, -40] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <motion.path
                d="M -200 130 Q -80 120 100 135 T 280 120"
                fill="none"
                stroke="url(#windGradient)"
                strokeWidth="1"
                strokeDasharray="4 6"
                animate={{ strokeDashoffset: [0, -30] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
              <defs>
                <linearGradient id="windGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
                  <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </>
      )}

      {/* ── SCENE 02: THE QUESTION (Bubble is Top-Center Above) ── */}
      {id === 2 && (
        <>
          {/* Mid-Left: NE555 Timer IC (layering behind character's left side) */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-6 sm:top-2 -left-4 sm:-left-16 md:-left-28 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-amber-200/90 shadow-[0_10px_25px_rgba(245,158,11,0.18)] flex flex-col gap-1.5 font-mono text-[11px] text-slate-700 pointer-events-auto hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-1.5 text-amber-600 font-bold border-b border-amber-100 pb-1">
              <Cpu className="w-4 h-4 text-amber-500" />
              <span>NE555 TIMER IC</span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-600">
              <span>Pin 3: OUT Pulse</span>
              <span className="text-emerald-600 font-bold">1.2 kHz</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-500">
              <span>R1: 4.7kΩ • C1: 10µF</span>
            </div>
          </motion.div>

          {/* Bottom-Right: Digital Multimeter Reading (layering behind lower-right cloud) */}
          <motion.div
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute bottom-1 sm:-bottom-3 -right-2 sm:-right-14 md:-right-24 px-3.5 py-2 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs font-bold border border-slate-700 shadow-xl flex items-center gap-2 pointer-events-auto hover:scale-105 transition-transform"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>+5.04 V DC</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              STABLE
            </span>
          </motion.div>

          {/* Electronic Circuit Traces on Background */}
          <div className="absolute inset-0 pointer-events-none opacity-25">
            <svg className="w-full h-full overflow-visible">
              <path d="M -140 20 H -60 V 80 H 20" fill="none" stroke="#f59e0b" strokeWidth="2" />
              <circle cx="-140" cy="20" r="3" fill="#f59e0b" />
              <circle cx="20" cy="80" r="3" fill="#f59e0b" />
              <path d="M 60 140 H 140 V 100 H 200" fill="none" stroke="#10b981" strokeWidth="2" />
              <circle cx="60" cy="140" r="3" fill="#10b981" />
              <circle cx="200" cy="100" r="3" fill="#10b981" />
            </svg>
          </div>
        </>
      )}

      {/* ── SCENE 03: CURIOSITY (Bubble is Top-Left 'left-curving') ── */}
      {id === 3 && (
        <>
          {/* Mid-Right: Oscilloscope Live Waveform Card (layering behind character's right side) */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-4 sm:top-2 -right-4 sm:-right-16 md:-right-28 w-44 sm:w-48 p-2.5 rounded-2xl bg-slate-900 border border-emerald-500/40 shadow-[0_12px_30px_rgba(16,185,129,0.25)] font-mono text-[10px] text-emerald-400 pointer-events-auto hover:scale-105 transition-transform"
          >
            <div className="flex items-center justify-between border-b border-emerald-900/60 pb-1 mb-1 text-[9px] text-emerald-500">
              <span className="flex items-center gap-1 font-bold">
                <Activity className="w-3 h-3 text-emerald-400" />
                OSCILLOSCOPE
              </span>
              <span>1.0 kHz</span>
            </div>
            {/* Animated SVG Sine Wave */}
            <div className="h-10 w-full bg-slate-950 rounded border border-emerald-950 flex items-center justify-center overflow-hidden relative">
              <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#059669_1px,transparent_1px),linear-gradient(to_bottom,#059669_1px,transparent_1px)] bg-[size:8px_8px]" />
              <svg className="w-full h-8 overflow-visible z-10">
                <motion.path
                  d="M 0 16 Q 15 4 30 16 T 60 16 T 90 16 T 120 16 T 150 16 T 180 16"
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="1.8"
                  animate={{ x: [-30, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                />
              </svg>
            </div>
            <div className="flex justify-between text-[9px] text-emerald-600 mt-1">
              <span>V_pp: 3.3V</span>
              <span>CH1: AC</span>
            </div>
          </motion.div>

          {/* Bottom-Left: Mechanical Gears & Linkage (layering behind lower-left cloud) */}
          <motion.div
            animate={{ y: [4, -4, 4] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute bottom-1 sm:-bottom-3 -left-2 sm:-left-14 md:-left-22 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-purple-200 shadow-lg flex items-center gap-2 font-mono text-[11px] font-bold text-slate-700 pointer-events-auto hover:scale-105 transition-transform"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            >
              <Sliders className="w-4 h-4 text-purple-500" />
            </motion.div>
            <div className="flex flex-col">
              <span>GEAR RATIO: 1:2.4</span>
              <span className="text-[9px] text-purple-500 font-normal">Kinematic Linkage</span>
            </div>
          </motion.div>
        </>
      )}

      {/* ── SCENE 04: MORE QUESTIONS (Bubble is Top-Center 'high-above') ── */}
      {id === 4 && (
        <>
          {/* Mid-Left: Bohr Atomic Model with Orbiting Electrons (layering behind character's left side) */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-6 sm:top-4 -left-4 sm:-left-16 md:-left-26 w-28 h-28 pointer-events-none flex items-center justify-center"
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Central Nucleus */}
              <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-[0_0_12px_rgba(56,189,248,0.8)] z-10" />
              {/* Orbit 1 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                className="absolute w-24 h-10 rounded-full border border-sky-300/60 rotate-45 flex items-center justify-start"
              >
                <div className="w-2 h-2 rounded-full bg-sky-400 shadow-[0_0_6px_#38bdf8]" />
              </motion.div>
              {/* Orbit 2 */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute w-24 h-10 rounded-full border border-indigo-300/60 -rotate-45 flex items-center justify-end"
              >
                <div className="w-2 h-2 rounded-full bg-indigo-400 shadow-[0_0_6px_#818cf8]" />
              </motion.div>
            </div>
          </motion.div>

          {/* Mid-Right: Quantum Physics Equations (layering behind character's right side) */}
          <div className="absolute top-6 sm:top-4 -right-4 sm:-right-16 md:-right-28 flex flex-col gap-2 pointer-events-auto">
            <motion.div
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-indigo-200 shadow-md font-mono text-[11px] font-bold text-slate-800"
            >
              iℏ ∂/∂t Ψ = ĤΨ
            </motion.div>
            <motion.div
              animate={{ y: [3, -3, 3] }}
              transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-sky-200 shadow-md font-mono text-[11px] font-bold text-slate-800"
            >
              Δx · Δp ≥ ℏ/2
            </motion.div>
          </div>
        </>
      )}

      {/* ── SCENE 05: EXPLORING (Bubble is Top-Left 'opposite-telescope') ── */}
      {id === 5 && (
        <>
          {/* Mid-Right: Telescope Optical Reticle & Telemetry (layering behind character's right side) */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-4 sm:top-2 -right-4 sm:-right-16 md:-right-28 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-indigo-200 shadow-[0_10px_30px_rgba(99,102,241,0.18)] font-mono text-[11px] text-slate-800 flex flex-col gap-1.5 pointer-events-auto hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-1.5 text-indigo-600 font-bold border-b border-indigo-100 pb-1">
              <Eye className="w-3.5 h-3.5 text-indigo-500" />
              <span>TELESCOPE FOV: 0.45°</span>
            </div>
            <div className="text-[10px] text-slate-600">
              <p>AZ: 142.6° • ALT: 48.2°</p>
              <p className="text-indigo-600 font-semibold mt-0.5">Target: Kepler-452b</p>
            </div>
          </motion.div>

          {/* Bottom-Left: Spectroscopic Wavelength Bar (layering behind lower-left cloud) */}
          <motion.div
            animate={{ y: [4, -4, 4] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute bottom-1 sm:-bottom-3 -left-2 sm:-left-14 md:-left-22 px-3 py-2 rounded-xl bg-slate-900 border border-purple-500/40 shadow-xl font-mono text-[10px] text-purple-300 flex flex-col gap-1 pointer-events-auto hover:scale-105 transition-transform"
          >
            <div className="flex justify-between text-[9px] text-slate-400">
              <span>SPECTROSCOPY</span>
              <span>656.3 nm (H-α)</span>
            </div>
            <div className="w-32 h-2.5 rounded-full bg-gradient-to-r from-violet-500 via-cyan-400 via-emerald-400 to-amber-400 relative overflow-hidden">
              <div className="absolute top-0 bottom-0 left-[35%] w-0.5 bg-black" />
              <div className="absolute top-0 bottom-0 left-[62%] w-0.5 bg-black" />
            </div>
          </motion.div>
        </>
      )}

      {/* ── SCENE 06: A NEW WORLD (Bubble is Top-Left 'between-portal') ── */}
      {id === 6 && (
        <>
          {/* Mid-Right: Holographic CLI Terminal (layering behind character's right side) */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-2 sm:top-0 -right-4 sm:-right-16 md:-right-30 w-48 sm:w-56 p-3 rounded-2xl bg-slate-950/95 border border-cyan-400/60 shadow-[0_0_30px_rgba(6,182,212,0.3)] font-mono text-[10px] text-cyan-300 pointer-events-auto hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-1.5 border-b border-cyan-900/60 pb-1.5 mb-2 text-cyan-500">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-bold">terminal@alif-os</span>
            </div>
            <div className="flex flex-col gap-1 leading-relaxed">
              <p className="text-white">$ npx create-universe</p>
              <p className="text-cyan-400">&gt; Building WebGL portal...</p>
              <p className="text-emerald-400 font-bold">✔ 256 shaders compiled</p>
              <p className="text-slate-400 text-[9px]">Live at: https://world.alif</p>
            </div>
          </motion.div>

          {/* Bottom-Left: Memory & VRAM Meter (layering behind lower-left cloud) */}
          <motion.div
            animate={{ y: [4, -4, 4] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            className="absolute bottom-1 sm:-bottom-3 -left-2 sm:-left-14 md:-left-22 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-cyan-200 shadow-lg font-mono text-[11px] font-bold text-slate-800 flex items-center gap-2 pointer-events-auto hover:scale-105 transition-transform"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>VRAM: 1.2GB • 60 FPS</span>
          </motion.div>
        </>
      )}

      {/* ── SCENE 07: THE WEB (Bubble is Top-Center 'above-laptop') ── */}
      {id === 7 && (
        <>
          {/* Mid-Left: Floating Browser Window Mockup (layering behind character's laptop & cloud) */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-4 sm:top-1 -left-4 sm:-left-16 md:-left-30 w-48 sm:w-56 p-3 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-sky-300 shadow-[0_15px_35px_rgba(56,189,248,0.2)] font-mono text-[10px] text-slate-700 pointer-events-auto hover:scale-105 transition-transform"
          >
            {/* Window Chrome */}
            <div className="flex items-center gap-1.5 border-b border-gray-100 pb-1.5 mb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-[9px] text-slate-400 ml-1">index.html</span>
            </div>
            <div className="flex flex-col gap-1 text-slate-800">
              <p className="text-sky-600 font-bold">&lt;main class="experience"&gt;</p>
              <p className="pl-3 text-indigo-600">&lt;canvas id="story-3d" /&gt;</p>
              <p className="pl-3 text-emerald-600">&lt;CloudCharacter /&gt;</p>
              <p className="text-sky-600 font-bold">&lt;/main&gt;</p>
            </div>
          </motion.div>

          {/* Mid-Right: CSS Grid / HTTP 200 Badges (layering behind character's right side) */}
          <div className="absolute top-4 sm:top-1 -right-4 sm:-right-16 md:-right-26 flex flex-col gap-2 pointer-events-auto">
            <motion.div
              animate={{ y: [4, -4, 4] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
              className="px-3.5 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-indigo-200 shadow-md font-mono text-[11px] font-bold text-indigo-700 flex items-center gap-1.5"
            >
              <Code2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>display: grid;</span>
            </motion.div>
            <motion.div
              animate={{ y: [-3, 3, -3] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 shadow-md font-mono text-[10px] font-bold text-emerald-800 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>HTTP 200 OK • HTTP/3</span>
            </motion.div>
          </div>
        </>
      )}

      {/* ── SCENE 08: CREATIVITY (Bubble is Top-Right 'above-behind') ── */}
      {id === 8 && (
        <>
          {/* Mid-Left: Vector Pen Tool Node & Tangent Handles (layering behind character's left side) */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-2 sm:top-0 -left-4 sm:-left-16 md:-left-26 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-sky-300 shadow-xl flex flex-col gap-2 font-mono text-[11px] text-slate-800 pointer-events-auto hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-1.5 text-sky-600 font-bold border-b border-sky-100 pb-1">
              <Palette className="w-4 h-4 text-sky-500" />
              <span>BEZIER SPLINE</span>
            </div>
            {/* Animated Bezier Spline SVG */}
            <svg className="w-36 h-12 overflow-visible">
              <path d="M 10 35 C 30 5, 80 45, 130 15" fill="none" stroke="#0284c7" strokeWidth="2.5" />
              <circle cx="10" cy="35" r="4" fill="#0284c7" />
              <circle cx="130" cy="15" r="4" fill="#0284c7" />
              <line x1="130" y1="15" x2="110" y2="40" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="2 2" />
              <circle cx="110" cy="40" r="3" fill="#f43f5e" />
            </svg>
            <span className="text-[9px] text-slate-500">cubic-bezier(0.16, 1, 0.3, 1)</span>
          </motion.div>

          {/* Bottom-Right: Color Swatch Palette (layering behind lower-right cloud) */}
          <motion.div
            animate={{ y: [4, -4, 4] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            className="absolute bottom-1 sm:-bottom-3 -right-2 sm:-right-14 md:-right-22 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-md flex items-center gap-1.5 pointer-events-auto"
          >
            <div className="w-3.5 h-3.5 rounded-full bg-sky-500" title="#0ea5e9" />
            <div className="w-3.5 h-3.5 rounded-full bg-indigo-500" title="#6366f1" />
            <div className="w-3.5 h-3.5 rounded-full bg-fuchsia-500" title="#d946ef" />
            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500" title="#10b981" />
            <span className="font-mono text-[10px] font-bold text-slate-600 ml-1">60.0 FPS</span>
          </motion.div>
        </>
      )}

      {/* ── SCENE 09: BUILDING (Bubble is Top-Right 'behind-stretching') ── */}
      {id === 9 && (
        <>
          {/* Mid-Left: CI/CD Build Pipeline Card (layering behind character's left side) */}
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-3 sm:top-1 -left-4 sm:-left-16 md:-left-28 w-48 sm:w-56 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-emerald-300 shadow-[0_12px_30px_rgba(16,185,129,0.18)] font-mono text-[10px] text-slate-800 pointer-events-auto hover:scale-105 transition-transform"
          >
            <div className="flex items-center justify-between border-b border-emerald-100 pb-1.5 mb-2">
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                BUILD PASSED
              </span>
              <span className="text-[9px] text-emerald-600">142ms</span>
            </div>
            <div className="flex flex-col gap-1 text-slate-600">
              <p>✔ Vite 6.0 production bundle</p>
              <p>✔ Tree-shaking 100% active</p>
              <p className="text-indigo-600 font-semibold">dist/app.js • 38.4 kB</p>
            </div>
          </motion.div>

          {/* Bottom-Right: Git Branch & Commit DAG (layering behind lower-right cloud) */}
          <motion.div
            animate={{ y: [5, -5, 5] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute bottom-1 sm:-bottom-3 -right-3 sm:-right-15 md:-right-26 p-3 rounded-2xl bg-slate-900 border border-slate-700 shadow-xl font-mono text-[10px] text-slate-300 pointer-events-auto hover:scale-105 transition-transform flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-1.5 text-sky-400 font-bold border-b border-slate-800 pb-1">
              <GitBranch className="w-3.5 h-3.5 text-sky-400" />
              <span>GIT: main</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>feat: launch interactive story</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-sky-400" />
              <span>perf: smooth 60fps camera</span>
            </div>
          </motion.div>
        </>
      )}

      {/* ── SCENE 10: THE STORM (Bubble is Top-Right 'wind-tilted') ── */}
      {id === 10 && (
        <>
          {/* Mid-Left: Terminal Exception Glitch Card (layering behind character's left side) */}
          <motion.div
            animate={{ y: [-4, 4, -4], x: [-1, 1, -1] }}
            transition={{ duration: 0.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-3 sm:top-1 -left-4 sm:-left-16 md:-left-28 w-48 sm:w-56 p-3 rounded-2xl bg-rose-950/90 border border-rose-500/60 shadow-[0_0_30px_rgba(244,63,94,0.3)] font-mono text-[10px] text-rose-200 pointer-events-auto hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-1.5 text-rose-400 font-bold border-b border-rose-900 pb-1 mb-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
              <span>UNCAUGHT EXCEPTION</span>
            </div>
            <p className="text-white font-bold">TypeError: retry()</p>
            <p className="text-rose-400/80 text-[9px] mt-1">Turbulence: HIGH</p>
            <p className="text-amber-300 font-semibold mt-1">&gt; Recovery daemon active</p>
          </motion.div>

          {/* Bottom-Right: Auto-Stabilizer Active (layering behind lower-right cloud) */}
          <motion.div
            animate={{ y: [4, -4, 4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1 sm:-bottom-3 -right-2 sm:-right-14 md:-right-22 px-3.5 py-2 rounded-xl bg-slate-900 border border-amber-500/50 shadow-xl font-mono text-[10px] text-amber-300 flex items-center gap-2 pointer-events-auto"
          >
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>GYRO AUTO-STABILIZE: ON</span>
          </motion.div>
        </>
      )}

      {/* ── SCENE 11: BREAKING THROUGH (Bubble is Top-Center 'high-contrast') ── */}
      {id === 11 && (
        <>
          {/* Top: Radiant Sunburst Rays */}
          <div className="absolute -top-16 w-72 h-72 rounded-full bg-gradient-to-t from-amber-300/30 to-yellow-100/10 blur-2xl pointer-events-none" />

          {/* Mid-Left: All Tests Passed Card (layering behind character's left side) */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-4 sm:top-1 -left-4 sm:-left-16 md:-left-26 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-amber-300 shadow-[0_12px_30px_rgba(245,158,11,0.2)] font-mono text-[10px] text-slate-800 pointer-events-auto hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-1.5 text-emerald-600 font-bold border-b border-amber-100 pb-1 mb-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>PASS test/resilience.ts</span>
            </div>
            <p className="text-slate-600 font-semibold">✔ 48 tests passed (100%)</p>
            <p className="text-amber-600 font-bold mt-1">Ascending through storm</p>
          </motion.div>

          {/* Bottom-Right: Aircraft Climb Telemetry (layering behind lower-right cloud) */}
          <motion.div
            animate={{ y: [4, -4, 4] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute bottom-1 sm:-bottom-3 -right-2 sm:-right-14 md:-right-22 px-3.5 py-2 rounded-xl bg-slate-900 border border-amber-400/60 shadow-xl font-mono text-[11px] font-bold text-amber-300 flex items-center gap-2 pointer-events-auto"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>VSI: +2,800 FPM (Climbing)</span>
          </motion.div>
        </>
      )}

      {/* ── SCENE 12: THE REALIZATION (Bubble is Top-Right 'subtle-beside') ── */}
      {id === 12 && (
        <>
          {/* Mid-Left: Audio Harmonic Spectrum Visualizer (layering behind character's left side) */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-3 sm:top-1 -left-4 sm:-left-16 md:-left-26 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-orange-200 shadow-xl font-mono text-[10px] text-slate-700 flex flex-col gap-1.5 pointer-events-auto hover:scale-105 transition-transform"
          >
            <div className="flex items-center gap-1.5 text-orange-600 font-bold border-b border-orange-100 pb-1">
              <Activity className="w-3.5 h-3.5 text-orange-500" />
              <span>EVENING HARMONICS</span>
            </div>
            <div className="flex items-end gap-1 h-8 px-1 pt-1">
              {[12, 24, 18, 28, 15, 30, 22, 16, 26, 14].map((h, idx) => (
                <motion.div
                  key={idx}
                  animate={{ height: [h, h * 0.4, h] }}
                  transition={{ duration: 1.2 + idx * 0.1, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-1.5 rounded-full bg-gradient-to-t from-orange-500 to-rose-400"
                />
              ))}
            </div>
          </motion.div>

          {/* Bottom-Right: Sunset Compass Heading (layering behind lower-right cloud) */}
          <motion.div
            animate={{ y: [4, -4, 4] }}
            transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            className="absolute bottom-1 sm:-bottom-3 -right-2 sm:-right-14 md:-right-22 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-purple-200 shadow-lg font-mono text-[11px] font-bold text-purple-900 flex items-center gap-2 pointer-events-auto"
          >
            <Compass className="w-4 h-4 text-purple-600" />
            <span>HEADING: 270° W (Sunset)</span>
          </motion.div>
        </>
      )}

      {/* ── SCENE 14: STILL EXPLORING (Bubble is Top-Center 'above-airplane') ── */}
      {id === 14 && (
        <>
          {/* Mid-Left: Primary Flight Display (PFD) Artificial Horizon HUD (layering behind wing & character) */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-4 sm:top-1 -left-4 sm:-left-16 md:-left-26 w-44 sm:w-48 p-2.5 rounded-2xl bg-slate-950 border border-sky-400/50 shadow-[0_12px_30px_rgba(56,189,248,0.2)] font-mono text-[10px] text-sky-400 pointer-events-auto hover:scale-105 transition-transform"
          >
            <div className="flex justify-between border-b border-slate-800 pb-1 mb-1 text-[9px] text-sky-500 font-bold">
              <span>AVIONICS PFD</span>
              <span>HDG: 085°</span>
            </div>
            {/* Pitch Ladder Graphic */}
            <div className="h-12 w-full bg-slate-900 rounded border border-slate-800 flex items-center justify-center relative overflow-hidden">
              <div className="w-full h-0.5 bg-emerald-400 z-10" />
              <div className="w-2 h-2 rounded-full border border-amber-400 z-10" />
              <div className="absolute top-2 w-10 h-0.5 bg-sky-300 opacity-60" />
              <div className="absolute bottom-2 w-10 h-0.5 bg-amber-300 opacity-60" />
            </div>
            <div className="flex justify-between text-[9px] text-sky-300 mt-1 font-bold">
              <span>PITCH: +5°</span>
              <span>ROLL: 0°</span>
            </div>
          </motion.div>

          {/* Bottom-Right: Mach & High Altitude Telemetry (layering behind lower-right wing) */}
          <motion.div
            animate={{ y: [4, -4, 4] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
            className="absolute bottom-1 sm:-bottom-3 -right-2 sm:-right-14 md:-right-22 px-3.5 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-sky-200 shadow-xl font-mono text-[11px] font-bold text-slate-800 flex items-center gap-2 pointer-events-auto"
          >
            <Plane className="w-4 h-4 text-sky-600" />
            <span>FL 380 • MACH 0.84</span>
          </motion.div>
        </>
      )}

      {/* ── SCENE 15: THE HORIZON (Bubble is Top-Left 'wide-pointing-horizon') ── */}
      {id === 15 && (
        <>
          {/* Mid-Right: Aviation Radar Scope with Sweeping Beam (layering behind character's right side) */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-2 sm:top-0 -right-4 sm:-right-16 md:-right-28 w-32 h-32 rounded-full bg-slate-950 border-2 border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.3)] flex items-center justify-center relative overflow-hidden pointer-events-auto"
          >
            {/* Grid Rings */}
            <div className="w-24 h-24 rounded-full border border-emerald-900/50" />
            <div className="w-14 h-14 rounded-full border border-emerald-900/50" />
            <div className="absolute w-full h-[1px] bg-emerald-900/50" />
            <div className="absolute h-full w-[1px] bg-emerald-900/50" />
            {/* Rotating Radar Sweep */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-emerald-400/40 origin-center rounded-full"
            />
            {/* Blip */}
            <div className="absolute top-8 right-8 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-ping" />
            <span className="absolute bottom-2 font-mono text-[8px] font-bold text-emerald-500">RADAR ACTIVE</span>
          </motion.div>

          {/* Bottom-Left: Waypoint Flight Route Card (layering behind lower-left cloud) */}
          <motion.div
            animate={{ y: [4, -4, 4] }}
            transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
            className="absolute bottom-1 sm:-bottom-3 -left-2 sm:-left-14 md:-left-24 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-sky-200 shadow-xl font-mono text-[10px] text-slate-800 pointer-events-auto hover:scale-105 transition-transform flex flex-col gap-1"
          >
            <div className="flex items-center gap-1.5 text-sky-600 font-bold border-b border-sky-100 pb-1">
              <Radio className="w-3.5 h-3.5 text-sky-500" />
              <span>FLIGHT PLAN: OPEN</span>
            </div>
            <p>ORIGIN: The Beginning</p>
            <p>WAYPOINT: Code & Web</p>
            <p className="text-indigo-600 font-bold">DEST: The Infinite Horizon</p>
          </motion.div>
        </>
      )}

      {/* ── SCENE 16: THE REVEAL (Interactive Tech Stack Orbital Chips Behind Character) ── */}
      {id === 16 && (
        <>
          {/* Flanked Orbital Tech Stack Badges emerging from behind character */}
          <div className="absolute -left-2 sm:-left-14 md:-left-24 top-1/2 -translate-y-1/2 flex flex-col items-end gap-3 sm:gap-4 pointer-events-auto">
            {[
              { label: '⚡ TypeScript', color: 'border-blue-200 text-blue-800' },
              { label: '⚛️ React 19', color: 'border-cyan-200 text-cyan-800' },
              { label: '🎨 Tailwind CSS', color: 'border-sky-200 text-sky-800' },
            ].map((stack, i) => (
              <motion.div
                key={i}
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 3.6 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                className={`px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border shadow-md font-mono text-[11px] sm:text-xs font-bold whitespace-nowrap ${stack.color} hover:scale-105 transition-transform cursor-default`}
              >
                {stack.label}
              </motion.div>
            ))}
          </div>

          <div className="absolute -right-2 sm:-right-14 md:-right-24 top-1/2 -translate-y-1/2 flex flex-col items-start gap-3 sm:gap-4 pointer-events-auto">
            {[
              { label: '📐 3D & Math', color: 'border-purple-200 text-purple-800' },
              { label: '🚀 Full-Stack', color: 'border-indigo-200 text-indigo-800' },
              { label: '✨ Creative Web', color: 'border-amber-200 text-amber-800' },
            ].map((stack, i) => (
              <motion.div
                key={i}
                animate={{ y: [4, -4, 4] }}
                transition={{ duration: 4.0 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                className={`px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border shadow-md font-mono text-[11px] sm:text-xs font-bold whitespace-nowrap ${stack.color} hover:scale-105 transition-transform cursor-default`}
              >
                {stack.label}
              </motion.div>
            ))}
          </div>
        </>
      )}

    </div>
  );
});

SceneEngineeringElements.displayName = 'SceneEngineeringElements';
