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

  // Specific subtle static tilt for wind-tilted bubble
  const tiltClass = scene.bubblePlacement === 'wind-tilted' ? '-rotate-1' : '';

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
      initial={{ opacity: 0, y: 6 }}
      animate={{ 
        opacity: 1, 
        y: [0, -3, 0],
      }}
      transition={{ 
        opacity: { duration: 0.25 },
        y: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' }
      }}
      className={`relative z-40 max-w-[260px] sm:max-w-[320px] md:max-w-[360px] select-none ${tiltClass} ${className}`}
    >
      <div 
        className={`relative px-2.5 py-1.5 sm:px-4 sm:py-2.5 rounded-2xl border transition-all duration-300 ${
          isStorm 
            ? 'bg-slate-900 text-amber-50 border-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.45)]'
            : isSunset
            ? 'bg-[#fffdf9] text-slate-900 border-amber-300/80 shadow-[0_8px_24px_rgba(249,115,22,0.18)]'
            : isBreakthrough
            ? 'bg-white text-slate-900 border-amber-400/80 shadow-[0_8px_24px_rgba(251,191,36,0.22)]'
            : isUnforgettable
            ? 'bg-white text-slate-900 border-indigo-300/80 shadow-[0_8px_24px_rgba(99,102,241,0.18)]'
            : isReveal
            ? 'bg-white text-slate-900 border-sky-300/80 shadow-[0_8px_24px_rgba(56,189,248,0.2)]'
            : 'bg-white text-slate-900 border-slate-200/90 shadow-[0_8px_24px_rgba(0,0,0,0.08)]'
        }`}
      >
        {/* Speech Bubble Quote - Ultra crisp, crystal-sharp typography */}
        <p 
          style={{
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            textRendering: 'optimizeLegibility',
          }}
          className={`font-display font-bold text-[11px] sm:text-sm md:text-base leading-tight sm:leading-snug tracking-normal ${
            isStorm ? 'text-amber-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]' : 'text-slate-950'
          }`}
        >
          {scene.bubble}
        </p>

        {/* Tail / Connector Pointer */}
        {isRightPlaced && (
          <div className="absolute -bottom-1.5 left-4 sm:left-5 w-3 h-3 bg-inherit border-r border-b border-inherit rotate-45 transform" />
        )}
        {isLeftPlaced && (
          <div className="absolute -bottom-1.5 right-4 sm:right-5 w-3 h-3 bg-inherit border-r border-b border-inherit rotate-45 transform" />
        )}
        {!isLeftPlaced && !isRightPlaced && (
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-inherit border-r border-b border-inherit rotate-45 transform" />
        )}
      </div>
    </motion.div>
  );
};
