import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  MotionValue,
  useTransform,
  useSpring,
} from 'motion/react';
import { dreamAudio } from '../utils/audio';

interface MarineFishProps {
  scrollVelocity: MotionValue<number>;
  smoothedDepth: MotionValue<number>;
}

interface CanvasBubble {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  wobbleSpeed: number;
  wobbleAmp: number;
  wobblePhase: number;
  life: number;
  decay: number;
}

export const MarineFish: React.FC<MarineFishProps> = ({
  scrollVelocity,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bubblesRef = useRef<CanvasBubble[]>([]);
  const lastEmitTimeRef = useRef<number>(0);

  const [isHovered, setIsHovered] = useState(false);
  const [isBursting, setIsBursting] = useState(false);
  const burstRef = useRef<number>(0);
  const tailPhaseRef = useRef<number>(0);

  // ── SUBTLE POINTER GUIDANCE (Keeps fish solidly centered, max +-16px) ─────
  const targetPointerX = useRef<number>(0);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const normalized = (e.clientX / window.innerWidth) * 2 - 1;
      targetPointerX.current = Math.max(-16, Math.min(16, normalized * 16));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const normalized = (touch.clientX / window.innerWidth) * 2 - 1;
        targetPointerX.current = Math.max(-16, Math.min(16, normalized * 16));
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Pitch reaction: Upper angle view pitches forward slightly when scrolling forward
  const pitchRaw = useTransform(scrollVelocity, (v: number) => {
    const vel = v || 0;
    return 24 + Math.max(-4, Math.min(10, vel * 0.04));
  });
  const pitch = useSpring(pitchRaw, { stiffness: 85, damping: 20 });

  // ── Realistic Swimming Kinematics State ───────────────────────────────────
  const [swimState, setSwimState] = useState({
    posX: 0,
    bankAngle: 0,
    headAngle: 0,
    torsoAngle: 0,
    tailAngle: 0,
    finAngle: 0,
    finTipWave: 0,
    pectLeftAngle: -22,
    pectRightAngle: 22,
    pectScale: 1,
    corePulse: 0.8,
  });

  const posXRef = useRef<number>(0);

  // ── 60FPS COMBINED LOOP: KINEMATICS + CANVAS FLOATING BUBBLES ────────────
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let currentSwimX = 0;
    let currentSwimBank = 0;
    let currentPointerX = 0;
    let currentHead = 0;
    let currentTorso = 0;
    let currentTail = 0;
    let currentFin = 0;
    let currentFinTip = 0;
    let currentPectL = -22;
    let currentPectR = 22;

    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const loop = (currentTime: number) => {
      const dt = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const vel = scrollVelocity.get() || 0;
      const isBurstingNow = burstRef.current > 0;
      if (isBurstingNow) {
        burstRef.current = Math.max(0, burstRef.current - dt * 1.5);
      }

      currentPointerX += (targetPointerX.current - currentPointerX) * 0.08;
      const isMoving = Math.abs(vel) > 6 || isBurstingNow;

      if (isMoving) {
        const swimFreq = 1.05 + Math.min(0.65, Math.abs(vel) * 0.012) + burstRef.current * 1.2;
        tailPhaseRef.current += dt * swimFreq * Math.PI * 2;
        const phase = tailPhaseRef.current;

        const swimAmp = 6.5 + Math.min(3.5, Math.abs(vel) * 0.015) + burstRef.current * 2.5;
        const targetSwimX = -Math.sin(phase) * swimAmp;
        const targetSwimBank = -Math.sin(phase) * 4.0;

        currentSwimX += (targetSwimX - currentSwimX) * 0.18;
        currentSwimBank += (targetSwimBank - currentSwimBank) * 0.18;

        const targetHead = Math.sin(phase) * -2.4;
        const targetTorso = Math.sin(phase - 0.5) * 4.6;
        const targetTail = Math.sin(phase - 1.1) * 13.5;
        const targetFin = Math.sin(phase - 1.8) * 19.5;
        const targetFinTip = Math.sin(phase * 1.2 - 2.4) * 7.0;

        const pectPhase = phase * 0.9;
        const targetPectL = -22 + Math.sin(pectPhase) * 11;
        const targetPectR = 22 - Math.sin(pectPhase) * 11;

        currentHead += (targetHead - currentHead) * 0.15;
        currentTorso += (targetTorso - currentTorso) * 0.15;
        currentTail += (targetTail - currentTail) * 0.15;
        currentFin += (targetFin - currentFin) * 0.15;
        currentFinTip += (targetFinTip - currentFinTip) * 0.15;
        currentPectL += (targetPectL - currentPectL) * 0.15;
        currentPectR += (targetPectR - currentPectR) * 0.15;
      } else {
        currentSwimX += (0 - currentSwimX) * 0.10;
        currentSwimBank += (0 - currentSwimBank) * 0.10;
        currentHead += (0 - currentHead) * 0.08;
        currentTorso += (0 - currentTorso) * 0.08;
        currentTail += (0 - currentTail) * 0.08;
        currentFin += (0 - currentFin) * 0.08;
        currentFinTip += (0 - currentFinTip) * 0.08;
        currentPectL += (-22 - currentPectL) * 0.08;
        currentPectR += (22 - currentPectR) * 0.08;
      }

      const totalX = currentSwimX + currentPointerX;
      const totalBank = currentSwimBank + (currentPointerX * 0.4);
      posXRef.current = totalX;

      const corePulse = 0.75 + Math.sin(currentTime * 0.0035) * 0.25;

      setSwimState({
        posX: totalX,
        bankAngle: totalBank,
        headAngle: currentHead,
        torsoAngle: currentTorso,
        tailAngle: currentTail,
        finAngle: currentFin,
        finTipWave: currentFinTip,
        pectLeftAngle: currentPectL,
        pectRightAngle: currentPectR,
        pectScale: isMoving ? 1.05 : 1.0,
        corePulse,
      });

      // ── BUBBLE PROPULSION WAKE: RELEASED FROM BACK & SHOOTS TO BOTTOM ──────
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;
      // Tail position: directly at the rear caudal fin of the fish
      const tailX = screenW * 0.5 + totalX + (Math.random() - 0.5) * 12;
      const tailY = screenH * (1 - 0.055) - 22 + (Math.random() - 0.5) * 6;

      if (isMoving) {
        const absVel = Math.abs(vel);
        // Reduced density: clean, spaced-out wake bubbles (120ms to 200ms interval)
        const interval = isBurstingNow ? 60 : Math.max(120, 210 - Math.min(90, absVel * 0.45));

        if (currentTime - lastEmitTimeRef.current > interval) {
          lastEmitTimeRef.current = currentTime;

          // Single distinct bubble per stroke (lower density, clear & legible)
          const radius = 4.0 + Math.random() * 7.5; // diameter 8px to 23px
          // Fast propulsion speed downwards towards the bottom (380px - 750px/sec)
          const fastVy = 6.2 + Math.random() * 6.0;
          // Angular dispersion counters the tail fin banking angle
          const wakeVx = (Math.random() - 0.5) * 2.8 - (currentSwimBank * 0.18);

          bubblesRef.current.push({
            x: tailX,
            y: tailY,
            radius,
            vx: wakeVx,
            vy: fastVy, // Shoots backwards and downwards to the bottom!
            wobbleSpeed: 3.5 + Math.random() * 3.0,
            wobbleAmp: 0.8 + Math.random() * 1.6,
            wobblePhase: Math.random() * Math.PI * 2,
            life: 1.0,
            decay: 0.022 + Math.random() * 0.012, // Fast life ~0.5s - 0.75s
          });

          // Trigger synchronized authentic water bubble bloop audio
          const panRatio = (tailX / screenW) * 2 - 1;
          dreamAudio.playSynchronizedBubble(radius * 2, panRatio);
        }
      }

      // ── RENDER BUBBLES ON CANVAS (60FPS Silky Smooth) ─────────────────────
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, screenW, screenH);

          const timeSec = currentTime * 0.001;
          const activeBubbles: CanvasBubble[] = [];

          for (let i = 0; i < bubblesRef.current.length; i++) {
            const b = bubblesRef.current[i];
            b.x += b.vx + Math.sin(timeSec * b.wobbleSpeed + b.wobblePhase) * b.wobbleAmp * 0.25;
            b.y += b.vy; // Travels fast towards the bottom
            b.radius += 0.025; // Expands slightly as it disperses
            b.life -= b.decay;

            // Active while alive and not yet off the bottom of the screen
            if (b.life > 0 && b.y < screenH + 60) {
              activeBubbles.push(b);

              const alpha = Math.min(0.85, Math.sin(b.life * Math.PI) * 1.1);

              ctx.save();
              ctx.beginPath();
              ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);

              // 1. Realistic Semi-Transparent Liquid Bubble Shading
              const grad = ctx.createRadialGradient(
                b.x - b.radius * 0.35,
                b.y - b.radius * 0.35,
                b.radius * 0.1,
                b.x,
                b.y,
                b.radius
              );
              grad.addColorStop(0, `rgba(255, 255, 255, ${0.95 * alpha})`);
              grad.addColorStop(0.25, `rgba(255, 255, 255, ${0.45 * alpha})`);
              grad.addColorStop(0.6, `rgba(56, 189, 248, ${0.28 * alpha})`);
              grad.addColorStop(0.85, `rgba(6, 182, 212, ${0.15 * alpha})`);
              grad.addColorStop(1, `rgba(255, 255, 255, ${0.75 * alpha})`);

              ctx.fillStyle = grad;
              ctx.shadowColor = `rgba(56, 189, 248, ${0.5 * alpha})`;
              ctx.shadowBlur = 8;
              ctx.fill();

              // 2. Delicate Refractive Outer Rim
              ctx.lineWidth = 1;
              ctx.strokeStyle = `rgba(255, 255, 255, ${0.75 * alpha})`;
              ctx.stroke();

              // 3. Crisp Specular Crescent Highlight (Sunlight caustic reflection)
              ctx.beginPath();
              ctx.arc(
                b.x - b.radius * 0.35,
                b.y - b.radius * 0.35,
                b.radius * 0.28,
                0,
                Math.PI * 2
              );
              ctx.fillStyle = `rgba(255, 255, 255, ${0.9 * alpha})`;
              ctx.shadowBlur = 0;
              ctx.fill();

              ctx.restore();
            }
          }

          bubblesRef.current = activeBubbles;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [scrollVelocity]);

  // Interactive Click: Playful dash flurry
  const handleFishClick = () => {
    if (isBursting) return;
    setIsBursting(true);
    burstRef.current = 1.0;
    dreamAudio.playFishTailSwish();

    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const tailX = screenW * 0.5 + posXRef.current;
    const tailY = screenH * (1 - 0.055) - 34;

    // Burst of 6 fast bubbles shooting backwards and downwards to bottom
    for (let i = 0; i < 6; i++) {
      const radius = 4.5 + Math.random() * 6.5;
      bubblesRef.current.push({
        x: tailX + (Math.random() - 0.5) * 20,
        y: tailY + (Math.random() - 0.5) * 8,
        radius,
        vx: (Math.random() - 0.5) * 3.5,
        vy: 7.0 + Math.random() * 6.0, // Shoots fast to the bottom
        wobbleSpeed: 3.5 + Math.random() * 3,
        wobbleAmp: 1.0 + Math.random() * 1.5,
        wobblePhase: Math.random() * Math.PI * 2,
        life: 1.0,
        decay: 0.024 + Math.random() * 0.012,
      });

      setTimeout(() => {
        dreamAudio.playSynchronizedBubble(radius * 2, (tailX / screenW) * 2 - 1);
      }, i * 45);
    }

    setTimeout(() => {
      setIsBursting(false);
    }, 650);
  };

  return (
    <>
      {/* ── 1. FLOATING SEMI-TRANSPARENT BUBBLE PARTICLES CANVAS (Behind Fish Path) ── */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-40 w-full h-full overflow-hidden"
      />

      {/* ── 2. FORWARD-FACING 2D CYBER-FISH (Upper-Angle View, z-50) ── */}
      <div
        className="fixed select-none z-50 pointer-events-auto cursor-pointer"
        style={{
          left: '50%',
          bottom: '5.5%',
          transform: 'translateX(-50%)',
          perspective: '900px',
        }}
        onClick={handleFishClick}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        title="Cyber-Marine Companion · Scroll to emit floating bubbles"
      >
        <motion.div
          style={{
            x: swimState.posX,
            rotateZ: swimState.bankAngle,
            rotateX: pitch,
            transformStyle: 'preserve-3d',
          }}
          animate={{
            y: isHovered ? [-4, 4, -4] : [-2.5, 2.5, -2.5],
            scale: isHovered ? 1.05 : 1.0,
          }}
          transition={{
            y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut' },
            scale: { duration: 0.25 },
          }}
          className="relative w-32 h-44 sm:w-36 sm:h-48 flex items-center justify-center will-change-transform group"
        >
          {/* Modern Cybernetic Bioluminescent Ambient Glow */}
          <div
            style={{ opacity: swimState.corePulse }}
            className="absolute w-26 h-34 rounded-full bg-cyan-400/20 blur-2xl pointer-events-none transition-opacity duration-300 group-hover:bg-cyan-400/35"
          />
          <div className="absolute w-16 h-20 rounded-full bg-sky-500/20 blur-lg pointer-events-none" />

          {/* User Control HUD Target Reticle (Centered subtle cyber guide ring) */}
          <div className="absolute -bottom-3 w-26 h-6 rounded-full border border-cyan-400/25 blur-xs pointer-events-none scale-y-60 group-hover:border-cyan-400/50 transition-colors" />

          {/* Dynamic Shadow beneath the Fish (Upper perspective depth) */}
          <div className="absolute -bottom-2 w-22 h-5 rounded-full bg-[#020e1f]/75 blur-sm pointer-events-none scale-y-75" />

          {/* ── MODERN FUTURISTIC CYBER-FISH (Facing Forward / Seen from Upper Angle) ── */}
          <svg
            viewBox="-75 -75 150 205"
            className="w-full h-full overflow-visible drop-shadow-[0_14px_28px_rgba(2,132,199,0.75)]"
          >
            <defs>
              <linearGradient id="cyberHullGradUpper3" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#040e1b" />
                <stop offset="25%" stopColor="#081e38" />
                <stop offset="50%" stopColor="#0f345c" />
                <stop offset="75%" stopColor="#081e38" />
                <stop offset="100%" stopColor="#040e1b" />
              </linearGradient>

              <linearGradient id="cyberTopPlateGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e4e79" />
                <stop offset="50%" stopColor="#0f345c" />
                <stop offset="100%" stopColor="#06182d" />
              </linearGradient>

              <linearGradient id="neonLaserGradUpper3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="30%" stopColor="#00f0ff" stopOpacity="0.95" />
                <stop offset="85%" stopColor="#0284c7" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.8" />
              </linearGradient>

              <linearGradient id="cyberHoloFinGradUpper3" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.95" />
                <stop offset="50%" stopColor="#0284c7" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.35" />
              </linearGradient>

              <radialGradient id="cyberCoreGradUpper3" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#00f0ff" />
                <stop offset="75%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#031933" />
              </radialGradient>

              <linearGradient id="headlightBeam3" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* ── FORWARD ILLUMINATION BEAMS (Projected into the deep water ahead) ── */}
            <g transform={`rotate(${swimState.headAngle}, 0, 0)`} className="pointer-events-none">
              <polygon points="-8,-48 -24,-72 -14,-72 -5,-48" fill="url(#headlightBeam3)" />
              <polygon points="8,-48 24,-72 14,-72 5,-48" fill="url(#headlightBeam3)" />
            </g>

            {/* ── 1. MODERN GEOMETRIC PECTORAL HYDRO-WINGS ── */}
            <g
              transform={`translate(-18, 5) rotate(${swimState.pectLeftAngle}) scale(${swimState.pectScale}, 1)`}
              className="transition-transform duration-100"
            >
              <path
                d="M 0 0 L -30 10 L -36 28 L -24 38 L -6 20 Z"
                fill="url(#cyberHoloFinGradUpper3)"
                stroke="#00f0ff"
                strokeWidth="1.2"
                className="drop-shadow-[0_0_10px_rgba(0,240,255,0.7)]"
              />
              <path d="M 0 4 L -26 14 L -30 26" stroke="#ffffff" strokeWidth="0.8" fill="none" strokeOpacity="0.8" />
              <path d="M 0 9 L -18 18 L -22 28" stroke="#38bdf8" strokeWidth="0.7" fill="none" strokeOpacity="0.7" />
            </g>

            <g
              transform={`translate(18, 5) rotate(${swimState.pectRightAngle}) scale(${swimState.pectScale}, 1)`}
              className="transition-transform duration-100"
            >
              <path
                d="M 0 0 L 30 10 L 36 28 L 24 38 L 6 20 Z"
                fill="url(#cyberHoloFinGradUpper3)"
                stroke="#00f0ff"
                strokeWidth="1.2"
                className="drop-shadow-[0_0_10px_rgba(0,240,255,0.7)]"
              />
              <path d="M 0 4 L 26 14 L 30 26" stroke="#ffffff" strokeWidth="0.8" fill="none" strokeOpacity="0.8" />
              <path d="M 0 9 L 18 18 L 22 28" stroke="#38bdf8" strokeWidth="0.7" fill="none" strokeOpacity="0.7" />
            </g>

            {/* ── 2. UPPER-PERSPECTIVE AERO HULL & FORWARD-FACING SNOUT ── */}
            <g transform={`rotate(${swimState.headAngle}, 0, 0)`}>
              <path
                d="M 0 -52 
                   L 14 -44 L 23 -22 L 24 6 L 16 32 L 8 48
                   L -8 48 L -16 32 L -24 6 L -23 -22 L -14 -44 Z"
                fill="url(#cyberHullGradUpper3)"
                stroke="#00f0ff"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />

              <path
                d="M 0 -48 
                   L 10 -40 L 15 -18 L 12 12 L 0 20
                   L -12 12 L -15 -18 L -10 -40 Z"
                fill="url(#cyberTopPlateGrad3)"
                stroke="#00ffff"
                strokeWidth="0.8"
                strokeOpacity="0.6"
              />

              <path
                d="M 0 -48 L 0 46"
                stroke="url(#neonLaserGradUpper3)"
                strokeWidth="2.4"
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(0,240,255,0.9)]"
              />

              <g transform="translate(0, 0)">
                <polygon
                  points="0,-8 7,-4 7,4 0,8 -7,4 -7,-4"
                  fill="url(#cyberCoreGradUpper3)"
                  stroke="#00ffff"
                  strokeWidth="1.2"
                  className="drop-shadow-[0_0_12px_rgba(0,240,255,1)]"
                />
                <circle cx="0" cy="0" r="2.8" fill="#ffffff" />
              </g>

              <circle cx="-7" cy="-46" r="2.5" fill="#ffffff" stroke="#00f0ff" strokeWidth="0.8" className="drop-shadow-[0_0_6px_#00f0ff]" />
              <circle cx="7" cy="-46" r="2.5" fill="#ffffff" stroke="#00f0ff" strokeWidth="0.8" className="drop-shadow-[0_0_6px_#00f0ff]" />

              <g transform="translate(-17, -26)">
                <rect x="-3.5" y="-3" width="7" height="6" rx="2" fill="#020e1f" stroke="#00f0ff" strokeWidth="0.8" />
                <circle cx="0" cy="0" r="2.0" fill="#00ffff" />
              </g>
              <g transform="translate(17, -26)">
                <rect x="-3.5" y="-3" width="7" height="6" rx="2" fill="#020e1f" stroke="#00f0ff" strokeWidth="0.8" />
                <circle cx="0" cy="0" r="2.0" fill="#00ffff" />
              </g>

              {/* ── 3. ARTICULATED CYBER-TAIL PEDUNCLE (Moves ONLY when user scrolls) ── */}
              <g transform={`translate(0, 46) rotate(${swimState.tailAngle})`}>
                <polygon
                  points="-8,0 -5,28 0,34 5,28 8,0"
                  fill="url(#cyberHullGradUpper3)"
                  stroke="#0284c7"
                  strokeWidth="1.0"
                />
                <path
                  d="M 0 0 L 0 32"
                  stroke="url(#neonLaserGradUpper3)"
                  strokeWidth="2.0"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_6px_rgba(0,240,255,0.85)]"
                />

                {/* ── 4. MODERN FUTURISTIC HOLOGRAPHIC CAUDAL FIN ── */}
                <g transform={`translate(0, 32) rotate(${swimState.finAngle})`}>
                  <path
                    d="M 0 0 
                       L -22 14 L -40 32 L -42 48 L -24 52 L -8 40 L 0 28
                       L 8 40 L 24 52 L 42 48 L 40 32 L 22 14 Z"
                    fill="url(#cyberHoloFinGradUpper3)"
                    stroke="#00f0ff"
                    strokeWidth="1.4"
                    className="drop-shadow-[0_0_14px_rgba(0,240,255,0.85)]"
                  />

                  <path d="M 0 4 L -24 28 L -34 44" stroke="#ffffff" strokeWidth="1.0" strokeOpacity="0.85" fill="none" />
                  <path d="M 0 4 L -12 30 L -18 48" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.75" fill="none" />
                  <path d="M 0 4 L 0 26" stroke="#ffffff" strokeWidth="1.2" strokeOpacity="0.9" fill="none" />
                  <path d="M 0 4 L 12 30 L 18 48" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.75" fill="none" />
                  <path d="M 0 4 L 24 28 L 34 44" stroke="#ffffff" strokeWidth="1.0" strokeOpacity="0.85" fill="none" />

                  <g transform={`rotate(${swimState.finTipWave}, 0, 38)`}>
                    <path
                      d="M -32 46 L -16 48 L 0 34 L 16 48 L 32 46"
                      stroke="#ffffff"
                      strokeWidth="1.0"
                      strokeOpacity="0.9"
                      fill="none"
                    />
                  </g>
                </g>
              </g>

            </g>
          </svg>

          {/* High-Tech Energy Wave Ring beneath the Fish */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.65, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-1 w-24 h-4 rounded-full border border-cyan-400/50 blur-xs pointer-events-none"
          />
        </motion.div>
      </div>
    </>
  );
};
