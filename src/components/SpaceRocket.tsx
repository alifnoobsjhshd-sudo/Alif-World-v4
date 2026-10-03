import React, { useEffect, useState } from 'react';
import { motion, MotionValue, useTransform } from 'motion/react';

interface SpaceRocketProps {
  scrollVelocity?: MotionValue<number>;
  isSpeedEffectActive?: boolean;
}

export const SpaceRocket: React.FC<SpaceRocketProps> = ({ scrollVelocity, isSpeedEffectActive = false }) => {
  // Subtle interactive pilot steering based on cursor position
  const [steering, setSteering] = useState({ x: 0, roll: 0 });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      const normX = (e.clientX / window.innerWidth) - 0.5; // -0.5 (left) to 0.5 (right)
      setSteering({
        x: normX * 36, // ±18px subtle lateral translation
        roll: normX * 5.5, // ±2.75deg subtle aerospace banking
      });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // ── DYNAMIC TAIL EXHAUST: ONLY EMITS WHEN SCROLLING FORWARD ────────────────
  // Stationary (velocity <= 0) or scrolling backward: tail is completely hidden.
  // Scrolling forward (velocity > 5): realistic supersonic mach plume blooms from nozzle bells.
  const tailOpacity = useTransform(
    scrollVelocity || { get: () => 0 },
    (v: number) => {
      if (v <= 6) return 0;
      return Math.min(1, Math.max(0, (v - 6) / 130));
    }
  );

  const tailScaleY = useTransform(
    scrollVelocity || { get: () => 0 },
    (v: number) => {
      if (v <= 6) return 0;
      return Math.min(1.85, 0.45 + Math.max(0, (v - 6) / 220));
    }
  );

  const tailScaleX = useTransform(
    scrollVelocity || { get: () => 0 },
    (v: number) => {
      if (v <= 6) return 0.6;
      return Math.min(1.2, 0.8 + Math.max(0, (v - 6) / 380));
    }
  );

  const nozzleGlowOpacity = useTransform(
    scrollVelocity || { get: () => 0 },
    (v: number) => {
      if (v <= 6) return 0.12;
      return Math.min(1, 0.35 + (v / 180));
    }
  );

  return (
    <div
      id="space-rocket-static"
      className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 pointer-events-none z-30 select-none flex flex-col items-center"
      style={{
        perspective: '850px',
        perspectiveOrigin: '50% 85%', // Third-person chase camera view
      }}
    >
      {/* ── 3D SPACECRAFT RIG (CLEAN FORWARD INCLINATION WITH SUBTLE PILOT STEERING) ── */}
      <div
        className="relative flex flex-col items-center pointer-events-none transition-transform duration-300 ease-out"
        style={{
          transform: `translateX(${steering.x}px) translateY(${isSpeedEffectActive ? -14 : 0}px) rotateX(58deg) rotateY(0deg) rotateZ(${steering.roll}deg)`,
          transformStyle: 'preserve-3d',
          transformOrigin: '50% 65%',
        }}
      >
        {/* ── UNIFIED COMMAND-CLASS AEROSPACE AIRFRAME (160px × 152px) ──────── */}
        {/* Fuselage and swept-back wings are completely unified in geometry with ZERO gap */}
        <div
          className="relative w-[160px] h-[152px] flex flex-col items-center"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* 1. SOLID AEROSPACE WINGS & FUSELAGE HULL */}
          <div
            className="absolute inset-0 flex flex-col items-center"
            style={{
              transform: 'translateZ(14px)',
              backfaceVisibility: 'visible',
            }}
          >
            <svg
              viewBox="0 0 160 152"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full drop-shadow-[0_14px_28px_rgba(0,0,0,0.92)]"
            >
              <defs>
                {/* Composite Titanium / Ceramic Hull Gradient */}
                <linearGradient id="chaseHullGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="18%" stopColor="#94a3b8" />
                  <stop offset="38%" stopColor="#f1f5f9" />
                  <stop offset="50%" stopColor="#ffffff" />
                  <stop offset="62%" stopColor="#f1f5f9" />
                  <stop offset="82%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#1e293b" />
                </linearGradient>

                {/* Electric Cyan Wing & Hull Accents */}
                <linearGradient id="wingGlowGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="60%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>

                {/* Ion Drive Dorsal Spine */}
                <linearGradient id="chaseCyanSpine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="50%" stopColor="#0284c7" />
                  <stop offset="100%" stopColor="#0369a1" />
                </linearGradient>

                {/* Cockpit Canopy Bubble */}
                <linearGradient id="chaseCanopy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e0f2fe" />
                  <stop offset="40%" stopColor="#38bdf8" />
                  <stop offset="80%" stopColor="#0369a1" />
                  <stop offset="100%" stopColor="#082f49" />
                </linearGradient>

                {/* Rear Engine Bulkhead Heat Shield */}
                <linearGradient id="chaseEngineShield" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#090d16" />
                  <stop offset="25%" stopColor="#1e293b" />
                  <stop offset="50%" stopColor="#334155" />
                  <stop offset="75%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#090d16" />
                </linearGradient>
              </defs>

              {/* ── PORT (LEFT) DELTA WING: SOLID CONTINUOUS CONNECTION TO FUSELAGE FLANK ── */}
              {/* Root connects seamlessly from shoulder (64, 54) to flank (62, 112) */}
              <polygon
                points="64,54 8,102 14,116 62,112"
                fill="url(#wingGlowGrad)"
                stroke="#0284c7"
                strokeWidth="1.5"
              />
              {/* Left Wing Elevon Control Flap */}
              <polygon points="61,96 18,105 20,114 62,111" fill="#0369a1" opacity="0.5" />
              {/* Left Wing Aerodynamic Panel Seam */}
              <line x1="58" y1="78" x2="26" y2="103" stroke="#7dd3fc" strokeWidth="1" strokeDasharray="3 2" />
              {/* Port Wingtip Red Navigation Strobe */}
              <circle cx="9" cy="103" r="3" fill="#f43f5e" className="animate-pulse" />
              <circle cx="9" cy="103" r="7" fill="#f43f5e" opacity="0.3" />

              {/* ── STARBOARD (RIGHT) DELTA WING: SOLID CONTINUOUS CONNECTION TO FUSELAGE FLANK ── */}
              {/* Root connects seamlessly from shoulder (96, 54) to flank (98, 112) */}
              <polygon
                points="96,54 152,102 146,116 98,112"
                fill="url(#wingGlowGrad)"
                stroke="#0284c7"
                strokeWidth="1.5"
              />
              {/* Right Wing Elevon Control Flap */}
              <polygon points="99,96 142,105 140,114 98,111" fill="#0369a1" opacity="0.5" />
              {/* Right Wing Aerodynamic Panel Seam */}
              <line x1="102" y1="78" x2="134" y2="103" stroke="#7dd3fc" strokeWidth="1" strokeDasharray="3 2" />
              {/* Starboard Wingtip Green Navigation Strobe */}
              <circle cx="151" cy="103" r="3" fill="#10b981" className="animate-pulse" />
              <circle cx="151" cy="103" r="7" fill="#10b981" opacity="0.3" />

              {/* ── MAIN FUSELAGE LIFTING BODY ── */}
              {/* Forward Sensor Needle */}
              <line x1="80" y1="2" x2="80" y2="14" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
              <circle cx="80" cy="3" r="1.5" fill="#ffffff" />

              {/* Arrowhead Hull Structure */}
              <path
                d="M80 12 L96 54 L98 120 L62 120 L64 54 Z"
                fill="url(#chaseHullGrad)"
                stroke="#64748b"
                strokeWidth="1.5"
              />

              {/* Aeronautical Panel Seam Lines */}
              <line x1="68" y1="72" x2="92" y2="72" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 2" />
              <line x1="66" y1="96" x2="94" y2="96" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 2" />

              {/* Central Dorsal Power Spine */}
              <rect x="77.5" y="22" width="5" height="92" fill="url(#chaseCyanSpine)" rx="2.5" />
              <line x1="80" y1="26" x2="80" y2="108" stroke="#e0f2fe" strokeWidth="1.5" opacity="0.85" />

              {/* Forward Cockpit Canopy */}
              <ellipse cx="80" cy="42" rx="8" ry="14" fill="url(#chaseCanopy)" stroke="#bae6fd" strokeWidth="1.5" />
              {/* Canopy Glass Specular Highlight */}
              <ellipse cx="77.5" cy="37" rx="3" ry="6.5" fill="#ffffff" opacity="0.75" />

              {/* Rear Structural Heatshield Bulkhead */}
              <path
                d="M58 116 L102 116 L97 134 L63 134 Z"
                fill="url(#chaseEngineShield)"
                stroke="#0f172a"
                strokeWidth="1.5"
              />
              {/* Heat Shield Thermal Radiator Vanes */}
              <line x1="69" y1="120" x2="69" y2="132" stroke="#475569" strokeWidth="1" />
              <line x1="75" y1="120" x2="75" y2="132" stroke="#475569" strokeWidth="1" />
              <line x1="85" y1="120" x2="85" y2="132" stroke="#475569" strokeWidth="1" />
              <line x1="91" y1="120" x2="91" y2="132" stroke="#475569" strokeWidth="1" />
            </svg>
          </div>

          {/* 2. DORSAL STABILIZER VERTICAL FIN (Perpendicular in 3D along centerline) */}
          <div
            className="absolute top-[64px] left-1/2 -translate-x-1/2 w-[8px] h-[56px] pointer-events-none"
            style={{
              transform: 'rotateY(90deg) translateZ(18px)',
              transformStyle: 'preserve-3d',
            }}
          >
            <svg viewBox="0 0 56 30" className="w-[56px] h-[30px] drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
              <polygon points="0,30 42,0 56,0 48,30" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
              <circle cx="50" cy="5" r="2.5" fill="#fde047" />
            </svg>
          </div>

          {/* 3. REAR ENGINE NOZZLE ARRAY (Directly anchored to the rear bulkhead) */}
          <div
            className="absolute bottom-1 w-[96px] left-1/2 -translate-x-1/2 flex justify-between items-end"
            style={{
              transform: 'translateZ(18px)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* ── PORT (LEFT) AUXILIARY VECTOR NOZZLE ── */}
            <div className="relative w-6 h-6 rounded-full bg-slate-950 border-[2.5px] border-slate-600 shadow-[inset_0_3px_6px_rgba(0,0,0,1)] flex items-center justify-center">
              <motion.div
                style={{ opacity: nozzleGlowOpacity }}
                className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#38bdf8]"
              />

              {/* Seamless Port Exhaust Plume */}
              <motion.div
                style={{
                  opacity: tailOpacity,
                  scaleY: tailScaleY,
                  scaleX: tailScaleX,
                  transformOrigin: '50% 0%',
                }}
                className="absolute top-[75%] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20"
              >
                <div
                  className="w-3.5 h-16 rounded-b-full bg-gradient-to-b from-white via-cyan-300 via-sky-500 to-transparent origin-top rotate-[-4deg]"
                  style={{
                    boxShadow: '0 0 14px rgba(56, 189, 248, 0.9), 0 0 24px rgba(2, 132, 199, 0.6)',
                  }}
                />
                <div className="absolute top-0 w-1.5 h-8 rounded-b-full bg-white shadow-[0_0_8px_#ffffff] origin-top opacity-95" />
              </motion.div>
            </div>

            {/* ── CENTER MAIN HEAVY THRUSTER NOZZLE ── */}
            <div className="relative w-8 h-8 rounded-full bg-slate-950 border-[3px] border-sky-400 shadow-[inset_0_4px_8px_rgba(0,0,0,1)] flex items-center justify-center">
              <div className="absolute inset-[3px] rounded-full border border-slate-700 pointer-events-none" />

              <motion.div
                style={{ opacity: nozzleGlowOpacity }}
                className="w-4.5 h-4.5 rounded-full bg-white shadow-[0_0_16px_#38bdf8,0_0_24px_#0284c7]"
              />

              {/* Seamless Center Supersonic Plume with Mach Shock Diamonds */}
              <motion.div
                style={{
                  opacity: tailOpacity,
                  scaleY: tailScaleY,
                  scaleX: tailScaleX,
                  transformOrigin: '50% 0%',
                  willChange: 'transform, opacity',
                }}
                className="absolute top-[75%] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30"
              >
                {/* Outer Plasma Gas Shroud */}
                <div
                  className="w-6 h-28 sm:h-36 rounded-b-full bg-gradient-to-b from-white via-cyan-200 via-sky-400 via-blue-600 to-transparent origin-top"
                  style={{
                    boxShadow: '0 0 20px rgba(56, 189, 248, 0.95), 0 0 36px rgba(2, 132, 199, 0.75), 0 0 60px rgba(14, 165, 233, 0.4)',
                  }}
                />

                {/* Hyper-Intense White Supersonic Core */}
                <div className="absolute top-0 w-3 h-18 sm:h-22 rounded-b-full bg-white shadow-[0_0_14px_#ffffff] origin-top opacity-95" />

                {/* Mach Shock Diamonds */}
                <div
                  className="absolute top-2.5 w-2.5 h-3.5 bg-white origin-center rotate-45 shadow-[0_0_10px_#ffffff] animate-pulse"
                  style={{ borderRadius: '1px' }}
                />
                <div
                  className="absolute top-8 w-2 h-3 bg-cyan-200 origin-center rotate-45 shadow-[0_0_8px_#38bdf8]"
                  style={{ borderRadius: '1px' }}
                />
                <div
                  className="absolute top-14 w-1.5 h-2.5 bg-sky-300 origin-center rotate-45 shadow-[0_0_6px_#0284c7] opacity-80"
                  style={{ borderRadius: '1px' }}
                />

                {/* Ambient Radiant Engine Bloom (0ms radial gradient) */}
                <div
                  className="absolute -top-4 w-36 h-36 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, transparent 70%)',
                  }}
                />

                {/* Hyperdrive Warp Speed Afterburner Plume & Shockwave Rings */}
                {isSpeedEffectActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-30"
                  >
                    {/* Intense Cyan Hyperdrive Plasma Flame */}
                    <div
                      className="w-12 h-44 rounded-b-full bg-gradient-to-b from-white via-cyan-300 via-sky-500 to-transparent origin-top shadow-[0_0_35px_rgba(34,211,238,0.95),0_0_70px_rgba(56,189,248,0.7)] animate-pulse"
                    />
                    {/* Shockwave Rings */}
                    <div className="absolute top-10 w-20 h-5 rounded-full border-2 border-cyan-300/80 shadow-[0_0_20px_#22d3ee] animate-ping" />
                    <div className="absolute top-22 w-14 h-4 rounded-full border border-sky-400/90 shadow-[0_0_15px_#38bdf8]" />
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* ── STARBOARD (RIGHT) AUXILIARY VECTOR NOZZLE ── */}
            <div className="relative w-6 h-6 rounded-full bg-slate-950 border-[2.5px] border-slate-600 shadow-[inset_0_3px_6px_rgba(0,0,0,1)] flex items-center justify-center">
              <motion.div
                style={{ opacity: nozzleGlowOpacity }}
                className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#38bdf8]"
              />

              {/* Seamless Starboard Exhaust Plume */}
              <motion.div
                style={{
                  opacity: tailOpacity,
                  scaleY: tailScaleY,
                  scaleX: tailScaleX,
                  transformOrigin: '50% 0%',
                }}
                className="absolute top-[75%] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-20"
              >
                <div
                  className="w-3.5 h-16 rounded-b-full bg-gradient-to-b from-white via-cyan-300 via-sky-500 to-transparent origin-top rotate-[4deg]"
                  style={{
                    boxShadow: '0 0 14px rgba(56, 189, 248, 0.9), 0 0 24px rgba(2, 132, 199, 0.6)',
                  }}
                />
                <div className="absolute top-0 w-1.5 h-8 rounded-b-full bg-white shadow-[0_0_8px_#ffffff] origin-top opacity-95" />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
