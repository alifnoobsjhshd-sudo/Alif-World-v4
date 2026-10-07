import React, { useState } from 'react';
import { motion, animate, MotionValue } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { STORY_SCENES, SCENE_STEP } from '../data/storyline';
import { ChevronLeft, ChevronRight, ArrowLeft, FolderGit2, Volume2, VolumeX } from 'lucide-react';
import { dreamAudio } from '../utils/audio';

interface SectionPlaneProps {
  activeSection: number;
  depthValue: MotionValue<number>;
}

/* Tiny paper airplane facing right ---------------------------------------- */
const TinyPlane = () => (
  <svg width="28" height="18" viewBox="0 0 56 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tpTop" x1="0" y1="0" x2="56" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#e8ecf4"/>
        <stop offset="100%" stopColor="#d0d6e2"/>
      </linearGradient>
      <linearGradient id="tpBot" x1="0" y1="0" x2="56" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#c4cad8"/>
        <stop offset="100%" stopColor="#b0b6c4"/>
      </linearGradient>
    </defs>
    {/* Top wing */}
    <path d="M54 16 L4 2 L18 16 Z" fill="url(#tpTop)" stroke="#bec4d0" strokeWidth="0.8"/>
    {/* Bottom wing */}
    <path d="M54 16 L18 16 L4 30 Z" fill="url(#tpBot)" stroke="#aab0be" strokeWidth="0.8"/>
    {/* Fold wall */}
    <path d="M18 16 L22 30 L4 30 Z" fill="#7a808e" opacity="0.6"/>
    {/* Spine */}
    <line x1="54" y1="16" x2="18" y2="16" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.85"/>
    {/* Nose glint */}
    <circle cx="54" cy="16" r="2" fill="white" opacity="0.95"/>
  </svg>
);

