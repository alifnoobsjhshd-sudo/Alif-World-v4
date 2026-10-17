import React, { useState } from 'react';
import { motion, animate, MotionValue } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { STORY_SCENES, SCENE_STEP } from '../data/storyline';
import { ChevronUp, ChevronDown, ArrowLeft, Volume2, VolumeX, FastForward } from 'lucide-react';
import { dreamAudio } from '../utils/audio';

interface SectionPlaneProps {
  activeSection: number;
  depthValue: MotionValue<number>;
  fromLetsDrive?: boolean;
}

/* Tiny paper airplane facing right ---------------------------------------- */
const TinyPlane = () => (
  <svg width="26" height="17" viewBox="0 0 56 36" fill="none" xmlns="http://www.w3.org/2000/svg">
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

export const SectionPlane = React.memo(({ activeSection, depthValue, fromLetsDrive = false }: SectionPlaneProps) => {
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

  const handleBack = () => {
    dreamAudio.playPop();
    if (fromLetsDrive) {
      dreamAudio.stopJourneyMusic(0.8);
      navigate('/');
    } else {
      navigate('/world');
    }
  };

  const handleSkipToWorld = () => {
    dreamAudio.playPop();
    dreamAudio.stopJourneyMusic(0.8);
    navigate('/world');
  };

  return (
    <>
      {/* ── TOP STORYLINE HEADER ────────────────────────────────────────────── */}
      <header
        className="fixed top-[max(0.75rem,env(safe-area-inset-top))] left-0 right-0 z-40 pointer-events-none px-3 sm:px-6 w-full flex items-center justify-between"
        aria-label="Storyline navigation"
      >
        <h1 className="sr-only">Alif World Journey – Alif Portfolio (Zenox Portfolio)</h1>
        
        {/* Top Left: Back Button */}
        <div className="flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
          <motion.button
            type="button"
            onClick={handleBack}
            onMouseEnter={() => dreamAudio.playHover()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="pointer-events-auto shrink-0 relative overflow-hidden flex items-center gap-1.5 bg-white/85 hover:bg-white backdrop-blur-2xl px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/80 shadow-[0_8px_25px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] text-slate-800 transition-all font-display font-bold text-xs uppercase tracking-wider cursor-pointer"
            title={fromLetsDrive ? "Return to Landing Page" : "Return to World Page"}
            aria-label={fromLetsDrive ? "Return to Landing Page" : "Return to World Page"}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent pointer-events-none" />
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600 shrink-0" />
            <span>Back</span>
          </motion.button>
        </div>

        {/* Top Right: Skip Button (Exclusively for journey arrived from LET'S DRIVE) & Soundtrack Mute Toggle */}
        <div className="flex items-center gap-2 pointer-events-auto shrink-0">
          {fromLetsDrive && (
            <motion.button
              type="button"
              onClick={handleSkipToWorld}
              onMouseEnter={() => dreamAudio.playHover()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="pointer-events-auto shrink-0 relative overflow-hidden flex items-center gap-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-sky-300/40 shadow-[0_8px_20px_rgba(14,165,233,0.3),inset_0_1px_1px_rgba(255,255,255,0.4)] transition-all font-display font-black text-xs uppercase tracking-wider cursor-pointer"
              title="Skip to Worlds Page"
              aria-label="Skip to Worlds Page"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-transparent pointer-events-none" />
              <span>Skip</span>
              <FastForward className="w-3.5 h-3.5 text-sky-100 shrink-0" />
            </motion.button>
          )}

          {/* Soundtrack Mute Toggle */}
          <motion.button
            type="button"
            onClick={toggleSoundtrack}
            onMouseEnter={() => dreamAudio.playHover()}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            className="pointer-events-auto shrink-0 relative overflow-hidden w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/85 hover:bg-white backdrop-blur-2xl border border-white/70 shadow-[0_8px_25px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] text-slate-700 hover:text-slate-900 transition-all flex items-center justify-center cursor-pointer active:scale-95"
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

      {/* ── VERTICAL FLIGHT PATH PROGRESS BAR (Docked on Right Side - Compact & Sleek) ── */}
      <nav
        aria-label="Vertical Storyline Progress"
        className="fixed right-2 sm:right-4 top-[calc(50%+3rem)] -translate-y-1/2 z-40 pointer-events-auto flex flex-col items-center justify-between bg-white/85 hover:bg-white/95 backdrop-blur-xl py-1.5 px-1 rounded-full border border-white/80 shadow-[0_8px_25px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.9)] h-[38vh] min-h-[175px] max-h-[235px] transition-all"
      >
        {/* Previous Scene Button (Scroll Up) */}
        <button
          type="button"
          onClick={() => {
            dreamAudio.playPop();
            handlePrev();
          }}
          onMouseEnter={() => dreamAudio.playHover()}
          disabled={activeSection === 0}
          className="p-0.5 rounded-full hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent text-slate-700 transition-colors cursor-pointer shrink-0"
          title="Previous Scene"
          aria-label="Previous Scene"
        >
          <ChevronUp className="w-3 h-3" />
        </button>

        {/* Vertical Timeline Track */}
        <div className="relative flex-1 my-1 flex flex-col items-center justify-between w-4">
          {/* Connecting Line Track */}
          <div className="absolute top-0.5 bottom-0.5 left-1/2 -translate-x-1/2 w-[1px] bg-slate-200 rounded-full" />

          {/* Filled Progress Line */}
          <motion.div
            className="absolute top-0.5 left-1/2 -translate-x-1/2 w-[1.5px] bg-sky-500 rounded-full origin-top"
            style={{
              height: `${(activeSection / (STORY_SCENES.length - 1)) * 100}%`,
            }}
          />

          {/* 16 Scene Dots */}
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
                className="relative z-10 flex items-center justify-center p-0 focus:outline-none group cursor-pointer"
                aria-label={`Jump to scene ${i + 1}: ${scene.title}`}
                title={`Scene ${i + 1}: ${scene.title}`}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1.5 : isMilestone ? 1.2 : 0.9,
                    backgroundColor: isActive
                      ? '#0284c7'
                      : i < activeSection
                      ? '#38bdf8'
                      : '#cbd5e1',
                  }}
                  transition={{ duration: 0.2 }}
                  className={`rounded-full ${isActive ? 'w-1.5 h-1.5 shadow-[0_0_6px_rgba(2,132,199,0.7)]' : isMilestone ? 'w-1 h-1' : 'w-1 h-1'}`}
                />

                {/* Hover Tooltip to the Left */}
                <div className="absolute right-full mr-2 px-2 py-0.5 rounded-md bg-slate-900/90 text-white text-[10px] font-display font-medium tracking-wide whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
                  Scene {i + 1}: {scene.title}
                </div>
              </button>
            );
          })}

          {/* Gliding Paper Airplane Indicator (Oriented along vertical flight path) */}
          <motion.div
            className="absolute -left-2 pointer-events-none origin-center"
            animate={{
              top: `calc(${(activeSection / (STORY_SCENES.length - 1)) * 100}% - 7px)`,
            }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))',
              transform: 'rotate(90deg) scale(0.55)',
            }}
          >
            <TinyPlane />
          </motion.div>
        </div>

        {/* Next Scene Button (Scroll Down) */}
        <button
          type="button"
          onClick={() => {
            dreamAudio.playPop();
            handleNext();
          }}
          onMouseEnter={() => dreamAudio.playHover()}
          disabled={activeSection === STORY_SCENES.length - 1}
          className="p-0.5 rounded-full hover:bg-slate-100 disabled:opacity-20 disabled:hover:bg-transparent text-slate-700 transition-colors cursor-pointer shrink-0"
          title="Next Scene"
          aria-label="Next Scene"
        >
          <ChevronDown className="w-3 h-3" />
        </button>
      </nav>
    </>
  );
});

SectionPlane.displayName = 'SectionPlane';
