import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface TrailParticle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  scale: number;
}

export const CustomCursor: React.FC = () => {
  const location = useLocation();
  const [hasMouse, setHasMouse] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  
  // Real mouse coordinates
  const mousePos = useRef({ x: -100, y: -100 });
  // Trailing delayed coordinates (interpolated)
  const trailPos = useRef({ x: -100, y: -100 });
  // Velocity for dynamic cursor squish / stretch
  const vel = useRef({ x: 0, y: 0 });

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<TrailParticle[]>([]);
  const particleIdCounter = useRef(0);

  // Determine current page theme for unique styling
  const path = location.pathname.toLowerCase();
  const isLanding = path === '/' || path === '';
  const isWorld = path.startsWith('/world');
  const isJourney = path.startsWith('/journey') || path.startsWith('/story');
  const isCosmic = path.startsWith('/explore-work');
  const isProjects = path.startsWith('/project');

  useEffect(() => {
    // Check if the primary device uses a precise pointing device (mouse or trackpad)
    const mediaQuery = window.matchMedia('(pointer: fine)');
    setHasMouse(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setHasMouse(e.matches);
    };
    mediaQuery.addEventListener('change', handleMediaChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (!hasMouse) return;

    let animId: number;
    let lastSpawnTime = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Check if hovering over clickable or interactive element
      const target = e.target as HTMLElement | null;
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
          target.closest('summary')
        );
        setIsHovering(isInteractive);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseEnterWindow = () => setIsVisible(true);
    const handleMouseLeaveWindow = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnterWindow);
    document.addEventListener('mouseleave', handleMouseLeaveWindow);

    // High performance RAF loop with smooth lerping
    const renderLoop = (time: number) => {
      const dx = mousePos.current.x - trailPos.current.x;
      const dy = mousePos.current.y - trailPos.current.y;

      // Buttery passive delay: lerp factor ~0.16
      trailPos.current.x += dx * 0.16;
      trailPos.current.y += dy * 0.16;
      vel.current.x = dx * 0.16;
      vel.current.y = dy * 0.16;

      const speed = Math.hypot(vel.current.x, vel.current.y);

      // Update immediate dot
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
      }

      // Update delayed trailing ring with subtle speed-stretch
      if (ringRef.current) {
        const angle = Math.atan2(vel.current.y, vel.current.x);
        const stretch = Math.min(1 + speed * 0.012, 1.35);
        const squish = Math.max(1 - speed * 0.008, 0.82);
        
        ringRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0) translate(-50%, -50%) rotate(${angle}rad) scale(${stretch}, ${squish})`;
      }

      // Spawn dream stardust motes on landing page while moving
      if (isLanding && speed > 2.5 && time - lastSpawnTime > 75) {
        lastSpawnTime = time;
        particleIdCounter.current += 1;
        setParticles((prev) => [
          ...prev.slice(-6),
          {
            id: particleIdCounter.current,
            x: mousePos.current.x + (Math.random() - 0.5) * 12,
            y: mousePos.current.y + (Math.random() - 0.5) * 12,
            opacity: 0.8,
            scale: Math.random() * 0.6 + 0.6,
          },
        ]);
      }

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnterWindow);
      document.removeEventListener('mouseleave', handleMouseLeaveWindow);
    };
  }, [hasMouse, isVisible, isLanding]);

  // Periodic particle cleanup
  useEffect(() => {
    if (particles.length === 0) return;
    const timer = setTimeout(() => {
      setParticles((prev) => prev.slice(1));
    }, 450);
    return () => clearTimeout(timer);
  }, [particles]);

  if (!hasMouse) return null;

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[99999] transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-hidden="true"
    >
      {/* ── PASSIVE DELAYED TRAILING RING ──────────────────────────────────── */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        {/* 1. LANDING PAGE: Cozy Dream Aura Ring (Amber / Sky Violet Glow) */}
        {isLanding && (
          <div
            className={`rounded-full transition-all duration-300 ease-out flex items-center justify-center ${
              isClicking
                ? 'w-9 h-9 border-2 border-amber-400 bg-amber-400/20 shadow-[0_0_24px_rgba(251,191,36,0.6)]'
                : isHovering
                ? 'w-13 h-13 border-2 border-sky-400/90 bg-sky-400/15 shadow-[0_0_28px_rgba(56,189,248,0.5),inset_0_0_12px_rgba(255,255,255,0.4)] backdrop-blur-[2px]'
                : 'w-10 h-10 border-[1.75px] border-amber-300/80 bg-gradient-to-tr from-amber-400/10 via-sky-300/10 to-indigo-400/15 shadow-[0_0_18px_rgba(251,191,36,0.35)]'
            }`}
          >
            {/* Delicate inner spinning dashed dream orbit */}
            <div className="w-6 h-6 rounded-full border border-dashed border-white/60 animate-[spin_8s_linear_infinite]" />
          </div>
        )}

        {/* 2. JOURNEY / STORY PAGE: Celestial Sky Navigator Reticle (High-contrast cyan & starlight) */}
        {isJourney && (
          <div
            className={`rounded-full transition-all duration-300 ease-out flex items-center justify-center ${
              isClicking
                ? 'w-8 h-8 border-2 border-sky-500 bg-sky-500/25 shadow-[0_0_20px_rgba(14,165,233,0.7)]'
                : isHovering
                ? 'w-12 h-12 border-2 border-sky-400 bg-white/20 shadow-[0_0_24px_rgba(56,189,248,0.6),0_2px_8px_rgba(0,0,0,0.15)] backdrop-blur-[1px]'
                : 'w-9 h-9 border-[1.8px] border-sky-500/90 bg-sky-400/10 shadow-[0_0_16px_rgba(56,189,248,0.45),0_1px_4px_rgba(0,0,0,0.2)]'
            }`}
          >
            {/* 4 Cardinal tick marks for celestial navigation precision */}
            <div className="absolute -top-1 w-1 h-1 rounded-full bg-white shadow-[0_0_4px_#38bdf8]" />
            <div className="absolute -bottom-1 w-1 h-1 rounded-full bg-white shadow-[0_0_4px_#38bdf8]" />
            <div className="absolute -left-1 w-1 h-1 rounded-full bg-white shadow-[0_0_4px_#38bdf8]" />
            <div className="absolute -right-1 w-1 h-1 rounded-full bg-white shadow-[0_0_4px_#38bdf8]" />
            <div className="w-4 h-4 rounded-full border border-sky-300/60" />
          </div>
        )}

        {/* 3. COSMIC SECTOR / EXPLORE WORKS: Sci-Fi Avionics Reticle */}
        {isCosmic && (
          <div
            className={`transition-all duration-300 ease-out flex items-center justify-center ${
              isClicking
                ? 'w-9 h-9 rotate-45 border-2 border-emerald-400 bg-emerald-400/20 shadow-[0_0_25px_#34d399]'
                : isHovering
                ? 'w-14 h-14 border border-cyan-400/80 bg-cyan-950/30 shadow-[0_0_30px_rgba(6,182,212,0.6)] backdrop-blur-sm'
                : 'w-11 h-11 border border-cyan-500/60 bg-cyan-950/20 shadow-[0_0_18px_rgba(6,182,212,0.35)]'
            }`}
          >
            {/* Tactical avionics corner brackets */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-300" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-300" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-300" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-300" />
            <div className="w-5 h-5 rounded-full border border-dashed border-cyan-400/70 animate-[spin_10s_linear_infinite]" />
          </div>
        )}

        {/* 4. PROJECTS PAGE: Prismatic Glass Precision Ring */}
        {isProjects && (
          <div
            className={`rounded-full transition-all duration-300 ease-out flex items-center justify-center ${
              isClicking
                ? 'w-8 h-8 border-2 border-indigo-500 bg-indigo-500/25 shadow-[0_0_22px_rgba(99,102,241,0.6)]'
                : isHovering
                ? 'w-12 h-12 border-2 border-indigo-400/90 bg-indigo-500/15 shadow-[0_0_25px_rgba(99,102,241,0.45)] backdrop-blur-md'
                : 'w-10 h-10 border-[1.75px] border-indigo-400/70 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 shadow-[0_0_16px_rgba(99,102,241,0.3)]'
            }`}
          >
            <div className="w-5 h-5 rounded-full border border-white/50" />
          </div>
        )}

        {/* WORLD MAP PAGE: Celestial Adventurer Compass Ring */}
        {isWorld && (
          <div
            className={`rounded-full transition-all duration-300 ease-out flex items-center justify-center ${
              isClicking
                ? 'w-9 h-9 border-2 border-cyan-400 bg-cyan-400/25 shadow-[0_0_24px_rgba(34,211,238,0.7)]'
                : isHovering
                ? 'w-14 h-14 border-2 border-cyan-300 bg-sky-500/20 shadow-[0_0_30px_rgba(56,189,248,0.6),inset_0_0_15px_rgba(255,255,255,0.4)] backdrop-blur-sm'
                : 'w-11 h-11 border-[1.8px] border-cyan-400/80 bg-gradient-to-tr from-cyan-500/15 via-indigo-500/15 to-purple-500/15 shadow-[0_0_20px_rgba(56,189,248,0.45)]'
            }`}
          >
            {/* Spinning mini compass crosshair */}
            <div className="w-5 h-5 rounded-full border border-dashed border-cyan-300/80 animate-[spin_10s_linear_infinite]" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-cyan-200 shadow-[0_0_6px_#38bdf8]" />
          </div>
        )}

        {/* 5. DEFAULT / OTHER PAGES: Elegant Frosted Glass Orb */}
        {!isLanding && !isWorld && !isJourney && !isCosmic && !isProjects && (
          <div
            className={`rounded-full transition-all duration-300 ease-out flex items-center justify-center ${
              isHovering
                ? 'w-12 h-12 border-2 border-sky-400/80 bg-white/25 shadow-[0_0_20px_rgba(56,189,248,0.4)] backdrop-blur-md'
                : 'w-9 h-9 border border-slate-700/50 bg-white/10 shadow-md'
            }`}
          />
        )}
      </div>

      {/* ── IMMEDIATE SHARP MOUSE NUCLEUS POINT ─────────────────────────────── */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none will-change-transform z-10"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      >
        <div
          className={`rounded-full transition-all duration-150 ${
            isLanding
              ? 'w-2 h-2 bg-amber-400 shadow-[0_0_8px_#fde047]'
              : isWorld
              ? 'w-2 h-2 bg-cyan-300 shadow-[0_0_8px_#38bdf8]'
              : isJourney
              ? 'w-2 h-2 bg-sky-500 shadow-[0_0_8px_#38bdf8,0_0_2px_#000]'
              : isCosmic
              ? 'w-1.5 h-1.5 bg-cyan-300 shadow-[0_0_8px_#22d3ee]'
              : isProjects
              ? 'w-2 h-2 bg-indigo-400 shadow-[0_0_8px_#818cf8]'
              : 'w-2 h-2 bg-slate-800 dark:bg-white shadow-sm'
          } ${isClicking ? 'scale-150' : isHovering ? 'scale-75 opacity-70' : 'scale-100'}`}
        />
      </div>

      {/* ── DREAM STARDUST TRAIL (Landing Page Living Effect) ───────────────── */}
      {isLanding &&
        particles.map((p) => (
          <div
            key={p.id}
            className="fixed pointer-events-none rounded-full bg-amber-200/90 shadow-[0_0_6px_#fde047] transition-all duration-500 ease-out"
            style={{
              left: p.x,
              top: p.y,
              width: `${p.scale * 3.5}px`,
              height: `${p.scale * 3.5}px`,
              opacity: p.opacity,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
    </div>
  );
};