export const SectionPlane = React.memo(({ activeSection, depthValue }: SectionPlaneProps) => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(dreamAudio.isMuted);

  const toggleSoundtrack = () => {
    const next = dreamAudio.toggleMute();
    setIsMuted(next);
    if (!next) dreamAudio.playPop();
  };

  const goTo = (i: number) => {
    const target = i * SCENE_STEP;
    animate(depthValue, target, { duration: 1.2, ease: [0.16, 1, 0.3, 1] });
  };

  const handlePrev = () => {
    const nextIdx = Math.max(0, activeSection - 1);
    goTo(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = Math.min(STORY_SCENES.length - 1, activeSection + 1);
    goTo(nextIdx);
  };

  return (
    <header
      className="fixed top-[max(0.75rem,env(safe-area-inset-top))] left-0 right-0 z-40 pointer-events-none px-3 sm:px-6 max-w-5xl mx-auto flex items-center justify-between gap-2 sm:gap-4"
      aria-label="Storyline navigation"
    >
      <h1 className="sr-only">Alif World Journey – Alif Portfolio (Zenox Portfolio)</h1>
      {/* Top Left Back to World Button */}
      <motion.button
        type="button"
        onClick={() => {
          dreamAudio.playPop();
          navigate('/world');
        }}
        onMouseEnter={() => dreamAudio.playHover()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="pointer-events-auto shrink-0 relative overflow-hidden flex items-center gap-1.5 bg-white/85 hover:bg-white backdrop-blur-2xl px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/80 shadow-[0_8px_25px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] text-slate-800 transition-all font-display font-bold text-xs uppercase tracking-wider cursor-pointer"
        title="Return to World Page"
        aria-label="Return to World Page"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent pointer-events-none" />
        <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600 shrink-0" />
        <span>Back</span>
      </motion.button>

      {/* Track & Flight Path Progress Bar (Center) */}
      <div className="relative flex-1 min-w-0 max-w-[230px] xs:max-w-[280px] sm:max-w-[460px] flex items-center justify-between pointer-events-auto bg-white/80 hover:bg-white/95 backdrop-blur-2xl px-2 xs:px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-white/60 shadow-[0_8px_25px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent pointer-events-none" />
        
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => {
            dreamAudio.playPop();
            handlePrev();
          }}
          onMouseEnter={() => dreamAudio.playHover()}
          disabled={activeSection === 0}
          className="p-1 sm:p-1.5 rounded-full hover:bg-slate-100 disabled:opacity-25 disabled:hover:bg-transparent text-slate-700 transition-colors cursor-pointer shrink-0"
          title="Previous Scene"
          aria-label="Previous Scene"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Timeline dots container */}
        <div className="relative flex-1 mx-1.5 xs:mx-2 sm:mx-3 flex items-center justify-between h-5">
          {/* Connecting Line */}
          <div className="absolute left-1 right-1 top-1/2 -translate-y-1/2 h-0.5 bg-slate-200 rounded-full" />
          
          {/* Progress fill */}
          <motion.div 
            className="absolute left-1 top-1/2 -translate-y-1/2 h-0.5 bg-sky-500 rounded-full"
            style={{ 
              width: `${(activeSection / (STORY_SCENES.length - 1)) * 100}%` 
            }}
          />

          {/* Scene Dots: on mobile (< sm) display milestones & active point to prevent cramped collision; on sm: and up show all 16 dots */}
          {STORY_SCENES.map((scene, i) => {
            const isActive = activeSection === i;
            const isMilestone = i === 0 || i === 5 || i === 9 || i === 11 || i === 15;
            
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => {
                  dreamAudio.playSceneTick();
                  goTo(i);
                }}
                onMouseEnter={() => dreamAudio.playHover()}
                className={`relative z-10 flex flex-col items-center justify-center p-0.5 focus:outline-none group cursor-pointer ${
                  !isMilestone && !isActive ? 'hidden sm:flex' : 'flex'
                }`}
                aria-label={`Progress point ${i + 1}`}
                title={`Scene ${i + 1}: ${scene.title}`}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.4 : isMilestone ? 1.1 : 0.85,
                    backgroundColor: isActive 
                      ? '#0284c7' 
                      : i < activeSection 
                      ? '#38bdf8' 
                      : '#cbd5e1',
                  }}
                  transition={{ duration: 0.25 }}
                  className={`rounded-full ${isMilestone ? 'w-2 h-2 sm:w-2.5 sm:h-2.5' : 'w-1.5 h-1.5 sm:w-2 sm:h-2'}`}
                />
              </button>
            );
          })}

          {/* Flying Paper Airplane Indicator */}
          <motion.div
            className="absolute -top-3.5 sm:-top-4 pointer-events-none"
            animate={{ left: `calc(${(activeSection / (STORY_SCENES.length - 1)) * 100}% - 14px)` }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.18))' }}
          >
            <TinyPlane />
          </motion.div>
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => {
            dreamAudio.playPop();
            handleNext();
          }}
          onMouseEnter={() => dreamAudio.playHover()}
          disabled={activeSection === STORY_SCENES.length - 1}
          className="p-1 sm:p-1.5 rounded-full hover:bg-slate-100 disabled:opacity-25 disabled:hover:bg-transparent text-slate-700 transition-colors cursor-pointer shrink-0"
          title="Next Scene"
          aria-label="Next Scene"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>

      {/* Right Controls: Projects & Soundtrack Mute Toggle */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <motion.button
          type="button"
          onClick={() => {
            dreamAudio.playPop();
            navigate('/projects');
          }}
          onMouseEnter={() => dreamAudio.playHover()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="pointer-events-auto shrink-0 relative overflow-hidden flex items-center gap-1.5 bg-white/80 hover:bg-white/95 backdrop-blur-2xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full border border-white/60 shadow-[0_8px_25px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] text-slate-700 hover:text-slate-900 transition-colors font-display font-bold text-xs uppercase tracking-wider cursor-pointer"
          title="View Projects"
          aria-label="View Projects"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent pointer-events-none" />
          <FolderGit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
          <span className="hidden sm:inline">Projects</span>
        </motion.button>

        <motion.button
          type="button"
          onClick={toggleSoundtrack}
          onMouseEnter={() => dreamAudio.playHover()}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="pointer-events-auto shrink-0 relative overflow-hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 hover:bg-white/95 backdrop-blur-2xl border border-white/60 shadow-[0_8px_25px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] text-slate-700 hover:text-slate-900 transition-all flex items-center justify-center cursor-pointer active:scale-95"
          title={isMuted ? 'Unmute Soundtrack' : 'Mute Soundtrack'}
          aria-label={isMuted ? 'Unmute Soundtrack' : 'Mute Soundtrack'}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent pointer-events-none" />
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-slate-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />
          )}
        </motion.button>
      </div>
    </header>
  );
});

SectionPlane.displayName = 'SectionPlane';
