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

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)');
    setHasMouse(media.matches);

    const handleMedia = (e: MediaQueryListEvent) => setHasMouse(e.matches);
    media.addEventListener('change', handleMedia);
    return () => media.removeEventListener('change', handleMedia);
  }, []);

  useEffect(() => {
    if (!hasMouse) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [hasMouse, isVisible, mouseX, mouseY]);

  if (!hasMouse || !isDesktop) return null;

  return (
    <motion.div
      style={{
        left: springX,
        top: springY,
        opacity: isVisible ? 1 : 0,
      }}
      className="fixed pointer-events-none z-[2] -translate-x-1/2 -translate-y-1/2 w-[48px] h-[48px] rounded-full will-change-transform hidden lg:block"
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
