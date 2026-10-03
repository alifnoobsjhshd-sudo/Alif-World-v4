import React from 'react';
import { motion } from 'motion/react';
import { StoryScene } from '../data/storyline';

interface StorySpeechBubbleProps {
  scene: StoryScene;
  className?: string;
}

export const StorySpeechBubble: React.FC<StorySpeechBubbleProps> = ({ scene, className = '' }) => {
  const isStorm = scene.theme === 'storm';
  const isSunset = scene.theme === 'sunset';
  const isBreakthrough = scene.theme === 'breakthrough';
  const isUnforgettable = scene.theme === 'unforgettable';
  const isReveal = scene.theme === 'reveal';

  // Specific tilt for wind-tilted bubble
  const tiltClass = scene.bubblePlacement === 'wind-tilted' ? '-rotate-2 sm:-rotate-3' : '';

  // Determine pointer tail placement
  const isLeftPlaced = 
    scene.bubblePlacement === 'left-curving' || 
    scene.bubblePlacement === 'between-portal' || 
    scene.bubblePlacement === 'opposite-telescope' || 
    scene.bubblePlacement === 'wide-pointing-horizon';

  const isRightPlaced = 
    scene.bubblePlacement === 'beside-head' || 
    scene.bubblePlacement === 'subtle-beside' || 
    scene.bubblePlacement === 'direct-friendly' || 
    scene.bubblePlacement === 'above-behind' || 
    scene.bubblePlacement === 'behind-stretching' || 
    scene.bubblePlacement === 'wind-tilted';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ 
        opacity: 1, 
        y: [0, -4, 0],
        scale: 1,
        rotate: scene.bubblePlacement === 'wind-tilted' ? [-2, -4, -2] : [0, 0.4, 0]
      }}
      transition={{ 
        y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' }
      }}
      className={`relative z-30 max-w-[210px] sm:max-w-[260px] md:max-w-[290px] select-none filter drop-shadow-md ${tiltClass} ${className}`}
    >
      <div 
        className={`relative px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl border-2 transition-all duration-300 ${
          isStorm 
            ? 'bg-slate-900/95 text-slate-100 border-slate-700 shadow-[0_10px_25px_rgba(15,23,42,0.4)] backdrop-blur-md'
            : isSunset
            ? 'bg-gradient-to-br from-amber-50/95 via-rose-50/95 to-purple-50/95 text-slate-800 border-amber-200/90 shadow-[0_10px_25px_rgba(249,115,22,0.18)] backdrop-blur-sm'
            : isBreakthrough
            ? 'bg-gradient-to-b from-white to-amber-50 text-slate-900 border-amber-300 shadow-[0_12px_30px_rgba(251,191,36,0.25)]'
            : isUnforgettable
            ? 'bg-white/95 text-slate-800 border-indigo-200/90 shadow-[0_12px_30px_rgba(99,102,241,0.16)] backdrop-blur-md'
            : isReveal
            ? 'bg-white text-slate-900 border-sky-300 shadow-[0_12px_30px_rgba(56,189,248,0.2)]'
            : 'bg-white/95 text-slate-800 border-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.06)] backdrop-blur-sm'
        }`}
      >
        {/* Speech Bubble Quote */}
        <p 
          className={`font-hand text-xs sm:text-sm md:text-base leading-snug tracking-normal ${
            isStorm ? 'text-amber-100' : 'text-slate-800'
          }`}
        >
          {scene.bubble}
        </p>

        {/* Tail / Connector Pointer */}
        {isRightPlaced && (
          <div className="absolute -bottom-2 left-4 sm:left-5 w-3.5 h-3.5 bg-inherit border-r-2 border-b-2 border-inherit rotate-45 transform" />
        )}
        {isLeftPlaced && (
          <div className="absolute -bottom-2 right-4 sm:right-5 w-3.5 h-3.5 bg-inherit border-r-2 border-b-2 border-inherit rotate-45 transform" />
        )}
        {!isLeftPlaced && !isRightPlaced && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-inherit border-r-2 border-b-2 border-inherit rotate-45 transform" />
        )}
      </div>
    </motion.div>
  );
};
