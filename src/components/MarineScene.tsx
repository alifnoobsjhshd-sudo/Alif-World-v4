import React from 'react';
import { motion, useTransform, MotionValue } from 'motion/react';

interface MarineSceneProps {
  children: React.ReactNode;
  startDepth: number;
  scrollProgress: MotionValue<number>;
  className?: string;
}

export const MarineScene: React.FC<MarineSceneProps> = ({
  children,
  startDepth,
  scrollProgress,
  className = '',
}) => {
  // Relative depth to the fish's current position
  const relativeDepth = useTransform(scrollProgress, (val: number) => {
    return startDepth - (val || 0);
  });

  // Smooth 3D Z-depth camera travel
  const z = useTransform(
    relativeDepth,
    [-3400, -1600, 0, 1800, 3600],
    [450, 200, 0, -480, -1100]
  );

  // Scale: emerges from ocean depths and gently expands as fish swims past
  const scale = useTransform(
    relativeDepth,
    [-3400, -1600, 0, 1800, 3600],
    [1.1, 1.05, 1.0, 0.84, 0.62]
  );

  // Clear scene isolation: only fully visible when the fish is within range
  const opacity = useTransform(
    relativeDepth,
    [-2800, -1800, -900, 0, 900, 1800, 2800],
    [0, 0.45, 0.98, 1, 0.98, 0.45, 0]
  );

  // Interactive only when in direct foreground view
  const pointerEvents = useTransform(relativeDepth, (val: number) => {
    return Math.abs(val) < 1300 ? 'auto' : 'none';
  });

  // Occlusion culling for optimal 60fps rendering
  const visibility = useTransform(relativeDepth, (val: number) => {
    return Math.abs(val) > 3200 ? 'hidden' : 'visible';
  });

  return (
    <motion.div
      style={{
        z,
        opacity,
        scale,
        visibility,
        pointerEvents,
        willChange: 'transform, opacity',
      }}
      className={`absolute inset-0 flex flex-col items-center justify-center text-center p-3 sm:p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
};
