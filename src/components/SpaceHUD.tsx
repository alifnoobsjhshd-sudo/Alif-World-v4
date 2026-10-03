import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, Orbit, Home, Compass } from 'lucide-react';
import { SPACE_PROJECT_SECTORS } from '../data/spaceWorks';
import { dreamAudio } from '../utils/audio';

interface SpaceHUDProps {
  activeSectorIdx: number;
  onSelectSector: (idx: number) => void;
  isMuted: boolean;
  onToggleAudio: () => void;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const SpaceHUD: React.FC<SpaceHUDProps> = ({
  activeSectorIdx,
  onSelectSector,
  isMuted,
  onToggleAudio,
  activeCategory,
  onSelectCategory,
}) => {
  const navigate = useNavigate();
  const currentSector = SPACE_PROJECT_SECTORS[activeSectorIdx] || SPACE_PROJECT_SECTORS[0];

  const categories = ['All', 'Featured', 'AI & Systems', 'Creative 3D', 'Full-Stack', 'Future Dock'];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none select-none font-display">
      
      {/* ── TOP PRIMARY ORBITAL HUD ───────────────────────────────────────── */}
      <div className="pt-[max(0.75rem,env(safe-area-inset-top))] px-3 sm:px-6 pb-2.5 flex items-center justify-between gap-2 max-w-6xl mx-auto">
        
        {/* Return to Worlds (Left) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <motion.button
            type="button"
            onClick={() => {
              dreamAudio.playPop();
              navigate('/world');
            }}
            onMouseEnter={() => dreamAudio.playHover()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-slate-700/80 shadow-lg text-slate-200 hover:text-white transition-all font-bold text-xs uppercase tracking-wider cursor-pointer"
            title="Return to Worlds"
            aria-label="Return to Worlds"
          >
            <Orbit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
            <span className="hidden sm:inline">Worlds</span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => {
              dreamAudio.playPop();
              navigate('/journey');
            }}
            onMouseEnter={() => dreamAudio.playHover()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto hidden md:flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-800 backdrop-blur-md px-3 py-2 rounded-full border border-slate-700/80 shadow-lg text-slate-300 hover:text-white transition-all font-bold text-xs uppercase tracking-wider cursor-pointer"
            title="Watch Sky Story"
          >
            <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Sky Story</span>
          </motion.button>
        </div>

        {/* ── CENTER SECTOR FLIGHT TRACKER ─────────────────────────────────── */}
        <div className="relative flex-1 min-w-0 max-w-[240px] xs:max-w-[320px] sm:max-w-[480px] flex items-center justify-between pointer-events-auto bg-slate-900/85 backdrop-blur-md px-2 xs:px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          
          {/* Previous Sector Button */}
          <button
            type="button"
            onClick={() => {
              if (activeSectorIdx > 0) {
                dreamAudio.playPop();
                onSelectSector(activeSectorIdx - 1);
              }
            }}
            onMouseEnter={() => dreamAudio.playHover()}
            disabled={activeSectorIdx === 0}
            className="p-1 rounded-full hover:bg-slate-800 disabled:opacity-25 text-slate-300 transition-colors cursor-pointer shrink-0"
            title="Previous Cosmic Sector"
          >
            <ChevronLeft className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Timeline track with glowing dots */}
          <div className="relative flex-1 mx-2 sm:mx-3 flex items-center justify-between h-5">
            {/* Connecting Track Line */}
            <div className="absolute left-1 right-1 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800 rounded-full" />
            
            {/* Active progress glow line */}
            <motion.div
              className="absolute left-1 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-500 shadow-[0_0_8px_rgba(56,189,248,0.8)] rounded-full"
              style={{
                width: `${(activeSectorIdx / (SPACE_PROJECT_SECTORS.length - 1)) * 100}%`,
              }}
            />

            {/* Sector Dots */}
            {SPACE_PROJECT_SECTORS.map((sec, i) => {
              const isActive = activeSectorIdx === i;
              const isHangar = sec.isFutureDock;
              return (
                <button
                  key={sec.id}
                  type="button"
                  onClick={() => {
                    dreamAudio.playPop();
                    onSelectSector(i);
                  }}
                  onMouseEnter={() => dreamAudio.playHover()}
                  className="relative z-10 flex flex-col items-center justify-center p-0.5 focus:outline-none group cursor-pointer"
                  title={`${sec.sectorCode}: ${sec.title}`}
                >
                  <motion.div
                    animate={{
                      scale: isActive ? 1.4 : 1,
                      backgroundColor: isActive
                        ? '#38bdf8'
                        : isHangar
                        ? '#c084fc'
                        : '#475569',
                      boxShadow: isActive
                        ? '0 0 10px #38bdf8, 0 0 16px rgba(56, 189, 248, 0.6)'
                        : 'none',
                    }}
                    transition={{ duration: 0.25 }}
                    className="rounded-full w-2 h-2 sm:w-2.5 sm:h-2.5"
                  />
                </button>
              );
            })}

            {/* Mini Rocket Pointer */}
            <motion.div
              className="absolute -top-3.5 pointer-events-none"
              animate={{
                left: `calc(${(activeSectorIdx / (SPACE_PROJECT_SECTORS.length - 1)) * 100}% - 9px)`,
              }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-xs drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]">🚀</div>
            </motion.div>
          </div>

          {/* Next Sector Button */}
          <button
            type="button"
            onClick={() => {
              if (activeSectorIdx < SPACE_PROJECT_SECTORS.length - 1) {
                dreamAudio.playPop();
                onSelectSector(activeSectorIdx + 1);
              }
            }}
            onMouseEnter={() => dreamAudio.playHover()}
            disabled={activeSectorIdx === SPACE_PROJECT_SECTORS.length - 1}
            className="p-1 rounded-full hover:bg-slate-800 disabled:opacity-25 text-slate-300 transition-colors cursor-pointer shrink-0"
            title="Next Cosmic Sector"
          >
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Right Controls: Sector Telemetry Badge & Audio Mute Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Active Sector Code Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-mono text-cyan-300 shadow-md">
            <Orbit className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>{currentSector.sectorCode}</span>
          </div>

          {/* Sound Mute Toggle */}
          <motion.button
            type="button"
            onClick={() => {
              dreamAudio.playPop();
              onToggleAudio();
            }}
            onMouseEnter={() => dreamAudio.playHover()}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="pointer-events-auto shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md border border-cyan-500/40 shadow-lg text-slate-200 hover:text-white transition-all flex items-center justify-center cursor-pointer active:scale-95"
            title={isMuted ? 'Unmute Space Soundscape' : 'Mute Space Soundscape'}
            aria-label={isMuted ? 'Unmute Space Soundscape' : 'Mute Space Soundscape'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
            )}
          </motion.button>
        </div>

      </div>

      {/* ── SECONDARY HUD: CATEGORY FILTER BAR ────────────────────────────── */}
      <div className="px-3 sm:px-6 flex justify-center">
        <div className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 px-2 py-1 rounded-full bg-slate-950/75 backdrop-blur-md border border-slate-800/90 shadow-md overflow-x-auto max-w-full no-scrollbar">
          {categories.map((cat) => {
            const isSel = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  dreamAudio.playPop();
                  onSelectCategory(cat);
                }}
                onMouseEnter={() => dreamAudio.playHover()}
                className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSel
                    ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};
