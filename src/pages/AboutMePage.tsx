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
import { MarineBubblesLanding } from '../components/MarineBubblesLanding';
import { MarineDepthHUD } from '../components/MarineDepthHUD';
import { StoryContactModal } from '../components/StoryContactModal';
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
  const [isLoading, setIsLoading] = useState(true);
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
    dreamAudio.startUnderwaterAmbience();

    const resumeAudio = () => {
      dreamAudio.startUnderwaterAmbience();
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
      dreamAudio.stopUnderwaterAmbience(1.5);
    };
  }, []);

  useEffect(() => {
    let lastSwimTime = 0;
    const unsubVel = scrollVelocity.on('change', (v: number) => {
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
      dreamAudio.startUnderwaterAmbience();
    } else {
      dreamAudio.stopUnderwaterAmbience(0.5);
    }
  };

  const handleBack = () => {
    dreamAudio.playPop();
    navigate('/world');
  };

  return (
    <div className="relative w-screen h-screen h-[100dvh] overflow-hidden select-none bg-[#020d1c] font-display text-white">
      <SEO
        title="About Me · Alif's Underwater World"
        description="A cinematic, interactive underwater 3D world where visitors explore Alif's story, skills, and passions through a glowing marine fish."
      />

      {/* ── 0. BUBBLES LANDING TRANSITION ─────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <MarineBubblesLanding
            isActive={isLoading}
            onComplete={() => setIsLoading(false)}
          />
        )}
      </AnimatePresence>

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
              
              {/* Cinematic Scene Card with Ambient Glow */}
              <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_55px_rgba(56,189,248,0.45)] bg-[#021833]/90">
                <img
                  src={scene1Img}
                  alt="About Me Scene - Exact Reference Artwork"
                  className="w-auto h-auto max-h-[70vh] sm:max-h-[74vh] max-w-[92vw] md:max-w-3xl object-contain block"
                />

                {/* Ambient bioluminescent water caustics overlay */}
                <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-gradient-to-t from-[#021833]/60 via-transparent to-cyan-500/10" />

                {/* Interactive Clickable Hotspots on the Wooden Signpost (NO navigation path indicator) */}
                {/* 1. Developer Signboard */}
                <button
                  onClick={() => handleGlideTo(SCENE_2_DEVELOPER)}
                  onMouseEnter={() => dreamAudio.playHover()}
                  className="absolute right-[6%] top-[18%] w-[42%] h-[16%] rounded-xl cursor-pointer hover:bg-cyan-400/15 border-2 border-transparent hover:border-cyan-300/40 transition-all focus:outline-none"
                  title="Glide to Developer"
                  aria-label="Developer Scene"
                />

                {/* 2. Skills Signboard */}
                <button
                  onClick={() => handleGlideTo(SCENE_4_SKILLS)}
                  onMouseEnter={() => dreamAudio.playHover()}
                  className="absolute right-[6%] top-[37%] w-[42%] h-[16%] rounded-xl cursor-pointer hover:bg-cyan-400/15 border-2 border-transparent hover:border-cyan-300/40 transition-all focus:outline-none"
                  title="Glide to Skills"
                  aria-label="Skills Scene"
                />

                {/* 3. Things I Love Signboard */}
                <button
                  onClick={() => handleGlideTo(SCENE_5_THINGSILOVE)}
                  onMouseEnter={() => dreamAudio.playHover()}
                  className="absolute right-[6%] top-[56%] w-[42%] h-[16%] rounded-xl cursor-pointer hover:bg-cyan-400/15 border-2 border-transparent hover:border-cyan-300/40 transition-all focus:outline-none"
                  title="Glide to Things I Love"
                  aria-label="Things I Love Scene"
                />
              </div>

            </div>
          </MarineScene>

          {/* ════════════════════════════════════════════════════════════════════
              SCENE 2 — "I'M A CREATIVE WEB DEVELOPER" (Exact Reference Artwork)
              - Left speech bubble: </> I'm a Creative Web Developer
              - Floating cyan cards:
                • Landing Pages
                • Full Stack Web Apps
                • Mobile Apps
                • Discord Bots / Telegram Bots
                • Currently focusing on Game Development
             ════════════════════════════════════════════════════════════════════ */}
          <MarineScene startDepth={SCENE_2_DEVELOPER} scrollProgress={smoothedDepth}>
            <div className="relative flex flex-col items-center pointer-events-auto select-none">
              
              <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_55px_rgba(56,189,248,0.45)] bg-[#021833]/90">
                <img
                  src={scene2Img}
                  alt="I'm a Creative Web Developer Scene"
                  className="w-auto h-auto max-h-[70vh] sm:max-h-[74vh] max-w-[92vw] md:max-w-3xl object-contain block"
                />

                <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-gradient-to-t from-[#021833]/60 via-transparent to-cyan-500/10" />

                {/* Interactive Clickable Hotspots for Developer Cards with Audio Feedback */}
                {/* 1. Landing Pages */}
                <button
                  onClick={() => dreamAudio.playPop()}
                  onMouseEnter={() => dreamAudio.playHover()}
                  className="absolute left-[38%] top-[37%] w-[19%] h-[16%] rounded-2xl cursor-pointer hover:bg-cyan-400/20 border-2 border-transparent hover:border-cyan-300/60 transition-all focus:outline-none"
                  title="Landing Pages"
                />

                {/* 2. Full Stack Web Apps */}
                <button
                  onClick={() => dreamAudio.playPop()}
                  onMouseEnter={() => dreamAudio.playHover()}
                  className="absolute left-[58%] top-[37%] w-[19%] h-[16%] rounded-2xl cursor-pointer hover:bg-cyan-400/20 border-2 border-transparent hover:border-cyan-300/60 transition-all focus:outline-none"
                  title="Full Stack Web Apps"
                />

                {/* 3. Mobile Apps */}
                <button
                  onClick={() => dreamAudio.playPop()}
                  onMouseEnter={() => dreamAudio.playHover()}
                  className="absolute left-[78%] top-[33%] w-[17%] h-[16%] rounded-2xl cursor-pointer hover:bg-cyan-400/20 border-2 border-transparent hover:border-cyan-300/60 transition-all focus:outline-none"
                  title="Mobile Apps"
                />

                {/* 4. Discord Bots / Telegram Bots */}
                <button
                  onClick={() => dreamAudio.playPop()}
                  onMouseEnter={() => dreamAudio.playHover()}
                  className="absolute left-[68%] top-[51%] w-[27%] h-[16%] rounded-2xl cursor-pointer hover:bg-cyan-400/20 border-2 border-transparent hover:border-cyan-300/60 transition-all focus:outline-none"
                  title="Discord Bots / Telegram Bots"
                />

                {/* 5. Currently focusing on Game Development */}
                <button
                  onClick={() => dreamAudio.playPop()}
                  onMouseEnter={() => dreamAudio.playHover()}
                  className="absolute left-[60%] top-[68%] w-[35%] h-[18%] rounded-full cursor-pointer hover:bg-cyan-400/20 border-2 border-transparent hover:border-cyan-300/60 transition-all focus:outline-none"
                  title="Currently focusing on Game Development"
                />
              </div>

            </div>
          </MarineScene>

          {/* ════════════════════════════════════════════════════════════════════
              SCENE 3 — "MY NAME IS ALIF" (Exact Reference Artwork)
              - Top-left speech bubble: My name is Alif / Full Name: Abdullah Ansari Alif
              - Lower bubble: Born in Bangladesh with flag 🇧🇩
              - Classical underwater palace & stone monument with Bangladesh map
             ════════════════════════════════════════════════════════════════════ */}
          <MarineScene startDepth={SCENE_3_IDENTITY} scrollProgress={smoothedDepth}>
            <div className="relative flex flex-col items-center pointer-events-auto select-none">
              
              <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_55px_rgba(56,189,248,0.45)] bg-[#021833]/90">
                <img
                  src={scene3Img}
                  alt="My name is Alif Scene - Born in Bangladesh"
                  className="w-auto h-auto max-h-[70vh] sm:max-h-[74vh] max-w-[92vw] md:max-w-3xl object-contain block"
                />

                <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-gradient-to-t from-[#021833]/60 via-transparent to-cyan-500/10" />

                {/* Interactive Hotspot: Name Bubble */}
                <button
                  onClick={() => dreamAudio.playPop()}
                  onMouseEnter={() => dreamAudio.playHover()}
                  className="absolute left-[11%] top-[10%] w-[44%] h-[27%] rounded-3xl cursor-pointer hover:bg-cyan-400/15 border-2 border-transparent hover:border-cyan-300/50 transition-all focus:outline-none"
                  title="Abdullah Ansari Alif"
                />

                {/* Interactive Hotspot: Bangladesh Badge */}
                <button
                  onClick={() => dreamAudio.playPop()}
                  onMouseEnter={() => dreamAudio.playHover()}
                  className="absolute left-[14%] top-[39%] w-[36%] h-[15%] rounded-full cursor-pointer hover:bg-cyan-400/15 border-2 border-transparent hover:border-cyan-300/50 transition-all focus:outline-none"
                  title="Born in Bangladesh"
                />
              </div>

            </div>
          </MarineScene>

          {/* ════════════════════════════════════════════════════════════════════
              SCENE 4 — "MY OTHER SKILLS" (Exact Reference Artwork)
              - Top speech bubble: My Other Skills
              - 5 Glowing Skill Cards:
                • Velocity Video Editing
                • Retention Video Editing
                • Storytelling
                • Advance AI Prompting
                • Google & YouTube SEO
             ════════════════════════════════════════════════════════════════════ */}
          <MarineScene startDepth={SCENE_4_SKILLS} scrollProgress={smoothedDepth}>
            <div className="relative flex flex-col items-center pointer-events-auto select-none">
              
              <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_55px_rgba(56,189,248,0.45)] bg-[#021833]/90">
                <img
                  src={scene4Img}
                  alt="My Other Skills Scene"
                  className="w-auto h-auto max-h-[70vh] sm:max-h-[74vh] max-w-[92vw] md:max-w-3xl object-contain block"
                />

                <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-gradient-to-t from-[#021833]/60 via-transparent to-cyan-500/10" />

                {/* 5 Interactive Hotspots for Skills */}
                <button
                  onClick={() => dreamAudio.playPop()}
                  onMouseEnter={() => dreamAudio.playHover()}
                  className="absolute left-[14%] top-[36%] w-[23%] h-[27%] rounded-2xl cursor-pointer hover:bg-cyan-400/20 border-2 border-transparent hover:border-cyan-300/60 transition-all focus:outline-none"
                  title="Velocity Video Editing"
                />
                <button
                  onClick={() => dreamAudio.playPop()}
                  onMouseEnter={() => dreamAudio.playHover()}
                  className="absolute left-[38%] top-[36%] w-[23%] h-[27%] rounded-2xl cursor-pointer hover:bg-cyan-400/20 border-2 border-transparent hover:border-cyan-300/60 transition-all focus:outline-none"
                  title="Retention Video Editing"
                />
                <button
                  onClick={() => dreamAudio.playPop()}
                  onMouseEnter={() => dreamAudio.playHover()}
                  className="absolute left-[62%] top-[36%] w-[23%] h-[27%] rounded-2xl cursor-pointer hover:bg-cyan-400/20 border-2 border-transparent hover:border-cyan-300/60 transition-all focus:outline-none"
                  title="Storytelling"
                />
                <button
                  onClick={() => dreamAudio.playPop()}
                  onMouseEnter={() => dreamAudio.playHover()}
                  className="absolute left-[20%] top-[65%] w-[24%] h-[27%] rounded-2xl cursor-pointer hover:bg-cyan-400/20 border-2 border-transparent hover:border-cyan-300/60 transition-all focus:outline-none"
                  title="Advance AI Prompting"
                />
                <button
                  onClick={() => dreamAudio.playPop()}
                  onMouseEnter={() => dreamAudio.playHover()}
                  className="absolute left-[46%] top-[65%] w-[27%] h-[27%] rounded-2xl cursor-pointer hover:bg-cyan-400/20 border-2 border-transparent hover:border-cyan-300/60 transition-all focus:outline-none"
                  title="Google & YouTube SEO"
                />
              </div>

            </div>
          </MarineScene>

          {/* ════════════════════════════════════════════════════════════════════
              SCENE 5 — "THINGS I LOVE" (Exact Reference Artwork)
              - Top speech bubble: Things I Love
              - 5 Passion Cards:
                • Chess
                • Speed Rubik's Cube
                • Gaming
                • Anime
                • Football
             ════════════════════════════════════════════════════════════════════ */}
          <MarineScene startDepth={SCENE_5_THINGSILOVE} scrollProgress={smoothedDepth}>
            <div className="relative flex flex-col items-center pointer-events-auto select-none">
              
              <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_55px_rgba(56,189,248,0.45)] bg-[#021833]/90">
                <img
                  src={scene5Img}
                  alt="Things I Love Scene"
                  className="w-auto h-auto max-h-[70vh] sm:max-h-[74vh] max-w-[92vw] md:max-w-3xl object-contain block"
                />

                <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-gradient-to-t from-[#021833]/60 via-transparent to-cyan-500/10" />

                {/* 5 Interactive Hotspots for Passions */}
                <button
                  onClick={() => dreamAudio.playPop()}
                  onMouseEnter={() => dreamAudio.playHover()}
                  className="absolute left-[19%] top-[33%] w-[19%] h-[24%] rounded-2xl cursor-pointer hover:bg-cyan-400/20 border-2 border-transparent hover:border-cyan-300/60 transition-all focus:outline-none"
                  title="Chess"
                />
                <button
                  onClick={() => dreamAudio.playPop()}
                  onMouseEnter={() => dreamAudio.playHover()}
                  className="absolute left-[41%] top-[33%] w-[22%] h-[24%] rounded-2xl cursor-pointer hover:bg-cyan-400/20 border-2 border-transparent hover:border-cyan-300/60 transition-all focus:outline-none"
                  title="Speed Rubik's Cube"
                />
                <button
                  onClick={() => dreamAudio.playPop()}
                  onMouseEnter={() => dreamAudio.playHover()}
                  className="absolute left-[65%] top-[33%] w-[19%] h-[24%] rounded-2xl cursor-pointer hover:bg-cyan-400/20 border-2 border-transparent hover:border-cyan-300/60 transition-all focus:outline-none"
                  title="Gaming"
                />
                <button
                  onClick={() => dreamAudio.playPop()}
                  onMouseEnter={() => dreamAudio.playHover()}
                  className="absolute left-[30%] top-[58%] w-[19%] h-[24%] rounded-2xl cursor-pointer hover:bg-cyan-400/20 border-2 border-transparent hover:border-cyan-300/60 transition-all focus:outline-none"
                  title="Anime"
                />
                <button
                  onClick={() => dreamAudio.playPop()}
                  onMouseEnter={() => dreamAudio.playHover()}
                  className="absolute left-[52%] top-[58%] w-[19%] h-[24%] rounded-2xl cursor-pointer hover:bg-cyan-400/20 border-2 border-transparent hover:border-cyan-300/60 transition-all focus:outline-none"
                  title="Football"
                />
              </div>

            </div>
          </MarineScene>

          {/* ════════════════════════════════════════════════════════════════════
              SCENE 6 — "SAME OCEAN... DIFFERENT DREAMS." + ARCH MONUMENT
              - Cursive script: Same ocean... Different dreams.
              - Neon cyan Arch Monument: Crown 👑, Alif, Build, Create, Explore
              - Giant blue whale in sunlit turquoise sea
              - Interactive Swim Back & Get In Touch actions
             ════════════════════════════════════════════════════════════════════ */}
          <MarineScene startDepth={SCENE_6_ENDING} scrollProgress={smoothedDepth}>
            <div className="relative flex flex-col items-center pointer-events-auto select-none">
              
              <div className="relative rounded-[28px] sm:rounded-[36px] overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_55px_rgba(56,189,248,0.45)] bg-[#021833]/90">
                <img
                  src={scene6Img}
                  alt="Same ocean... Different dreams - Alif Monument"
                  className="w-auto h-auto max-h-[70vh] sm:max-h-[74vh] max-w-[92vw] md:max-w-3xl object-contain block"
                />

                <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-gradient-to-t from-[#021833]/60 via-transparent to-cyan-500/10" />

                {/* Interactive Action Buttons over bottom of Scene 6 */}
                <div className="absolute bottom-3 sm:bottom-4 left-2 right-2 sm:left-4 sm:right-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                  <button
                    onClick={() => handleGlideTo(SCENE_1_ABOUT)}
                    onMouseEnter={() => dreamAudio.playHover()}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-[#021833]/90 hover:bg-[#03254c] border border-cyan-400/60 text-cyan-200 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:scale-105"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Swim Back</span>
                  </button>

                  <button
                    onClick={() => {
                      dreamAudio.playPop();
                      navigate('/explore-works');
                    }}
                    onMouseEnter={() => dreamAudio.playHover()}
                    className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(245,158,11,0.6)] hover:brightness-110 transition-all cursor-pointer hover:scale-105"
                  >
                    <Compass className="w-3.5 h-3.5 text-slate-950" />
                    <span>Works</span>
                  </button>

                  <button
                    onClick={() => {
                      dreamAudio.playPop();
                      setIsContactOpen(true);
                    }}
                    onMouseEnter={() => dreamAudio.playHover()}
                    className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-display font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(56,189,248,0.6)] hover:brightness-110 transition-all cursor-pointer hover:scale-105"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-950" />
                    <span>Contact</span>
                  </button>
                </div>
              </div>

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
