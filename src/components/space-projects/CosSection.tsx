import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import {
  Bot,
  Binary,
  Maximize2,
  X,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { dreamAudio } from '../../utils/audio';

export const CosSection: React.FC = () => {
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const handleRedirect = () => {
    dreamAudio.playHover();
    navigate('/not-available?project=Cos');
  };

  const handleImageClick = (src: string) => {
    dreamAudio.playPaperPlaneFlutter();
    setActiveImage(src);
  };

  return (
    <div
      id="space-project-cos"
      className="relative w-full max-w-5xl mx-auto px-4 py-8 flex flex-col items-center justify-center pointer-events-auto select-none"
    >
      {/* ── THEMATIC MATHEMATICS & COS THETA AMBIENCE ─────────────────────── */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[350px] rounded-full bg-indigo-600/15 blur-[100px]" />
        <div className="w-[300px] h-[250px] rounded-full bg-blue-500/15 blur-[80px]" />
      </div>

      {/* Floating Mathematical Theta Formulas */}
      <div className="absolute top-0 left-6 sm:left-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/60 border border-indigo-500/30 text-[11px] font-mono text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.2)] pointer-events-none">
        <span className="font-serif italic font-bold">cos(θ)</span>
        <span>= x / r • θ ∈ [0, 2π]</span>
      </div>

      <div className="absolute top-2 right-6 sm:right-10 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-[11px] font-mono text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.2)] pointer-events-none">
        <span className="font-serif italic">cos²(θ) + sin²(θ) = 1</span>
      </div>

      {/* ── SECTION CONTENT: MIDDLE HERO WITH FLANKING EXTRAS ────────────── */}
      <div className="relative w-full flex items-center justify-center gap-6 lg:gap-12 mt-4">
        
        {/* ── LEFT SIDE: EXTRA IMAGE 1 (ANIMATED GIF) ── */}
        <div className="hidden md:flex flex-1 items-center justify-end">
          <motion.div
            animate={{
              y: [-7, 7, -7],
              rotate: [-2, 1.5, -2],
            }}
            transition={{
              duration: 6.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative group cursor-pointer"
            onClick={() => handleImageClick('https://i.postimg.cc/W1Gt8ZYQ/ezgif-4d46a0482ca958bc.gif')}
          >
            <div className="relative w-64 lg:w-72 rounded-2xl p-1.5 bg-gradient-to-b from-indigo-500/30 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-indigo-500/30 shadow-[0_12px_35px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105 group-hover:border-indigo-400">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
                <img
                  src="https://i.postimg.cc/W1Gt8ZYQ/ezgif-4d46a0482ca958bc.gif"
                  alt="Cos Bot Interaction Animation"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-[10px] font-mono text-indigo-300">
                  <Bot className="w-3 h-3 text-indigo-400" />
                  <span>Live Action Demo</span>
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
            whileHover={{ scale: 1.08, rotate: -2 }}
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1.5 bg-gradient-to-b from-indigo-400/40 via-slate-900/80 to-slate-950 border border-indigo-500/50 shadow-[0_0_35px_rgba(99,102,241,0.35)] mb-4 flex items-center justify-center overflow-hidden cursor-pointer"
            onClick={handleRedirect}
            title="Cos Bot"
          >
            <img
              src="https://i.postimg.cc/tJn4xnVk/images-1.jpg"
              alt="Cos Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-2xl"
            />
            {/* Ambient Indigo Halo */}
            <div className="absolute inset-0 bg-indigo-500/10 pointer-events-none rounded-3xl" />
          </motion.div>

          {/* Name */}
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>Cos</span>
              <span className="text-indigo-400 font-serif italic text-xl">θ</span>
            </h2>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-[10px] font-mono">
              <Bot className="w-3 h-3 text-indigo-400" />
              <span>DISCORD BOT</span>
            </span>
          </div>

          {/* Small description in small font */}
          <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-sm mb-6 font-normal">
            A powerful all in one discord bot.
          </p>

          {/* Redirect to action button */}
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              onClick={handleRedirect}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold text-xs font-mono tracking-wider shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:brightness-110 transition-all cursor-pointer"
            >
              <span>ACCESS BOT</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </motion.button>
          </div>

          {/* Mobile Extras Row */}
          <div className="flex md:hidden items-center justify-center gap-3 mt-6">
            <div
              className="w-32 aspect-[4/3] rounded-xl overflow-hidden border border-indigo-500/30 cursor-pointer"
              onClick={() => handleImageClick('https://i.postimg.cc/W1Gt8ZYQ/ezgif-4d46a0482ca958bc.gif')}
            >
              <img
                src="https://i.postimg.cc/W1Gt8ZYQ/ezgif-4d46a0482ca958bc.gif"
                alt="Demo preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="w-32 aspect-[4/3] rounded-xl overflow-hidden border border-blue-500/30 cursor-pointer"
              onClick={() => handleImageClick('https://i.postimg.cc/tgRPVDCj/IMG-20260918-210033-165.png')}
            >
              <img
                src="https://i.postimg.cc/tgRPVDCj/IMG-20260918-210033-165.png"
                alt="Commands preview"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT SIDE: EXTRA IMAGE 2 ── */}
        <div className="hidden md:flex flex-1 items-center justify-start">
          <motion.div
            animate={{
              y: [7, -7, 7],
              rotate: [1.5, -2, 1.5],
            }}
            transition={{
              duration: 6.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative group cursor-pointer"
            onClick={() => handleImageClick('https://i.postimg.cc/tgRPVDCj/IMG-20260918-210033-165.png')}
          >
            <div className="relative w-64 lg:w-72 rounded-2xl p-1.5 bg-gradient-to-b from-blue-500/30 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-blue-500/30 shadow-[0_12px_35px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-105 group-hover:border-blue-400">
              <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-950">
                <img
                  src="https://i.postimg.cc/tgRPVDCj/IMG-20260918-210033-165.png"
                  alt="Cos Interface Preview 2"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-[10px] font-mono text-blue-300">
                  <Binary className="w-3 h-3 text-blue-400" />
                  <span>Command Hierarchy</span>
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
          <div className="relative max-w-2xl w-full rounded-2xl overflow-hidden border border-indigo-500/40 shadow-2xl bg-slate-900">
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
