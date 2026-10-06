import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface Interactive3DCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glareEffect?: boolean;
  depthZ?: number;
  onClick?: () => void;
  soundEffect?: () => void;
}

export const Interactive3DCard: React.FC<Interactive3DCardProps> = ({
  children,
  className = '',
  maxTilt = 12,
  glareEffect = true,
  depthZ = 28,
  onClick,
  soundEffect,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Normalized mouse coordinate (-0.5 to 0.5)
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);

  // Smooth responsive spring physics
  const springX = useSpring(normX, { stiffness: 220, damping: 24, mass: 0.4 });
  const springY = useSpring(normY, { stiffness: 220, damping: 24, mass: 0.4 });

  // 3D Tilt rotations
  const rotateX = useTransform(springY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Dynamic Glare / Specular highlight position
  const glareX = useTransform(normX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(normY, [-0.5, 0.5], [0, 100]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    normX.set(x);
    normY.set(y);
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    if (soundEffect) soundEffect();
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    normX.set(0);
    normY.set(0);
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className="relative will-change-transform inline-block w-full"
    >
      <motion.div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={onClick}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        whileTap={{ scale: 0.98 }}
        className={`relative transition-shadow duration-300 ${className}`}
      >
        {/* Holographic Specular Glare Layer */}
        {glareEffect && isHovered && (
          <motion.div
            style={{
              background: `radial-gradient(circle 280px at ${glareX.get()}% ${glareY.get()}%, rgba(255,255,255,0.22), transparent 80%)`,
            }}
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-30 transition-opacity duration-300 opacity-100 mix-blend-overlay"
          />
        )}

        {/* Inner Content with 3D Depth Layer */}
        <div
          style={{
            transform: `translateZ(${isHovered ? depthZ : 0}px)`,
            transformStyle: 'preserve-3d',
            transition: 'transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
          }}
          className="relative w-full h-full"
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
};
