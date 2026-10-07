import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Compass, Volume2, VolumeX, Mail } from 'lucide-react';
import { SEO } from '../components/SEO';
import { dreamAudio } from '../utils/audio';
import { CartoonCloudTransition } from '../components/CartoonCloudTransition';
import { StoryContactModal } from '../components/StoryContactModal';
import { MagneticShimmerButton } from '../components/MagneticShimmerButton';
import { LetsDriveButton } from '../components/LetsDriveButton';
import { CursorBackgroundBlurLens } from '../components/CursorBackgroundBlurLens';
import landingBgUser from '../assets/images/landing_bg_user.jpg';
import landingBgMobile from '../assets/images/landing_bg_mobile.jpg';

const BG_IMAGE_DESKTOP_REMOTE = 'https://i.postimg.cc/1t0tnr3J/e57214e0eb264fed91a8928be24ba410.jpg';
const BG_IMAGE_DESKTOP_LOCAL = '/landing-bg-desktop-hd.jpg';

const BG_IMAGE_MOBILE_REMOTE = 'https://i.postimg.cc/Gmkb5r6m/watermarked-img-12159767605815857314-Picsart-Ai-Image-Enhancer.jpg';
const BG_IMAGE_MOBILE_LOCAL = '/landing-bg-mobile.jpg';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileBgSrc, setMobileBgSrc] = useState(landingBgMobile || BG_IMAGE_MOBILE_REMOTE);
  const [desktopBgSrc, setDesktopBgSrc] = useState(landingBgUser || BG_IMAGE_DESKTOP_LOCAL);
  const [isZooming, setIsZooming] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isHoveringStory, setIsHoveringStory] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);

  // Track desktop breakpoint for dynamic zoom origin and responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Interactive Touch & Mouse Ripple State (Circle outline effect)
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // ── 3D Smooth Parallax Tracking (Driven by continuous cursor movement, active everywhere, no click needed) ──
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Highly responsive, critically-damped spring: tracks mouse smoothly with zero click requirement
  const springX = useSpring(mouseX, { stiffness: 65, damping: 22, mass: 0.5 });
  const springY = useSpring(mouseY, { stiffness: 65, damping: 22, mass: 0.5 });

  // 3D Perspective Tilt and Multi-Plane Parallax Shifts (Active for Desktop):
  const bgX = useTransform(springX, [-1, 1], [32, -32]);
  const bgY = useTransform(springY, [-1, 1], [22, -22]);
  const bgRotY = useTransform(springX, [-1, 1], [-5.2, 5.2]);
  const bgRotX = useTransform(springY, [-1, 1], [4.4, -4.4]);

  // Foreground Dream Cloud & Plane 3D Counter-Parallax (Pop out towards viewer)
  const cloudParallaxX = useTransform(springX, [-1, 1], [-30, 30]);
  const cloudParallaxY = useTransform(springY, [-1, 1], [-20, 20]);
  const cloudRotZ = useTransform(springX, [-1, 1], [-2.5, 2.5]);

  // Atmospheric Cursor Spotlight: Dynamic ambient light follow
  const cursorLightX = useTransform(springX, [-1, 1], [30, 70]);
  const cursorLightY = useTransform(springY, [-1, 1], [25, 75]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse move listener: continuously updates 3D parallax on pointer movement
  useEffect(() => {
    const handlePointerMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      if (!innerWidth || !innerHeight) return;
      const nx = (e.clientX / innerWidth - 0.5) * 2;
      const ny = (e.clientY / innerHeight - 0.5) * 2;
      mouseX.set(nx);
      mouseY.set(ny);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [mouseX, mouseY]);

  // Start gentle sleeping sounds on landing page (boy asleep at study desk)
  useEffect(() => {
    dreamAudio.startSleepingSounds();

    const handleFirstTouch = () => {
      dreamAudio.startSleepingSounds();
      window.removeEventListener('pointerdown', handleFirstTouch);
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('keydown', handleFirstTouch);
    };

    window.addEventListener('pointerdown', handleFirstTouch);
    window.addEventListener('touchstart', handleFirstTouch);
    window.addEventListener('click', handleFirstTouch);
    window.addEventListener('keydown', handleFirstTouch);

    return () => {
      window.removeEventListener('pointerdown', handleFirstTouch);
      window.removeEventListener('touchstart', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
      window.removeEventListener('keydown', handleFirstTouch);
      dreamAudio.stopSleepingSounds(0.8);
    };
  }, []);

  const storyTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (storyTimerRef.current) {
        clearTimeout(storyTimerRef.current);
      }
    };
  }, []);

  const handleStartStory = () => {
    if (isZooming) return;
    setIsZooming(true);
    // Smoothly fade sleeping sounds and play epic sky & cloud whoosh
    dreamAudio.stopSleepingSounds(1.5);
    dreamAudio.playDreamZoom();
    // Start continuous cinematic journey soundtrack early during the dream dive
    dreamAudio.startJourneyMusic();
    dreamAudio.setStoryScene(0);

    // Fallback safety timeout if transition completes or drops
    if (storyTimerRef.current) clearTimeout(storyTimerRef.current);
    storyTimerRef.current = setTimeout(() => {
      navigate('/world');
    }, 4800);
  };

  const toggleAudio = () => {
    const next = dreamAudio.toggleMute();
    setIsMuted(next);
    if (!next) dreamAudio.playPop();
  };

  // ── Touch & Mouse Interactive Dream Ripple (Circle outline with sound) ─────
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only accept primary left mouse click or touch events
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    // Do not trigger background ripple when clicking action buttons
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a') || target.closest('input')) {
      return;
    }
    if (isZooming) return;

    const id = Date.now() + Math.random();
    setRipples((prev) => [...prev.slice(-4), { id, x: e.clientX, y: e.clientY }]);
    dreamAudio.playDreamRipple();

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 950);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className="relative w-screen h-screen h-[100dvh] overflow-hidden select-none bg-[#14151b] flex items-center justify-center cursor-default touch-none overscroll-none"
      style={{ perspective: '1100px', perspectiveOrigin: '50% 50%' }}
    >
      <SEO
        title="Alif-World | Alif Portfolio & Creative Developer (Zenox Portfolio)"
        description="Official creative developer portfolio of Alif (Zenox). Explore Alif World, featured interactive web projects, custom frontend UI/UX designs, and code experiments."
        keywords="alif world, alif portfolio, alif work, zenox portfolio, alif developer, zenox, creative web developer, frontend engineer, ui/ux designer, react developer, interactive portfolio"
      />

      {/* ── AMBIENT BLURRED BACKDROP (Fits all device ratios seamlessly) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src={isDesktop ? desktopBgSrc : mobileBgSrc}
          onError={() => {
            if (isDesktop) setDesktopBgSrc(BG_IMAGE_DESKTOP_REMOTE);
            else setMobileBgSrc(BG_IMAGE_MOBILE_LOCAL);
          }}
          alt="Room Atmosphere"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover scale-125 blur-3xl opacity-75 transform-gpu"
        />
      </div>

      {/* ── CINEMATIC ZOOM CONTAINER (Slowly zooms directly into the character bubbles & dream cloud) ── */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center overflow-hidden z-10"
        style={{
          transformOrigin: isDesktop ? '23% 18%' : '50% 32%', // Focused right at the character's rising dream bubbles
          willChange: 'transform',
          transform: 'translateZ(0)',
        }}
        animate={
          isZooming
            ? {
                scale: 2.8,
                transition: {
                  duration: 4.6,
                  ease: [0.25, 1, 0.35, 1],
                },
              }
            : {
                scale: 1,
                transition: { ease: 'easeOut', duration: 0.3 },
              }
        }
      >
        {/* ── MAIN 3D PARALLAX ROOM CONTAINER (Continuous Mouse Movement Driven) ── */}
        <div className="relative w-full h-full flex items-center justify-center preserve-3d">
          
          {/* Main 3D Scene Layer (Smooth 3D Tilt & Shift driven by continuous Mouse Movement, no click required) */}
          <motion.div
            style={{
              x: bgX,
              y: bgY,
              rotateY: bgRotY,
              rotateX: bgRotX,
              scale: isDesktop ? 1.06 : 1.08,
              transformStyle: 'preserve-3d',
            }}
            className="relative w-full h-full flex items-center justify-center will-change-transform"
          >
            {/* Desktop & Wide Screens: User's Requested High-Definition Background Image */}
            <img
              src={desktopBgSrc}
              onError={() => setDesktopBgSrc(BG_IMAGE_DESKTOP_REMOTE)}
              alt="Guy taking a nap on study table (Desktop)"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center select-none pointer-events-none hidden lg:block contrast-[1.02] saturate-[1.03] transform-gpu"
              style={{ transform: 'translateZ(0px)' }}
            />

            {/* Mobile Fallback: User's Requested Mobile Background */}
            <motion.img
              src={mobileBgSrc}
              onError={() => setMobileBgSrc(BG_IMAGE_MOBILE_REMOTE)}
              alt="Guy taking a nap on study table (Mobile)"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-[52%_48%] select-none pointer-events-none lg:hidden"
              style={{ transform: 'translateZ(0px)' }}
              animate={{
                scale: [1, 1.01, 1],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Localized Cursor Blur Lens (Blurs only background image within distance) */}
            <CursorBackgroundBlurLens />

            {/* ── MIDGROUND LAYER: WARM LAMP GLOW, DUST MOTES ── */}
            <div 
              className="absolute inset-0 pointer-events-none overflow-hidden z-15"
              style={{ transform: 'translateZ(10px)' }}
            >
              {/* WARM AMBIENT DESK LAMP LIGHT PULSE (Mobile only, keeps desktop razor-sharp) */}
              <motion.div
                className="absolute top-[35%] right-[25%] sm:right-[32%] w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-amber-300/20 blur-3xl pointer-events-none lg:hidden"
                animate={{
                  opacity: [0.25, 0.45, 0.25],
                  scale: [0.95, 1.05, 0.95],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* FLOATING SUNBEAMS & DUST MOTES (Living Room Atmosphere) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {[...Array(14)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/70 shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    style={{
                      width: (i % 3) + 2.5,
                      height: (i % 3) + 2.5,
                      top: `${15 + (i * 5.5) % 65}%`,
                      left: `${10 + (i * 6.8) % 80}%`,
                    }}
                    animate={{
                      y: [-12, 12, -12],
                      x: [-8, 8, -8],
                      opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                      duration: 4 + (i % 4),
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: i * 0.35,
                    }}
                  />
                ))}
              </div>
            </div>

            {/* CARTOON "Zzz..." SLEEP PARTICLES RISING FROM SLEEPING GUY'S HEAD */}
            {/* Desktop: perfectly positioned right at character's resting head (X=39.8%, Y=43.2%) */}
            {/* Mobile: centered above character (X=48%, Y=48%) */}
            <div 
              className="absolute left-[48%] sm:left-[51%] lg:left-[39.8%] top-[48%] sm:top-[47%] lg:top-[43.2%] pointer-events-none z-20"
              style={{ transform: 'translateZ(20px)' }}
            >
              {[
                { text: 'Z', size: 'text-2xl sm:text-3xl lg:text-3xl', delay: 0, x: [0, 8, -4] },
                { text: 'z', size: 'text-lg sm:text-xl lg:text-xl', delay: 1.1, x: [0, -6, 6] },
                { text: 'z', size: 'text-sm sm:text-base lg:text-sm', delay: 2.2, x: [0, 6, -6] },
              ].map((z, idx) => (
                <motion.span
                  key={idx}
                  className={`absolute font-display font-black text-white/95 drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)] ${z.size}`}
                  animate={{
                    y: [0, -35, -75],
                    x: z.x,
                    opacity: [0, 0.95, 0],
                    scale: [0.6, 1.1, 0.8],
                    rotate: [-8, 8, -8],
                  }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: z.delay,
                  }}
                >
                  {z.text}
                </motion.span>
              ))}
            </div>

            {/* ── FOREGROUND LAYER: RISING DREAM BUBBLES & MAIN DREAM CLOUD ────── */}
            {/* Desktop: Rising smoothly diagonally UP and LEFT from character's head */}
            {/* Tiny Bubble 1 (Directly touching character's head on desk) */}
            <motion.div
              className="absolute left-[49%] sm:left-[50%] lg:left-[38.2%] top-[47%] sm:top-[46%] lg:top-[41.5%] w-3.5 h-3.5 lg:w-3.5 lg:h-3.5 rounded-full bg-white/85 border border-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.6)] pointer-events-none z-25"
              style={{ willChange: 'transform, opacity', transform: 'translateZ(22px)' }}
              animate={
                isZooming
                  ? { scale: [1, 1.6, 2.5], opacity: [0.85, 1, 0.2] }
                  : { y: [-2, 2, -2], scale: [0.9, 1.1, 0.9] }
              }
              transition={
                isZooming
                  ? { duration: 3.4, ease: 'easeOut' }
                  : { duration: 3, repeat: Infinity, ease: 'easeInOut' }
              }
            />

            {/* Bubble 2 (Small bubble rising up-left towards cloud) */}
            <motion.div
              className="absolute left-[50.5%] sm:left-[51%] lg:left-[35.0%] top-[41%] sm:top-[40%] lg:top-[35.5%] w-6 h-6 lg:w-5 lg:h-5 rounded-full bg-white/85 border-2 border-sky-200 shadow-[0_0_12px_rgba(56,189,248,0.65)] pointer-events-none z-25"
              style={{ willChange: 'transform, opacity', transform: 'translateZ(35px)' }}
              animate={
                isZooming
                  ? { scale: [1, 1.7, 2.9], opacity: [0.85, 1, 0.2] }
                  : { y: [-3, 3, -3], scale: [0.95, 1.1, 0.95], x: [-1.5, 1.5, -1.5] }
              }
              transition={
                isZooming
                  ? { duration: 3.8, delay: 0.2, ease: 'easeOut' }
                  : { duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }
              }
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white absolute top-1 left-1.5 opacity-90" />
            </motion.div>

            {/* Bubble 3 (Medium bubble mid-way between head and cloud) */}
            <motion.div
              className="absolute left-[51.5%] sm:left-[51.8%] lg:left-[31.0%] top-[34%] sm:top-[33%] lg:top-[29.5%] w-9 h-9 lg:w-7 lg:h-7 rounded-full bg-white/90 border-2 border-sky-200 shadow-[0_0_16px_rgba(56,189,248,0.7)] pointer-events-none z-25"
              style={{ willChange: 'transform, opacity', transform: 'translateZ(50px)' }}
              animate={
                isZooming
                  ? { scale: [1, 1.9, 3.4], opacity: [0.9, 1, 0.2] }
                  : { y: [-4, 4, -4], scale: [0.98, 1.06, 0.98], x: [1.5, -1.5, 1.5] }
              }
              transition={
                isZooming
                  ? { duration: 4.2, delay: 0.35, ease: 'easeOut' }
                  : { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }
              }
            >
              <div className="w-2 h-2 rounded-full bg-white absolute top-1.5 left-2 opacity-95" />
            </motion.div>

            {/* Bubble 4 (Desktop connecting bubble right under dream cloud) */}
            <motion.div
              className="hidden lg:block absolute lg:left-[26.8%] lg:top-[24.0%] lg:w-9 lg:h-9 rounded-full bg-white/90 border-2 border-sky-200 shadow-[0_0_18px_rgba(56,189,248,0.75)] pointer-events-none z-25"
              style={{ willChange: 'transform, opacity', transform: 'translateZ(65px)' }}
              animate={
                isZooming
                  ? { scale: [1, 2.1, 3.8], opacity: [0.9, 1, 0.2] }
                  : { y: [-4, 4, -4], scale: [0.98, 1.06, 0.98], x: [-1, 1, -1] }
              }
              transition={
                isZooming
                  ? { duration: 4.5, delay: 0.5, ease: 'easeOut' }
                  : { duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }
              }
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white absolute top-1.5 left-2.5 opacity-95" />
            </motion.div>

            {/* ── MAIN VIBRANT DREAM BUBBLE (To the left & above character on desktop, centered on mobile) ── */}
            <motion.div 
              style={{ 
                x: cloudParallaxX, 
                y: cloudParallaxY,
                transform: 'translateZ(80px)',
              }}
              className="absolute left-1/2 lg:left-[22.5%] top-[24%] sm:top-[22%] lg:top-[17.5%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-30 pointer-events-auto"
            >
              <motion.div
                className="relative w-[270px] xs:w-[310px] sm:w-[380px] md:w-[440px] lg:w-[310px] xl:w-[340px] 2xl:w-[360px] h-[170px] xs:h-[190px] sm:h-[230px] md:h-[260px] lg:h-[180px] xl:h-[195px] 2xl:h-[205px] cursor-pointer"
                onClick={handleStartStory}
                onMouseEnter={() => {
                  setIsHoveringStory(true);
                  dreamAudio.playHover();
                }}
                onMouseLeave={() => setIsHoveringStory(false)}
                animate={
                  isZooming
                    ? {
                        scale: 1.4,
                      }
                    : {
                        y: isHoveringStory ? [-8, 0, -8] : [-5, 5, -5],
                        rotate: isHoveringStory ? [-1, 1, -1] : [-1.2, 1.2, -1.2],
                        scale: isHoveringStory ? 1.04 : 1,
                      }
                }
                transition={
                  isZooming
                    ? { duration: 4.2, ease: 'easeOut' }
                    : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
                }
                style={{ willChange: 'transform', transform: 'translateZ(0)' }}
              >
                {/* Dream Cloud Bubble Body with Liquid Glassmorphism & Glow */}
                <div className="relative w-full h-full rounded-[48px] sm:rounded-[60px] lg:rounded-[42px] xl:rounded-[46px] p-3 sm:p-4 lg:p-2.5 bg-gradient-to-br from-sky-400/90 via-sky-300/85 to-indigo-300/90 backdrop-blur-2xl border-4 lg:border-[3.5px] border-white/95 shadow-[0_15px_45px_rgba(14,165,233,0.45),0_0_25px_rgba(255,255,255,0.7),inset_0_2px_4px_rgba(255,255,255,0.8)] overflow-hidden flex flex-col justify-center items-center group">
                  
                  {/* Glossy top specular light reflection */}
                  <div className="absolute top-2 left-6 right-6 lg:left-4 lg:right-4 h-5 lg:h-3.5 rounded-full bg-white/55 blur-[0.5px] pointer-events-none z-20" />

                  {/* Animated Dream Sky Background Inside Bubble */}
                  <div className="absolute inset-0 bg-gradient-to-b from-[#38bdf8] via-[#7dd3fc] to-[#e0f2fe] opacity-95 pointer-events-none" />

                  {/* Drifting Cartoon Fluffy Clouds inside dream */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none opacity-85"
                    animate={{ x: [-20, 20, -20] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <div className="absolute top-4 lg:top-3 left-6 lg:left-4 w-20 lg:w-14 h-10 lg:h-7 rounded-full bg-white/95 shadow-sm" />
                    <div className="absolute top-2 left-12 lg:left-9 w-14 lg:w-10 h-12 lg:h-9 rounded-full bg-white/95" />
                    <div className="absolute bottom-6 lg:bottom-4 right-8 lg:right-5 w-24 lg:w-16 h-12 lg:h-8 rounded-full bg-white/95 shadow-sm" />
                    <div className="absolute bottom-10 lg:bottom-7 right-14 lg:right-9 w-16 lg:w-11 h-14 lg:h-10 rounded-full bg-white/95" />
                    <div className="absolute top-1/2 left-10 lg:left-7 w-16 lg:w-11 h-8 lg:h-6 rounded-full bg-white/80" />
                  </motion.div>

                  {/* ── FLYING ORIGAMI PAPER AIRPLANE (Pure Hero Animation) ── */}
                  <div className="relative w-full h-full flex items-center justify-center z-10 pointer-events-none">
                    {/* Dashed wind flight trail behind the plane */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60 overflow-visible" viewBox="0 0 300 200">
                      <motion.path
                        d="M 40 130 Q 110 50 160 110 T 260 80"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                        strokeDasharray="6 6"
                        animate={{ strokeDashoffset: [0, -48] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                      />
                    </svg>

                    {/* The Cartoon Paper Airplane */}
                    <motion.div
                      className="absolute z-10"
                      animate={{
                        x: [-32, 40, 10, -25, -32],
                        y: [10, -16, 14, -8, 10],
                        rotate: [8, 20, -10, 10, 8],
                        scale: [0.95, 1.12, 0.92, 1.06, 0.95],
                      }}
                      transition={{
                        duration: 6.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <svg width="68" height="42" viewBox="0 0 56 36" fill="none" className="w-13 sm:w-16 lg:w-11 xl:w-12 h-auto drop-shadow-md">
                        {/* Upper wing fold */}
                        <path d="M54 16 L4 2 L18 16 Z" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.2" />
                        {/* Lower wing fold */}
                        <path d="M54 16 L18 16 L4 30 Z" fill="#f0f9ff" stroke="#60a5fa" strokeWidth="1.2" />
                        {/* Bottom keel */}
                        <path d="M18 16 L22 30 L4 30 Z" fill="#38bdf8" opacity="0.85" />
                        {/* Center spine crease */}
                        <line x1="54" y1="16" x2="18" y2="16" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Bubble Click Ring Highlight on Hover */}
                  <motion.div
                    className="absolute inset-0 rounded-[48px] sm:rounded-[60px] lg:rounded-[42px] xl:rounded-[46px] border-4 lg:border-[3.5px] border-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* ── INTERACTIVE TOUCH & MOUSE DREAM RIPPLES (Circle Outlines) ────────── */}
      {ripples.map((rip) => (
        <div
          key={rip.id}
          className="fixed pointer-events-none z-35 -translate-x-1/2 -translate-y-1/2"
          style={{ left: rip.x, top: rip.y }}
        >
          {/* Central quick soft flash glint */}
          <motion.div
            initial={{ scale: 0.2, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-[0_0_12px_#38bdf8]"
          />

          {/* Primary dream sky circle outline ring */}
          <motion.div
            initial={{ scale: 0.12, opacity: 0.95 }}
            animate={{ scale: 3.2, opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="w-20 sm:w-24 h-20 sm:h-24 rounded-full border-2 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.7),inset_0_0_10px_rgba(255,255,255,0.7)]"
          />

          {/* Secondary warm golden dashed outline ring with gentle spin */}
          <motion.div
            initial={{ scale: 0.12, opacity: 0.85, rotate: 0 }}
            animate={{ scale: 2.2, opacity: 0, rotate: 55 }}
            transition={{ duration: 0.75, delay: 0.05, ease: 'easeOut' }}
            className="absolute inset-0 w-20 sm:w-24 h-20 sm:h-24 rounded-full border-2 border-dashed border-amber-300"
          />

          {/* 4 delicate dream sparklets radiating outward */}
          {[
            { x: 0, y: -36, delay: 0 },
            { x: 36, y: 0, delay: 0.03 },
            { x: 0, y: 36, delay: 0.06 },
            { x: -36, y: 0, delay: 0.09 },
          ].map((sp, idx) => (
            <motion.div
              key={idx}
              initial={{ x: 0, y: 0, scale: 0, opacity: 0.9 }}
              animate={{ x: sp.x, y: sp.y, scale: [0, 1.2, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 0.65, delay: sp.delay, ease: 'easeOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_6px_#fde047]"
            />
          ))}
        </div>
      ))}

      {/* ── CARTOON CLOUD TRANSITION (Billows out when entering dream realm) ── */}
      <CartoonCloudTransition 
        isActive={isZooming} 
        onComplete={() => {
          if (storyTimerRef.current) clearTimeout(storyTimerRef.current);
          navigate('/world');
        }} 
      />

      {/* ── TOP LEFT CONTACT MENU BUTTON (Magnetic Shimmer Stroke) ─────────── */}
      <motion.div
        className="fixed top-[max(0.75rem,env(safe-area-inset-top))] left-[max(0.75rem,env(safe-area-inset-left))] sm:top-5 sm:left-5 md:top-6 md:left-6 z-40"
        animate={isZooming ? { opacity: 0, pointerEvents: 'none' } : { opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <MagneticShimmerButton
          variant="glass"
          size="sm"
          onClick={() => {
            dreamAudio.playPop();
            setIsContactOpen(true);
          }}
          onMouseEnter={() => dreamAudio.playHover()}
          title="Contact Menu (Discord, Email, WhatsApp)"
          aria-label="Open Contact Menu"
          className="px-4 py-2 sm:py-2.5"
        >
          <Mail className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform drop-shadow-sm" />
          <span className="font-display font-bold text-xs sm:text-sm tracking-wide text-slate-800 drop-shadow-sm">
            Contact
          </span>
        </MagneticShimmerButton>
      </motion.div>

      {/* ── TOP RIGHT AUDIO MUTE BUTTON (Magnetic Shimmer Stroke) ──────────── */}
      <motion.div
        className="fixed top-[max(0.75rem,env(safe-area-inset-top))] right-[max(0.75rem,env(safe-area-inset-right))] sm:top-5 sm:right-5 md:top-6 md:right-6 z-40"
        animate={isZooming ? { opacity: 0, pointerEvents: 'none' } : { opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
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
      </motion.div>

      {/* ── CONTACT MODAL (Opens with Discord alifop24_, Email, WhatsApp) ── */}
      <StoryContactModal
        isOpen={isContactOpen}
        onClose={() => {
          dreamAudio.playPop();
          setIsContactOpen(false);
        }}
      />

      {/* ── ACTION BUTTON: Anchored to Right side in Middle Vertically on Desktop, Bottom Center (Lifted up) on Mobile ──────── */}
      <motion.div
        className="fixed bottom-[max(4.75rem,calc(env(safe-area-inset-bottom)+3.2rem))] xs:bottom-18 sm:bottom-22 left-1/2 -translate-x-1/2 lg:bottom-auto lg:left-auto lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0 lg:right-10 xl:right-14 z-30 flex justify-center lg:justify-end items-center bg-transparent pointer-events-auto"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={
          isZooming
            ? { opacity: 0, scale: 0.9, pointerEvents: 'none', transition: { duration: 0.2 } }
            : { opacity: 1, scale: 1, pointerEvents: 'auto', transition: { duration: 0.5, delay: 0.1 } }
        }
      >
        {/* BUTTON: "LET'S DRIVE" WITH CURSOR-FOLLOW GRADIENT OUTLINE & 3D TILT */}
        <LetsDriveButton
          onClick={handleStartStory}
          onMouseEnter={() => {
            setIsHoveringStory(true);
            dreamAudio.playHover();
          }}
          onMouseLeave={() => setIsHoveringStory(false)}
        />
      </motion.div>
    </div>
  );
};
