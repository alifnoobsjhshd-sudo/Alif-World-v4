import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useSpring,
  useTransform,
  useMotionTemplate,
  MotionValue,
} from 'motion/react';
import { dreamAudio } from '../utils/audio';

interface PaperAirplaneProps {
  scrollVelocity: MotionValue<number>;
  smoothedDepth:  MotionValue<number>;
}

interface TrailingParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  scale: number;
  opacity: number;
  duration: number;
  background: string;
  boxShadow?: string;
  filter?: string;
}

export const PaperAirplane = React.memo(({ scrollVelocity, smoothedDepth }: PaperAirplaneProps) => {
  // ── Trailing Particle State ───────────────────────────────────────────────
  const [particles, setParticles] = useState<TrailingParticle[]>([]);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastEmitTimeRef = useRef<number>(0);

  // ── Emit particles only when actively scrolling & clear immediately when velocity hits zero ──
  useEffect(() => {
    const VELOCITY_THRESHOLD = 12;

    const unsubscribe = scrollVelocity.on('change', (v: number) => {
      const absV = Math.abs(v);

      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
        idleTimeoutRef.current = null;
      }

      // Immediately clear all trailing particles when scroll velocity reaches zero (or threshold)
      if (absV <= VELOCITY_THRESHOLD) {
        setParticles([]);
        return;
      }

      // Active scrolling: emit particles at smooth throttled cadence
      const now = performance.now();
      if (now - lastEmitTimeRef.current >= 45) {
        lastEmitTimeRef.current = now;

        const isScrollForward = v > 0;
        const speedRatio = Math.min(1.5, Math.max(0.6, absV / 600));

        // Choose spawn location: Left wingtip, right wingtip, or center trailing wake
        const spawnType = Math.random();
        let spawnX = 0;
        let spawnY = 44;
        let driftX = (Math.random() - 0.5) * 14;
        let size = 5 + Math.random() * 6;
        let particleType = 'cloud';

        if (spawnType < 0.38) {
          // Left wingtip vortex
          spawnX = -72 + (Math.random() * 8 - 4);
          spawnY = 22 + Math.random() * 8;
          driftX = -12 - Math.random() * 16;
          particleType = 'vortex';
        } else if (spawnType < 0.76) {
          // Right wingtip vortex
          spawnX = 72 + (Math.random() * 8 - 4);
          spawnY = 22 + Math.random() * 8;
          driftX = 12 + Math.random() * 16;
          particleType = 'vortex';
        } else {
          // Center trailing slipstream
          spawnX = (Math.random() - 0.5) * 28;
          spawnY = 42 + Math.random() * 10;
          driftX = (Math.random() - 0.5) * 20;
          particleType = Math.random() > 0.4 ? 'cloud' : 'sparkle';
        }

        const driftY = (isScrollForward ? 25 : -20) + (Math.random() * 20 - 10);
        const baseOpacity = Math.min(0.85, 0.4 + (absV / 1000) * 0.4);

        let background = 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(224,242,254,0.6) 60%, transparent 100%)';
        let boxShadow: string | undefined = '0 0 8px rgba(186, 230, 253, 0.6)';
        let filter: string | undefined = 'blur(1.2px)';

        if (particleType === 'sparkle') {
          size = 3.5 + Math.random() * 2.5;
          background = '#ffffff';
          boxShadow = '0 0 6px rgba(56, 189, 248, 0.9)';
          filter = undefined;
        } else if (particleType === 'vortex') {
          size = 4 + Math.random() * 4;
          background = 'radial-gradient(circle, rgba(240,249,255,0.9) 0%, rgba(186,230,253,0.5) 70%, transparent 100%)';
          boxShadow = '0 0 6px rgba(125, 211, 252, 0.5)';
          filter = 'blur(0.8px)';
        }

        const newParticle: TrailingParticle = {
          id: `${now}-${Math.random()}`,
          x: spawnX,
          y: spawnY,
          vx: driftX * speedRatio,
          vy: driftY * speedRatio,
          size,
          scale: 0.8 + Math.random() * 0.5,
          opacity: baseOpacity,
          duration: 0.38 + Math.random() * 0.18,
          background,
          boxShadow,
          filter,
        };

        setParticles((prev) => {
          // Keep up to 22 particles maximum for lightning fast rendering
          return [...prev.slice(-21), newParticle];
        });
      }

      // Idle timeout: if velocity stops changing / settles to zero, wipe immediately
      idleTimeoutRef.current = setTimeout(() => {
        setParticles([]);
      }, 75);
    });

    return () => {
      unsubscribe();
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [scrollVelocity]);

  // ── Intensity Modulation ──────────────────────────────────────────────────
  // Keep the plane's motion visible at rest, but let a controlled amount of
  // momentum show through while scrolling.
  const rawIntensity = useTransform(scrollVelocity, [-1800, 0, 1800], [0.75, 0, 0.75]);
  const intensity    = useSpring(rawIntensity, { stiffness: 90, damping: 20, mass: 0.8 });

  // ── Movement & Rotation ────────────────────────────────────────────────────
  // Drive the plane from the same alternating depth cycle as the camera.
  // Rotation follows the scene position rather than the sign of the scroll
  // velocity, so reversing direction does not lock it to one bank.
  const swerve = useTransform([smoothedDepth, intensity], ([d, strength]) => {
    const phase = ((d as number) / 4800) * Math.PI;
    const sin   = Math.sin(phase);
    const cos   = Math.cos(phase);

    // Preserve the original horizontal travel while softening the added tilt.
    const x = sin * 90;

    const movement = strength as number;
    const bank  = sin * -12;
    const yaw   = sin * -8;
    const pitch = -12 + cos * 1.8 + movement * 1.2;

    return { x, bank, yaw, pitch };
  });

  // Extract individual motion values for use in the template
  const x     = useTransform(swerve, (s) => s.x);
  const bank  = useTransform(swerve, (s) => s.bank);
  const yaw   = useTransform(swerve, (s) => s.yaw);
  const pitch = useTransform(swerve, (s) => s.pitch);

  const planeTf = useMotionTemplate`perspective(800px) rotateX(${pitch}deg) rotateZ(${bank}deg) rotateY(${yaw}deg)`;

  // ── Shadow visuals ────────────────────────────────────────────────────────
  const shadowOpacity = 0.22;
  const shadowBlurCss = "blur(12px)";
  // Slightly squish the shadow when banking
  const shadowScaleX  = useTransform(bank, [-30, 0, 30], [0.6, 1.0, 0.6]);

  return (
    <motion.div
      className="fixed pointer-events-none select-none"
      style={{
        left:            '50%',
        bottom:          '10%',
        translateX:      '-50%',
        zIndex:          55,
      }}
    >
      {/* ── Scroll-Driven Sway Group ────────────────────────────────────────── */}
      <motion.div
        style={{
          x,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          willChange: 'transform',
        }}
      >
        {/* ── Trailing Particle Wake (Emitted only during active scroll, cleared immediately at 0 velocity) ── */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 pointer-events-none z-[-1]">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                opacity: p.opacity,
                scale: p.scale * 0.7,
                x: p.x,
                y: p.y,
              }}
              animate={{
                opacity: 0,
                scale: p.scale * 1.35,
                x: p.x + p.vx,
                y: p.y + p.vy,
              }}
              transition={{
                duration: p.duration,
                ease: 'easeOut',
              }}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                background: p.background,
                boxShadow: p.boxShadow,
                filter: p.filter,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        {/* Plane body — Dynamic 3D rotation based on swerve position */}
        <motion.div
          onClick={() => dreamAudio.playPaperPlaneFlutter()}
          onMouseEnter={() => dreamAudio.playHover()}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          className="pointer-events-auto cursor-pointer"
          title="Tap to fly!"
          style={{ transform: planeTf, transformOrigin: '50% 50%', willChange: 'transform' }}
        >
          {/* Continuous "float" bobbing animation */}
          <motion.div
            animate={{
              y: [0, -8, 0],
              rotateX: [0, 1.5, 0],
              rotateZ: [0, 0.8, -0.8, 0],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ transformOrigin: '50% 50%', willChange: 'transform' }}
          >
            <AirplaneDesign />
          </motion.div>
        </motion.div>

        {/* Soft shadow below the plane */}
        <motion.div
          animate={{
            opacity: [0.22, 0.16, 0.22],
            scale: [1, 0.92, 1],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position:  'absolute',
            bottom:    '-10px',
            left:      '50%',
            translateX:'-50%',
            width:     '160px',
            height:    '16px',
            background:'radial-gradient(ellipse, rgba(50,60,90,0.32) 0%, transparent 68%)',
            filter:    shadowBlurCss,
            opacity:   shadowOpacity,
            scaleX:    shadowScaleX,
            willChange: 'transform, opacity',
          }}
        />
      </motion.div>
    </motion.div>
  );
});

PaperAirplane.displayName = 'PaperAirplane';

/* ─────────────────────────────────────────────────────────────────────────────
 * Crafted Paper Airplane Design Overlay
 * ───────────────────────────────────────────────────────────────────────── */
const AIRPLANE_IMAGE_URL = 'https://i.postimg.cc/k5V1LWLF/Gemini-Generated-Image-removebg-preview.png';

const AirplaneDesign = React.memo(() => (
  <div className="relative flex items-center justify-center select-none pointer-events-none">
    <img
      src={AIRPLANE_IMAGE_URL}
      alt="Paper Airplane"
      referrerPolicy="no-referrer"
      className="w-[195px] sm:w-[230px] h-auto object-contain select-none pointer-events-none drop-shadow-[0_14px_28px_rgba(20,30,55,0.28)]"
      loading="eager"
    />
  </div>
));
AirplaneDesign.displayName = 'AirplaneDesign';
