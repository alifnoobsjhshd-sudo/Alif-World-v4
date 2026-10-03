import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { dreamAudio } from '../utils/audio';

// Visual assets
import worldSkyBg from '../assets/images/sky_mountain_realm_1790820082936.jpg';
import userIslandsImg from '../assets/images/user_islands_hd.png';

const USER_ISLANDS_REMOTE = 'https://i.postimg.cc/50b5Tcbh/8eb6c567-7782-40e8-82d9-6b99644466f7-removebg-preview.png';

export const WorldPage: React.FC = () => {
  const navigate = useNavigate();
  const clusterRef = useRef<HTMLDivElement>(null);
  const [zoomingIsland, setZoomingIsland] = useState<'story' | 'about' | 'works' | null>(null);
  const [zoomOrigin, setZoomOrigin] = useState<string>('50% 50%');
  const [isMuted, setIsMuted] = useState(dreamAudio.isMuted);
  const [hoveredIsland, setHoveredIsland] = useState<'story' | 'about' | 'works' | null>(null);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
  const [imgSrc, setImgSrc] = useState(userIslandsImg);
  const [isEntering, setIsEntering] = useState(true);

  // Responsive tracker
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ── Continuous 3D Parallax Tracking via Mouse Movement (For PC) ────────────
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for smooth responsive cursor tracking
  const springX = useSpring(mouseX, { stiffness: 65, damping: 22, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 65, damping: 22, mass: 0.5 });

  // Sky background parallax
  const bgX = useTransform(springX, [-1, 1], [-14, 14]);
  const bgY = useTransform(springY, [-1, 1], [-10, 10]);

  // Floating Island 3D tilt & shift
  const islandClusterX = useTransform(springX, [-1, 1], [-25, 25]);
  const islandClusterY = useTransform(springY, [-1, 1], [-18, 18]);
  const islandRotX = useTransform(springY, [-1, 1], [6, -6]);
  const islandRotY = useTransform(springX, [-1, 1], [-7, 7]);

  // Special Celestial Sky Music & Air Waves Soundscape Lifecycle
  useEffect(() => {
    dreamAudio.startWorldSkyMusic();

    const handleFirstGesture = () => {
      dreamAudio.startWorldSkyMusic();
    };
    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      dreamAudio.stopWorldSkyMusic(1.0);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const handlePointerMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX / innerWidth) * 2 - 1;
      const normY = (e.clientY / innerHeight) * 2 - 1;

      mouseX.set(normX);
      mouseY.set(normY);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('mousemove', handlePointerMove);
  }, [isDesktop, mouseX, mouseY]);

  // Audio Toggle
  const toggleAudio = () => {
    const muted = dreamAudio.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      dreamAudio.playPop();
      dreamAudio.startWorldSkyMusic();
    } else {
      dreamAudio.stopWorldSkyMusic(0.5);
    }
  };

  // Island Click: Zooms into the clicked island then redirects to the page.
  const handleIslandClick = (
    e: React.MouseEvent,
    islandId: 'story' | 'about' | 'works',
    targetUrl: string
  ) => {
    if (zoomingIsland) return;
    dreamAudio.playDreamRipple();

    // Compute exact click coordinates within the cluster to zoom directly into that point
    if (clusterRef.current) {
      const rect = clusterRef.current.getBoundingClientRect();
      const xPct = Math.max(5, Math.min(95, ((e.clientX - rect.left) / rect.width) * 100));
      const yPct = Math.max(5, Math.min(95, ((e.clientY - rect.top) / rect.height) * 100));
      setZoomOrigin(`${xPct.toFixed(1)}% ${yPct.toFixed(1)}%`);
    } else {
      const islandOrigins: Record<string, string> = {
        story: '25% 26%',
        about: '75% 26%',
        works: '50% 74%',
      };
      setZoomOrigin(islandOrigins[islandId] || '50% 50%');
    }

    setZoomingIsland(islandId);

    // Zoom into island then redirect
    setTimeout(() => {
      navigate(targetUrl);
    }, 520);
  };

  return (
    <div className="relative w-screen h-screen h-[100dvh] overflow-hidden bg-slate-900 select-none flex flex-col justify-between">
      <SEO
        title="Alif's Dream Realm · Floating Islands"
        description="Explore Alif's 3 connected floating sky islands: The Story, More About Him, and My Works."
      />

      {/* ── 1. ENTRANCE REVEAL: SOFT TRANSPARENT CLOUDS PARTING LEFT & RIGHT ── */}
      {isEntering && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 }}
          onAnimationComplete={() => setIsEntering(false)}
          className="fixed inset-0 z-50 pointer-events-none overflow-hidden flex items-center justify-between"
        >
          {/* Left Cloud Bank: Drifting and sliding away to the left */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: '-115%' }}
            transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
            className="relative w-[55%] h-full flex flex-col justify-around pointer-events-none"
          >
            <div className="absolute -right-20 top-[10%] w-[380px] h-[260px] rounded-full bg-white/70 blur-3xl" />
            <div className="absolute -right-12 top-[36%] w-[460px] h-[340px] rounded-full bg-white/85 blur-3xl" />
            <div className="absolute -right-24 top-[64%] w-[420px] h-[300px] rounded-full bg-white/80 blur-3xl" />
            <div className="w-full h-full bg-gradient-to-r from-white/95 via-white/80 to-transparent" />
          </motion.div>

          {/* Right Cloud Bank: Drifting and sliding away to the right */}
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: '115%' }}
            transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
            className="relative w-[55%] h-full flex flex-col justify-around pointer-events-none -ml-[10%]"
          >
            <div className="absolute -left-20 top-[12%] w-[380px] h-[260px] rounded-full bg-white/70 blur-3xl" />
            <div className="absolute -left-12 top-[38%] w-[460px] h-[340px] rounded-full bg-white/85 blur-3xl" />
            <div className="absolute -left-24 top-[66%] w-[420px] h-[300px] rounded-full bg-white/80 blur-3xl" />
            <div className="w-full h-full bg-gradient-to-l from-white/95 via-white/80 to-transparent" />
          </motion.div>
        </motion.div>
      )}

      {/* ── CINEMATIC SKY BACKGROUND (SUN REMOVED, SERENE CELESTIAL SKY ATMOSPHERE) ── */}
      <motion.div
        style={{
          x: isDesktop ? bgX : 0,
          y: isDesktop ? bgY : 0,
          scale: 1.08,
        }}
        className="absolute inset-0 pointer-events-none z-0 will-change-transform"
      >
        <img
          src={worldSkyBg}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/world-sky-bg.jpg';
          }}
          alt="Celestial Sky Realm"
          className="w-full h-full object-cover object-center"
        />

        {/* Ethereal atmosphere lighting (Sun removed as requested) */}
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400/20 via-sky-600/10 to-indigo-950/45 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/25 via-transparent to-sky-900/15" />
      </motion.div>

      {/* ── ANIMATED AIR WAVES & WIND CURRENTS RIPPLES IN THE SKY ─────────────── */}
      <AnimatedAirWaves />

      {/* ── DRIFTING SKY CLOUDS & FLYING CRANES ───────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {/* Upper soft billowing cloud bank */}
        <motion.div
          className="absolute -top-12 -left-[20%] w-[140%] h-40 opacity-70 flex justify-around"
          animate={{ x: [-35, 35, -35] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-80 h-32 rounded-full bg-white/70 blur-2xl" />
          <div className="w-[480px] h-40 rounded-full bg-white/80 blur-3xl" />
          <div className="w-72 h-28 rounded-full bg-white/60 blur-2xl" />
        </motion.div>

        {/* Mid-sky drifting fluff clouds */}
        <motion.div
          className="absolute top-[22%] -left-32 w-64 h-20 rounded-full bg-white/45 blur-xl"
          animate={{ x: [0, window.innerWidth + 200] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          className="absolute top-[68%] -left-48 w-80 h-24 rounded-full bg-white/40 blur-2xl"
          animate={{ x: [0, window.innerWidth + 300] }}
          transition={{ duration: 52, repeat: Infinity, ease: 'linear', delay: 10 }}
        />

        {/* Flocks of Flying Cranes with Flapping Wings gliding across sky */}
        <motion.div
          className="absolute top-[14%] -left-20 flex items-center gap-6"
          animate={{
            x: ['-10vw', '115vw'],
            y: [0, -30, 15, -20, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <FlyingCrane scale={0.85} delay={0} />
          <div className="-mt-6">
            <FlyingCrane scale={0.65} delay={0.2} />
          </div>
          <div className="mt-5">
            <FlyingCrane scale={0.6} delay={0.4} />
          </div>
        </motion.div>
      </div>

      {/* ── TOP NAVIGATION BAR (Simplified: "Back" & Sound Only) ─────────────── */}
      <header className="relative z-40 flex items-center justify-between px-4 sm:px-8 pt-3 sm:pt-4 pb-2 pointer-events-none w-full">
        {/* Left: "Back" Button */}
        <motion.button
          onClick={() => {
            dreamAudio.playPop();
            navigate('/');
          }}
          onMouseEnter={() => dreamAudio.playHover()}
          whileHover={{ scale: 1.05, y: -1 }}
          whileTap={{ scale: 0.95 }}
          className="pointer-events-auto relative overflow-hidden flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/85 hover:bg-white/95 backdrop-blur-xl border border-white/70 shadow-[0_6px_20px_rgba(0,0,0,0.1)] text-slate-800 transition-all cursor-pointer group"
          title="Back to Landing Page"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-700 group-hover:-translate-x-1 transition-transform" />
          <span className="font-display font-bold text-xs sm:text-sm tracking-wide text-slate-800">
            Back
          </span>
        </motion.button>

        {/* Right: Audio Mute Button */}
        <motion.button
          onClick={toggleAudio}
          onMouseEnter={() => dreamAudio.playHover()}
          whileHover={{ scale: 1.08, y: -1 }}
          whileTap={{ scale: 0.92 }}
          className="pointer-events-auto relative overflow-hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white/95 backdrop-blur-xl border border-white/70 shadow-[0_6px_20px_rgba(0,0,0,0.1)] text-slate-700 hover:text-slate-900 transition-all flex items-center justify-center cursor-pointer"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? (
            <VolumeX className="w-4 h-4 text-slate-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-emerald-600 animate-pulse" />
          )}
        </motion.button>
      </header>

      {/* ── CENTER: 3 CONNECTED FLOATING ISLANDS (Fits in 1 Screen) ─────────── */}
      <main
        className="relative flex-1 w-full flex items-center justify-center p-2 sm:p-4 overflow-hidden z-20"
        style={{ perspective: isDesktop ? '1200px' : 'none' }}
      >
        <motion.div
          ref={clusterRef}
          style={{
            x: isDesktop && !zoomingIsland ? islandClusterX : 0,
            y: isDesktop && !zoomingIsland ? islandClusterY : 0,
            rotateX: isDesktop && !zoomingIsland ? islandRotX : 0,
            rotateY: isDesktop && !zoomingIsland ? islandRotY : 0,
            transformOrigin: zoomOrigin,
          }}
          animate={
            zoomingIsland
              ? {
                  scale: 3.5,
                }
              : {
                  // Organic harmonic breathing floating motion
                  scale: 1.0,
                  y: [-7, 7, -7],
                  rotate: [-0.6, 0.6, -0.6],
                }
          }
          transition={
            zoomingIsland
              ? {
                  scale: { duration: 0.52, ease: [0.35, 0, 0.65, 0] },
                }
              : {
                  y: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
                  rotate: { duration: 6.5, repeat: Infinity, ease: 'easeInOut' },
                }
          }
          className="relative w-full max-w-[min(540px,78vh)] sm:max-w-[min(560px,76vh)] aspect-square flex items-center justify-center will-change-transform"
        >
          {/* ── THE 3 CONNECTED FLOATING ISLANDS IMAGE ── */}
          <div className="relative w-full h-full flex items-center justify-center">
            
            {/* Ambient Celestial Halo beneath the islands */}
            <div className="absolute inset-8 rounded-full bg-sky-300/25 blur-3xl pointer-events-none" />

            {/* Glowing Hover Aura for Left Top Island (The Story) */}
            <div
              className={`absolute top-[12%] left-[10%] w-[42%] h-[42%] rounded-full bg-rose-400/40 blur-2xl pointer-events-none transition-opacity duration-400 ${
                hoveredIsland === 'story' ? 'opacity-100 scale-110' : 'opacity-0'
              }`}
            />

            {/* Glowing Hover Aura for Right Top Island (More About Him) */}
            <div
              className={`absolute top-[12%] right-[10%] w-[42%] h-[42%] rounded-full bg-cyan-400/45 blur-2xl pointer-events-none transition-opacity duration-400 ${
                hoveredIsland === 'about' ? 'opacity-100 scale-110' : 'opacity-0'
              }`}
            />

            {/* Glowing Hover Aura for Bottom Island (My Works) */}
            <div
              className={`absolute bottom-[8%] left-[24%] w-[52%] h-[48%] rounded-full bg-amber-400/45 blur-2xl pointer-events-none transition-opacity duration-400 ${
                hoveredIsland === 'works' ? 'opacity-100 scale-110' : 'opacity-0'
              }`}
            />

            {/* Main Transparent PNG of the 3 Connected Islands */}
            <img
              src={imgSrc}
              onError={() => setImgSrc(USER_ISLANDS_REMOTE)}
              alt="Floating Sky Islands"
              className="w-full h-full object-contain pointer-events-none drop-shadow-[0_20px_35px_rgba(15,23,42,0.6)] select-none"
            />

            {/* ── 1. LEFT TOP ISLAND: "The Story" ───────────────────────────── */}
            <div
              onClick={(e) => handleIslandClick(e, 'story', '/journey')}
              onMouseEnter={() => {
                setHoveredIsland('story');
                dreamAudio.playHover();
              }}
              onMouseLeave={() => setHoveredIsland(null)}
              className="absolute left-[3%] top-[4%] w-[45%] h-[44%] cursor-pointer group flex flex-col items-center justify-start z-30"
              title="The Story · Click to Explore"
            >
              {/* Only the island name text: No icons, No background */}
              <motion.span
                animate={{
                  scale: hoveredIsland === 'story' ? 1.1 : 1.0,
                  y: hoveredIsland === 'story' ? -3 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="mt-1 font-display font-black text-sm sm:text-base tracking-wider uppercase text-rose-200 drop-shadow-[0_2px_10px_rgba(244,63,94,0.95)] group-hover:text-white transition-colors select-none"
              >
                The Story
              </motion.span>
            </div>

            {/* ── 2. RIGHT TOP ISLAND: "More About Him" ─────────────────────── */}
            <div
              onClick={(e) => handleIslandClick(e, 'about', '/about')}
              onMouseEnter={() => {
                setHoveredIsland('about');
                dreamAudio.playHover();
              }}
              onMouseLeave={() => setHoveredIsland(null)}
              className="absolute right-[3%] top-[4%] w-[45%] h-[44%] cursor-pointer group flex flex-col items-center justify-start z-30"
              title="More About Him · Click to Explore"
            >
              {/* Only the island name text: No icons, No background */}
              <motion.span
                animate={{
                  scale: hoveredIsland === 'about' ? 1.1 : 1.0,
                  y: hoveredIsland === 'about' ? -3 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="mt-1 font-display font-black text-sm sm:text-base tracking-wider uppercase text-cyan-200 drop-shadow-[0_2px_10px_rgba(6,182,212,0.95)] group-hover:text-white transition-colors select-none"
              >
                More About Him
              </motion.span>
            </div>

            {/* ── 3. BOTTOM ISLAND: "My Works" ──────────────────────────────── */}
            <div
              onClick={(e) => handleIslandClick(e, 'works', '/explore-works')}
              onMouseEnter={() => {
                setHoveredIsland('works');
                dreamAudio.playHover();
              }}
              onMouseLeave={() => setHoveredIsland(null)}
              className="absolute left-[24%] bottom-[2%] w-[52%] h-[50%] cursor-pointer group flex flex-col items-center justify-start z-30"
              title="My Works · Click to Explore"
            >
              {/* Only the island name text: No icons, No background */}
              <motion.span
                animate={{
                  scale: hoveredIsland === 'works' ? 1.1 : 1.0,
                  y: hoveredIsland === 'works' ? -3 : 0,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="mt-3 font-display font-black text-sm sm:text-base tracking-wider uppercase text-amber-200 drop-shadow-[0_2px_10px_rgba(245,158,11,0.95)] group-hover:text-white transition-colors select-none"
              >
                My Works
              </motion.span>
            </div>

          </div>
        </motion.div>
      </main>

      {/* ── 4. VISIBLE ANIMATED AIR WAVES SWEEPING ABOVE THE ISLAND OVERLAY (WITH INSTANT SOUND) ── */}
      <PassingAirWavesAboveIslands />

    </div>
  );
};

// ── ANIMATED AIR WAVES (Flowing Wind Currents & Breezes across the Sky) ───────
const AnimatedAirWaves: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Stream 1: Upper Sky Sweeping Air Wave */}
      <motion.div
        className="absolute top-[16%] -left-[30%] w-[160%] h-32 opacity-45"
        animate={{
          x: ['-12%', '12%', '-12%'],
          y: [-6, 6, -6],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg viewBox="0 0 1200 120" className="w-full h-full" fill="none">
          <motion.path
            d="M 0 60 Q 200 20, 400 60 T 800 60 T 1200 50"
            stroke="url(#airWaveGrad1)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="180 320"
            animate={{ strokeDashoffset: [0, -1000] }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          />
          <motion.path
            d="M 50 75 Q 250 40, 450 75 T 850 70 T 1200 65"
            stroke="url(#airWaveGrad2)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="120 280"
            animate={{ strokeDashoffset: [0, -800] }}
            transition={{ duration: 13, repeat: Infinity, ease: 'linear' }}
          />
          <defs>
            <linearGradient id="airWaveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="25%" stopColor="#bae6fd" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="75%" stopColor="#38bdf8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="airWaveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="30%" stopColor="#e0f2fe" stopOpacity="0.7" />
              <stop offset="70%" stopColor="#7dd3fc" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Stream 2: Mid-Sky Gentle Flowing Air Gust */}
      <motion.div
        className="absolute top-[44%] -left-[20%] w-[140%] h-28 opacity-40"
        animate={{
          x: ['8%', '-8%', '8%'],
          y: [5, -5, 5],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg viewBox="0 0 1000 100" className="w-full h-full" fill="none">
          <motion.path
            d="M 0 50 C 250 15, 350 85, 600 45 C 800 15, 900 70, 1000 50"
            stroke="url(#airWaveGrad3)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="140 260"
            animate={{ strokeDashoffset: [0, -850] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />
          <defs>
            <linearGradient id="airWaveGrad3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="20%" stopColor="#ffffff" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#7dd3fc" stopOpacity="0.8" />
              <stop offset="85%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Stream 3: Lower Floating Breeze Ripple */}
      <motion.div
        className="absolute top-[72%] -left-[25%] w-[150%] h-32 opacity-35"
        animate={{
          x: ['-10%', '10%', '-10%'],
          y: [-4, 6, -4],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <svg viewBox="0 0 1100 110" className="w-full h-full" fill="none">
          <motion.path
            d="M 0 55 Q 180 85, 380 50 T 780 55 T 1100 50"
            stroke="url(#airWaveGrad4)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="160 300"
            animate={{ strokeDashoffset: [0, -900] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          />
          <defs>
            <linearGradient id="airWaveGrad4" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="30%" stopColor="#bae6fd" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Floating Wind/Air Motes drifting across the sky */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-white/75 shadow-[0_0_8px_rgba(255,255,255,0.85)]"
          style={{
            top: `${14 + i * 13}%`,
            left: '-10px',
          }}
          animate={{
            x: ['0vw', '105vw'],
            y: [0, (i % 2 === 0 ? -25 : 25), (i % 2 === 0 ? 15 : -15), 0],
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{
            duration: 11 + i * 2.5,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 2,
          }}
        />
      ))}
    </div>
  );
};

// ── ANIMATED FLYING CRANE SVG COMPONENT (Flapping Wings) ────────────────────
interface FlyingCraneProps {
  scale?: number;
  flipped?: boolean;
  delay?: number;
}

const FlyingCrane: React.FC<FlyingCraneProps> = ({ scale = 1.0, flipped = false, delay = 0 }) => {
  return (
    <div
      style={{
        transform: `scale(${scale}) ${flipped ? 'scaleX(-1)' : ''}`,
      }}
      className="relative drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]"
    >
      <svg width="74" height="48" viewBox="0 0 100 65" fill="none">
        <path
          d="M 25 35 Q 50 30 75 35 Q 85 36 92 32 Q 78 40 45 42 Q 28 42 15 48 Q 20 40 25 35 Z"
          fill="#ffffff"
        />
        <path
          d="M 75 35 Q 88 28 92 18 Q 95 14 98 12 Q 95 18 90 28 Q 80 34 75 35 Z"
          fill="#ffffff"
        />
        <circle cx="95" cy="13" r="2.5" fill="#ef4444" />
        <path d="M 98 12 L 105 13 L 97 15 Z" fill="#f59e0b" />
        <path d="M 15 48 Q 10 52 5 56 Q 14 47 22 43 Z" fill="#0f172a" />
        <path d="M 30 42 L 5 58 M 32 42 L 8 62" stroke="#475569" strokeWidth="1.2" strokeLinecap="round" />

        {/* Flapping Wing */}
        <motion.g
          animate={{
            scaleY: [1, 0.4, -0.7, 0.4, 1],
            y: [0, 4, 10, 4, 0],
          }}
          transition={{
            duration: 1.1,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: delay,
          }}
          style={{ originX: '50px', originY: '32px' }}
        >
          <path
            d="M 45 32 Q 55 12 70 2 Q 58 10 50 18 Q 42 12 30 18 Q 38 24 45 32 Z"
            fill="#ffffff"
            stroke="#e2e8f0"
            strokeWidth="0.8"
          />
          <path d="M 68 3 Q 74 0 78 2 Q 70 8 62 14 Z" fill="#0f172a" />
        </motion.g>
      </svg>
    </div>
  );
};

// ── VISIBLE ANIMATED AIR WAVES (Sweeping dynamically Left-to-Right or Right-to-Left above Islands) ──
interface AirWaveEvent {
  id: number;
  direction: 'left-to-right' | 'right-to-left';
  top: number;
  scale: number;
  duration: number;
}

const PassingAirWavesAboveIslands: React.FC = () => {
  const [waves, setWaves] = useState<AirWaveEvent[]>([]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const scheduleNextWave = (delayMs: number) => {
      timeoutId = setTimeout(() => {
        const direction: 'left-to-right' | 'right-to-left' = Math.random() > 0.5 ? 'left-to-right' : 'right-to-left';
        // Random vertical position across the upper/middle island span
        const top = 18 + Math.random() * 52;
        const scale = 0.88 + Math.random() * 0.42;
        const duration = 2.6 + Math.random() * 0.6;
        const id = Date.now() + Math.random();

        // Play the sweeping air wave gust whoosh sound immediately!
        dreamAudio.playAirWaveWhoosh(direction);

        setWaves((prev) => [...prev.slice(-2), { id, direction, top, scale, duration }]);

        // Auto remove when offscreen
        setTimeout(() => {
          setWaves((prev) => prev.filter((w) => w.id !== id));
        }, (duration + 0.3) * 1000);

        // Schedule next air wave in 7 to 12 seconds
        const nextDelay = 7000 + Math.random() * 5500;
        scheduleNextWave(nextDelay);
      }, delayMs);
    };

    // First air wave arrives in 1.8 seconds so user experiences it right away
    scheduleNextWave(1800);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-35 overflow-hidden">
      {waves.map((wave) => (
        <motion.div
          key={wave.id}
          initial={{
            x: wave.direction === 'left-to-right' ? '-45vw' : '135vw',
            opacity: 0,
          }}
          animate={{
            x: wave.direction === 'left-to-right' ? '135vw' : '-45vw',
            opacity: [0, 0.95, 0.95, 0],
          }}
          transition={{
            duration: wave.duration,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            position: 'absolute',
            top: `${wave.top}%`,
            width: '440px',
            maxWidth: '92vw',
            transform: `scale(${wave.scale}) ${wave.direction === 'right-to-left' ? 'scaleX(-1)' : ''}`,
            filter: 'drop-shadow(0 0 16px rgba(56, 189, 248, 0.75))',
          }}
          className="flex flex-col select-none"
        >
          {/* Luminous dynamic breeze streamlines & eddy spirals */}
          <svg viewBox="0 0 440 90" className="w-full h-auto overflow-visible" fill="none">
            <defs>
              <linearGradient id={`waveGrad-${wave.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="20%" stopColor="#e0f2fe" stopOpacity="0.85" />
                <stop offset="55%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="85%" stopColor="#38bdf8" stopOpacity="0.75" />
                <stop offset="100%" stopColor="#bae6fd" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={`waveCore-${wave.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                <stop offset="40%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="80%" stopColor="#7dd3fc" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Main leading wind filament */}
            <path
              d="M 10 45 Q 120 15, 240 45 T 430 35"
              stroke={`url(#waveCore-${wave.id})`}
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Upper trailing breeze ribbon with gentle curve */}
            <path
              d="M 50 25 Q 160 5, 280 30 T 410 20 Q 430 18, 435 25 Q 430 32, 415 30"
              stroke={`url(#waveGrad-${wave.id})`}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeDasharray="18 10 120 15"
            />

            {/* Lower secondary sweeping wind stream */}
            <path
              d="M 30 65 Q 150 82, 270 55 T 425 60"
              stroke={`url(#waveGrad-${wave.id})`}
              strokeWidth="2.0"
              strokeLinecap="round"
              strokeDasharray="60 14 80 12"
            />

            {/* Small breeze swirl eddies */}
            <path
              d="M 280 40 C 310 40, 325 55, 315 65 C 305 75, 285 65, 290 50 C 295 40, 310 45, 305 55"
              stroke="rgba(255, 255, 255, 0.85)"
              strokeWidth="1.6"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          {/* Drifting wind motes & sparkles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white shadow-[0_0_8px_#38bdf8]"
                style={{
                  width: `${2.5 + (i % 3)}px`,
                  height: `${2.5 + (i % 3)}px`,
                  left: `${20 + i * 14}%`,
                  top: `${30 + (i % 3) * 15}%`,
                  opacity: 0.9,
                }}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
