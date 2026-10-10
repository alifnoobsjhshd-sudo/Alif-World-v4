import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { isVirtualCursorEnabled } from './VirtualCursorPad';

interface CursorBubble {
  id: number;
  x: number;
  y: number;
  size: number;
  wobble: number;
}

export const CustomCursor: React.FC = () => {
  const location = useLocation();
  const [hasMouse, setHasMouse] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return !window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(pointer: fine)').matches;
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Responsive screen ratio tracking: outline is visible exclusively on desktop ratios
  const [isDesktopRatio, setIsDesktopRatio] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth >= 1024;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleScreenResize = () => {
      setIsDesktopRatio(window.innerWidth >= 1024);
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
  const isChat = path.startsWith('/chat');

  const canTrackCursor = hasMouse || isVirtualCursorEnabled();

  // ── Hide native cursor in Journey and Space pages where vehicles are active ──
  useEffect(() => {
    if (isJourney || isCosmic) {
      document.body.classList.add('hide-native-cursor');
    } else {
      document.body.classList.remove('hide-native-cursor');
    }
    return () => {
      document.body.classList.remove('hide-native-cursor');
    };
  }, [isJourney, isCosmic]);

  // Pointer capability check
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePointerDetected = (e: MouseEvent | PointerEvent) => {
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
  }, []);

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
      if (typeof e.clientX !== 'number' || isNaN(e.clientX)) return;

      if (mousePos.current.x < 0) {
        // Prevent snapping from top-left corner on first load
        trailPos.current.x = e.clientX;
        trailPos.current.y = e.clientY;
      }

      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      setIsVisible(true);

      const target = (e.target as HTMLElement | null) || (document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null);
      updateHoverState(target);
    };

    // Virtual cursor sync: keeps themed custom cursor perfectly synced with virtual trackpad
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
      setTimeout(() => setIsClicking(false), 220);
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) setIsClicking(true);
    };
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseEnterWindow = () => setIsVisible(true);
    const handleMouseLeaveWindow = (e: MouseEvent) => {
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

      // ── SMOOTH DELAYED LERP FOR CIRCLE OUTLINE (~0.18) ──
      // Chases the cursor with smooth fluid follow delay
      const lerpFactor = isHovering ? 0.22 : 0.18;
      trailPos.current.x += dx * lerpFactor;
      trailPos.current.y += dy * lerpFactor;
      vel.current.x = dx * lerpFactor;
      vel.current.y = dy * lerpFactor;

      // Update immediate dot / pointer (instant, zero delay, follows real mouse directly)
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Update trailing circle outline ring (smooth delayed follow)
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // ── ABOUT ME PAGE: CONTINUOUS BUBBLE STREAM FROM CURSOR ──
      if (isAboutMe && !isHovering && isVisible) {
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
  }, [canTrackCursor, isVisible, isAboutMe, isHovering]);

  // Periodic bubble cleanup
  useEffect(() => {
    if (bubbles.length === 0) return;
    const timer = setTimeout(() => {
      setBubbles((prev) => prev.slice(1));
    }, 750);
    return () => clearTimeout(timer);
  }, [bubbles]);

  if (!canTrackCursor) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[99999] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
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

      {/* ── 2. DELAYED TRAILING CIRCLE OUTLINE (CHASES MOUSE WITH FLUID DELAY) ── */}
      {/* Exclusively visible for desktop screen ratio; strictly hidden for mobile screen ratio */}
      {isDesktopRatio && (
        <div
          ref={ringRef}
          className="fixed top-0 left-0 pointer-events-none will-change-transform hidden lg:block"
          style={{ transform: 'translate3d(-100px, -100px, 0)' }}
        >
          {/* 2A. LANDING: Warm Glass Glowing Ring */}
          {isLanding && (
            <div
              className={`rounded-full transition-all duration-300 ease-out flex items-center justify-center border border-amber-300/80 bg-amber-400/10 backdrop-blur-[2.5px] shadow-[0_0_16px_rgba(251,191,36,0.35),inset_0_0_8px_rgba(255,255,255,0.2)] ${
                isClicking
                  ? 'w-8 h-8 scale-90'
                  : isHovering
                  ? 'w-14 h-14 border-amber-200 bg-amber-400/20 shadow-[0_0_24px_rgba(251,191,36,0.6)]'
                  : 'w-10 h-10'
              }`}
            >
              <div className="w-1 h-1 rounded-full bg-amber-200/60" />
            </div>
          )}

          {/* 2B. WORLD PAGE: Starlight Celestial Ring */}
          {isWorld && (
            <div
              className={`rounded-full transition-all duration-300 ease-out flex items-center justify-center border border-purple-300/80 bg-purple-500/10 backdrop-blur-[2.5px] shadow-[0_0_18px_rgba(168,85,247,0.4),inset_0_0_8px_rgba(255,255,255,0.2)] ${
                isClicking
                  ? 'w-8 h-8 scale-90'
                  : isHovering
                  ? 'w-14 h-14 border-cyan-300 bg-cyan-400/20 shadow-[0_0_26px_rgba(6,182,212,0.55)]'
                  : 'w-10 h-10'
              }`}
            />
          )}

          {/* 2C. JOURNEY PAGE: Dream Sky Blue Ring */}
          {isJourney && (
            <div
              className={`rounded-full transition-all duration-300 ease-out flex items-center justify-center border border-sky-300/85 bg-sky-400/15 backdrop-blur-[2.5px] shadow-[0_0_20px_rgba(56,189,248,0.45)] ${
                isClicking
                  ? 'w-8 h-8 scale-90'
                  : isHovering
                  ? 'w-14 h-14 bg-sky-400/25 border-white shadow-[0_0_28px_rgba(56,189,248,0.7)]'
                  : 'w-11 h-11'
              }`}
            />
          )}

          {/* 2D. ABOUT ME PAGE: Oceanic Bubble Ring */}
          {isAboutMe && (
            <div
              className={`rounded-full transition-all duration-300 ease-out flex items-center justify-center border border-cyan-300/85 bg-cyan-400/15 backdrop-blur-[3px] shadow-[0_0_20px_rgba(6,182,212,0.45),inset_0_0_8px_rgba(255,255,255,0.25)] ${
                isClicking
                  ? 'w-8 h-8 scale-90'
                  : isHovering
                  ? 'w-14 h-14 border-cyan-200 bg-cyan-300/25 shadow-[0_0_28px_rgba(6,182,212,0.7)]'
                  : 'w-10 h-10'
              }`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-cyan-200/50" />
            </div>
          )}

          {/* 2E. SPACE / COSMIC PAGE: Neon Cyan Ring */}
          {isCosmic && (
            <div
              className={`rounded-full transition-all duration-300 ease-out flex items-center justify-center border border-cyan-400/85 bg-cyan-500/15 backdrop-blur-[2.5px] shadow-[0_0_22px_rgba(6,182,212,0.5)] ${
                isClicking
                  ? 'w-8 h-8 scale-90'
                  : isHovering
                  ? 'w-14 h-14 bg-cyan-400/25 border-white shadow-[0_0_30px_rgba(6,182,212,0.8)]'
                  : 'w-11 h-11'
              }`}
            />
          )}

          {/* 2F. CHAT, PROJECTS & OTHER PAGES: Crisp Dual-Tone Ring Visible on Light and Dark */}
          {!isLanding && !isWorld && !isJourney && !isAboutMe && !isCosmic && (
            <div
              className={`rounded-full transition-all duration-300 ease-out flex items-center justify-center border border-sky-500/70 bg-sky-500/10 backdrop-blur-[2px] shadow-[0_0_0_1px_rgba(255,255,255,0.75),0_0_14px_rgba(56,189,248,0.35)] ${
                isClicking
                  ? 'w-8 h-8 scale-90'
                  : isHovering
                  ? 'w-13 h-13 border-sky-400 bg-sky-400/20 shadow-[0_0_0_1.5px_rgba(255,255,255,0.95),0_0_22px_rgba(56,189,248,0.55)]'
                  : 'w-10 h-10'
              }`}
            >
              <div className="w-1 h-1 rounded-full bg-sky-500/40" />
            </div>
          )}
        </div>
      )}

      {/* ── 3. IMMEDIATE CURSOR POINT / THEMED ICONS (FOLLOWS MOUSE WITH 0 DELAY) ── */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform z-10 flex items-center justify-center"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        {/* 3A. JOURNEY PAGE: PAPER AIRPLANE CURSOR ICON */}
        {isJourney ? (
          <div
            className={`transition-transform duration-200 translate-x-[10px] translate-y-[10px] ${
              isClicking ? 'scale-90 rotate-[10deg]' : isHovering ? 'scale-125' : 'scale-100'
            }`}
            style={{ transformOrigin: '2px 2px' }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="drop-shadow-[0_2px_8px_rgba(14,165,233,0.7)]"
            >
              <path
                d="M 22 12 L 2 2 L 12 22 L 14 14 Z"
                fill="#ffffff"
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M 2 2 L 14 14"
                stroke="#0284c7"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        ) : isCosmic ? (
          /* 3B. SPACE / COSMIC PAGE: ROCKET CURSOR ICON */
          <div
            className={`transition-transform duration-200 translate-x-[8px] translate-y-[8px] ${
              isClicking ? 'scale-90 rotate-[-8deg]' : isHovering ? 'scale-125' : 'scale-100'
            }`}
            style={{ transformOrigin: '5px 5px' }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              className="drop-shadow-[0_2px_10px_rgba(6,182,212,0.8)] -rotate-45"
            >
              <path
                d="M12 2C8 4 6 8 6 12L4 14V17L7 16L9 18H12L14 14C14 10 12 6 12 2Z"
                fill="#ffffff"
                stroke="#06b6d4"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M12 2C16 4 18 8 18 12L20 14V17L17 16L15 18H12"
                fill="#e0f2fe"
                stroke="#06b6d4"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="9" r="1.5" fill="#0284c7" />
              <motion.path
                d="M10 18 L12 23 L14 18 Z"
                fill="#f59e0b"
                animate={{ scaleY: [1, 1.4, 0.9, 1] }}
                transition={{ duration: 0.3, repeat: Infinity }}
              />
            </svg>
          </div>
        ) : (
          /* 3C. STANDARD CURSOR CENTER DOT */
          <div
            className={`rounded-full transition-all duration-150 ${
              isLanding
                ? 'w-2 h-2 bg-amber-300 shadow-[0_0_8px_#fde047]'
                : isAboutMe
                ? 'w-2 h-2 bg-cyan-300 shadow-[0_0_8px_#38bdf8]'
                : isWorld
                ? 'w-2 h-2 bg-purple-300 shadow-[0_0_8px_#c084fc]'
                : isChat
                ? 'w-2 h-2 bg-sky-600 shadow-[0_0_6px_rgba(2,132,199,0.7)]'
                : 'w-2 h-2 bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]'
            } ${isClicking ? 'scale-150' : isHovering ? 'scale-75 opacity-70' : 'scale-100'}`}
          />
        )}
      </div>
    </div>
  );
};
