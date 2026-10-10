/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import {
  motion,
  animate,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useMotionValueEvent,
} from 'motion/react';
import { Section } from './components/Section';
import { AtmosphericClouds } from './components/AtmosphericClouds';
import { Cloud } from './components/Decorations';
import { SectionPlane } from './components/SectionPlane';
import { ScrollHint } from './components/ScrollHint';
import { PaperAirplane } from './components/PaperAirplane';
import { LoadingScreen } from './components/LoadingScreen';
import { LandingPage } from './pages/LandingPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { SEO } from './components/SEO';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { STORY_SCENES, SCENE_STEP } from './data/storyline';
import { StorySceneView } from './components/StorySceneView';
import { StoryContactModal } from './components/StoryContactModal';
import { JourneyCloudOut } from './components/JourneyCloudOut';
import { RocketLaunchTransition } from './components/RocketLaunchTransition';
import { ExploreWorksPage } from './pages/ExploreWorksPage';
import { WorldPage } from './pages/WorldPage';
import { AboutMePage } from './pages/AboutMePage';
import { NotAvailablePage } from './pages/NotAvailablePage';
import { dreamAudio } from './utils/audio';
import { CustomCursor } from './components/CustomCursor';
import { VirtualCursorPad } from './components/VirtualCursorPad';
import { GlobalChatButton } from './components/GlobalChatButton';

const ChatbotPage = lazy(() => import('./pages/chatbot/ChatbotPage'));

const MAX_DEPTH = (STORY_SCENES.length - 1) * SCENE_STEP; // 15 * 3800 = 57,000

