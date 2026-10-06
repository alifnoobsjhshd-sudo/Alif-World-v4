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

  if (!hasMouse) return null;

  return (
    <motion.div
      style={{
        left: springX,
        top: springY,
        opacity: isVisible ? 1 : 0,
      }}
      className="fixed pointer-events-none z-[2] -translate-x-1/2 -translate-y-1/2 w-[240px] sm:w-[280px] h-[240px] sm:h-[280px] rounded-full will-change-transform"
      aria-hidden="true"
    >
      {/* ── LOCALIZED BACKGROUND BLUR WITH DISTANCE-BASED INTENSITY FALLOFF ── */}
      <div
        className="w-full h-full rounded-full backdrop-blur-[14px]"
        style={{
          WebkitMaskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 20%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0) 100%)',
          maskImage: 'radial-gradient(circle at center, rgba(0,0,0,1) 20%, rgba(0,0,0,0.65) 55%, rgba(0,0,0,0) 100%)',
        }}
      />
    </motion.div>
  );
};
