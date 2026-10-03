import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ExternalLink,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Sparkles,
  CheckCircle2,
  Maximize2,
  X,
} from 'lucide-react';
import { dreamAudio } from '../../utils/audio';

export const KenoStoreSection: React.FC = () => {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const handleOpenSite = () => {
    dreamAudio.playHover();
    window.open('https://www.kenostores.com', '_blank', 'noopener,noreferrer');
  };

  const handleImageClick = (src: string) => {
    dreamAudio.playPaperPlaneFlutter();
    setActiveImage(src);
  };

  return (
    <div
      id="space-project-keno-store"
      className="relative w-full max-w-5xl mx-auto px-4 py-8 flex flex-col items-center justify-center pointer-events-auto select-none"
    >
      {/* ── THEMATIC SHOPPING AMBIENCE ─────────────────────────────────────── */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[350px] rounded-full bg-emerald-500/10 blur-[100px]" />
        <div className="w-[300px] h-[250px] rounded-full bg-cyan-500/10 blur-[80px]" />
      </div>

      {/* Floating Theme Badges */}
      <div className="absolute top-0 left-6 sm:left-12 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-mono text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] animate-pulse pointer-events-none">
        <ShoppingBag className="w-3.5 h-3.5 text-emerald-400" />
        <span>FASHION • GADGETS • ESSENTIALS</span>
      </div>

      <div className="absolute top-2 right-6 sm:right-12 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)] pointer-events-none">
        <ShoppingCart className="w-3.5 h-3.5 text-cyan-400" />
        <span>SECURE ONLINE SHOPPING</span>
      </div>

      {/* ── SECTION CONTENT: MIDDLE HERO WITH FLANKING EXTRAS ────────────── */}
      <div className="relative w-full flex items-center justify-center gap-6 lg:gap-12 mt-4">
        
        {/* ── LEFT SIDE: EXTRA IMAGE 1 ── */}
        <div className="hidden md:flex flex-1 items-center justify-end">
          <motion.div
            animate={{
              y: [-6, 6, -6],
              rotate: [-2, 1, -2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative group cursor-pointer"
            onClick={() => handleImageClick('https://i.postimg.cc/HsGpNxMp/IMG-20260918-204604-807.png')}
          >
            <div className="relative w-64 lg:w-72 rounded-2xl p-1.5 bg-gradient-to-b from-emerald-500/30 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-emerald-500/30 shadow-[0_12px_35px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105 group-hover:border-emerald-400">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-950">
                <img
                  src="https://i.postimg.cc/HsGpNxMp/IMG-20260918-204604-807.png"
                  alt="Keno Store Preview 1"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-[10px] font-mono text-emerald-300">
                  <Tag className="w-3 h-3 text-emerald-400" />
                  <span>Store Catalog</span>
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
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1.5 bg-gradient-to-b from-emerald-400/40 via-slate-900/80 to-slate-950 border border-emerald-500/50 shadow-[0_0_35px_rgba(16,185,129,0.3)] mb-4 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={handleOpenSite}
            title="Open Keno Store"
          >
            <img
              src="https://i.postimg.cc/3wQJDwKS/Keno-Stores.webp"
              alt="Keno Store Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain rounded-2xl bg-slate-950/60 p-2"
            />
            {/* Ambient Logo Glow */}
            <div className="absolute inset-0 bg-emerald-400/10 pointer-events-none rounded-3xl" />
          </motion.div>

          {/* Name */}
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Keno Store
            </h2>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>LIVE STORE</span>
            </span>
          </div>

          {/* Small description in small font */}
          <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-sm mb-6 font-normal">
            Keno Store is a modern online shopping platform offering quality fashion, gadgets, accessories, and everyday essentials—all in one place. Shop with confidence, enjoy a simple experience, and discover products made for everyday life.
          </p>

          {/* Redirect to action button */}
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={handleOpenSite}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold text-xs font-mono tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.35)] hover:brightness-110 transition-all cursor-pointer"
            >
              <span>VISIT KENOSTORES.COM</span>
              <ExternalLink className="w-4 h-4 text-slate-950" />
            </motion.button>
          </div>

          {/* Mobile Extras Row */}
          <div className="flex md:hidden items-center justify-center gap-3 mt-6">
            <div
              className="w-32 aspect-[4/3] rounded-xl overflow-hidden border border-emerald-500/30 cursor-pointer"
              onClick={() => handleImageClick('https://i.postimg.cc/HsGpNxMp/IMG-20260918-204604-807.png')}
            >
              <img
                src="https://i.postimg.cc/HsGpNxMp/IMG-20260918-204604-807.png"
                alt="Preview 1"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="w-32 aspect-[4/3] rounded-xl overflow-hidden border border-cyan-500/30 cursor-pointer"
              onClick={() => handleImageClick('https://i.postimg.cc/YCqTDKdc/IMG-20260918-204628-833.png')}
            >
              <img
                src="https://i.postimg.cc/YCqTDKdc/IMG-20260918-204628-833.png"
                alt="Preview 2"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDE: EXTRA IMAGE 2 ── */}
        <div className="hidden md:flex flex-1 items-center justify-start">
          <motion.div
            animate={{
              y: [6, -6, 6],
              rotate: [2, -1, 2],
            }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative group cursor-pointer"
            onClick={() => handleImageClick('https://i.postimg.cc/YCqTDKdc/IMG-20260918-204628-833.png')}
          >
            <div className="relative w-64 lg:w-72 rounded-2xl p-1.5 bg-gradient-to-b from-cyan-500/30 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-cyan-500/30 shadow-[0_12px_35px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105 group-hover:border-cyan-400">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-950">
                <img
                  src="https://i.postimg.cc/YCqTDKdc/IMG-20260918-204628-833.png"
                  alt="Keno Store Preview 2"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-[10px] font-mono text-cyan-300">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Featured Collection</span>
                </div>
                <div className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>
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
          <div className="relative max-w-2xl w-full rounded-2xl overflow-hidden border border-emerald-500/40 shadow-2xl bg-slate-900">
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
