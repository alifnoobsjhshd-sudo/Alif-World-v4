import React from 'react';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { dreamAudio } from '../utils/audio';
import { MagneticShimmerButton } from './MagneticShimmerButton';

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
      {/* ── TOP HEADER (BACK TO WORLDS & SOUND TOGGLE WITH MAGNETIC SHIMMER) ── */}
      <header className="fixed top-4 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 z-50 flex items-center justify-between pointer-events-none select-none">
        {/* Left: Back Button to World */}
        <div className="pointer-events-auto">
          <MagneticShimmerButton
            variant="cyan"
            size="sm"
            onClick={onBack}
            onMouseEnter={() => dreamAudio.playHover()}
            title="Return to World Page"
            aria-label="Return to World Page"
            className="px-4 py-2 text-xs font-mono tracking-wider uppercase"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-200" />
            <span className="font-bold text-white">Worlds</span>
          </MagneticShimmerButton>
        </div>

        {/* Right: Audio Mute Button */}
        <div className="pointer-events-auto">
          <MagneticShimmerButton
            variant="cyan"
            size="icon"
            onClick={onToggleAudio}
            onMouseEnter={() => dreamAudio.playHover()}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-200 animate-pulse" />
            )}
          </MagneticShimmerButton>
        </div>
      </header>

      {/* ── BOTTOM CONTROLS (Fish navigation guide only; scenes path & progress indicators removed) ── */}
      <footer className="fixed bottom-3 sm:bottom-5 left-3 sm:left-8 z-40 pointer-events-none select-none">
        {/* Left: "Move fish Back & Forth" with Drag Indicator */}
        <div className="pointer-events-auto hidden md:flex items-center gap-3 px-4 py-2 rounded-2xl bg-[#021833]/85 backdrop-blur-xl border border-cyan-400/40 shadow-[0_8px_25px_rgba(0,0,0,0.5)]">
          {/* Mini Fish Icon */}
          <div className="w-8 h-8 relative flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
              <path
                d="M16 2 C22 8 26 14 26 20 C26 26 21 30 16 30 C11 30 6 26 6 20 C6 14 10 8 16 2 Z"
                fill="currentColor"
                opacity="0.85"
              />
              <circle cx="16" cy="10" r="2" fill="#ffffff" />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] font-mono tracking-widest uppercase text-cyan-300 font-bold">
              Ocean Navigator
            </span>
            <span className="text-[10px] text-cyan-100/70 font-sans">
              Scroll or drag to swim through depths
            </span>
          </div>
        </div>
      </footer>
    </>
  );
};
