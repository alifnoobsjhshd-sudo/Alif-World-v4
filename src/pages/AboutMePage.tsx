import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useSpring,
  useMotionValue,
  useVelocity,
  animate,
} from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  RotateCcw,
  Mail,
  Compass,
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { MarineScene } from '../components/MarineScene';
import { MarineFish } from '../components/MarineFish';
import { MarineBackground } from '../components/MarineBackground';
import { MarineDepthHUD } from '../components/MarineDepthHUD';
import { StoryContactModal } from '../components/StoryContactModal';
import { Interactive3DCard } from '../components/Interactive3DCard';
import { MagneticShimmerButton } from '../components/MagneticShimmerButton';
import { MarineInteractiveHotspot } from '../components/MarineInteractiveHotspot';
import { dreamAudio } from '../utils/audio';

// Exact HD Scene Images matching the Reference Images provided by the user
import scene1Img from '../assets/images/scene-1-hd.jpg';
import scene2Img from '../assets/images/scene-2-hd.jpg';
import scene3Img from '../assets/images/scene-3-hd.jpg';
import scene4Img from '../assets/images/scene-4-hd.jpg';
import scene5Img from '../assets/images/scene-5-hd.jpg';
import scene6Img from '../assets/images/scene-6-hd.jpg';

// ── EXPANDED DEPTH DISTANCES (5,800 units between each of the 6 scenes) ───────
const SCENE_STEP = 5800;
const SCENE_1_ABOUT = 0;
const SCENE_2_DEVELOPER = SCENE_STEP * 1;  // 5,800
const SCENE_3_IDENTITY = SCENE_STEP * 2;   // 11,600
const SCENE_4_SKILLS = SCENE_STEP * 3;     // 17,400
const SCENE_5_THINGSILOVE = SCENE_STEP * 4;// 23,200
const SCENE_6_ENDING = SCENE_STEP * 5;     // 29,000
const MAX_MARINE_DEPTH = SCENE_6_ENDING;

// Scene nodes for sound triggers and audio ticks
const TIMELINE_NODES: Array<{ id: string; label: string; depth: number; icon?: string }> = [
  { id: 'about', label: 'About Me', depth: SCENE_1_ABOUT },
  { id: 'developer', label: 'Developer', depth: SCENE_2_DEVELOPER },
  { id: 'identity', label: 'Identity', depth: SCENE_3_IDENTITY },
  { id: 'skills', label: 'Skills', depth: SCENE_4_SKILLS },
  { id: 'things', label: 'Things I Love', depth: SCENE_5_THINGSILOVE },
  { id: 'end', label: 'End', depth: SCENE_6_ENDING, icon: 'crown' },
];

