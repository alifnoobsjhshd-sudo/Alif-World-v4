import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { isVirtualCursorEnabled } from './VirtualCursorPad';
import { useMobileVirtualCursor } from '../context/MobileVirtualCursorContext';

interface CursorBubble {
  id: number;
  x: number;
  y: number;
  size: number;
  wobble: number;
}

export const CustomCursor: React.FC = () => {
  const location = useLocation();
  const { isSupported: isMobileSupported, isCursorOn: isMobileCursorOn, cursorPos: mobileCursorPos } =
    useMobileVirtualCursor();
  const isMobileCursorActive = isMobileSupported && isMobileCursorOn;

  const [hasMouse, setHasMouse] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return !window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(pointer: fine)').matches;
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Responsive screen ratio tracking: cursor is visible exclusively on desktop ratios by default,
  // OR when mobile virtual cursor is explicitly switched ON
  const checkDesktopRatio = () => {
    if (typeof window === 'undefined') return true;
    const isDesktopWidth = window.innerWidth >= 1024;
    const isTouchOnly = window.matchMedia('(pointer: coarse) and not (pointer: fine)').matches;
    return isDesktopWidth && !isTouchOnly;
  };

  const [isDesktopRatio, setIsDesktopRatio] = useState<boolean>(checkDesktopRatio);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleScreenResize = () => {
      setIsDesktopRatio(checkDesktopRatio());
    };
    handleScreenResize();
    window.addEventListener('resize', handleScreenResize, { passive: true });
    window.addEventListener('orientationchange', handleScreenResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleScreenResize);
      window.removeEventListener('orientationchange', handleScreenResize);
    };
  }, []);

  // Real mouse coordinates (instant, 0 delay)
  const mousePos = useRef({ x: -100, y: -100 });
  // Trailing delayed coordinates (smooth interpolated follow)
  const trailPos = useRef({ x: -100, y: -100 });
  // Velocity for dynamic cursor angle / motion
  const vel = useRef({ x: 0, y: 0 });

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // About Me Page cursor bubbles state
  const [bubbles, setBubbles] = useState<CursorBubble[]>([]);
  const bubbleIdCounter = useRef(0);
  const lastBubbleTime = useRef(0);

  // Determine current page theme
  const path = location.pathname.toLowerCase();
  const isLanding = path === '/' || path === '';
  const isAboutMe = path.startsWith('/about') || path.startsWith('/more-about-him');
  const isWorld = path.startsWith('/world');
  const isJourney = path.startsWith('/journey') || path.startsWith('/story');
  const isCosmic = path.startsWith('/explore-work') || path.startsWith('/space');

  const canTrackCursor = hasMouse || isVirtualCursorEnabled() || isMobileCursorActive;

  // Sync position immediately when mobile virtual cursor activates
  useEffect(() => {
    if (isMobileCursorActive) {
      mousePos.current.x = mobileCursorPos.x;
      mousePos.current.y = mobileCursorPos.y;
      trailPos.current.x = mobileCursorPos.x;
      trailPos.current.y = mobileCursorPos.y;
      setIsVisible(true);
    }
  }, [isMobileCursorActive, mobileCursorPos.x, mobileCursorPos.y]);

  // ── Hide native cursor on desktop when custom cursor is active ──
  useEffect(() => {
    if (isDesktopRatio && canTrackCursor) {
      document.body.classList.add('hide-native-cursor');
    } else {
      document.body.classList.remove('hide-native-cursor');
    }
    return () => {
      document.body.classList.remove('hide-native-cursor');
    };
  }, [isDesktopRatio, canTrackCursor]);

  // Pointer capability check
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePointerDetected = (e: MouseEvent | PointerEvent) => {
      if (isMobileCursorActive) return;
      if ((e as PointerEvent).pointerType === 'touch') return;
      setHasMouse(true);
      setIsVisible(true);
    };

    window.addEventListener('pointermove', handlePointerDetected, { passive: true });
    window.addEventListener('mousemove', handlePointerDetected, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerDetected);
      window.removeEventListener('mousemove', handlePointerDetected);
    };
  }, [isMobileCursorActive]);

  useEffect(() => {
    if (!canTrackCursor) return;
    let animId: number;

    const updateHoverState = (target: HTMLElement | null) => {
      if (target) {
        const isInteractive = Boolean(
          target.closest('button') ||
          target.closest('a') ||
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('select') ||
          target.closest('[role="button"]') ||
          target.closest('[role="link"]') ||
          target.closest('.cursor-pointer') ||
          target.closest('summary') ||
          target.closest('[data-hoverable]') ||
          (typeof window !== 'undefined' && window.getComputedStyle(target).cursor === 'pointer')
        );
        setIsHovering(isInteractive);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // When mobile virtual cursor is active, ignore browser mousemove entirely
      // to avoid any tap or gesture anywhere on screen attracting or jumping the cursor!
      if (isMobileCursorActive) return;
      if (typeof e.clientX !== 'number' || isNaN(e.clientX)) return;

      if (mousePos.current.x < 0) {
        trailPos.current.x = e.clientX;
        trailPos.current.y = e.clientY;
      }

      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      setIsVisible(true);

      const target = (e.target as HTMLElement | null) || (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null);
      updateHoverState(target);
    };

    // Virtual cursor sync: keeps themed custom cursor perfectly synced with virtual movement
    const handleVirtualCursorMove = (e: Event) => {
      const ev = e as CustomEvent<{ x: number; y: number; isHovering?: boolean }>;
      if (!ev.detail || typeof ev.detail.x !== 'number') return;
      if (mousePos.current.x < 0) {
        trailPos.current.x = ev.detail.x;
        trailPos.current.y = ev.detail.y;
      }
      mousePos.current.x = ev.detail.x;
      mousePos.current.y = ev.detail.y;
      setIsVisible(true);
      if (typeof ev.detail.isHovering === 'boolean') {
        setIsHovering(ev.detail.isHovering);
      }
    };

    const handleVirtualCursorClick = () => {
      setIsClicking(true);
      setTimeout(() => setIsClicking(false), 240);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) setIsClicking(true);
    };
    const handleMouseUp = () => {
      setTimeout(() => setIsClicking(false), 150);
    };
    const handleMouseEnterWindow = () => setIsVisible(true);
    const handleMouseLeaveWindow = (e: MouseEvent) => {
      if (isMobileCursorActive) return; // Keep visible on mobile
      if (
        e.clientX <= 0 ||
        e.clientX >= window.innerWidth ||
        e.clientY <= 0 ||
        e.clientY >= window.innerHeight
      ) {
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('virtual-cursor-move', handleVirtualCursorMove);
    window.addEventListener('virtual-cursor-click', handleVirtualCursorClick);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnterWindow);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);

    // High performance RAF loop with smooth trailing lerp for the circle outline
    const renderLoop = (time: number) => {
      const dx = mousePos.current.x - trailPos.current.x;
      const dy = mousePos.current.y - trailPos.current.y;

      const lerpFactor = isHovering ? 0.46 : 0.38;
      trailPos.current.x += dx * lerpFactor;
      trailPos.current.y += dy * lerpFactor;
      vel.current.x = dx * lerpFactor;
      vel.current.y = dy * lerpFactor;

      // Update immediate dot / pointer arrow SVG
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-3.5px, -3.5px)`;
      }

      // Update trailing circle outline ring
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // ── ABOUT ME PAGE: CONTINUOUS BUBBLE STREAM FROM CURSOR ──
      if (isAboutMe && !isHovering && (isVisible || isMobileCursorActive)) {
        if (time - lastBubbleTime.current > 110) {
          lastBubbleTime.current = time;
          bubbleIdCounter.current += 1;
          const newBubble: CursorBubble = {
            id: bubbleIdCounter.current,
            x: mousePos.current.x + (Math.random() - 0.5) * 16,
            y: mousePos.current.y + (Math.random() - 0.5) * 16,
            size: Math.random() * 5 + 4,
            wobble: (Math.random() - 0.5) * 24,
          };
          setBubbles((prev) => [...prev.slice(-14), newBubble]);
        }
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('virtual-cursor-move', handleVirtualCursorMove);
      window.removeEventListener('virtual-cursor-click', handleVirtualCursorClick);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
    };
  }, [canTrackCursor, isVisible, isAboutMe, isHovering, isMobileCursorActive]);

  // Periodic bubble cleanup
  useEffect(() => {
    if (bubbles.length === 0) return;
    const timer = setTimeout(() => {
      setBubbles((prev) => prev.slice(1));
    }, 750);
    return () => clearTimeout(timer);
  }, [bubbles]);

  // Visible on desktop ratio OR when mobile virtual cursor is switched ON
  const shouldRender = (canTrackCursor && isDesktopRatio) || isMobileCursorActive;
  if (!shouldRender) return null;

  return (
    <div
      id="custom-cursor-root"
      data-cursor-ignore="true"
      className={`fixed inset-0 pointer-events-none z-[99999] transition-opacity duration-300 ${
        isMobileCursorActive ? 'block' : 'hidden lg:block'
      } ${isVisible || isMobileCursorActive ? 'opacity-100' : 'opacity-0'}`}
      aria-hidden="true"
    >
      {/* ── 1. ABOUT ME PAGE: RISING BUBBLES FROM CURSOR ── */}
      {isAboutMe && !isHovering &&
        bubbles.map((b) => (
          <div
            key={b.id}
            className="fixed pointer-events-none rounded-full border border-white/70 bg-cyan-200/50 shadow-[0_0_8px_rgba(56,189,248,0.85)] animate-cursor-bubble"
            style={{
              left: b.x,
              top: b.y,
              width: `${b.size}px`,
              height: `${b.size}px`,
              transform: 'translate(-50%, -50%)',
              '--wobble-x': `${b.wobble}px`,
            } as React.CSSProperties}
          >
            <div className="absolute top-[20%] left-[25%] w-[30%] h-[30%] rounded-full bg-white/90" />
          </div>
        ))}

      {/* ── 2. TRAILING CIRCLE OUTLINE (CHASES CURSOR WITH GLASSY INSIDE BLUR) ── */}
      {(isDesktopRatio || isMobileCursorActive) && (
        <div
          ref={ringRef}
          className={`fixed top-0 left-0 pointer-events-none will-change-transform ${
            isMobileCursorActive ? 'block' : 'hidden lg:block'
          }`}
          style={{ transform: 'translate3d(-100px, -100px, 0)' }}
        >
          {/* 2A. LANDING: White Glassy Circle Outline with Inside Blur */}
          {isLanding && (
            <div
              className={`rounded-full transition-all duration-200 ease-out flex items-center justify-center border border-white/65 bg-white/[0.08] backdrop-blur-[2.5px] shadow-[0_0_12px_rgba(255,255,255,0.25)] ${
                isClicking
                  ? 'w-8 h-8 scale-90'
                  : isHovering
                  ? 'w-14 h-14 border-white/90 bg-white/[0.16] shadow-[0_0_18px_rgba(255,255,255,0.45)]'
                  : 'w-10 h-10'
              }`}
            />
          )}

          {/* 2B. WORLD PAGE: Blue Glassy Circle Outline with Inside Blur */}
          {isWorld && (
            <div
              className={`rounded-full transition-all duration-200 ease-out flex items-center justify-center border border-blue-400/65 bg-blue-500/[0.08] backdrop-blur-[2.5px] shadow-[0_0_12px_rgba(59,130,246,0.3)] ${
                isClicking
                  ? 'w-8 h-8 scale-90'
                  : isHovering
                  ? 'w-14 h-14 border-blue-300/90 bg-blue-400/[0.18] shadow-[0_0_18px_rgba(59,130,246,0.45)]'
                  : 'w-10 h-10'
              }`}
            />
          )}

          {/* 2C. JOURNEY PAGE: White Glassy Circle Outline with Inside Blur */}
          {isJourney && (
            <div
              className={`rounded-full transition-all duration-200 ease-out flex items-center justify-center border border-white/70 bg-white/[0.08] backdrop-blur-[2.5px] shadow-[0_0_12px_rgba(255,255,255,0.25)] ${
                isClicking
                  ? 'w-8 h-8 scale-90'
                  : isHovering
                  ? 'w-14 h-14 border-white/95 bg-white/[0.16] shadow-[0_0_18px_rgba(255,255,255,0.45)]'
                  : 'w-11 h-11'
              }`}
            />
          )}

          {/* 2D. ABOUT ME PAGE: Green Glassy Circle Outline with Inside Blur */}
          {isAboutMe && (
            <div
              className={`rounded-full transition-all duration-200 ease-out flex items-center justify-center border border-emerald-400/65 bg-emerald-500/[0.08] backdrop-blur-[2.5px] shadow-[0_0_12px_rgba(52,211,153,0.3)] ${
                isClicking
                  ? 'w-8 h-8 scale-90'
                  : isHovering
                  ? 'w-14 h-14 border-emerald-300/90 bg-emerald-400/[0.18] shadow-[0_0_18px_rgba(52,211,153,0.45)]'
                  : 'w-10 h-10'
              }`}
            />
          )}

          {/* 2E. SPACE / COSMIC PAGE: Blue/Cyan Ring with Inside Blur */}
          {isCosmic && (
            <div
              className={`rounded-full transition-all duration-200 ease-out flex items-center justify-center border border-blue-400/65 bg-blue-500/[0.08] backdrop-blur-[2.5px] shadow-[0_0_12px_rgba(59,130,246,0.3)] ${
                isClicking
                  ? 'w-8 h-8 scale-90'
                  : isHovering
                  ? 'w-14 h-14 border-blue-300/90 bg-blue-400/[0.18] shadow-[0_0_18px_rgba(59,130,246,0.45)]'
                  : 'w-11 h-11'
              }`}
            />
          )}

          {/* 2F. OTHER PAGES: White Glassy Ring with Inside Blur */}
          {!isLanding && !isWorld && !isJourney && !isAboutMe && !isCosmic && (
            <div
              className={`rounded-full transition-all duration-200 ease-out flex items-center justify-center border border-white/60 bg-white/[0.08] backdrop-blur-[2.5px] shadow-[0_0_10px_rgba(255,255,255,0.2)] ${
                isClicking
                  ? 'w-8 h-8 scale-90'
                  : isHovering
                  ? 'w-13 h-13 border-white/90 bg-white/[0.16] shadow-[0_0_16px_rgba(255,255,255,0.35)]'
                  : 'w-10 h-10'
              }`}
            />
          )}
        </div>
      )}

      {/* ── 3. IMMEDIATE CURSOR: ARROW SVG WITH LUMINOUS HALO & CLICK RIPPLE ── */}
      {(isDesktopRatio || isMobileCursorActive) && (
        <div
          ref={dotRef}
          className={`fixed top-0 left-0 pointer-events-none will-change-transform z-10 ${
            isMobileCursorActive ? 'block' : 'hidden lg:block'
          }`}
          style={{ transform: 'translate3d(-100px, -100px, 0) translate(-3.5px, -3.5px)' }}
        >
          <div className="relative">
            {/* Luminous Glow Halo behind cursor arrow for high contrast on all scenes */}
            <div className="absolute -inset-1 rounded-full bg-cyan-400/50 blur-[5px]" />

            {/* Main Pointer Arrow SVG */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className={`drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] transition-transform duration-75 ${
                isClicking ? 'scale-90 rotate-[-8deg]' : isHovering ? 'scale-110' : 'scale-100'
              }`}
            >
              <path
                d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                fill="#06b6d4"
                stroke="#ffffff"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
            </svg>

            {/* Click Ripple Indicator Animation */}
            <AnimatePresence>
              {isClicking && (
                <motion.div
                  initial={{ scale: 0.2, opacity: 1 }}
                  animate={{ scale: 3.2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="absolute top-[3.5px] left-[3.5px] -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full border-2 border-cyan-300 bg-cyan-400/40 pointer-events-none"
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};
