import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useSpring,
  useMotionValue,
  useVelocity,
  animate,
} from 'motion/react';
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SpaceBackground } from '../components/SpaceBackground';
import { SpaceRocket } from '../components/SpaceRocket';
import { SpaceAvionicsHUD, SpaceWaypoint } from '../components/SpaceAvionicsHUD';
import { SpaceSpeedVisualEffects } from '../components/SpaceSpeedVisualEffects';
import { KenoStoreSection } from '../components/space-projects/KenoStoreSection';
import { CosSection } from '../components/space-projects/CosSection';
import { CosmicTiersSection } from '../components/space-projects/CosmicTiersSection';
import { OtherWebsitesSection } from '../components/space-projects/OtherWebsitesSection';
import { Section } from '../components/Section';
import { SEO } from '../components/SEO';
import { dreamAudio } from '../utils/audio';
import { MagneticShimmerButton } from '../components/MagneticShimmerButton';

const MAX_SPACE_DEPTH = 36000;
const KENO_STORE_DEPTH = 4500;
const COS_DEPTH = 13500;
const COSMIC_TIERS_DEPTH = 22500;
const OTHER_WEBSITES_DEPTH = 31500;

const SPACE_WAYPOINTS: SpaceWaypoint[] = [
  { id: 'keno', name: 'Keno Store', shortName: '1. KENO', depth: KENO_STORE_DEPTH },
  { id: 'cos', name: 'Cos Bot', shortName: '2. COS', depth: COS_DEPTH },
  { id: 'cosmic', name: 'CosmicTiers', shortName: '3. COSMIC', depth: COSMIC_TIERS_DEPTH },
  { id: 'other', name: 'Web Archive', shortName: '4. WEB ARCHIVE', depth: OTHER_WEBSITES_DEPTH },
];

interface SpaceRipple {
  id: number;
  x: number;
  y: number;
}

