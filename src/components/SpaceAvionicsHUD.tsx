import React, { useEffect, useState } from 'react';
import { motion, MotionValue } from 'motion/react';

export interface SpaceWaypoint {
  id: string;
  name: string;
  shortName: string;
  depth: number;
}

interface SpaceAvionicsHUDProps {
  depthValue: MotionValue<number>;
  smoothedDepth: MotionValue<number>;
  scrollVelocity: MotionValue<number>;
  maxDepth: number;
  waypoints: SpaceWaypoint[];
  onWarpJump?: (targetDepth: number) => void;
  onReverseStart: () => void;
  onReverseEnd: () => void;
  isReverseActive: boolean;
}

export const SpaceAvionicsHUD: React.FC<SpaceAvionicsHUDProps> = ({
  smoothedDepth,
  scrollVelocity,
  maxDepth,
  onReverseStart,
  onReverseEnd,
  isReverseActive,
}) => {
  const [currentDepth, setCurrentDepth] = useState(0);
  const [currentVelocity, setCurrentVelocity] = useState(0);

  useEffect(() => {
    const unsubDepth = smoothedDepth.on('change', (v) => {
      setCurrentDepth(Math.round(v));
    });
    const unsubVel = scrollVelocity.on('change', (v) => {
      // Scale velocity to cosmic sub-light/super-luminal readout (e.g. 0.00c to ~3.5c)
      const c = (Math.abs(v) / 42).toFixed(2);
      setCurrentVelocity(parseFloat(c));
    });
    return () => {
      unsubDepth();
      unsubVel();
    };
  }, [smoothedDepth, scrollVelocity]);

  const progressPct = Math.min(100, Math.max(0, (currentDepth / maxDepth) * 100));

  return (
    <div className="fixed top-16 sm:top-18 right-4 sm:right-6 pointer-events-none z-40 select-none flex flex-col items-end gap-1.5">
      {/* ── TOP AVIONICS / TELEMETRY STATUS & REVERSE WARP BUTTON ─────────── */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Speed and Distance Display */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)] text-[11px] font-mono text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="tracking-widest uppercase text-slate-300">
            TELEMETRY
          </span>
          <span className="text-slate-600">|</span>
          <span className="font-medium text-white">
            {currentVelocity > 0.05 ? `${currentVelocity.toFixed(2)}c` : 'CRUISE'}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-300 font-bold">
            {currentDepth} <span className="text-[9px] text-cyan-400/80">LY</span>
          </span>
        </div>

        {/* ── "↓" BUTTON (Directly next to speed & distance elements) ────── */}
        <motion.button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            onReverseStart();
          }}
          onPointerUp={onReverseEnd}
          onPointerLeave={onReverseEnd}
          onPointerCancel={onReverseEnd}
          onContextMenu={(e) => e.preventDefault()}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className={`h-[29px] px-2.5 rounded-lg flex items-center justify-center border font-mono font-bold text-sm transition-all select-none cursor-pointer ${
            isReverseActive
              ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_16px_rgba(6,182,212,0.8)] scale-95'
              : 'bg-slate-950/85 hover:bg-slate-900 border-cyan-500/40 hover:border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
          }`}
          title="Hold to move backwards fast with rocket speed effect"
          aria-label="Move backwards"
        >
          <span className="text-base font-black leading-none">↓</span>
        </motion.button>
      </div>

      {/* Depth Progress Bar */}
      <div className="w-48 sm:w-60 h-1.5 rounded-full bg-slate-800/80 overflow-hidden border border-slate-700/50">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-purple-400 transition-all duration-150"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
};
