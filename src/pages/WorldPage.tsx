import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dreamAudio } from '../utils/audio';
import { MagneticShimmerButton } from '../components/MagneticShimmerButton';
import { MobileCursorToggleButton } from '../components/MobileCursorToggleButton';
import { CinematicVideoCutscene } from '../components/CinematicVideoCutscene';
import { getStageDimensions } from '../context/MobileVirtualCursorContext';
import worldCutsceneUrl from '../../cutscenes-2.mp4';

// Visual assets
import worldBoardBgRemote from '../assets/images/sky_mountain_realm_1790820082936.jpg'; // fallback
import islandStoryImg from '../assets/images/islands/island_story_trimmed.png';
import islandAboutImg from '../assets/images/islands/island_about_trimmed.png';
import islandWorksImg from '../assets/images/islands/island_works_trimmed.png';
import {
  StoryCloudCoverTransition,
  AboutBubbleCoverTransition,
  WorksRocketLaunchTransition,
} from '../components/WorldTransitions';

const WOOD_BOARD_BG_URL = 'https://i.postimg.cc/FHBPzSP2/d28f364d-caca-44e7-a29a-a2f431d6bbf4.jpg';
const WOOD_BOARD_LOCAL_URL = '/world-wood-board.jpg';

export const WorldPage: React.FC<{ initialLoading?: boolean }> = ({ initialLoading = false }) => {
  const navigate = useNavigate();
  const clusterRef = useRef<HTMLDivElement>(null);
  const storyIslandRef = useRef<HTMLDivElement>(null);
  const worksIslandRef = useRef<HTMLDivElement>(null);
  const aboutIslandRef = useRef<HTMLDivElement>(null);
  const hoveredIslandRef = useRef<'story' | 'about' | 'works' | null>(null);

  const [zoomingIsland, setZoomingIsland] = useState<'story' | 'about' | 'works' | null>(null);
  const [activeTransition, setActiveTransition] = useState<'story' | 'about' | 'works' | null>(null);
  const [zoomOrigin, setZoomOrigin] = useState<string>('50% 50%');
  const [isMuted, setIsMuted] = useState(dreamAudio.isMuted);
  const [hoveredIsland, setHoveredIsland] = useState<'story' | 'about' | 'works' | null>(null);
  const checkDesktop = () => {
    if (typeof window === 'undefined') return false;
    const isVirtualCursorActive = typeof document !== 'undefined' && document.body.classList.contains('mobile-virtual-cursor-active');
    return isVirtualCursorActive || window.innerWidth >= 1024;
  };
  const [isDesktop, setIsDesktop] = useState(checkDesktop);
  const [isEntering, setIsEntering] = useState(false);
  const [hasCutsceneEnded, setHasCutsceneEnded] = useState(false);
  const [bgSrc, setBgSrc] = useState(WOOD_BOARD_LOCAL_URL);
  const isCutsceneActive = !initialLoading && !hasCutsceneEnded;

  // Responsive tracker
  useEffect(() => {
    const handleUpdate = () => {
      setIsDesktop(checkDesktop());
    };
    handleUpdate();
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('mobile-cursor-state-change', handleUpdate);
    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('mobile-cursor-state-change', handleUpdate);
    };
  }, []);

  // ── Unified 3D Parallax Tracking via Mouse Movement & Virtual Cursor ──
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Responsive spring physics providing crisp tactile 3D movement matching desktop ratio
  const springX = useSpring(mouseX, { stiffness: 50, damping: 24, mass: 0.75 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 24, mass: 0.75 });

  // 3D Tilt and Parallax Shifts (Deep desktop-grade 3D feel):
  const sceneX = useTransform(springX, [-1, 1], [30, -30]);
  const sceneY = useTransform(springY, [-1, 1], [20, -20]);
  const sceneRotY = useTransform(springX, [-1, 1], [-4.8, 4.8]);
  const sceneRotX = useTransform(springY, [-1, 1], [4.0, -4.0]);

  // Peaceful World Theme Background Music (Airflows and air sound effects removed per request)
  useEffect(() => {
    if (!hasCutsceneEnded) return;

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
  }, [hasCutsceneEnded]);

  useEffect(() => {
    const handleMove = (stageX: number, stageY: number) => {
      const { width: stageW, height: stageH } = getStageDimensions();
      if (!stageW || !stageH) return;
      const normX = Math.max(-1, Math.min(1, (stageX / stageW - 0.5) * 2));
      const normY = Math.max(-1, Math.min(1, (stageY / stageH - 0.5) * 2));
      mouseX.set(normX);
      mouseY.set(normY);
    };

    const updateIslandHover = (x: number, y: number, isVirtual: boolean) => {
      const container = document.getElementById('auto-landscape-container');
      const bounds = container?.getBoundingClientRect();
      const isAutoRotated = Boolean(container?.style.transform.includes('rotate(90deg)'));

      const checkHit = (ref: React.RefObject<HTMLDivElement | null>) => {
        if (!ref.current) return false;
        const r = ref.current.getBoundingClientRect();
        if (isVirtual && isAutoRotated && bounds && bounds.height > 0 && bounds.width > 0) {
          const stageW = container?.clientWidth || bounds.height;
          const stageH = container?.clientHeight || bounds.width;
          const cx_phys = r.left + r.width / 2;
          const cy_phys = r.top + r.height / 2;
          const islandStageX = ((cy_phys - bounds.top) / bounds.height) * stageW;
          const islandStageY = ((bounds.right - cx_phys) / bounds.width) * stageH;
          const islandStageW = (r.height / bounds.height) * stageW;
          const islandStageH = (r.width / bounds.width) * stageH;
          const pad = 26;
          return Math.abs(x - islandStageX) <= islandStageW / 2 + pad && Math.abs(y - islandStageY) <= islandStageH / 2 + pad;
        }

        if (isVirtual && bounds) {
          const islandStageX = r.left - bounds.left + r.width / 2;
          const islandStageY = r.top - bounds.top + r.height / 2;
          const pad = 24;
          return Math.abs(x - islandStageX) <= r.width / 2 + pad && Math.abs(y - islandStageY) <= r.height / 2 + pad;
        }

        const pad = 20;
        return x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad;
      };

      let newHover: 'story' | 'about' | 'works' | null = null;
      if (checkHit(storyIslandRef)) {
        newHover = 'story';
      } else if (checkHit(worksIslandRef)) {
        newHover = 'works';
      } else if (checkHit(aboutIslandRef)) {
        newHover = 'about';
      }

      if (newHover !== hoveredIslandRef.current) {
        hoveredIslandRef.current = newHover;
        setHoveredIsland(newHover);
        if (newHover) {
          dreamAudio.playHover();
        }
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      if (document.body.classList.contains('mobile-virtual-cursor-active')) return;
      const { innerWidth, innerHeight } = window;
      if (!innerWidth || !innerHeight) return;
      const normX = Math.max(-1, Math.min(1, (e.clientX / innerWidth - 0.5) * 2));
      const normY = Math.max(-1, Math.min(1, (e.clientY / innerHeight - 0.5) * 2));
      mouseX.set(normX);
      mouseY.set(normY);
      updateIslandHover(e.clientX, e.clientY, false);
    };

    const handleVirtual = (e: Event) => {
      const ev = e as CustomEvent<{ x: number; y: number }>;
      if (ev.detail && typeof ev.detail.x === 'number') {
        handleMove(ev.detail.x, ev.detail.y);
        updateIslandHover(ev.detail.x, ev.detail.y, true);
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('virtual-cursor-move', handleVirtual);
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('virtual-cursor-move', handleVirtual);
    };
  }, [mouseX, mouseY]);

  // Audio Toggle
  const toggleAudio = () => {
    const next = dreamAudio.toggleMute();
    setIsMuted(next);
    if (!next) {
      dreamAudio.playPop();
      dreamAudio.startWorldSkyMusic();
    } else {
      dreamAudio.stopWorldSkyMusic(0.5);
    }
  };

  // Island Click: Zooms into the clicked island then triggers the dedicated transition
  const handleIslandClick = (islandId: 'story' | 'about' | 'works') => {
    if (zoomingIsland || activeTransition) return;
    dreamAudio.playDreamRipple();

    const cluster = clusterRef.current;
    const islandRef = {
      story: storyIslandRef,
      about: aboutIslandRef,
      works: worksIslandRef,
    }[islandId];
    const island = islandRef.current;

    if (cluster && island && cluster.clientWidth > 0 && cluster.clientHeight > 0) {
      const [translateX = '0px', translateY = '0px'] = window
        .getComputedStyle(island)
        .getPropertyValue('translate')
        .trim()
        .split(/\s+/);
      const translateToPixels = (value: string, size: number) => {
        const amount = Number.parseFloat(value);
        if (!Number.isFinite(amount)) return 0;
        return value.endsWith('%') ? (amount / 100) * size : amount;
      };
      const centerX =
        island.offsetLeft +
        island.offsetWidth / 2 +
        translateToPixels(translateX, island.offsetWidth);
      const centerY =
        island.offsetTop +
        island.offsetHeight / 2 +
        translateToPixels(translateY, island.offsetHeight);
      const xPct = Math.max(0, Math.min(100, (centerX / cluster.clientWidth) * 100));
      const yPct = Math.max(0, Math.min(100, (centerY / cluster.clientHeight) * 100));
      setZoomOrigin(`${xPct.toFixed(1)}% ${yPct.toFixed(1)}%`);
    }

    setZoomingIsland(islandId);

    // Zoom dive directly toward clicked island first, then trigger redirecting animation
    setTimeout(() => {
      setActiveTransition(islandId);
    }, 320);
  };

  const handleTransitionComplete = (destination: string) => {
    dreamAudio.stopWorldSkyMusic(0.6);
    navigate(destination);
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#241a15] select-none flex flex-col justify-between touch-none overscroll-none">
      <SEO
        title="Alif's Dream Realm · Story Board"
        description="Explore Alif's 3 connected level islands pinned to the cork notice board: The Story, More About Him, and My Works."
      />

      {/* ── 1. ENTRANCE REVEAL: SOFT CLOUDS PARTING LEFT & RIGHT ── */}
      {isEntering && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 }}
          onAnimationComplete={() => setIsEntering(false)}
          className="fixed inset-0 z-50 pointer-events-none overflow-hidden flex items-center justify-between"
        >
          {/* Left Cloud Bank */}
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

          {/* Right Cloud Bank */}
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

      {/* ── TOP NAVIGATION BAR (Transparent Overlay: "Back" & Sound Only) ─────────────── */}
      <header className="absolute top-0 inset-x-0 z-40 flex items-center justify-between px-4 sm:px-8 pt-3 sm:pt-4 pb-2 pointer-events-none w-full bg-transparent">
        {/* Left: "Back" Button (Magnetic Shimmer Stroke) */}
        <div className="pointer-events-auto">
          <MagneticShimmerButton
            variant="glass"
            size="sm"
            onClick={() => {
              dreamAudio.playPop();
              navigate('/');
            }}
            onMouseEnter={() => dreamAudio.playHover()}
            title="Back to Landing Page"
            aria-label="Back to Landing Page"
            className="px-3.5 sm:px-4 py-1.5 sm:py-2"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-700 group-hover:-translate-x-1 transition-transform" />
            <span className="font-display font-bold text-xs sm:text-sm tracking-wide text-slate-800">
              Back
            </span>
          </MagneticShimmerButton>
        </div>

        {/* Right: Controls (Mobile Cursor Toggle & Audio Mute Button) */}
        <div className="pointer-events-auto flex items-center gap-2">
          <MobileCursorToggleButton />
          <MagneticShimmerButton
            variant="glass"
            size="icon"
            onClick={toggleAudio}
            onMouseEnter={() => dreamAudio.playHover()}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            ) : (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 animate-pulse" />
            )}
          </MagneticShimmerButton>
        </div>
      </header>

      {/* ── UNIFIED 3D STAGE: WOOD BOARD BACKGROUND + ISLANDS HARDLY PINNED TO BOARD ── */}
      {/* Both the board and the islands move together under mouse parallax with slight delay & scaled travel */}
      <div
        className="relative flex-1 w-full h-full flex items-center justify-center overflow-hidden z-10"
        style={{ perspective: '1100px' }}
      >
        <motion.div
          style={{
            x: sceneX,
            y: sceneY,
            rotateX: sceneRotX,
            rotateY: sceneRotY,
            transformStyle: 'preserve-3d',
            scale: 1.09,
          }}
          className="relative w-full h-full flex items-center justify-center will-change-transform"
        >
          {/* ── 2. NEW WOOD BOARD BACKGROUND (Requested image with bleed margins to prevent cutting) ── */}
          <div className="absolute -inset-10 sm:-inset-16 w-[calc(100%+5rem)] sm:w-[calc(100%+8rem)] h-[calc(100%+5rem)] sm:h-[calc(100%+8rem)] pointer-events-none select-none z-0 overflow-hidden">
            <img
              src={bgSrc}
              onError={() => {
                if (bgSrc === WOOD_BOARD_LOCAL_URL) {
                  setBgSrc(WOOD_BOARD_BG_URL);
                } else {
                  setBgSrc(worldBoardBgRemote);
                }
              }}
              alt="Room Cork Notice Board"
              className="w-full h-full object-cover object-center scale-105 transform-gpu"
              style={{ transform: 'translateZ(0px)' }}
            />
            {/* Gentle warm room ambient gradient overlay */}
            <div className="absolute inset-0 bg-amber-950/10 pointer-events-none mix-blend-multiply" />
          </div>

          {/* ── 3. CORK BOARD AREA WITH PINNED LEVEL ISLANDS & NON-STRAIGHT CONNECTING LINE ── */}
          {/*
              The cork inner area on desktop spans:
              left: ~26%, top: ~11%, width: ~52%, height: ~76%
              On mobile/landscape, nicely proportioned across board face.
          */}
          <motion.div
            ref={clusterRef}
            style={{
              transformOrigin: zoomOrigin,
              transform: 'translateZ(26px)', // Firmly anchored with crisp 3D elevation above board
            }}
            animate={
              zoomingIsland
                ? {
                    scale: 3.1,
                  }
                : {
                    scale: 1.0,
                  }
            }
            transition={
              zoomingIsland
                ? {
                    scale: { duration: 0.52, ease: [0.35, 0, 0.65, 0] },
                  }
                : {
                    duration: 0.3,
                  }
            }
            className="absolute left-[26%] top-[11.5%] w-[51%] h-[74%] min-w-[280px] pointer-events-auto z-20 flex items-center justify-center"
          >
            {/* ── NON-STRAIGHT LIGHT WOOD STORY LEVEL CONNECTING PATH ── */}
            {/* Sequence: Level 1 (The Story, top-center) -> Level 2 (About Me, mid-right) -> Level 3 (My Works, bottom-left) */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <filter id="woodShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="1.2" stdDeviation="0.8" floodColor="#2e1808" floodOpacity="0.7" />
                </filter>
              </defs>

              {/* Segment 1: Story (X=40, Y=24) -> About Me (X=78, Y=46) */}
              {/* Whimsical curving path in authentic light wood tone */}
              <path
                d="M 40 24 C 56 18, 68 30, 78 46"
                fill="none"
                stroke="#e8c39e"
                strokeWidth="0.95"
                strokeLinecap="round"
                strokeDasharray="2.8 2.2"
                filter="url(#woodShadow)"
                opacity="0.95"
              />

              {/* Segment 2: About Me (X=78, Y=56) -> My Works (X=24, Y=70) */}
              {/* Whimsical curving route across the wooden board */}
              <path
                d="M 76 56 C 70 72, 44 64, 24 70"
                fill="none"
                stroke="#e8c39e"
                strokeWidth="0.95"
                strokeLinecap="round"
                strokeDasharray="2.8 2.2"
                filter="url(#woodShadow)"
                opacity="0.95"
              />

              {/* Level Pushpins on the board marking each station in order */}
              {/* Start: The Story Pin (LVL 1) */}
              <circle cx="40" cy="24" r="1.4" fill="#f43f5e" stroke="#fae8d8" strokeWidth="0.5" filter="url(#woodShadow)" />
              <circle cx="40" cy="24" r="0.6" fill="#881337" />

              {/* Middle: About Me Pin (LVL 2) */}
              <circle cx="78" cy="46" r="1.4" fill="#06b6d4" stroke="#fae8d8" strokeWidth="0.5" filter="url(#woodShadow)" />
              <circle cx="78" cy="46" r="0.6" fill="#164e63" />

              {/* End: My Works Pin (LVL 3) */}
              <circle cx="24" cy="70" r="1.4" fill="#a855f7" stroke="#fae8d8" strokeWidth="0.5" filter="url(#woodShadow)" />
              <circle cx="24" cy="70" r="0.6" fill="#1e1b4b" />
            </svg>

            {/* ══════════════════════════════════════════════════════════════════
                LEVEL 3: "MY WORKS" (Purple Theme · Bottom-Left of board)
                Hardly stuck to board: zero floating animation
                ══════════════════════════════════════════════════════════════════ */}
            <div
              ref={worksIslandRef}
              onClick={() => handleIslandClick('works')}
              onMouseEnter={() => {
                setHoveredIsland('works');
                dreamAudio.playHover();
              }}
              onMouseLeave={() => setHoveredIsland(null)}
              className="absolute left-[4%] bottom-[6%] z-20 cursor-pointer group flex flex-col items-center select-none"
              title="My Works · Click to Explore"
            >
              {/* Stationary firmly stuck container */}
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex flex-col items-center"
              >
                {/* Theme Color Glow (Purple) */}
                <div
                  className={`absolute inset-[-8%] rounded-full bg-purple-500/22 blur-xl pointer-events-none transition-all duration-300 ${
                    hoveredIsland === 'works' ? 'opacity-100 scale-105' : 'opacity-0 scale-95'
                  }`}
                />

                {/* My Works Island Image firmly attached */}
                <img
                  src={islandWorksImg}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/islands/island_works.png';
                  }}
                  alt="My Works Island"
                  className="w-[96px] xs:w-[108px] sm:w-[122px] lg:w-[132px] xl:w-[144px] h-auto object-contain pointer-events-none drop-shadow-[0_10px_16px_rgba(20,10,5,0.7)] select-none"
                />

                {/* Title Text */}
                <motion.span
                  animate={{
                    y: hoveredIsland === 'works' ? -2 : 0,
                    scale: hoveredIsland === 'works' ? 1.05 : 1.0,
                  }}
                  transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                  className="mt-1 font-display font-black text-[10px] sm:text-[11px] lg:text-xs tracking-wider uppercase text-purple-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] group-hover:text-purple-100 transition-colors"
                >
                  My Works
                </motion.span>
              </motion.div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                "THE STORY" (Grand Story Island · Upper Center of board)
                Hardly stuck to board: zero floating animation
                ══════════════════════════════════════════════════════════════════ */}
            <div
              ref={storyIslandRef}
              onClick={() => handleIslandClick('story')}
              onMouseEnter={() => {
                setHoveredIsland('story');
                dreamAudio.playHover();
              }}
              onMouseLeave={() => setHoveredIsland(null)}
              className="absolute left-[38%] top-[2%] max-[900px]:top-[-4%] -translate-x-1/2 z-20 cursor-pointer group flex flex-col items-center select-none"
              title="The Story · Click to Explore"
            >
              {/* Stationary firmly stuck container */}
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex flex-col items-center"
              >
                {/* Theme Color Glow (Rose) */}
                <div
                  className={`absolute inset-[-8%] rounded-full bg-rose-400/22 blur-xl pointer-events-none transition-all duration-300 ${
                    hoveredIsland === 'story' ? 'opacity-100 scale-105' : 'opacity-0 scale-95'
                  }`}
                />

                {/* Story Island Image firmly attached */}
                <img
                  src={islandStoryImg}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/islands/island_story.png';
                  }}
                  alt="The Story Island"
                  className="w-[125px] xs:w-[138px] sm:w-[160px] lg:w-[178px] xl:w-[192px] h-auto object-contain pointer-events-none drop-shadow-[0_12px_20px_rgba(20,10,5,0.75)] select-none"
                />

                {/* Title Text */}
                <motion.span
                  animate={{
                    y: hoveredIsland === 'story' ? -2 : 0,
                    scale: hoveredIsland === 'story' ? 1.05 : 1.0,
                  }}
                  transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                  className="mt-1 font-display font-black text-xs sm:text-sm lg:text-base tracking-wider uppercase text-rose-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] group-hover:text-white transition-colors"
                >
                  The Story
                </motion.span>
              </motion.div>
            </div>

            {/* ══════════════════════════════════════════════════════════════════
                "MORE ABOUT HIM" / "ABOUT ME" (Cyan Theme · Middle-Right of board)
                Hardly stuck to board: zero floating animation
                ══════════════════════════════════════════════════════════════════ */}
            <div
              ref={aboutIslandRef}
              onClick={() => handleIslandClick('about')}
              onMouseEnter={() => {
                setHoveredIsland('about');
                dreamAudio.playHover();
              }}
              onMouseLeave={() => setHoveredIsland(null)}
              className="absolute right-[4%] top-[28%] z-20 cursor-pointer group flex flex-col items-center select-none"
              title="More About Him · Click to Explore"
            >
              {/* Stationary firmly stuck container */}
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative flex flex-col items-center"
              >
                {/* Theme Color Glow (Cyan) */}
                <div
                  className={`absolute inset-[-8%] rounded-full bg-sky-400/22 blur-xl pointer-events-none transition-all duration-300 ${
                    hoveredIsland === 'about' ? 'opacity-100 scale-105' : 'opacity-0 scale-95'
                  }`}
                />

                {/* About Me Island Image firmly attached */}
                <img
                  src={islandAboutImg}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/islands/island_about.png';
                  }}
                  alt="More About Him Island"
                  className="w-[96px] xs:w-[108px] sm:w-[122px] lg:w-[134px] xl:w-[146px] h-auto object-contain pointer-events-none drop-shadow-[0_10px_16px_rgba(20,10,5,0.7)] select-none"
                />

                {/* Title Text */}
                <motion.span
                  animate={{
                    y: hoveredIsland === 'about' ? -2 : 0,
                    scale: hoveredIsland === 'about' ? 1.05 : 1.0,
                  }}
                  transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                  className="mt-1 font-display font-black text-[10px] sm:text-[11px] lg:text-xs tracking-wider uppercase text-cyan-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] group-hover:text-white transition-colors"
                >
                  More About Him
                </motion.span>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── 4. REDIRECTING TRANSITIONS (Starting directly in the World Page) ────── */}
      <StoryCloudCoverTransition
        isActive={activeTransition === 'story'}
        onComplete={() => handleTransitionComplete('/journey')}
      />
      <AboutBubbleCoverTransition
        isActive={activeTransition === 'about'}
        onComplete={() => handleTransitionComplete('/about')}
      />
      <WorksRocketLaunchTransition
        isActive={activeTransition === 'works'}
        onComplete={() => handleTransitionComplete('/explore-works')}
      />

      <CinematicVideoCutscene
        isActive={isCutsceneActive}
        onComplete={() => {
          setHasCutsceneEnded(true);
          setIsEntering(true);
        }}
        shouldPreload
        videoSrc={worldCutsceneUrl}
      />
    </div>
  );
};
