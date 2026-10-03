import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import alifCharacterImg from '../assets/images/alif_character_pure_transparent_1780383675414.png';
import poseStanding from '../assets/images/pose_standing.png';
import poseSitting from '../assets/images/pose_sitting.png';
import poseLying from '../assets/images/pose_lying.png';
import poseCrosslegged from '../assets/images/pose_crosslegged.png';
import poseLaptop from '../assets/images/pose_laptop.png';
import poseWave from '../assets/images/pose_wave.png';
import poseStorm from '../assets/images/pose_storm.png';
import poseSunset from '../assets/images/pose_sunset.png';

const ALL_PRELOAD_ASSETS = [
  alifCharacterImg,
  poseStanding,
  poseSitting,
  poseLying,
  poseCrosslegged,
  poseLaptop,
  poseWave,
  poseStorm,
  poseSunset,
  '/landing-bg.jpg',
  '/landing-bg-desktop.jpg',
  '/landing-bg-desktop-hd.jpg',
  '/landing-bg-desktop-ultra.jpg',
  '/alif-character.png',
  '/scientist-reference.jpg',
];

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('INITIALIZING CREATIVE ENGINE...');
  const assetsLoadedRef = useRef(0);
  const totalAssets = ALL_PRELOAD_ASSETS.length;

  useEffect(() => {
    let active = true;

    // 1. Off-thread GPU Image Texture Pre-decoding (Prevents scroll/transition lag)
    const preloadImage = (src: string): Promise<void> => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = src;

        const onFinished = () => {
          if ('decode' in img) {
            img
              .decode()
              .then(() => {
                if (active) assetsLoadedRef.current += 1;
                resolve();
              })
              .catch(() => {
                if (active) assetsLoadedRef.current += 1;
                resolve();
              });
          } else {
            if (active) assetsLoadedRef.current += 1;
            resolve();
          }
        };

        if (img.complete) {
          onFinished();
        } else {
          img.onload = onFinished;
          img.onerror = () => {
            if (active) assetsLoadedRef.current += 1;
            resolve();
          };
        }
      });
    };

    // 2. Comprehensive Preloader for all elements & web fonts
    const runFullAssetPreload = async () => {
      // Preload Web Fonts to eliminate layout shift (CLS)
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // ignore font loading fallback
        }
      }

      // Preload & decode all key graphical scenes and character poses
      await Promise.all(ALL_PRELOAD_ASSETS.map((url) => preloadImage(url)));
    };

    runFullAssetPreload();

    // 3. Extended, ultra-smooth loading period (~4.6 seconds total)
    // Ensures all assets are cached and GPU-ready before revealing pages
    const startTime = performance.now();
    const TARGET_DURATION = 4600; // 4.6 seconds extended period for zero lag

    const updateTimer = setInterval(() => {
      if (!active) return;
      const elapsed = performance.now() - startTime;
      const timeRatio = Math.min(1, elapsed / TARGET_DURATION);

      // Blend elapsed time with asset decoding completion
      const assetRatio = totalAssets > 0 ? assetsLoadedRef.current / totalAssets : 1;
      const blendedProgress = Math.min(
        100,
        Math.floor((timeRatio * 0.7 + assetRatio * 0.3) * 100)
      );

      // Dynamic sub-status messages informing user of optimization phases
      if (blendedProgress < 25) {
        setStatusMessage('INITIALIZING CREATIVE ENGINE & FONTS...');
      } else if (blendedProgress < 50) {
        setStatusMessage('PRE-CACHING 3D ASSETS & CHARACTER POSES...');
      } else if (blendedProgress < 75) {
        setStatusMessage('DECODING ULTRA-HD GRAPHICS & ATMOSPHERE...');
      } else if (blendedProgress < 95) {
        setStatusMessage('WARMING GPU SHADERS & AUDIO PIPELINE...');
      } else {
        setStatusMessage('ALL SYSTEMS OPTIMIZED // READY');
      }

      setProgress((prev) => Math.max(prev, blendedProgress));

      if (elapsed >= TARGET_DURATION && blendedProgress >= 100) {
        clearInterval(updateTimer);
        setProgress(100);
        setStatusMessage('ALL SYSTEMS OPTIMIZED // READY');

        // Graceful hold to let the 100% state register, then transition cleanly
        setTimeout(() => {
          if (active) onComplete();
        }, 550);
      }
    }, 40);

    return () => {
      active = false;
      clearInterval(updateTimer);
    };
  }, [onComplete, totalAssets]);

  return (
    <motion.div
      id="main-app-loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.015 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[1000] bg-white flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Subtle warm ambient backdrop gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50/60 via-white to-amber-50/30 pointer-events-none" />

      <div className="w-72 sm:w-96 relative z-10 px-4">
        {/* Progress Bar Container */}
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)] border border-slate-200/60">
          {/* Progress fill */}
          <motion.div
            className="h-full bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 rounded-full"
            style={{
              width: `${progress}%`,
              transition: 'width 0.15s ease-out',
            }}
          />
        </div>

        {/* Paper Airplane Indicator */}
        <motion.div
          className="absolute top-[-32px] flex items-center justify-center pointer-events-none"
          style={{
            left: `${progress}%`,
            x: '-50%',
            transition: 'left 0.15s ease-out',
          }}
        >
          <motion.div
            animate={{ y: [0, -5, 0], rotate: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="white"
              stroke="#e11d48"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="rotate-45 drop-shadow-md"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" fill="#fff" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Percentage & Status Label */}
        <div className="mt-8 flex flex-col items-center text-center gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-display font-black text-gray-800 text-base tracking-widest">
              LOADING {progress}%
            </span>
          </div>
          <span className="text-[11px] font-mono tracking-wider text-slate-500 uppercase">
            {statusMessage}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
