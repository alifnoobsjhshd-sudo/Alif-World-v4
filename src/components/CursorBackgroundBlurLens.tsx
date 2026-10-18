import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export const CursorBackgroundBlurLens: React.FC = () => {
  const [hasMouse, setHasMouse] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(-500);
  const mouseY = useMotionValue(-500);

  // Silky responsive spring to follow cursor with zero lag
  const springX = useSpring(mouseX, { stiffness: 450, damping: 32 });
  const springY = useSpring(mouseY, { stiffness: 450, damping: 32 });

  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024);
  const [isVirtualCursor, setIsVirtualCursor] = useState(() =>
    typeof document !== 'undefined' && document.body.classList.contains('mobile-virtual-cursor-active')
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    const handleCursorState = () => {
      setIsVirtualCursor(document.body.classList.contains('mobile-virtual-cursor-active'));
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('mobile-cursor-state-change', handleCursorState);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mobile-cursor-state-change', handleCursorState);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)');
    setHasMouse(media.matches);

    const handleMedia = (e: MediaQueryListEvent) => setHasMouse(e.matches);
    media.addEventListener('change', handleMedia);
    return () => media.removeEventListener('change', handleMedia);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleVirtualMove = (e: Event) => {
      const ev = e as CustomEvent<{ x: number; y: number }>;
      if (ev.detail && typeof ev.detail.x === 'number') {
        mouseX.set(ev.detail.x);
        mouseY.set(ev.detail.y);
        if (!isVisible) setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      if (!document.body.classList.contains('mobile-virtual-cursor-active')) {
        setIsVisible(false);
      }
    };
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('virtual-cursor-move', handleVirtualMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('virtual-cursor-move', handleVirtualMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, mouseX, mouseY]);

  const active = (hasMouse && isDesktop) || isVirtualCursor;
  if (!active) return null;

  return (
    <motion.div
      style={{
        left: springX,
        top: springY,
        opacity: isVisible || isVirtualCursor ? 1 : 0,
      }}
      className={`fixed pointer-events-none z-[2] -translate-x-1/2 -translate-y-1/2 w-[48px] h-[48px] rounded-full will-change-transform ${
        isVirtualCursor ? 'block' : 'hidden lg:block'
      }`}
      aria-hidden="true"
    >
      {/* ── DECREASED SUBTLE NATURAL NEAR-SCREEN BLUR (LIGHT & NATURAL) ── */}
      <div
        className="w-full h-full rounded-full backdrop-blur-[1px]"
        style={{
          WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.12) 55%, rgba(0,0,0,0) 100%)',
          maskImage: 'radial-gradient(circle at center, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.12) 55%, rgba(0,0,0,0) 100%)',
        }}
      />
    </motion.div>
  );
};
