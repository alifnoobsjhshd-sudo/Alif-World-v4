import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { StoryScene } from '../data/storyline';
import { StorySpeechBubble } from './StorySpeechBubble';
import { SnappedCloudCharacter } from './SnappedCloudCharacter';
import { Compass, Mail, ArrowRight, User } from 'lucide-react';
import { dreamAudio } from '../utils/audio';

interface StorySceneViewProps {
  scene: StoryScene;
  onOpenContact?: () => void;
  onExploreWork?: () => void;
}

function getTopBubbleOffset(bubblePlacement: string): string {
  switch (bubblePlacement) {
    case 'above': // Scene 02: Lying down on stomach, head is lower down
      return 'top-6 sm:top-8 md:top-10';
    case 'high-above': // Scene 04: Standing tall looking up
      return '-top-6 sm:-top-5 md:-top-4';
    case 'high-contrast': // Scene 11: Breaking through, standing
    case 'cinematic-large': // Scene 13: Standing proudly on peak
      return '-top-5 sm:-top-4 md:-top-3';
    case 'above-laptop': // Scene 07: Sitting with laptop
    case 'above-airplane': // Scene 14: Sitting in flight
    default:
      return '-top-2 sm:-top-1 md:top-0';
  }
}

export const StorySceneView: React.FC<StorySceneViewProps> = React.memo(({ scene, onOpenContact, onExploreWork }) => {
  const navigate = useNavigate();
  const isReveal = scene.id === 16;

  const isTopPlaced = 
    scene.bubblePlacement === 'above' ||
    scene.bubblePlacement === 'high-above' ||
    scene.bubblePlacement === 'above-laptop' ||
    scene.bubblePlacement === 'above-airplane' ||
    scene.bubblePlacement === 'high-contrast' ||
    scene.bubblePlacement === 'cinematic-large';

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
    <div className="relative flex flex-col items-center justify-center w-full max-w-4xl px-4 select-none">
      
      {/* ── CENTRAL SNAPPED CLOUD + CHARACTER SECTION ELEMENT ──────────────── */}
      <div className="relative flex flex-col items-center justify-center min-w-[320px] sm:min-w-[500px] md:min-w-[660px]">
        
        {/* Top-centered floating bubble — balanced naturally above character head */}
        {isTopPlaced && (
          <div className={`absolute left-1/2 -translate-x-1/2 z-40 ${getTopBubbleOffset(scene.bubblePlacement)}`}>
            <StorySpeechBubble scene={scene} />
          </div>
        )}

        {/* Left floating bubble — balanced beside upper torso / head */}
        {isLeftPlaced && (
          <div className="absolute top-2 sm:top-4 md:top-6 left-1 sm:-left-12 md:-left-20 z-40">
            <StorySpeechBubble scene={scene} />
          </div>
        )}

        {/* Right floating bubble — balanced beside upper torso / head */}
        {isRightPlaced && (
          <div className="absolute top-2 sm:top-4 md:top-6 right-1 sm:-right-12 md:-right-20 z-40">
            <StorySpeechBubble scene={scene} />
          </div>
        )}

        {/* The character seated and snapped with the cloud in scene-specific pose */}
        <div className="my-2">
          <SnappedCloudCharacter scene={scene} />
        </div>

        {/* ── SCENE 16 SPECIAL: MAIN INTRODUCTION & BUTTONS ────────────────── */}
        {isReveal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-4 flex flex-col items-center text-center max-w-lg z-30"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-display font-black text-slate-900 tracking-tight mb-2">
              I’m Alif
            </h2>

            <p className="text-base sm:text-lg font-display font-bold text-black mb-6 tracking-wide">
              A develop, &ldquo; Making my imagination real&rdquo;
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pointer-events-auto">
              <button
                type="button"
                onClick={() => {
                  dreamAudio.playPop();
                  if (onExploreWork) {
                    onExploreWork();
                  } else {
                    navigate('/explore-works');
                  }
                }}
                onMouseEnter={() => dreamAudio.playHover()}
                className="px-6 sm:px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-black text-white font-display font-black text-base sm:text-lg shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border border-slate-800"
              >
                <Compass className="w-5 h-5 text-sky-400" />
                <span>Explore Work</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  dreamAudio.playPop();
                  dreamAudio.stopJourneyMusic(0.8);
                  navigate('/about');
                }}
                onMouseEnter={() => dreamAudio.playHover()}
                className="px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-display font-black text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <User className="w-5 h-5 text-slate-950" />
                <span>About Me</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  dreamAudio.playChime();
                  onOpenContact?.();
                }}
                onMouseEnter={() => dreamAudio.playHover()}
                className="px-6 sm:px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-display font-black text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 border-2 border-slate-200 hover:border-slate-400 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Mail className="w-5 h-5 text-sky-600" />
                <span>Contact Me</span>
              </button>
            </div>
          </motion.div>
        )}

      </div>

    </div>
  );
});

StorySceneView.displayName = 'StorySceneView';
