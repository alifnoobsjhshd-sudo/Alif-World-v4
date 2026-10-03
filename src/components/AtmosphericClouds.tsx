import React from 'react';
import { motion, MotionValue, useTransform } from 'motion/react';
import { STORY_SCENES, SCENE_STEP } from '../data/storyline';

interface AtmosphericCloudsProps {
  smoothedDepth: MotionValue<number>;
}

export const AtmosphericClouds: React.FC<AtmosphericCloudsProps> = React.memo(({ smoothedDepth }) => {
  const maxStoryDepth = (STORY_SCENES.length - 1) * SCENE_STEP;
  // Gentle parallax shifts tied to flight depth across entire journey
  const parallaxY1 = useTransform(smoothedDepth, [0, maxStoryDepth], [0, -450]);
  const parallaxY2 = useTransform(smoothedDepth, [0, maxStoryDepth], [0, -700]);
  const parallaxX1 = useTransform(smoothedDepth, [0, maxStoryDepth], [0, 200]);
  const parallaxX2 = useTransform(smoothedDepth, [0, maxStoryDepth], [0, -240]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[5]">
      {/* Background layer 1: distant slow clouds */}
      <motion.div 
        style={{ y: parallaxY1, x: parallaxX1, willChange: 'transform' }}
        className="absolute -top-32 -bottom-96 -left-16 -right-16"
      >
        <div className="absolute top-[12%] -left-12 opacity-40 scale-125">
          <CloudSvg width={340} height={170} />
        </div>
        <div className="absolute top-[28%] right-[4%] opacity-35 scale-110">
          <CloudSvg width={300} height={150} flip />
        </div>
        <div className="absolute top-[65%] left-[8%] opacity-30 scale-90">
          <CloudSvg width={260} height={130} />
        </div>
        <div className="absolute top-[78%] right-[10%] opacity-40 scale-115">
          <CloudSvg width={320} height={160} flip />
        </div>
      </motion.div>

      {/* Background layer 2: medium clouds + balloons */}
      <motion.div 
        style={{ y: parallaxY2, x: parallaxX2, willChange: 'transform' }}
        className="absolute -top-32 -bottom-96 -left-16 -right-16"
      >
        <div className="absolute top-[22%] left-[18%] opacity-50 scale-100">
          <CloudSvg width={280} height={140} />
        </div>
        <div className="absolute top-[45%] right-[22%] opacity-45 scale-105">
          <CloudSvg width={310} height={155} flip />
        </div>

        {/* Hot air balloons */}
        <div className="absolute top-[15%] right-[12%] animate-pulse duration-1000">
          <BalloonSvg color="bg-rose-400" />
        </div>
        <div className="absolute top-[52%] left-[6%]">
          <BalloonSvg color="bg-sky-400" />
        </div>
        <div className="absolute top-[75%] right-[15%]">
          <BalloonSvg color="bg-amber-400" />
        </div>
      </motion.div>
    </div>
  );
});

AtmosphericClouds.displayName = 'AtmosphericClouds';

const CloudSvg = ({ width, height, flip = false }: { width: number; height: number; flip?: boolean }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 320 160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: flip ? 'scaleX(-1)' : undefined }}
  >
    <path
      d="M 54 120 C 34 120 14 104 14 86 C 14 64 36 50 64 50 C 76 28 112 16 144 34 C 168 18 218 22 242 54 C 268 54 304 72 302 102 C 300 124 268 144 238 144 C 200 144 74 148 54 120 Z"
      fill="white"
      stroke="#e2e8f0"
      strokeWidth="1.5"
      strokeLinejoin="round"
      opacity="0.9"
    />
  </svg>
);

const BalloonSvg = ({ color }: { color: string }) => (
  <div className={`w-10 h-14 ${color} rounded-full border border-black/10 relative shadow-sm`}>
    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-inherit rotate-45 border-b border-r border-black/5" />
    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-0.5 h-7 bg-slate-300" />
  </div>
);
