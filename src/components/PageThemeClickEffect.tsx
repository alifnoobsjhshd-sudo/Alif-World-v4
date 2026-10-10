import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { dreamAudio } from '../utils/audio';

interface ClickParticle {
  id: string;
  x: number;
  y: number;
  type: 'world' | 'story' | 'about';
}

export const PageThemeClickEffect: React.FC = () => {
  const location = useLocation();
  const [clicks, setClicks] = useState<ClickParticle[]>([]);
  const latestCoord = useRef({ x: 0, y: 0 });

  const path = location.pathname.toLowerCase();
  const isWorld = path.startsWith('/world');
  const isStory = path.startsWith('/journey') || path.startsWith('/story');
  const isAbout = path.startsWith('/about') || path.startsWith('/more-about-him');

  const activeTheme: 'world' | 'story' | 'about' | null = isWorld
    ? 'world'
    : isStory
    ? 'story'
    : isAbout
    ? 'about'
    : null;

  useEffect(() => {
    if (!activeTheme) return;

    const triggerEffect = (clientX: number, clientY: number) => {
      const panX = (clientX / (window.innerWidth || 1) - 0.5) * 1.4;

      // Play themed sound
      if (activeTheme === 'world') {
        dreamAudio.playWorldClickSound(panX);
      } else if (activeTheme === 'story') {
        dreamAudio.playStoryClickSound(panX);
      } else if (activeTheme === 'about') {
        dreamAudio.playAboutBubbleClickSound(panX);
      }

      // Add visual click effect
      const id = `${Date.now()}-${Math.random()}`;
      setClicks((prev) => [...prev.slice(-7), { id, x: clientX, y: clientY, type: activeTheme }]);

      setTimeout(() => {
        setClicks((prev) => prev.filter((c) => c.id !== id));
      }, 950);
    };

    const handlePointerDown = (e: PointerEvent) => {
      // Don't trigger on right-clicks
      if (e.button !== 0) return;
      latestCoord.current = { x: e.clientX, y: e.clientY };
      triggerEffect(e.clientX, e.clientY);
    };

    const handleVirtualClick = () => {
      triggerEffect(latestCoord.current.x, latestCoord.current.y);
    };

    const handleVirtualMove = (e: Event) => {
      const ev = e as CustomEvent<{ x: number; y: number }>;
      if (ev.detail && typeof ev.detail.x === 'number') {
        latestCoord.current = { x: ev.detail.x, y: ev.detail.y };
      }
    };

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('virtual-cursor-click', handleVirtualClick);
    window.addEventListener('virtual-cursor-move', handleVirtualMove);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('virtual-cursor-click', handleVirtualClick);
      window.removeEventListener('virtual-cursor-move', handleVirtualMove);
    };
  }, [activeTheme]);

  if (!activeTheme || clicks.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9990] overflow-hidden select-none">
      <AnimatePresence>
        {clicks.map((item) => (
          <React.Fragment key={item.id}>
            {/* ── 1. WORLD PAGE THEMED CLICK EFFECT (Celestial Shockwave & Starlight Motes) ── */}
            {item.type === 'world' && (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: item.x, top: item.y }}
              >
                {/* Luminous celestial expanding halo */}
                <motion.div
                  initial={{ scale: 0.1, opacity: 0.95 }}
                  animate={{ scale: [0.1, 1.8, 2.5], opacity: [0.95, 0.6, 0] }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                  className="w-14 h-14 rounded-full border-2 border-sky-300 shadow-[0_0_24px_rgba(56,189,248,0.9),inset_0_0_12px_rgba(254,240,138,0.7)]"
                />

                {/* Secondary golden celestial ripple */}
                <motion.div
                  initial={{ scale: 0.2, opacity: 0.8 }}
                  animate={{ scale: [0.2, 1.3, 1.9], opacity: [0.8, 0.4, 0] }}
                  transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
                  className="absolute inset-0 w-14 h-14 rounded-full border border-amber-200/80 shadow-[0_0_16px_rgba(251,191,36,0.8)]"
                />

                {/* 8 Radiating Celestial Star Motes */}
                {[...Array(8)].map((_, i) => {
                  const angle = (i * Math.PI) / 4;
                  const dist = 32 + (i % 2) * 16;
                  const dx = Math.cos(angle) * dist;
                  const dy = Math.sin(angle) * dist;
                  return (
                    <motion.div
                      key={i}
                      initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                      animate={{
                        x: dx,
                        y: dy,
                        scale: [0, 1.4, 0],
                        opacity: [1, 0.9, 0],
                        rotate: [0, 90],
                      }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="absolute top-1/2 left-1/2 -ml-1 -mt-1 w-2 h-2 flex items-center justify-center pointer-events-none"
                    >
                      <div className="w-1.5 h-1.5 rotate-45 bg-gradient-to-tr from-sky-200 to-amber-100 shadow-[0_0_8px_#38bdf8]" />
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* ── 2. THE STORY THEMED CLICK EFFECT (Whimsical Paper Fold Sparkles & Storybook Compass) ── */}
            {item.type === 'story' && (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: item.x, top: item.y }}
              >
                {/* Dashed whimsical storybook flight ring */}
                <motion.div
                  initial={{ scale: 0.1, opacity: 0.95, rotate: 0 }}
                  animate={{ scale: [0.1, 1.6, 2.2], opacity: [0.95, 0.7, 0], rotate: 45 }}
                  transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                  className="w-14 h-14 rounded-full border-2 border-dashed border-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.7)]"
                />

                {/* Soft warm paper-cloud puff */}
                <motion.div
                  initial={{ scale: 0.2, opacity: 0.85 }}
                  animate={{ scale: [0.2, 1.2, 1.7], opacity: [0.85, 0.35, 0] }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                  className="absolute inset-0 w-14 h-14 rounded-full bg-gradient-to-tr from-white/70 via-sky-100/40 to-transparent blur-sm"
                />

                {/* 6 Fluttering origami paper sparkles */}
                {[...Array(6)].map((_, i) => {
                  const angle = (i * Math.PI) / 3;
                  const dist = 28 + (i % 2) * 14;
                  const dx = Math.cos(angle) * dist;
                  const dy = Math.sin(angle) * dist;
                  return (
                    <motion.div
                      key={i}
                      initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                      animate={{
                        x: dx,
                        y: dy,
                        scale: [0, 1.2, 0],
                        opacity: [1, 0.85, 0],
                        rotate: [0, (i % 2 === 0 ? 120 : -120)],
                      }}
                      transition={{ duration: 0.55, ease: 'easeOut' }}
                      className="absolute top-1/2 left-1/2 -ml-1 -mt-1 w-2.5 h-2.5 flex items-center justify-center"
                    >
                      {/* Diamond paper fold fragment */}
                      <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 drop-shadow-[0_0_6px_rgba(255,255,255,0.9)]">
                        <polygon points="5,0 10,5 5,10 0,5" fill="#ffffff" stroke="#93c5fd" strokeWidth="0.8" />
                      </svg>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* ── 3. ABOUT ME THEMED CLICK EFFECT (Iridescent Bubble Burst & Aquatic Droplets) ── */}
            {item.type === 'about' && (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ left: item.x, top: item.y }}
              >
                {/* Iridescent popping bubble rim */}
                <motion.div
                  initial={{ scale: 0.2, opacity: 1 }}
                  animate={{ scale: [0.2, 1.7, 2.4], opacity: [1, 0.7, 0] }}
                  transition={{ duration: 0.5, ease: [0.18, 0.89, 0.32, 1.28] }}
                  className="w-12 h-12 rounded-full border-2 border-cyan-300 bg-cyan-400/15 backdrop-blur-[1px] shadow-[0_0_20px_rgba(6,182,212,0.85),inset_0_0_12px_rgba(255,255,255,0.9)]"
                />

                {/* Inner rainbow soap film sheen */}
                <motion.div
                  initial={{ scale: 0.1, opacity: 0.9 }}
                  animate={{ scale: [0.1, 1.3, 1.8], opacity: [0.9, 0.3, 0] }}
                  transition={{ duration: 0.38, ease: 'easeOut' }}
                  className="absolute inset-0 w-12 h-12 rounded-full bg-gradient-to-tr from-pink-300/30 via-emerald-200/30 to-sky-300/40"
                />

                {/* 6 Tiny Aquatic Droplet Sprays */}
                {[...Array(6)].map((_, i) => {
                  const angle = (i * Math.PI) / 3 + 0.2;
                  const dist = 26 + (i % 2) * 12;
                  const dx = Math.cos(angle) * dist;
                  const dy = Math.sin(angle) * dist;
                  return (
                    <motion.div
                      key={i}
                      initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                      animate={{
                        x: dx,
                        y: dy,
                        scale: [0, 1.3, 0],
                        opacity: [1, 0.8, 0],
                      }}
                      transition={{ duration: 0.45, ease: 'easeOut' }}
                      className="absolute top-1/2 left-1/2 -ml-1 -mt-1 w-2 h-2 rounded-full bg-gradient-to-tr from-white via-cyan-200 to-sky-300 shadow-[0_0_8px_#22d3ee]"
                    >
                      <div className="w-0.5 h-0.5 rounded-full bg-white absolute top-0.5 left-0.5" />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </React.Fragment>
        ))}
      </AnimatePresence>
    </div>
  );
};