export const ExploreWorksPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(dreamAudio.isMuted);
  const [ripples, setRipples] = useState<SpaceRipple[]>([]);
  const [isSpeedEffectActive, setIsSpeedEffectActive] = useState(false);
  const [speedDirection, setSpeedDirection] = useState<'forward' | 'backward'>('forward');
  const [isReverseActive, setIsReverseActive] = useState(false);

  // Speed effect refs for forward scroll detection and fast scroll
  const isSpeedEffectActiveRef = useRef(false);
  const speedDeactivateTimeout = useRef<NodeJS.Timeout | null>(null);
  const reverseRafRef = useRef<number | null>(null);
  const reverseStartTimeRef = useRef<number>(0);

  // ── Scroll Depth (Driven by wheel & touch, smoothed via physics spring) ──────
  const depthValue = useMotionValue(0);
  const smoothedDepth = useSpring(depthValue, {
    damping: 26,
    stiffness: 85,
    mass: 0.8,
  });
  const scrollVelocity = useVelocity(smoothedDepth);

  // Touch scroll references (track both X and Y for straightness detection)
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // ── Automatic Cosmic Theme Audio (Plays automatically regardless of scroll) ──
  useEffect(() => {
    // Start deep ethereal space ambient soundscape immediately
    dreamAudio.startSpaceAmbientMusic();

    // Auto-resume audio context on user's first touch/gesture if browser autoplay was suspended
    const unlockAudio = () => {
      dreamAudio.startSpaceAmbientMusic();
    };
    window.addEventListener('pointerdown', unlockAudio, { once: true });
    window.addEventListener('touchstart', unlockAudio, { once: true });
    window.addEventListener('wheel', unlockAudio, { once: true });
    window.addEventListener('keydown', unlockAudio, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('wheel', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      dreamAudio.stopSpaceAmbientMusic(1.5);
    };
  }, []);

  // ── Dynamic Rocket Thrusters Sound & Sector Waypoint Audio ──────────────────
  useEffect(() => {
    let lastThrustTime = 0;
    const unsubVel = scrollVelocity.on('change', (v) => {
      const now = Date.now();
      if (Math.abs(v) > 28 && now - lastThrustTime > 200) {
        lastThrustTime = now;
        dreamAudio.playRocketFireblast(Math.min(2.0, Math.abs(v) / 70));
      }
    });

    const passedSectors = new Set<string>();
    const unsubDepth = smoothedDepth.on('change', (d) => {
      SPACE_WAYPOINTS.forEach((wp) => {
        if (Math.abs(d - wp.depth) < 140) {
          if (!passedSectors.has(wp.id)) {
            passedSectors.add(wp.id);
            dreamAudio.playSpaceSectorPing();
          }
        } else if (Math.abs(d - wp.depth) > 350) {
          passedSectors.delete(wp.id);
        }
      });
    });

    return () => {
      unsubVel();
      unsubDepth();
    };
  }, [scrollVelocity, smoothedDepth]);

  // ── Wheel, Touch & Keyboard Listeners ───────────────────────────────────────
  useEffect(() => {
    const activateSpeedBoost = () => {
      setSpeedDirection('forward');
      if (!isSpeedEffectActiveRef.current) {
        isSpeedEffectActiveRef.current = true;
        setIsSpeedEffectActive(true);
        dreamAudio.startRocketSpeedSound();
      }
      if (speedDeactivateTimeout.current) clearTimeout(speedDeactivateTimeout.current);
      speedDeactivateTimeout.current = setTimeout(() => {
        isSpeedEffectActiveRef.current = false;
        setIsSpeedEffectActive(false);
        dreamAudio.stopRocketSpeedSound();
      }, 450);
    };

    const cancelSpeedBoost = () => {
      if (speedDeactivateTimeout.current) clearTimeout(speedDeactivateTimeout.current);
      isSpeedEffectActiveRef.current = false;
      setIsSpeedEffectActive(false);
      dreamAudio.stopRocketSpeedSound();
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const deltaY = e.deltaY;

      // Straight forward scroll (even a short flick, without needing to hold)
      if (deltaY > 6) {
        activateSpeedBoost();
      } else if (deltaY < -6) {
        cancelSpeedBoost();
      }

      // Fast forward scroll when boosting, and increased backwards movement scrolling fast (not too much)
      let multiplier = 7.0;
      if (deltaY > 0) {
        multiplier = isSpeedEffectActiveRef.current ? 15.0 : 7.0;
      } else if (deltaY < 0) {
        multiplier = 10.5; // Increased backward speed ("not to much")
      }

      const delta = Math.max(-100, Math.min(100, deltaY));
      const current = depthValue.get();
      const next = Math.max(0, Math.min(MAX_SPACE_DEPTH, current + delta * multiplier));
      depthValue.set(next);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        activateSpeedBoost();
        const step = isSpeedEffectActiveRef.current ? 950 : 550;
        depthValue.set(Math.min(MAX_SPACE_DEPTH, depthValue.get() + step));
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        cancelSpeedBoost();
        // Faster backwards movement (750 vs 450)
        depthValue.set(Math.max(0, depthValue.get() - 750));
      } else if (e.key === 'Home' || e.key === '0') {
        e.preventDefault();
        handleWarpJump(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        depthValue.set(MAX_SPACE_DEPTH);
      } else if (e.key === '1') {
        handleWarpJump(KENO_STORE_DEPTH);
      } else if (e.key === '2') {
        handleWarpJump(COS_DEPTH);
      } else if (e.key === '3') {
        handleWarpJump(COSMIC_TIERS_DEPTH);
      } else if (e.key === '4') {
        handleWarpJump(OTHER_WEBSITES_DEPTH);
      } else if (e.key === 'Escape' || e.key === 'Backspace') {
        handleBack();
      } else if (e.key.toLowerCase() === 'w' || e.key.toLowerCase() === 'j') {
        const cur = depthValue.get();
        const nextWp = SPACE_WAYPOINTS.find((wp) => wp.depth > cur + 100);
        if (nextWp) {
          handleWarpJump(nextWp.depth);
        } else {
          handleWarpJump(0);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY.current === null || touchStartX.current === null) return;
      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const touchDeltaY = touchStartY.current - currentY;
      const touchDeltaX = Math.abs(currentX - touchStartX.current);
      touchStartY.current = currentY;

      // Straight forward scroll (even a short flick, without holding)
      // Checks that vertical movement is straight and not a simple tap
      if (touchDeltaY > 6 && touchDeltaY >= touchDeltaX * 0.45) {
        activateSpeedBoost();
      } else if (touchDeltaY < -6) {
        cancelSpeedBoost();
      }

      let multiplier = 5.5;
      if (touchDeltaY > 0) {
        multiplier = isSpeedEffectActiveRef.current ? 12.0 : 5.5;
      } else if (touchDeltaY < 0) {
        multiplier = 9.0; // Increased backward speed on touch
      }

      const current = depthValue.get();
      depthValue.set(Math.max(0, Math.min(MAX_SPACE_DEPTH, current + touchDeltaY * multiplier)));
    };

    const handleTouchEnd = () => {
      touchStartX.current = null;
      touchStartY.current = null;
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      if (speedDeactivateTimeout.current) clearTimeout(speedDeactivateTimeout.current);
      if (reverseRafRef.current) cancelAnimationFrame(reverseRafRef.current);
      dreamAudio.stopRocketSpeedSound();
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [depthValue]);

  const toggleAudio = () => {
    const next = dreamAudio.toggleMute();
    setIsMuted(next);
  };

  // ── Reverse Warp Button Handlers ("↓" Button) ──────────────────────────────
  const handleReverseStart = () => {
    setIsReverseActive(true);
    setSpeedDirection('backward');
    isSpeedEffectActiveRef.current = true;
    setIsSpeedEffectActive(true);
    dreamAudio.startRocketSpeedSound();
    reverseStartTimeRef.current = Date.now();

    if (speedDeactivateTimeout.current) {
      clearTimeout(speedDeactivateTimeout.current);
      speedDeactivateTimeout.current = null;
    }

    const stepReverse = () => {
      const cur = depthValue.get();
      if (cur > 0) {
        // Ultra-fast backward travel (smoothly ramps from 95 to 160 LY/frame = ~5,700 to 9,600 LY/s)
        const elapsed = (Date.now() - reverseStartTimeRef.current) / 1000;
        const speed = Math.min(160, 95 + elapsed * 90);
        const next = Math.max(0, cur - speed);
        depthValue.set(next);
        reverseRafRef.current = requestAnimationFrame(stepReverse);
      } else {
        handleReverseEnd();
      }
    };

    if (reverseRafRef.current) cancelAnimationFrame(reverseRafRef.current);
    reverseRafRef.current = requestAnimationFrame(stepReverse);
  };

  const handleReverseEnd = () => {
    const duration = Date.now() - reverseStartTimeRef.current;
    if (reverseRafRef.current) {
      cancelAnimationFrame(reverseRafRef.current);
      reverseRafRef.current = null;
    }

    // If it was just a quick click/tap (< 220ms), perform an immediate quick burst backwards (3000 LY)
    if (duration < 220 && depthValue.get() > 0) {
      const cur = depthValue.get();
      const next = Math.max(0, cur - 3000);
      depthValue.set(next);
      setIsReverseActive(false);
      if (speedDeactivateTimeout.current) clearTimeout(speedDeactivateTimeout.current);
      speedDeactivateTimeout.current = setTimeout(() => {
        isSpeedEffectActiveRef.current = false;
        setIsSpeedEffectActive(false);
        dreamAudio.stopRocketSpeedSound();
        setSpeedDirection('forward');
      }, 400);
      return;
    }

    setIsReverseActive(false);
    isSpeedEffectActiveRef.current = false;
    setIsSpeedEffectActive(false);
    dreamAudio.stopRocketSpeedSound();
    setSpeedDirection('forward');
  };

  // ── Bulletproof Navigation Handlers ─────────────────────────────────────────
  const handleBack = () => {
    dreamAudio.playHover();
    dreamAudio.stopSpaceAmbientMusic(0.8);
    navigate('/world');
  };

  const handleGoEarth = () => {
    dreamAudio.playHover();
    dreamAudio.stopSpaceAmbientMusic(0.8);
    navigate('/');
  };

  // ── Interactive Hyperdrive Warp Jump ────────────────────────────────────────
  const handleWarpJump = (target: number, isForward: boolean = true) => {
    if (isForward) {
      // Activate speed visual effects & the continuous rocket engine sound
      setSpeedDirection('forward');
      isSpeedEffectActiveRef.current = true;
      setIsSpeedEffectActive(true);
      dreamAudio.startRocketSpeedSound();
      if (speedDeactivateTimeout.current) clearTimeout(speedDeactivateTimeout.current);
      speedDeactivateTimeout.current = setTimeout(() => {
        isSpeedEffectActiveRef.current = false;
        setIsSpeedEffectActive(false);
        dreamAudio.stopRocketSpeedSound();
      }, 1000);
    } else {
      dreamAudio.playWarpJumpSound();
    }
    animate(depthValue, target, {
      duration: 1.25,
      ease: [0.16, 1, 0.3, 1],
    });
  };

  // ── Interactive Gravitational Wave Ripple on Space Canvas Click ─────────────
  const handleSpaceClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input')) return;
    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev.slice(-3), { id, x: e.clientX, y: e.clientY }]);
    dreamAudio.playGravitationalPulse();
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 900);
  };

  return (
    <div
      onClick={handleSpaceClick}
      className="relative w-screen h-screen h-[100dvh] overflow-hidden bg-[#030718] text-white font-display select-none touch-none overscroll-none"
    >
      <SEO
        title="Explore Works | Alif World &amp; Projects (Zenox Portfolio)"
        description="Explore the cosmic sector of Alif World. Navigate through high-impact interactive systems, Keno Store, Cos Bot, and CosmicTiers by Alif (Zenox)."
        keywords="alif work, alif world, alif portfolio, zenox portfolio, cosmic web projects, creative frontend developer, interactive portfolio"
      />

      {/* ── 1. CINEMATIC SPACE BACKDROP (SUBTLE ZOOM OUT ON WARP) ───────── */}
      <motion.div
        animate={{ scale: isSpeedEffectActive ? 0.95 : 1.0 }}
        transition={{ duration: isSpeedEffectActive ? 0.45 : 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 pointer-events-none"
      >
        <SpaceBackground smoothedDepth={smoothedDepth} />
      </motion.div>

      {/* ── 1.5. HYPERSPACE SPEED VISUAL EFFECTS OVERLAY ─────────────────── */}
      <SpaceSpeedVisualEffects isActive={isSpeedEffectActive} direction={speedDirection} />

      {/* ── 2. INTERACTIVE GRAVITATIONAL WAVE RIPPLES ──────────────────────── */}
      {ripples.map((rip) => (
        <div
          key={rip.id}
          className="fixed pointer-events-none z-30 -translate-x-1/2 -translate-y-1/2"
          style={{ left: rip.x, top: rip.y }}
        >
          <motion.div
            initial={{ scale: 0.1, opacity: 0.8 }}
            animate={{ scale: 3.2, opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="w-24 h-24 rounded-full border border-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.7)]"
          />
          <motion.div
            initial={{ scale: 0.1, opacity: 0.5 }}
            animate={{ scale: 2.0, opacity: 0 }}
            transition={{ duration: 0.65, delay: 0.08, ease: 'easeOut' }}
            className="absolute inset-0 w-24 h-24 rounded-full border border-indigo-400"
          />
        </div>
      ))}

      {/* ── 3. AEROSPACE AVIONICS HUD & REVERSE WARP CONTROL ─────────────── */}
      <SpaceAvionicsHUD
        depthValue={depthValue}
        smoothedDepth={smoothedDepth}
        scrollVelocity={scrollVelocity}
        maxDepth={MAX_SPACE_DEPTH}
        waypoints={SPACE_WAYPOINTS}
        onWarpJump={handleWarpJump}
        onReverseStart={handleReverseStart}
        onReverseEnd={handleReverseEnd}
        isReverseActive={isReverseActive}
      />

      {/* ── 5. TOP CONTROLS (BACK & AUDIO TOGGLE) ─────────────────────────── */}
      <header className="fixed top-4 left-4 sm:left-6 right-4 sm:right-6 z-50 flex items-center justify-between pointer-events-none">
        {/* Back Button */}
        <div className="pointer-events-auto">
          <MagneticShimmerButton
            variant="glass"
            size="sm"
            onClick={handleBack}
            onMouseEnter={() => dreamAudio.playHover()}
            title="Return to world page"
            aria-label="Back"
            className="text-slate-200"
          >
            <ArrowLeft className="w-4 h-4 text-sky-400" />
            <span className="tracking-wider text-xs font-mono">Back</span>
          </MagneticShimmerButton>
        </div>

        {/* Center: Branding & Heading (H1) for Search Engines */}
        <div className="pointer-events-auto flex flex-col items-center justify-center">
          <h1 className="text-xs sm:text-sm font-mono tracking-widest uppercase text-cyan-300 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-800 shadow-sm">
            <span>ALIF-WORLD</span>
            <span className="text-[10px] text-slate-400 font-sans tracking-normal bg-slate-900/90 px-1.5 py-0.5 rounded-full border border-slate-700/80 hidden xs:inline-block">
              zenox portfolio
            </span>
          </h1>
          <p className="sr-only">
            Explore Alif World, showcasing interactive web projects, custom frontend works, and portfolio by Alif (Zenox).
          </p>
        </div>

        {/* Audio Mute/Unmute */}
        <div className="pointer-events-auto">
          <MagneticShimmerButton
            variant="glass"
            size="icon"
            onClick={toggleAudio}
            onMouseEnter={() => dreamAudio.playHover()}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-sky-400" />
            )}
          </MagneticShimmerButton>
        </div>
      </header>

      {/* ── 6. 3D PERSPECTIVE STAGE FOR CONTENT (WITH DYNAMIC CAMERA ZOOM OUT) ── */}
      <motion.div
        animate={{ scale: isSpeedEffectActive ? 0.90 : 1.0 }}
        transition={{ duration: isSpeedEffectActive ? 0.45 : 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 pointer-events-none overflow-hidden z-20"
        style={{ perspective: '900px', perspectiveOrigin: '50% 50%' }}
      >
        <div
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Sector 1: Keno Store */}
          <Section startDepth={KENO_STORE_DEPTH} scrollProgress={smoothedDepth}>
            <KenoStoreSection />
          </Section>

          {/* Sector 2: Cos Discord Bot */}
          <Section startDepth={COS_DEPTH} scrollProgress={smoothedDepth}>
            <CosSection />
          </Section>

          {/* Sector 3: CosmicTiers Minecraft Tier List */}
          <Section startDepth={COSMIC_TIERS_DEPTH} scrollProgress={smoothedDepth}>
            <CosmicTiersSection />
          </Section>

          {/* Sector 4: Web Creations & Landings Archive */}
          <Section startDepth={OTHER_WEBSITES_DEPTH} scrollProgress={smoothedDepth}>
            <OtherWebsitesSection />
          </Section>
        </div>
      </motion.div>

      {/* ── 7. 3D ROCKET (THIRD-PERSON CHASE CAM WITH PILOT STEERING & AFTERBURNER) ── */}
      <SpaceRocket scrollVelocity={scrollVelocity} isSpeedEffectActive={isSpeedEffectActive} />

    </div>
  );
};
