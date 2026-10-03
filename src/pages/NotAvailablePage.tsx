import React from 'react';
import { motion } from 'motion/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Rocket, AlertCircle, Home, Compass } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dreamAudio } from '../utils/audio';

export const NotAvailablePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectName = searchParams.get('project') || 'Project';

  const handleBackToSpace = () => {
    dreamAudio.playHover();
    navigate('/explore-works');
  };

  const handleBack = () => {
    dreamAudio.playHover();
    navigate('/world');
  };

  const handleGoHome = () => {
    dreamAudio.playHover();
    navigate('/');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#02040f] text-white flex flex-col items-center justify-center p-6 select-none overflow-hidden font-display">
      <SEO
        title={`${projectName} | Currently Not Available`}
        description="This project is currently not available."
      />

      {/* Top Left Back Button to World */}
      <div className="fixed top-4 left-4 z-40 pointer-events-auto">
        <button
          onClick={handleBack}
          onMouseEnter={() => dreamAudio.playHover()}
          className="flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-900/80 hover:bg-slate-800 backdrop-blur-xl border border-slate-700/80 shadow-md text-slate-200 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer hover:scale-105"
          title="Back to Worlds"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />
          <span>Worlds</span>
        </button>
      </div>

      {/* Subtle cosmic background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.08)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      {/* Clean, minimal card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 max-w-md w-full rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 text-center shadow-2xl flex flex-col items-center"
      >
        {/* Status icon badge */}
        <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-6 text-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
          <AlertCircle className="w-8 h-8 text-cyan-400" />
        </div>

        {/* Project Name & Status */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 tracking-wider uppercase mb-3">
          <span>{projectName}</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-400">Offline / Restricted</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white mb-2">
          Currently Not Available
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed mb-8 max-w-xs">
          This service is currently under active development, offline maintenance, or private access.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          <motion.button
            type="button"
            onClick={handleBackToSpace}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 text-slate-950 font-medium text-xs font-mono shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:brightness-110 transition-all cursor-pointer"
          >
            <Rocket className="w-4 h-4 text-slate-950" />
            <span>RETURN TO SPACE</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={handleBack}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span>GO BACK</span>
          </motion.button>
        </div>

        <button
          type="button"
          onClick={handleGoHome}
          className="mt-6 flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Return to Earth Home</span>
        </button>
      </motion.div>
    </div>
  );
};
