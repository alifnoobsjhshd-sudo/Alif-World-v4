import { useEffect, useState } from 'react';
import { useMotionValue, useSpring, useTransform } from 'motion/react';

type MouseCallback = (x: number, y: number) => void;
const subscribers = new Set<MouseCallback>();
let globalListenerAttached = false;

function setupGlobalMouseListener() {
  if (globalListenerAttached || typeof window === 'undefined') return;
  globalListenerAttached = true;

  window.addEventListener(
    'mousemove',
    (e: MouseEvent) => {
      if (subscribers.size === 0) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      const clampedX = Math.max(-1, Math.min(1, x));
      const clampedY = Math.max(-1, Math.min(1, y));
      subscribers.forEach((cb) => cb(clampedX, clampedY));
    },
    { passive: true }
  );

  document.addEventListener('mouseleave', () => {
    subscribers.forEach((cb) => cb(0, 0));
  });
}

export function useDesktopCharacterParallax() {
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 768;
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(pointer: fine)');
    const checkDesktop = () => {
      setIsDesktop(mq.matches && window.innerWidth >= 768);
    };
    checkDesktop();

    window.addEventListener('resize', checkDesktop);
    mq.addEventListener?.('change', checkDesktop);

    setupGlobalMouseListener();

    const onMouse: MouseCallback = (x, y) => {
      if (!mq.matches || window.innerWidth < 768) {
        mouseX.set(0);
        mouseY.set(0);
        return;
      }
      mouseX.set(x);
      mouseY.set(y);
    };

    subscribers.add(onMouse);

    return () => {
      subscribers.delete(onMouse);
      window.removeEventListener('resize', checkDesktop);
      mq.removeEventListener?.('change', checkDesktop);
    };
  }, [mouseX, mouseY]);

  // Spring physics for organic, buttery smooth trailing response (zero jitter)
  const smoothX = useSpring(mouseX, { stiffness: 68, damping: 22, mass: 0.5 });
  const smoothY = useSpring(mouseY, { stiffness: 68, damping: 22, mass: 0.5 });

  // 3D Avatar parallax translation & rotation channels
  const avatarX = useTransform(smoothX, [-1, 1], [-13, 13]);
  const avatarY = useTransform(smoothY, [-1, 1], [-9, 9]);
  const avatarRotateY = useTransform(smoothX, [-1, 1], [-4.5, 4.5]);
  const avatarRotateX = useTransform(smoothY, [-1, 1], [3.5, -3.5]);

  // Grounding shadow reaction on the cloud
  const shadowX = useTransform(smoothX, [-1, 1], [4, -4]);
  const shadowScale = useTransform(smoothY, [-1, 1], [0.96, 1.04]);
  const shadowOpacity = useTransform(smoothY, [-1, 1], [0.13, 0.08]);

  return {
    isDesktop,
    avatarX,
    avatarY,
    avatarRotateX,
    avatarRotateY,
    shadowX,
    shadowScale,
    shadowOpacity,
  };
}
