import React from 'react';
import { motion } from 'motion/react';

export const SketchyCloud = React.memo(({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div 
    animate={{ 
      y: [0, -12, 0],
      rotate: [-0.5, 0.5, -0.5]
    }}
    transition={{ 
      duration: 6, 
      repeat: Infinity, 
      ease: "easeInOut" 
    }}
    className={`relative ${className}`}
  >
    <svg 
      viewBox="0 0 500 200" 
      className="absolute inset-0 w-full h-full -z-10 fill-white/80 stroke-gray-200 stroke-2"
      preserveAspectRatio="none"
    >
      <path d="M50,150 C30,150 10,130 10,100 C10,60 40,40 80,40 C100,10 160,5 200,30 C240,10 320,10 350,50 C390,30 460,40 480,80 C495,110 480,160 440,180 C400,195 80,195 50,150Z" />
    </svg>
    <div className="relative z-10 px-12 py-8">
      {children}
    </div>
  </motion.div>
));

SketchyCloud.displayName = 'SketchyCloud';
