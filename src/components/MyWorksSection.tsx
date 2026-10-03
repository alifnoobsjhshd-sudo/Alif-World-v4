import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ExternalLink,
  Code2,
  Sparkles,
  Layers,
  Terminal,
  X,
  Play,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { dreamAudio } from '../utils/audio';

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  tags: string[];
  gradient: string;
  accentColor: string;
  stats: string;
}

const PROJECTS: ProjectItem[] = [
  {
    id: 'journey-sky',
    title: 'Sky Storyline Journey',
    category: '3D Interactive Experience',
    tagline: 'Cinematic paper airplane narrative with custom procedural sound synthesis.',
    description:
      'A multi-scene 3D journey through 16 emotional narrative chapters, featuring reactive spring physics, atmospheric clouds, dynamic lighting transitions, and synthetic spatial audio.',
    tags: ['React 18', 'Motion', 'Web Audio API', 'Tailwind CSS'],
    gradient: 'from-sky-500/20 via-blue-600/10 to-transparent',
    accentColor: '#38bdf8',
    stats: '16 Story Scenes // 60 FPS',
  },
  {
    id: 'cosmic-space',
    title: 'Cosmic Works & Deep Space',
    category: 'Creative Engineering',
    tagline: 'Living space art environment with cartoon black hole, planets, and orbital rocket.',
    description:
      'A cartoon art space environment with rotating gravitational black hole accretion disk, pastel planets, 3D slender cartoon rocket with horizontal axial rotation, and custom thruster particle synthesis.',
    tags: ['WebGL Ready', '3D Transforms', 'Procedural Audio', 'Vite'],
    gradient: 'from-amber-500/20 via-orange-600/10 to-transparent',
    accentColor: '#f59e0b',
    stats: 'Full 3D // Zero Jitter',
  },
  {
    id: 'intelligent-agents',
    title: 'Autonomous AI Engine',
    category: 'Full-Stack Architecture',
    tagline: 'High-throughput multimodal reasoning agents with real-time streaming pipelines.',
    description:
      'Designed scalable server-side agentic architectures integrating Gemini models, grounding tools, resilient fallback handlers, and responsive conversational user interfaces.',
    tags: ['Gemini API', 'TypeScript', 'Node.js', 'Express'],
    gradient: 'from-purple-500/20 via-indigo-600/10 to-transparent',
    accentColor: '#c084fc',
    stats: 'Sub-second Latency',
  },
  {
    id: 'next-mission',
    title: 'Orbital Dock // In Progress',
    category: 'Upcoming Innovation',
    tagline: 'Next flagship interactive creation currently being assembled in the cosmic hangar.',
    description:
      'New real-time collaborative workspace and generative canvas arriving in the next release vector. Stay tuned for orbital launch.',
    tags: ['Classified', 'Real-Time', 'WebGL 2.0'],
    gradient: 'from-emerald-500/20 via-teal-600/10 to-transparent',
    accentColor: '#34d399',
    stats: 'Coming Soon',
  },
];

export const MyWorksSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | '3D' | 'AI' | 'AUDIO'>('ALL');

  const filteredProjects = PROJECTS.filter((p) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === '3D') return p.category.includes('3D') || p.tags.includes('3D Transforms');
    if (activeFilter === 'AI') return p.tags.includes('Gemini API');
    if (activeFilter === 'AUDIO') return p.tags.includes('Web Audio API');
    return true;
  });

  const handleOpenProject = (project: ProjectItem) => {
    dreamAudio.playPaperPlaneFlutter();
    setSelectedProject(project);
  };

  const handleCloseProject = () => {
    dreamAudio.playPop();
    setSelectedProject(null);
  };

  return (
    <div
      id="my-works-station"
      className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col items-center select-none text-left"
    >
      {/* ── SECTION HEADER (Cartoon Space Station Dock) ──────────────────── */}
      <div className="flex flex-col items-center text-center mb-8">
        
        {/* Orbital Station Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-400/50 text-amber-300 text-xs font-mono tracking-widest uppercase shadow-lg shadow-amber-950/40 mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>ORBITAL STATION // SECTOR 01</span>
        </div>

        {/* Main Title: MY WORKS */}
        <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-[0_4px_20px_rgba(251,191,36,0.25)]">
          MY WORKS
        </h2>

        {/* Subtitle */}
        <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-lg font-sans">
          Interactive creations, digital craftsmanship, and experimental software systems engineered for exploration.
        </p>

        {/* Filter Pills */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {(['ALL', '3D', 'AI', 'AUDIO'] as const).map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  dreamAudio.playHover();
                  setActiveFilter(filter);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700/70'
                }`}
              >
                {filter === 'ALL' ? 'ALL MISSIONS' : filter}
              </button>
            );
          })}
        </div>

      </div>

      {/* ── PROJECT DOCKS GRID ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
        {filteredProjects.map((project) => (
          <motion.div
            key={project.id}
            onClick={() => handleOpenProject(project)}
            onMouseEnter={() => dreamAudio.playHover()}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`relative rounded-2xl p-5 sm:p-6 bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 hover:border-amber-400/60 transition-all cursor-pointer shadow-xl overflow-hidden group flex flex-col justify-between`}
          >
            {/* Background Ambient Glow */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-40 group-hover:opacity-75 transition-opacity`}
            />

            {/* Top Row: Category & Status */}
            <div className="relative flex items-center justify-between z-10 mb-3">
              <span
                className="text-[11px] font-mono tracking-wider uppercase font-semibold"
                style={{ color: project.accentColor }}
              >
                {project.category}
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
                {project.stats}
              </span>
            </div>

            {/* Title & Tagline */}
            <div className="relative z-10 mb-4">
              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-200 transition-colors">
                {project.title}
              </h3>
              <p className="mt-1.5 text-slate-300 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                {project.tagline}
              </p>
            </div>

            {/* Bottom Row: Tags & Action Arrow */}
            <div className="relative z-10 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex flex-wrap gap-1.5">
                {project.tags.slice(0, 3).map((tag, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-mono bg-slate-950/70 text-slate-300 px-2 py-0.5 rounded border border-slate-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-800/80 group-hover:bg-amber-400 group-hover:text-slate-950 text-slate-300 flex items-center justify-center transition-all shadow-md">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

          </motion.div>
        ))}
      </div>

      {/* ── PROJECT DETAIL MODAL ──────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={handleCloseProject}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700 p-6 sm:p-8 shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span
                    className="text-xs font-mono font-semibold uppercase tracking-wider"
                    style={{ color: selectedProject.accentColor }}
                  >
                    {selectedProject.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {selectedProject.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={handleCloseProject}
                  className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Description */}
              <p className="text-slate-300 text-sm leading-relaxed mb-6">
                {selectedProject.description}
              </p>

              {/* Tech Stack List */}
              <div className="mb-6">
                <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                  System Architecture & Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    dreamAudio.playSceneTick();
                    handleCloseProject();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-sm font-sans flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Inspect Module</span>
                </button>
                <button
                  type="button"
                  onClick={handleCloseProject}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition-all cursor-pointer"
                >
                  Close Dock
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
