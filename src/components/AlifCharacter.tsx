import React from 'react';
import { motion } from 'motion/react';
import waveImg from '../assets/images/pose_wave.png';

export const AlifCharacter = React.memo(() => {
  return (
    <div className="relative w-96 h-[390px] flex flex-col items-center justify-center scale-105 sm:scale-115">
      <motion.div 
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-full flex justify-center"
      >
        <div className="relative">
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-64 h-8 bg-black/10 blur-xl rounded-full" />
          
          <img 
            src={waveImg} 
            alt="Alif Character on Cloud"
            width="420"
            height="420"
            className="w-full max-w-[360px] sm:max-w-[420px] h-auto drop-shadow-[0_20px_45px_rgba(0,0,0,0.14)] object-contain select-none pointer-events-none"
            referrerPolicy="no-referrer"
          />
        </div>
      </motion.div>
    </div>
  );
});

AlifCharacter.displayName = 'AlifCharacter';
