import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Github, Sparkles, CheckCircle2, ShieldAlert, Rocket } from 'lucide-react';
import { SpaceProject } from '../data/spaceWorks';
import { dreamAudio } from '../utils/audio';

interface ProjectMissionModalProps {
  project: SpaceProject | null;
  onClose: () => void;
}

export const ProjectMissionModal: React.FC<ProjectMissionModalProps> = ({
  project,
  onClose,
}) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 font-display select-none">
        
        {/* Backdrop overlay */}
        <motion.div
          className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            dreamAudio.playPop();
            onClose();
          }}
        />

        {/* Modal Window Container */}
        <motion.div
          className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 rounded-2xl border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.25)] overflow-hidden z-10 max-h-[90vh] flex flex-col"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {/* Glowing Top Accent Strip */}
          <div
            className="h-1.5 w-full"
            style={{
              background: `linear-gradient(90deg, ${project.visualTheme.primaryColor}, #a855f7, #38bdf8)`,
            }}
          />

          {/* Modal Header */}
          <div className="p-4 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border"
                style={{
                  backgroundColor: `${project.visualTheme.primaryColor}15`,
                  borderColor: project.visualTheme.borderColor,
                }}
              >
                {project.visualTheme.celestialEmoji}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60">
                    {project.sectorCode}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {project.status}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {project.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  {project.subtitle}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                dreamAudio.playPop();
                onClose();
              }}
              className="p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close Blueprint"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body (Scrollable) */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-300 text-sm">
            
            {/* Overview */}
            <div>
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mission Blueprint</span>
              </h4>
              <p className="text-slate-300 leading-relaxed font-sans text-sm sm:text-base">
                {project.fullOverview}
              </p>
            </div>

            {/* Key Telemetry Stats Grid */}
            <div>
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2">
                Orbital Telemetry & Specs
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {project.stats.map((st, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col"
                  >
                    <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">
                      {st.label}
                    </span>
                    <span className="text-sm font-bold text-white mt-1">
                      {st.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Engineering Highlights */}
            <div>
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Core Capabilities & Architecture</span>
              </h4>
              <ul className="space-y-2">
                {project.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300">
                    <span className="text-cyan-400 font-bold mt-0.5">•</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technologies */}
            <div>
              <h4 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2">
                Propulsion & Tech Stack
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-800/80 text-cyan-200 border border-slate-700/80"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Special Callout if Future Dock */}
            {project.isFutureDock && (
              <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-800/60 flex items-start gap-3">
                <Rocket className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-purple-200 text-xs uppercase tracking-wider mb-1">
                    Future Works Staging Bay
                  </h5>
                  <p className="text-xs text-purple-300/90 leading-relaxed">
                    This slot is ready for your next project! Whenever you want to add another build, you can simply update the entries in <code className="bg-purple-900/60 px-1 py-0.5 rounded text-white font-mono">src/data/spaceWorks.ts</code> with your title, demo URL, and live screenshots.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Modal Footer (Action Links) */}
          <div className="p-4 sm:p-5 border-t border-slate-800/90 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs font-mono text-slate-400">
              SECTOR: <span className="text-white font-bold">{project.sectorCode}</span>
            </div>

            <div className="flex items-center gap-2">
              {project.githubUrl && project.githubUrl !== '#' && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => dreamAudio.playPop()}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}

              {project.liveUrl && project.liveUrl !== '#' && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => dreamAudio.playChime()}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-cyan-900/40"
                >
                  <span>Launch Live</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                type="button"
                onClick={() => {
                  dreamAudio.playPop();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Close Hatch
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
