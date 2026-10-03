import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Swords,
  Trophy,
  Shield,
  Crown,
  Maximize2,
  X,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { dreamAudio } from '../../utils/audio';

export const CosmicTiersSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const handleRedirect = () => {
    dreamAudio.playHover();
    navigate('/not-available?project=CosmicTiers');
  };

  const handleImageClick = (src: string) => {
    dreamAudio.playPaperPlaneFlutter();
    setActiveImage(src);
  };

  const cosmicScreenshot = 'https://api.microlink.io/?url=https%3A%2F%2FCosmicTiers.onrender.com&screenshot=true&meta=false&embed=screenshot.url';

  return (
    <div
      id="space-project-cosmictiers"
      className="relative w-full max-w-5xl mx-auto px-4 py-8 flex flex-col items-center justify-center pointer-events-auto select-none"
    >
      {/* ── THEMATIC SWORD & TROPHY MINECRAFT AMBIENCE ────────────────────── */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-[520px] h-[350px] rounded-full bg-purple-600/15 blur-[100px]" />
        <div className="w-[320px] h-[260px] rounded-full bg-amber-500/15 blur-[80px]" />
      </div>

      {/* Floating Sword & Trophy Badges */}
      <div className="absolute top-0 left-6 sm:left-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/70 border border-purple-500/40 text-[11px] font-mono text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.25)] pointer-events-none">
        <Swords className="w-3.5 h-3.5 text-purple-400" />
        <span>CRACKED MINECRAFT PVP</span>
      </div>

      <div className="absolute top-2 right-6 sm:right-10 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-[11px] font-mono text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)] pointer-events-none">
        <Trophy className="w-3.5 h-3.5 text-amber-400" />
        <span>OFFICIAL TIER LADDER</span>
      </div>

      {/* ── SECTION CONTENT: MIDDLE HERO WITH FLANKING EXTRAS ────────────── */}
      <div className="relative w-full flex items-center justify-center gap-6 lg:gap-12 mt-4">
        
        {/* ── LEFT SIDE: EXTRA ELEMENT 1 (PVP SWORD & COMBAT TIERS) ── */}
        <div className="hidden md:flex flex-1 items-center justify-end">
          <motion.div
            animate={{
              y: [-6, 7, -6],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 6.3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative group cursor-pointer"
            onClick={() => handleImageClick(cosmicScreenshot)}
          >
            <div className="relative w-64 lg:w-72 rounded-2xl p-1.5 bg-gradient-to-b from-purple-500/30 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-purple-500/40 shadow-[0_12px_35px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105 group-hover:border-purple-400">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-950">
                <img
                  src={cosmicScreenshot}
                  alt="CosmicTiers Web Portal"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    // Clean fallback if microlink is buffering
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-purple-950/20 to-transparent" />
                
                {/* Floating Minecraft PvP Badges */}
                <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-purple-900/90 border border-purple-400/40 text-[10px] font-mono text-purple-200">
                      <Swords className="w-3 h-3 text-purple-300" />
                      <span>Combat Tiers</span>
                    </span>
                    <div className="flex items-center gap-1 text-[10px] font-mono text-amber-300">
                      <Crown className="w-3 h-3 text-amber-400" />
                      <span>HT1</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 bg-slate-900/80 px-2 py-1 rounded border border-slate-700/50">
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3 text-cyan-400" />
                        <span>Netherite Pot</span>
                      </span>
                      <span className="text-emerald-400 font-bold">Tier 1</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-300 bg-slate-900/80 px-2 py-1 rounded border border-slate-700/50">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3 h-3 text-orange-400" />
                        <span>Crystal PvP</span>
                      </span>
                      <span className="text-purple-400 font-bold">Tier 1</span>
                    </div>
                  </div>
                </div>

                <div className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── MIDDLE: LOGO, NAME, DESCRIBE, BUTTON ── */}
        <div className="flex flex-col items-center text-center max-w-md mx-auto z-10 px-2 flex-shrink-0">
          
          {/* Logo in Middle */}
          <motion.div
            whileHover={{ scale: 1.08, rotate: 2 }}
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1.5 bg-gradient-to-b from-purple-500/40 via-slate-900/80 to-slate-950 border border-purple-500/50 shadow-[0_0_35px_rgba(168,85,247,0.35)] mb-4 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={handleRedirect}
            title="CosmicTiers"
          >
            <img
              src="https://i.postimg.cc/x1D3qKbB/1789744380571.png"
              alt="CosmicTiers Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-2xl"
            />
            {/* Ambient Purple Amethyst Halo */}
            <div className="absolute inset-0 bg-purple-500/10 pointer-events-none rounded-3xl" />
          </motion.div>

          {/* Name */}
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
              <span>CosmicTiers</span>
            </h2>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-[10px] font-mono">
              <Swords className="w-3 h-3 text-purple-400" />
              <span>MINECRAFT PVP</span>
            </span>
          </div>

          {/* Small description in small font */}
          <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-sm mb-6 font-normal">
            a powerful and modern Minecraft pvp tier list system for cracked users.
          </p>

          {/* Redirect to action button */}
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={handleRedirect}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 text-white font-semibold text-xs font-mono tracking-wider shadow-[0_0_20px_rgba(168,85,247,0.35)] hover:brightness-110 transition-all cursor-pointer"
            >
              <span>ACCESS COSMIC TIERS</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </motion.button>
          </div>

          {/* Mobile Extras Row */}
          <div className="flex md:hidden items-center justify-center gap-3 mt-6">
            <div
              className="w-36 p-2 rounded-xl bg-slate-900/90 border border-purple-500/30 text-[10px] font-mono flex flex-col gap-1 cursor-pointer"
              onClick={() => handleImageClick(cosmicScreenshot)}
            >
              <div className="flex items-center gap-1 text-purple-300">
                <Swords className="w-3 h-3" />
                <span>PvP Tiers</span>
              </div>
              <span className="text-amber-300">HT1 Netherite</span>
            </div>
            <div
              className="w-36 p-2 rounded-xl bg-slate-900/90 border border-amber-500/30 text-[10px] font-mono flex flex-col gap-1 cursor-pointer"
              onClick={handleRedirect}
            >
              <div className="flex items-center gap-1 text-amber-300">
                <Trophy className="w-3 h-3" />
                <span>Leaderboard</span>
              </div>
              <span className="text-emerald-400">#1 2,480 ELO</span>
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDE: EXTRA ELEMENT 2 (TROPHY & CHAMPIONS CARD) ── */}
        <div className="hidden md:flex flex-1 items-center justify-start">
          <motion.div
            animate={{
              y: [7, -7, 7],
              rotate: [2, -1.5, 2],
            }}
            transition={{
              duration: 6.7,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative group cursor-pointer"
            onClick={handleRedirect}
          >
            <div className="relative w-64 lg:w-72 rounded-2xl p-4 bg-gradient-to-b from-amber-500/25 via-slate-800/70 to-slate-900/90 backdrop-blur-xl border border-amber-500/35 shadow-[0_12px_35px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105 group-hover:border-amber-400">
              {/* Trophy Icon & Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">PVP Leaderboard</h4>
                    <p className="text-[10px] font-mono text-amber-400/80">Season Champions</p>
                  </div>
                </div>
                <Crown className="w-4 h-4 text-amber-400 animate-pulse" />
              </div>

              {/* Ranking Scorecards */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] font-mono">
                  <span className="text-amber-300 font-bold">#1 Champion</span>
                  <span className="text-emerald-400">2,480 ELO</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] font-mono">
                  <span className="text-slate-300 font-bold">#2 High Tier I</span>
                  <span className="text-emerald-400">2,320 ELO</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/70 border border-slate-800 text-[11px] font-mono">
                  <span className="text-purple-300 font-bold">#3 High Tier I</span>
                  <span className="text-emerald-400">2,190 ELO</span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                <span>Cracked Network</span>
                <span className="text-amber-400">Global Ranks</span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* ── LIGHTBOX MODAL FOR PREVIEW IMAGES ── */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
          onClick={() => setActiveImage(null)}
        >
          <div className="relative max-w-2xl w-full rounded-2xl overflow-hidden border border-purple-500/40 shadow-2xl bg-slate-900">
            <button
              type="button"
              onClick={() => setActiveImage(null)}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-slate-950/80 text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={activeImage}
              alt="Enlarged view"
              referrerPolicy="no-referrer"
              className="w-full max-h-[75vh] object-contain bg-slate-950"
            />
          </div>
        </div>
      )}
    </div>
  );
};