function StorylinePortfolio({ initialLoading }: { initialLoading: boolean }) {
  const navigate = useNavigate();
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isRocketLaunching, setIsRocketLaunching] = useState(false);

  // ── Depth motion value — the "camera Z position" ──────────────────────────
  const depthValue = useMotionValue(0);
  
  // Highly responsive, critically-damped spring: tracks scroll immediately with zero lag or overshoot
  const smoothedDepth = useSpring(depthValue, {
    stiffness: 100,
    damping: 22,
    mass: 0.55,
    restDelta: 0.5,
  });
  
  // Settled velocity for camera tilt and airplane bank without shake
  const depthVelocity = useVelocity(smoothedDepth);

  // ── Active storyline scene tracking ────────────────────────────────────────
  const [activeSection, setActiveSection] = useState(0);

  // ── Continuous Background Soundtrack Lifecycle ─────────────────────────────
  useEffect(() => {
    dreamAudio.startJourneyMusic();
    dreamAudio.setStoryScene(0);

    const handleFirstGesture = () => {
      dreamAudio.startJourneyMusic();
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
    window.addEventListener('pointerdown', handleFirstGesture);
    window.addEventListener('keydown', handleFirstGesture);

    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      dreamAudio.stopJourneyMusic(2.0);
    };
  }, []);

  useMotionValueEvent(smoothedDepth, 'change', (v) => {
    const raw = v / SCENE_STEP;
    const idx = Math.min(Math.max(Math.round(raw), 0), STORY_SCENES.length - 1);
    if (idx !== activeSection) {
      dreamAudio.playSceneTick();
      dreamAudio.setStoryScene(idx);
      setActiveSection(idx);
    }
  });

  // ── World camera motion (Synchronous direct transforms — ZERO spring jitter) ─
  const worldRotateY = useTransform(smoothedDepth, (depth) => {
    return Math.sin((depth / 5200) * Math.PI) * 4.8;
  });
  const worldRotateZ = useTransform(smoothedDepth, (depth) => {
    return Math.sin((depth / 5200) * Math.PI) * -1.8;
  });
  const worldRotateX = useTransform(smoothedDepth, (depth) => {
    return Math.cos((depth / 5200) * Math.PI) * 1.4;
  });

  const smoothCameraVelocity = useSpring(depthVelocity, { stiffness: 100, damping: 22, mass: 0.6 });
  // Base scale of 1.05 ensures 3D tilted edges never pull away from screen corners even during strong rotation
  const worldScale = useTransform(smoothCameraVelocity, [-3000, 0, 3000], [1.07, 1.05, 1.07]);
  const worldTranslateX = useTransform(smoothCameraVelocity, [-2000, 0, 2000], [6, 0, -6]);
  const worldTranslateY = useTransform(smoothCameraVelocity, [-2000, 0, 2000], [3, 0, 3]);

  // ── Dynamic Sky Atmosphere based on storyline chapters ──────────────────────
  const dynamicSkyGradient = useTransform(
    smoothedDepth,
    [
      0,                  // Scene 01: The Beginning (Peaceful sky)
      SCENE_STEP * 4,     // Scene 05: Exploring (Curiosity sky)
      SCENE_STEP * 7,     // Scene 08: Creativity (Vibrant lavender)
      SCENE_STEP * 8.5,   // Entering Storm
      SCENE_STEP * 9,     // Scene 10: The Storm (Dark slate & charcoal)
      SCENE_STEP * 9.7,   // Breaking through storm
      SCENE_STEP * 10,    // Scene 11: Breaking Through (Radiant gold)
      SCENE_STEP * 11,    // Scene 12: The Realization (Orange & purple sunset)
      SCENE_STEP * 12,    // Scene 13: Unforgettable (Luminous twilight)
      SCENE_STEP * 13,    // Scene 14: Still Exploring (Expansive azure)
      SCENE_STEP * 14,    // Scene 15: The Horizon (Golden morning)
      SCENE_STEP * 15,    // Scene 16: The Reveal (Crisp clean sky)
    ],
    [
      'linear-gradient(to bottom, #dbeafe 0%, #f0f9ff 60%, #ffffff 100%)',
      'linear-gradient(to bottom, #bae6fd 0%, #e0f2fe 55%, #ffffff 100%)',
      'linear-gradient(to bottom, #ddd6fe 0%, #ede9fe 50%, #ffffff 100%)',
      'linear-gradient(to bottom, #64748b 0%, #94a3b8 60%, #cbd5e1 100%)',
      'linear-gradient(to bottom, #1e293b 0%, #334155 55%, #475569 100%)',
      'linear-gradient(to bottom, #475569 0%, #94a3b8 40%, #fef3c7 100%)',
      'linear-gradient(to bottom, #fde68a 0%, #fef3c7 45%, #ffffff 100%)',
      'linear-gradient(to bottom, #6b21a8 0%, #c026d3 30%, #f97316 70%, #fef08a 100%)',
      'linear-gradient(to bottom, #4338ca 0%, #6366f1 45%, #f5f3ff 100%)',
      'linear-gradient(to bottom, #0284c7 0%, #38bdf8 55%, #f0f9ff 100%)',
      'linear-gradient(to bottom, #f59e0b 0%, #fbbf24 45%, #fffbeb 100%)',
      'linear-gradient(to bottom, #e0f2fe 0%, #f8fafc 60%, #ffffff 100%)',
    ]
  );


  // ── Constant velocity arrow key navigation between storyline sections ───────
  const arrowAnimRef = useRef<ReturnType<typeof animate> | null>(null);
  const targetDepthRef = useRef<number>(0);

  const stopArrowNav = () => {
    if (arrowAnimRef.current) {
      arrowAnimRef.current.stop();
      arrowAnimRef.current = null;
    }
  };

  // ── Wheel scroll — buttery smooth, bounded, no jumping ─────────────────────
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      stopArrowNav();
      const delta = Math.max(-100, Math.min(100, e.deltaY));
      const next = Math.max(0, Math.min(MAX_DEPTH, depthValue.get() + delta * 9.5));
      depthValue.set(next);
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [depthValue]);

  // ── Touch scroll — responsive & natural inertia ───────────────────────────
  const touchStartY = useRef(0);
  const touchLastY  = useRef(0);
  const touchVelY   = useRef(0);
  const rafId       = useRef<number | null>(null);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      stopArrowNav();
      touchStartY.current = e.touches[0].clientY;
      touchLastY.current  = e.touches[0].clientY;
      touchVelY.current   = 0;
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };

    const onTouchMove = (e: TouchEvent) => {
      stopArrowNav();
      const y     = e.touches[0].clientY;
      const delta = touchLastY.current - y;
      touchVelY.current  = delta;
      touchLastY.current = y;
      const next = Math.max(0, Math.min(MAX_DEPTH, depthValue.get() + delta * 9.0));
      depthValue.set(next);
    };

    const onTouchEnd = () => {
      let vel = touchVelY.current;
      const step = () => {
        if (Math.abs(vel) < 0.2) return;
        const next = Math.max(0, Math.min(MAX_DEPTH, depthValue.get() + vel * 7.5));
        depthValue.set(next);
        vel *= 0.90;
        rafId.current = requestAnimationFrame(step);
      };
      rafId.current = requestAnimationFrame(step);
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove',  onTouchMove,  { passive: false });
    window.addEventListener('touchend',   onTouchEnd,   { passive: true });
    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove',  onTouchMove);
      window.removeEventListener('touchend',   onTouchEnd);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [depthValue]);

  // ── Arrow key navigation (Up/Down) with constant velocity ─────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in forms or if modal/transition is active
      if (isContactOpen || isRocketLaunching) return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      const isDown = e.key === 'ArrowDown' || e.key === 'PageDown';
      const isUp = e.key === 'ArrowUp' || e.key === 'PageUp';

      if (!isDown && !isUp) return;

      e.preventDefault();

      // Cancel any ongoing touch inertia
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }

      const currentD = depthValue.get();
      const isCurrentlyNavigating = arrowAnimRef.current !== null;
      const baseTarget = isCurrentlyNavigating ? targetDepthRef.current : currentD;

      let targetIdx: number;
      if (isDown) {
        // If holding key and current animation still has far to go (> 800 units), let it continue steadily
        if (e.repeat && isCurrentlyNavigating && Math.abs(targetDepthRef.current - currentD) > 800) {
          return;
        }
        const currentBaseIdx = baseTarget / SCENE_STEP;
        targetIdx = Math.min(STORY_SCENES.length - 1, Math.floor(currentBaseIdx + 0.05) + 1);
      } else {
        if (e.repeat && isCurrentlyNavigating && Math.abs(targetDepthRef.current - currentD) > 800) {
          return;
        }
        const currentBaseIdx = baseTarget / SCENE_STEP;
        targetIdx = Math.max(0, Math.ceil(currentBaseIdx - 0.05) - 1);
      }

      const targetDepth = targetIdx * SCENE_STEP;
      const distance = Math.abs(targetDepth - currentD);

      if (distance < 1) return;

      // Constant velocity: 6200 depth units/sec (travel between scenes in ~1.2s)
      const CONSTANT_VELOCITY = 6200;
      const duration = distance / CONSTANT_VELOCITY;

      stopArrowNav();
      targetDepthRef.current = targetDepth;

      arrowAnimRef.current = animate(depthValue, targetDepth, {
        duration,
        ease: 'linear', // Guarantees constant velocity (no acceleration or deceleration curve)
        onComplete: () => {
          arrowAnimRef.current = null;
        },
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopArrowNav();
    };
  }, [depthValue, isContactOpen, isRocketLaunching]);

  return (
    <div className="relative bg-[#f8f8f8] text-gray-800 font-sans selection:bg-blue-100 h-screen h-[100dvh] w-screen overflow-hidden touch-none overscroll-none">
      <SEO 
        title="Alif-World | Alif Portfolio Story Journey (Zenox Portfolio)"
        description="Experience the cinematic sky storyline of Alif (Zenox). Discover the creative milestones, development passion, and interactive frontend works of Alif-World."
        keywords="alif world, alif portfolio, alif work, zenox portfolio, alif story, interactive portfolio, anime web developer, creative web design"
      />
      
      {/* ── Cinematic entrance transition ─────────────────────────────────────── */}
      <motion.div
        animate={{ opacity: initialLoading ? 1 : 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="fixed inset-0 z-[200] pointer-events-none"
      >
        <motion.div
          animate={{ y: initialLoading ? '0%' : '-100%' }}
          transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 0.3 }}
          className="h-1/2 bg-white w-full border-b border-gray-100 flex items-end justify-center pb-24"
        >
          <div className="opacity-20 translate-y-12">
            <Cloud x="20%" y="0" z={0} scale={4} opacity={1} />
            <Cloud x="60%" y="0" z={0} scale={6} opacity={1} />
          </div>
        </motion.div>
        <motion.div
          animate={{ y: initialLoading ? '0%' : '100%' }}
          transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1], delay: 0.3 }}
          className="h-1/2 bg-white w-full border-t border-gray-100 flex items-start justify-center pt-24"
        >
          <div className="opacity-20 -translate-y-12">
            <Cloud x="40%" y="0" z={0} scale={5} opacity={1} />
            <Cloud x="80%" y="0" z={0} scale={7} opacity={1} />
          </div>
        </motion.div>
      </motion.div>

      {/* ── Top Story Navigator with Paper Airplane ─────────────────────────── */}
      <SectionPlane activeSection={activeSection} depthValue={depthValue} />

      {/* ── Dynamic Sky Atmosphere Background ───────────────────────────────── */}
      <motion.div
        className="fixed inset-0 pointer-events-none transition-colors duration-1000 overflow-hidden"
        style={{ background: dynamicSkyGradient }}
      />

      {/* ── Smooth Parallax Atmospheric Clouds & Balloons ───────────────────── */}
      <AtmosphericClouds smoothedDepth={smoothedDepth} />

      {/* ── Main 3-D perspective canvas ─────────────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden z-10"
        style={{ perspective: '900px', perspectiveOrigin: '50% 50%' }}
      >
        <motion.div
          className="relative w-full h-full preserve-3d gpu"
          style={{
            rotateX:    worldRotateX,
            rotateY:    worldRotateY,
            rotateZ:    worldRotateZ,
            scale:      worldScale,
            translateX: worldTranslateX,
            translateY: worldTranslateY,
            transformOrigin: '50% 50%',
            transformStyle: 'preserve-3d',
            willChange: 'transform',
          }}
        >
          {/* ── 16 Storyline Sections in 3D Depth ──────────────────────────── */}
          {STORY_SCENES.map((scene) => (
            <Section
              key={scene.id}
              startDepth={scene.depth}
              scrollProgress={smoothedDepth}
            >
              <StorySceneView
                scene={scene}
                onOpenContact={() => {
                  dreamAudio.playChime();
                  setIsContactOpen(true);
                }}
                onExploreWork={() => {
                  dreamAudio.stopJourneyMusic(0.8);
                  setIsRocketLaunching(true);
                }}
              />
            </Section>
          ))}
        </motion.div>
      </div>

      {/* ── Soft cinematic vignette (Zero corner blanking / flashing on scroll) ─ */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_65%,rgba(0,0,0,0.035)_100%)] z-20" />

      {/* ── 3D Crafted Paper Airplane following the journey ──────────────────── */}
      <PaperAirplane scrollVelocity={depthVelocity} smoothedDepth={smoothedDepth} />

      {/* ── Scroll hint — fades after first scroll ───────────────────────────── */}
      <ScrollHint smoothedDepth={smoothedDepth} />

      {/* ── Interactive Contact Modal ────────────────────────────────────────── */}
      <StoryContactModal 
        isOpen={isContactOpen} 
        onClose={() => {
          dreamAudio.playPop();
          setIsContactOpen(false);
        }} 
      />

      {/* ── Cinematic Cartoon Cloud Out Transition (Dispersing outward to reveal the sky) ── */}
      <JourneyCloudOut />

      {/* ── Cinematic Rocket Launch to Space Transition ── */}
      <RocketLaunchTransition
        isActive={isRocketLaunching}
        onComplete={() => navigate('/explore-works')}
      />

    </div>
  );
}