export const AboutMePage: React.FC = () => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(dreamAudio.isMuted);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // ── Physics-Driven Depth Value & Velocity ─────────────────────────────────
  const depthValue = useMotionValue(0);
  const smoothedDepth = useSpring(depthValue, {
    damping: 26,
    stiffness: 85,
    mass: 0.8,
  });
  const scrollVelocity = useVelocity(smoothedDepth);

  // Touch drag tracking for mobile
  const touchStartY = useRef<number | null>(null);

  // ── Audio Lifecycle & Sound Effects ───────────────────────────────────────
  useEffect(() => {
    // Explicitly guarantee no World Page sky music or space music is playing
    dreamAudio.stopAllNonUnderwaterMusic();
    dreamAudio.startUnderwaterAmbience(false);

    const resumeAudio = () => {
      dreamAudio.stopAllNonUnderwaterMusic();
      dreamAudio.startUnderwaterAmbience(false);
    };
    window.addEventListener('pointerdown', resumeAudio, { once: true });
    window.addEventListener('touchstart', resumeAudio, { once: true });
    window.addEventListener('wheel', resumeAudio, { once: true });
    window.addEventListener('keydown', resumeAudio, { once: true });

    return () => {
      window.removeEventListener('pointerdown', resumeAudio);
      window.removeEventListener('touchstart', resumeAudio);
      window.removeEventListener('wheel', resumeAudio);
      window.removeEventListener('keydown', resumeAudio);
      dreamAudio.stopUnderwaterAmbience(1.2);
      dreamAudio.stopBubbleSounds(0);
    };
  }, []);

  useEffect(() => {
    let lastSwimTime = 0;
    const unsubVel = scrollVelocity.on('change', (v: number) => {
      // Continuous organic water bubble stream for as long as user is scrolling
      dreamAudio.updateScrollingBubbleSound(v);

      const now = Date.now();
      if (Math.abs(v) > 30 && now - lastSwimTime > 340) {
        lastSwimTime = now;
        dreamAudio.playFishTailSwish();
      }
    });

    const passedScenes = new Set<string>();
    const unsubDepth = smoothedDepth.on('change', (d: number) => {
      TIMELINE_NODES.forEach((n) => {
        if (Math.abs(d - n.depth) < 220) {
          if (!passedScenes.has(n.id)) {
            passedScenes.add(n.id);
            dreamAudio.playUnderwaterBubble(1.15);
          }
        } else if (Math.abs(d - n.depth) > 500) {
          passedScenes.delete(n.id);
        }
      });
    });

    return () => {
      unsubVel();
      unsubDepth();
      dreamAudio.stopScrollingBubbleSound();
    };
  }, [scrollVelocity, smoothedDepth]);

  // ── Controls: Wheel, Touch Drag, Keyboard ─────────────────────────────────
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const deltaY = e.deltaY;
      const delta = Math.max(-100, Math.min(100, deltaY));
      const current = depthValue.get();
      depthValue.set(Math.max(0, Math.min(MAX_MARINE_DEPTH, current + delta * 8.5)));
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY.current === null || e.touches.length === 0) return;
      const currentY = e.touches[0].clientY;
      const diffY = touchStartY.current - currentY;
      touchStartY.current = currentY;

      const current = depthValue.get();
      depthValue.set(Math.max(0, Math.min(MAX_MARINE_DEPTH, current + diffY * 11.0)));
    };

    const handleTouchEnd = () => {
      touchStartY.current = null;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const current = depthValue.get();
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ' || e.key === 'ArrowRight') {
        e.preventDefault();
        depthValue.set(Math.min(MAX_MARINE_DEPTH, current + 1800));
        dreamAudio.playFishTailSwish();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        depthValue.set(Math.max(0, current - 1800));
        dreamAudio.playFishTailSwish();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [depthValue]);

  const handleGlideTo = (targetDepth: number) => {
    dreamAudio.playDreamRipple();
    animate(depthValue, targetDepth, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
    });
  };

  const handleToggleAudio = () => {
    const muted = dreamAudio.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      dreamAudio.playPop();
      dreamAudio.startUnderwaterAmbience(false);
    } else {
      dreamAudio.stopUnderwaterAmbience(0.5);
      dreamAudio.stopBubbleSounds(0);
    }
  };

  const handleBack = () => {
    dreamAudio.playPop();
    navigate('/world');
  };

  return (
    <div className="relative w-screen h-screen h-[100dvh] overflow-hidden select-none bg-[#020d1c] font-display text-white touch-none overscroll-none">
      <SEO
        title="About Me · Alif's Underwater World"
        description="A cinematic, interactive underwater 3D world where visitors explore Alif's story, skills, and passions through a glowing marine fish."
      />

      {/* ── 1. CINEMATIC UNDERWATER REALM BACKDROP ─────────────────────────── */}
      <MarineBackground smoothedDepth={smoothedDepth} maxDepth={MAX_MARINE_DEPTH} />

      {/* ── 2. MINIMALIST OCEAN CONTROLS HUD (NO SCENES PATH OR PROGRESS INDICATOR) ── */}
      <MarineDepthHUD
        onBack={handleBack}
        isMuted={isMuted}
        onToggleAudio={handleToggleAudio}
      />

      {/* ── 3. 3D PERSPECTIVE OCEAN STAGE FOR THE 6 SCENES ──────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden z-20"
        style={{ perspective: '950px', perspectiveOrigin: '50% 45%' }}
      >
        <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
          
          {/* ════════════════════════════════════════════════════════════════════
              SCENE 1 — "ABOUT ME" (Exact Reference Design & Layout)
              - Left: "About Me" & "A small fish, with a big dream."
              - Right: Weathered wooden signboard with:
                • Developer (Interactive)
                • Skills (Interactive)
                • Things I Love (Interactive)
              - Navigation path indicator REMOVED completely!
             ════════════════════════════════════════════════════════════════════ */}
          <MarineScene startDepth={SCENE_1_ABOUT} scrollProgress={smoothedDepth}>
            <div className="relative flex flex-col items-center pointer-events-auto select-none">
              
              {/* Cinematic 3D Scene Card with Ambient Glow and Interactive Tilt */}
              <Interactive3DCard maxTilt={8} depthZ={16}>
                <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_55px_rgba(56,189,248,0.45)] bg-[#021833]/90">
                  <img
                    src={scene1Img}
                    alt="About Me Scene - Exact Reference Artwork"
                    className="w-auto h-auto max-h-[70vh] sm:max-h-[74vh] max-w-[92vw] md:max-w-3xl object-contain block"
                  />

                  {/* Ambient bioluminescent water caustics overlay */}
                  <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-gradient-to-t from-[#021833]/60 via-transparent to-cyan-500/10" />

                  {/* Interactive Clickable Hotspots on the Wooden Signpost with Creative Tooltips & Bubbles */}
                  {/* 1. Developer Signboard */}
                  <MarineInteractiveHotspot
                    onClick={() => handleGlideTo(SCENE_2_DEVELOPER)}
                    title="Developer Works"
                    badge="Developer"
                    tagline="Dive into web apps & systems"
                    className="absolute right-[6%] top-[18%] w-[42%] h-[16%]"
                    shape="rounded"
                    tooltipPlacement="top"
                  />

                  {/* 2. Skills Signboard */}
                  <MarineInteractiveHotspot
                    onClick={() => handleGlideTo(SCENE_4_SKILLS)}
                    title="Skills Arsenal"
                    badge="Skills"
                    tagline="Explore technical mastery"
                    className="absolute right-[6%] top-[37%] w-[42%] h-[16%]"
                    shape="rounded"
                    tooltipPlacement="top"
                  />

                  {/* 3. Things I Love Signboard */}
                  <MarineInteractiveHotspot
                    onClick={() => handleGlideTo(SCENE_5_THINGSILOVE)}
                    title="Things I Love"
                    badge="Things I Love"
                    tagline="Discover passions & hobbies"
                    className="absolute right-[6%] top-[56%] w-[42%] h-[16%]"
                    shape="rounded"
                    tooltipPlacement="bottom"
                  />
                </div>
              </Interactive3DCard>

            </div>
          </MarineScene>

          {/* ════════════════════════════════════════════════════════════════════
              SCENE 2 — "I'M A CREATIVE WEB DEVELOPER" (Exact Reference Artwork)
             ════════════════════════════════════════════════════════════════════ */}
          <MarineScene startDepth={SCENE_2_DEVELOPER} scrollProgress={smoothedDepth}>
            <div className="relative flex flex-col items-center pointer-events-auto select-none">
              
              <Interactive3DCard maxTilt={8} depthZ={16}>
                <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_55px_rgba(56,189,248,0.45)] bg-[#021833]/90">
                  <img
                    src={scene2Img}
                    alt="I'm a Creative Web Developer Scene"
                    className="w-auto h-auto max-h-[70vh] sm:max-h-[74vh] max-w-[92vw] md:max-w-3xl object-contain block"
                  />

                  <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-gradient-to-t from-[#021833]/60 via-transparent to-cyan-500/10" />

                  {/* Interactive Hotspots for Developer Cards */}
                  {/* 1. Landing Pages */}
                  <MarineInteractiveHotspot
                    title="Landing Pages"
                    badge="Landing Pages"
                    tagline="High-converting & 3D interactive"
                    className="absolute left-[38%] top-[37%] w-[19%] h-[16%]"
                    shape="rounded"
                    tooltipPlacement="top"
                  />

                  {/* 2. Full Stack Web Apps */}
                  <MarineInteractiveHotspot
                    title="Full Stack Web Apps"
                    badge="Full Stack Web Apps"
                    tagline="React, Node, Express, Databases"
                    className="absolute left-[58%] top-[37%] w-[19%] h-[16%]"
                    shape="rounded"
                    tooltipPlacement="top"
                  />

                  {/* 3. Mobile Apps */}
                  <MarineInteractiveHotspot
                    title="Mobile Apps"
                    badge="Mobile Apps"
                    tagline="Responsive & cross-platform UX"
                    className="absolute left-[78%] top-[33%] w-[17%] h-[16%]"
                    shape="rounded"
                    tooltipPlacement="top"
                  />

                  {/* 4. Discord Bots / Telegram Bots */}
                  <MarineInteractiveHotspot
                    title="Discord & Telegram Bots"
                    badge="Discord & Telegram Bots"
                    tagline="Custom automations & integrations"
                    className="absolute left-[68%] top-[51%] w-[27%] h-[16%]"
                    shape="rounded"
                    tooltipPlacement="bottom"
                  />

                  {/* 5. Currently focusing on Game Development */}
                  <MarineInteractiveHotspot
                    title="Game Development"
                    badge="Game Development"
                    tagline="Three.js, WebGL & Godot Engines"
                    className="absolute left-[60%] top-[68%] w-[35%] h-[18%]"
                    shape="pill"
                    tooltipPlacement="top"
                  />
                </div>
              </Interactive3DCard>

            </div>
          </MarineScene>

          {/* ════════════════════════════════════════════════════════════════════
              SCENE 3 — "MY NAME IS ALIF" (Exact Reference Artwork)
             ════════════════════════════════════════════════════════════════════ */}
          <MarineScene startDepth={SCENE_3_IDENTITY} scrollProgress={smoothedDepth}>
            <div className="relative flex flex-col items-center pointer-events-auto select-none">
              
              <Interactive3DCard maxTilt={8} depthZ={16}>
                <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_55px_rgba(56,189,248,0.45)] bg-[#021833]/90">
                  <img
                    src={scene3Img}
                    alt="My name is Alif Scene - Born in Bangladesh"
                    className="w-auto h-auto max-h-[70vh] sm:max-h-[74vh] max-w-[92vw] md:max-w-3xl object-contain block"
                  />

                  <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-gradient-to-t from-[#021833]/60 via-transparent to-cyan-500/10" />

                  {/* Interactive Hotspot: Name Bubble */}
                  <MarineInteractiveHotspot
                    title="Abdullah Ansari Alif"
                    badge="Abdullah Ansari Alif"
                    tagline="Creative Full-Stack Developer & Designer"
                    className="absolute left-[11%] top-[10%] w-[44%] h-[27%]"
                    shape="card"
                    tooltipPlacement="bottom"
                  />

                  {/* Interactive Hotspot: Bangladesh Badge */}
                  <MarineInteractiveHotspot
                    title="Born in Bangladesh"
                    badge="Born in Bangladesh"
                    tagline="Crafting digital worlds with pride"
                    className="absolute left-[14%] top-[39%] w-[36%] h-[15%]"
                    shape="pill"
                    tooltipPlacement="bottom"
                  />
                </div>
              </Interactive3DCard>

            </div>
          </MarineScene>

          {/* ════════════════════════════════════════════════════════════════════
              SCENE 4 — "MY OTHER SKILLS" (Exact Reference Artwork)
             ════════════════════════════════════════════════════════════════════ */}
          <MarineScene startDepth={SCENE_4_SKILLS} scrollProgress={smoothedDepth}>
            <div className="relative flex flex-col items-center pointer-events-auto select-none">
              
              <Interactive3DCard maxTilt={8} depthZ={16}>
                <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_55px_rgba(56,189,248,0.45)] bg-[#021833]/90">
                  <img
                    src={scene4Img}
                    alt="My Other Skills Scene"
                    className="w-auto h-auto max-h-[70vh] sm:max-h-[74vh] max-w-[92vw] md:max-w-3xl object-contain block"
                  />

                  <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-gradient-to-t from-[#021833]/60 via-transparent to-cyan-500/10" />

                  {/* 5 Interactive Hotspots for Skills */}
                  <MarineInteractiveHotspot
                    title="Velocity Video Editing"
                    badge="Velocity Editing"
                    tagline="Dynamic beat-sync & speed curves"
                    className="absolute left-[14%] top-[36%] w-[23%] h-[27%]"
                    shape="rounded"
                    tooltipPlacement="top"
                  />
                  <MarineInteractiveHotspot
                    title="Retention Video Editing"
                    badge="Retention Editing"
                    tagline="Pacing, hooks & viewer engagement"
                    className="absolute left-[38%] top-[36%] w-[23%] h-[27%]"
                    shape="rounded"
                    tooltipPlacement="top"
                  />
                  <MarineInteractiveHotspot
                    title="Storytelling"
                    badge="Storytelling"
                    tagline="Narrative resonance & emotional craft"
                    className="absolute left-[62%] top-[36%] w-[23%] h-[27%]"
                    shape="rounded"
                    tooltipPlacement="top"
                  />
                  <MarineInteractiveHotspot
                    title="Advance AI Prompting"
                    badge="AI Prompting"
                    tagline="Autonomous workflows & fine-tuning"
                    className="absolute left-[20%] top-[65%] w-[24%] h-[27%]"
                    shape="rounded"
                    tooltipPlacement="bottom"
                  />
                  <MarineInteractiveHotspot
                    title="Google & YouTube SEO"
                    badge="Google & YouTube SEO"
                    tagline="Algorithmic growth & top discovery"
                    className="absolute left-[46%] top-[65%] w-[27%] h-[27%]"
                    shape="rounded"
                    tooltipPlacement="bottom"
                  />
                </div>
              </Interactive3DCard>

            </div>
          </MarineScene>

          {/* ════════════════════════════════════════════════════════════════════
              SCENE 5 — "THINGS I LOVE" (Exact Reference Artwork)
             ════════════════════════════════════════════════════════════════════ */}
          <MarineScene startDepth={SCENE_5_THINGSILOVE} scrollProgress={smoothedDepth}>
            <div className="relative flex flex-col items-center pointer-events-auto select-none">
              
              <Interactive3DCard maxTilt={8} depthZ={16}>
                <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_55px_rgba(56,189,248,0.45)] bg-[#021833]/90">
                  <img
                    src={scene5Img}
                    alt="Things I Love Scene"
                    className="w-auto h-auto max-h-[70vh] sm:max-h-[74vh] max-w-[92vw] md:max-w-3xl object-contain block"
                  />

                  <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-gradient-to-t from-[#021833]/60 via-transparent to-cyan-500/10" />

                  {/* 5 Interactive Hotspots for Passions */}
                  <MarineInteractiveHotspot
                    title="Chess"
                    badge="Chess"
                    tagline="Tactical patience & strategic depth"
                    className="absolute left-[19%] top-[33%] w-[19%] h-[24%]"
                    shape="rounded"
                    tooltipPlacement="top"
                  />
                  <MarineInteractiveHotspot
                    title="Speed Rubik's Cube"
                    badge="Speedcubing"
                    tagline="Sub-15s recognition & muscle memory"
                    className="absolute left-[41%] top-[33%] w-[22%] h-[24%]"
                    shape="rounded"
                    tooltipPlacement="top"
                  />
                  <MarineInteractiveHotspot
                    title="Gaming"
                    badge="Gaming"
                    tagline="Atmospheric worlds & competitive reflex"
                    className="absolute left-[65%] top-[33%] w-[19%] h-[24%]"
                    shape="rounded"
                    tooltipPlacement="top"
                  />
                  <MarineInteractiveHotspot
                    title="Anime"
                    badge="Anime"
                    tagline="Epic storytelling & cinematic direction"
                    className="absolute left-[30%] top-[58%] w-[19%] h-[24%]"
                    shape="rounded"
                    tooltipPlacement="bottom"
                  />
                  <MarineInteractiveHotspot
                    title="Football"
                    badge="Football"
                    tagline="High-intensity team energy & tactics"
                    className="absolute left-[52%] top-[58%] w-[19%] h-[24%]"
                    shape="rounded"
                    tooltipPlacement="bottom"
                  />
                </div>
              </Interactive3DCard>

            </div>
          </MarineScene>

          {/* ════════════════════════════════════════════════════════════════════
              SCENE 6 — "SAME OCEAN... DIFFERENT DREAMS." + ARCH MONUMENT
             ════════════════════════════════════════════════════════════════════ */}
          <MarineScene startDepth={SCENE_6_ENDING} scrollProgress={smoothedDepth}>
            <div className="relative flex flex-col items-center pointer-events-auto select-none">
              
              <Interactive3DCard maxTilt={8} depthZ={16}>
                <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_55px_rgba(56,189,248,0.45)] bg-[#021833]/90">
                  <img
                    src={scene6Img}
                    alt="Same ocean... Different dreams - Alif Monument"
                    className="w-auto h-auto max-h-[70vh] sm:max-h-[74vh] max-w-[92vw] md:max-w-3xl object-contain block"
                  />

                  <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-gradient-to-t from-[#021833]/60 via-transparent to-cyan-500/10" />

                  {/* Interactive Action Buttons over bottom of Scene 6 (Magnetic Shimmer Stroke) */}
                  <div className="absolute bottom-3 sm:bottom-4 left-2 right-2 sm:left-4 sm:right-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                    <MagneticShimmerButton
                      variant="glass"
                      size="sm"
                      onClick={() => handleGlideTo(SCENE_1_ABOUT)}
                      onMouseEnter={() => dreamAudio.playHover()}
                      className="px-3 sm:px-4 py-2 text-xs font-mono uppercase tracking-wider"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Swim Back</span>
                    </MagneticShimmerButton>

                    <MagneticShimmerButton
                      variant="amber"
                      size="sm"
                      onClick={() => {
                        dreamAudio.playPop();
                        navigate('/explore-works');
                      }}
                      onMouseEnter={() => dreamAudio.playHover()}
                      className="px-4 sm:px-5 py-2 text-xs font-display font-black uppercase tracking-wider"
                    >
                      <Compass className="w-3.5 h-3.5 text-slate-950" />
                      <span>Works</span>
                    </MagneticShimmerButton>

                    <MagneticShimmerButton
                      variant="cyan"
                      size="sm"
                      onClick={() => {
                        dreamAudio.playPop();
                        setIsContactOpen(true);
                      }}
                      onMouseEnter={() => dreamAudio.playHover()}
                      className="px-4 sm:px-5 py-2 text-xs font-display font-black uppercase tracking-wider text-slate-950"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-950" />
                      <span>Contact</span>
                    </MagneticShimmerButton>
                  </div>
                </div>
              </Interactive3DCard>

            </div>
          </MarineScene>

        </div>
      </div>

      {/* ── 4. PLAYER-CONTROLLED 3D FISH IN THE BOTTOM OF SCREEN ────────────────── */}
      <MarineFish scrollVelocity={scrollVelocity} smoothedDepth={smoothedDepth} />

      {/* ── 5. INTERACTIVE CONTACT MODAL ────────────────────────────────────────── */}
      <StoryContactModal
        isOpen={isContactOpen}
        onClose={() => {
          dreamAudio.playPop();
          setIsContactOpen(false);
        }}
      />
    </div>
  );
};
