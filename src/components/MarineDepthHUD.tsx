import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { dreamAudio } from '../utils/audio';

interface MarineDepthHUDProps {
  onBack: () => void;
  isMuted: boolean;
  onToggleAudio: () => void;
}

export const MarineDepthHUD: React.FC<MarineDepthHUDProps> = ({
  onBack,
  isMuted,
  onToggleAudio,
}) => {
  return (
    <>
      {/* ── TOP HEADER (BACK TO WORLDS & SOUND TOGGLE) ── */}
      <header className="fixed top-4 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 z-50 flex items-center justify-between pointer-events-none select-none">
        {/* Left: Back Button to World */}
        <div className="pointer-events-auto">
          <motion.button
            onClick={onBack}
            onMouseEnter={() => dreamAudio.playHover()}
            whileHover={{ scale: 1.05, y: -1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#031d3b]/80 hover:bg-[#06284f]/90 backdrop-blur-xl border border-cyan-400/40 shadow-[0_4px_20px_rgba(6,182,212,0.3)] text-cyan-200 hover:text-white transition-all text-xs font-mono tracking-wider uppercase cursor-pointer"
            title="Return to World Page"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
            <span className="font-bold">Worlds</span>
          </motion.button>
        </div>

        {/* Right: Audio Mute Button */}
        <div className="pointer-events-auto">
          <motion.button
            onClick={onToggleAudio}
            onMouseEnter={() => dreamAudio.playHover()}
            whileHover={{ scale: 1.08, y: -1 }}
            whileTap={{ scale: 0.92 }}
            className="w-10 h-10 rounded-full bg-[#031d3b]/80 hover:bg-[#06284f]/90 backdrop-blur-xl border border-cyan-400/40 shadow-[0_4px_20px_rgba(6,182,212,0.3)] text-cyan-300 hover:text-white transition-all flex items-center justify-center cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-300 animate-pulse" />
            )}
          </motion.button>
        </div>
      </header>

      {/* ── BOTTOM CONTROLS (Fish navigation guide only; scenes path & progress indicators removed) ── */}
      <footer className="fixed bottom-3 sm:bottom-5 left-3 sm:left-8 z-40 pointer-events-none select-none">
        {/* Left: "Move fish Back & Forth" with Drag Indicator */}
        <div className="pointer-events-auto hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#021833]/85 backdrop-blur-xl border border-cyan-400/40 shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
          {/* Mini Fish Icon */}
          <div className="w-8 h-8 relative flex items-center justify-center">
            <svg viewBox="0 0 40 28" className="w-full h-full fill-cyan-400 filter drop-shadow-[0_0_8px_rgba(56,189,248,0.9)]">
              <path d="M 4 14 C 10 7, 26 5, 34 12 C 38 9, 42 6, 39 14 C 42 22, 38 19, 34 16 C 26 23, 10 21, 4 14 Z" />
              <circle cx="10" cy="12" r="1.8" fill="#ffffff" />
              <path d="M 34 12 C 38 7, 44 4, 42 14 C 44 24, 38 21, 34 16" fill="none" stroke="#67e8f9" strokeWidth="1.2" opacity="0.8" />
            </svg>
          </div>

          <div className="flex flex-col text-left">
            <span className="font-display font-medium text-[11px] text-cyan-100 tracking-wide">
              Move fish Back & Forth
            </span>
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-cyan-400/90">
              <span>&larr;</span>
              <span className="text-white text-xs">👆</span>
              <span>&rarr;</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