export default function App() {
  const [initialLoading, setInitialLoading] = useState(true);
  const { pathname } = useLocation();

  return (
    <>
      <CustomCursor />
      <VirtualCursorPad />
      <GlobalChatButton />
      <AnimatePresence>
        {initialLoading && pathname !== '/chat' && (
          <LoadingScreen onComplete={() => setInitialLoading(false)} />
        )}
      </AnimatePresence>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/world" element={<WorldPage />} />
        <Route path="/journey" element={<StorylinePortfolio initialLoading={initialLoading} />} />
        <Route path="/story" element={<StorylinePortfolio initialLoading={initialLoading} />} />
        <Route path="/projects" element={<ProjectsPage initialLoading={initialLoading} />} />
        <Route path="/explore-works" element={<ExploreWorksPage />} />
        <Route path="/explore-work" element={<ExploreWorksPage />} />
        <Route path="/about" element={<AboutMePage />} />
        <Route path="/about-me" element={<AboutMePage />} />
        <Route path="/more-about-him" element={<AboutMePage />} />
        <Route path="/not-available" element={<NotAvailablePage />} />
        <Route path="/unavailable" element={<NotAvailablePage />} />
        <Route
          path="/chat"
          element={(
            <Suspense
              fallback={(
                <div
                  role="status"
                  className="fixed inset-0 z-[120] grid place-items-center bg-[#202c50] px-6 text-center font-display text-sm text-white"
                >
                  Opening Alif’s assistant…
                </div>
              )}
            >
              <ChatbotPage />
            </Suspense>
          )}
        />
      </Routes>
    </>
  );
}
