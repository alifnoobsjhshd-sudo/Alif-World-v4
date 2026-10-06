import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { dreamAudio } from '../utils/audio';

export interface MarineInteractiveHotspotProps {
  onClick?: () => void;
  title: string;
  badge?: string;
  tagline?: string;
  className?: string; // Positioning classes (e.g. absolute left-[38%] top-[37%] w-[19%] h-[16%])
  shape?: 'rounded' | 'pill' | 'card';
  tooltipPlacement?: 'top' | 'bottom';
}

export const MarineInteractiveHotspot: React.FC<MarineInteractiveHotspotProps> = ({
  onClick,
  title,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handlePointerEnter = () => {
    setIsHovered(true);
    dreamAudio.playHover();
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dreamAudio.playPop();
    if (onClick) onClick();
  };

  return (
    <div
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`group cursor-pointer select-none transition-all duration-300 ${className}`}
      title={title}
      role="button"
      tabIndex={0}
    >
      {/* ── FLOATING AQUATIC MICRO-BUBBLES ON HOVER (NO BOXES OR BORDERS) ── */}
      <AnimatePresence>
        {isHovered && (
          <div className="absolute inset-0 pointer-events-none overflow-visible">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: `${20 + i * 30}%`,
                  y: '90%',
                  opacity: 0,
                  scale: 0.4,
                }}
                animate={{
                  y: ['80%', '-25%'],
                  x: [`${20 + i * 30}%`, `${20 + i * 30 + (i % 2 === 0 ? 12 : -12)}%`],
                  opacity: [0, 0.9, 0],
                  scale: [0.5, 1.1, 0.7],
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1.2 + i * 0.3,
                  repeat: Infinity,
                  ease: 'easeOut',
                  delay: i * 0.22,
                }}
                className="absolute w-2 h-2 rounded-full bg-cyan-200 border border-white shadow-[0_0_8px_rgba(56,189,248,0.9)]"
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
