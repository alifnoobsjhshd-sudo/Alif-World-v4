import React from 'react';
import { motion } from 'motion/react';
import alifCharacterImg from '../assets/images/alif_character_pure_transparent_1780383675414.png';
import { StoryScene } from '../data/storyline';

interface StoryCharacterProps {
  scene: StoryScene;
}

export const StoryCharacter: React.FC<StoryCharacterProps> = React.memo(({ scene }) => {
  const { id, theme } = scene;

  return (
    <div className="relative flex flex-col items-center justify-center select-none pointer-events-none">
      
      {/* ── SCENE SPECIFIC PROPS & SURROUNDINGS (BEHIND CHARACTER) ──────────── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        
        {/* Scene 04: Cosmic questions & atoms */}
        {id === 4 && (
          <div className="absolute w-[500px] h-[400px]">
            {[
              { text: '?', top: '5%', left: '15%', size: 'text-4xl', dur: 4 },
              { text: '⚛', top: '12%', left: '78%', size: 'text-3xl', dur: 5 },
              { text: '?', top: '25%', left: '85%', size: 'text-5xl', dur: 3.8 },
              { text: '★', top: '8%', left: '45%', size: 'text-2xl', dur: 4.5 },
              { text: '⚙', top: '35%', left: '10%', size: 'text-3xl', dur: 6 },
              { text: '?', top: '45%', left: '80%', size: 'text-3xl', dur: 4.2 },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                animate={{ 
                  y: [0, -14, 0], 
                  opacity: [0.3, 0.9, 0.3],
                  scale: [0.9, 1.1, 0.9]
                }}
                transition={{ duration: item.dur, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.3 }}
                className={`absolute font-mono font-bold text-sky-600/80 ${item.size} drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]`}
                style={{ top: item.top, left: item.left }}
              >
                {item.text}
              </motion.div>
            ))}
          </div>
        )}

        {/* Scene 05: Distant glowing planet */}
        {id === 5 && (
          <motion.div
            animate={{ scale: [1, 1.05, 1], y: [0, -8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-36 right-0 sm:-right-24 w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-400 to-amber-200 shadow-[0_0_50px_rgba(168,85,247,0.4)] flex items-center justify-center"
          >
            <div className="w-36 h-8 rounded-full border-2 border-indigo-200/50 rotate-[-25deg] shadow-inner" />
          </motion.div>
        )}

        {/* Scene 06: Gigantic glowing digital portal */}
        {id === 6 && (
          <motion.div
            animate={{ 
              scale: [0.98, 1.03, 0.98],
              rotate: [0, 1, 0] 
            }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-12 -right-8 sm:-right-20 w-64 sm:w-80 h-80 sm:h-96 rounded-3xl bg-gradient-to-b from-cyan-400/30 via-indigo-600/40 to-fuchsia-500/30 p-1 border-2 border-cyan-300/80 shadow-[0_0_60px_rgba(6,182,212,0.4)] backdrop-blur-md flex flex-col items-center justify-center overflow-hidden"
          >
            <div className="absolute inset-2 border border-cyan-400/40 rounded-2xl flex flex-col items-center justify-center p-4">
              <motion.div 
                animate={{ y: [-100, 100] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-80"
              />
              <div className="font-mono text-xs text-cyan-200/90 text-left space-y-1">
                <p>&lt;world builder="alif"&gt;</p>
                <p className="pl-3">&lt;dimension: web /&gt;</p>
                <p className="pl-3">&lt;portal: open /&gt;</p>
                <p>&lt;/world&gt;</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Scene 08: Giant floating website interface */}
        {id === 8 && (
          <motion.div
            animate={{ y: [0, -10, 0], rotateY: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-10 -right-4 sm:-right-28 w-60 sm:w-72 h-72 rounded-2xl bg-white/90 border-2 border-sky-300 shadow-2xl p-3 flex flex-col gap-2 transform-gpu"
          >
            <div className="flex items-center gap-1.5 border-b border-gray-100 pb-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-[9px] font-mono text-gray-400 ml-2">alif.creative/experience</span>
            </div>
            <div className="h-16 rounded-xl bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 animate-pulse flex items-center justify-center text-white text-xs font-bold">
              Creative UI Engine
            </div>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <div className="h-12 bg-sky-50 rounded-lg border border-sky-100 flex items-center justify-center text-[10px] font-bold text-sky-700">Components</div>
              <div className="h-12 bg-purple-50 rounded-lg border border-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-700">Animations</div>
            </div>
          </motion.div>
        )}

        {/* Scene 10: Storm effects - wind, rain lines */}
        {id === 10 && (
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3], x: [-10, 10, -10] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="absolute -inset-20 bg-slate-900/30 rounded-full blur-3xl"
            />
            {/* Wind gusts */}
            <motion.div 
              animate={{ x: [-100, 200], opacity: [0, 0.8, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeIn' }}
              className="absolute top-1/4 left-0 w-48 h-0.5 bg-gradient-to-r from-transparent via-cyan-200 to-transparent -rotate-12"
            />
            <motion.div 
              animate={{ x: [-150, 180], opacity: [0, 0.7, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeIn', delay: 0.4 }}
              className="absolute top-1/2 left-4 w-60 h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent -rotate-6"
            />
          </div>
        )}

        {/* Scene 12: Massive sunset backdrop */}
        {id === 12 && (
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-24 w-80 sm:w-[480px] h-60 rounded-full bg-gradient-to-t from-orange-500/30 via-rose-500/20 to-purple-500/10 blur-2xl"
          />
        )}

        {/* Scene 13: Constellation of memories */}
        {id === 13 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            {/* Left Side Elements */}
            <div className="absolute -left-6 sm:-left-20 md:-left-32 top-1/2 -translate-y-1/2 flex flex-col items-end gap-5">
              {[
                { label: '⚙️ Hardware', xOff: 0, delay: 0 },
                { label: '💻 Web UI', xOff: -6, delay: 0.8 },
                { label: '⚡ Electronics', xOff: 6, delay: 1.6 },
              ].map((node, i) => (
                <motion.div
                  key={`left-${i}`}
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3.8 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: node.delay }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/95 backdrop-blur-md rounded-full border border-indigo-200/90 shadow-md font-mono text-xs font-bold text-slate-800"
                >
                  {node.label}
                </motion.div>
              ))}
            </div>

            {/* Right Side Elements */}
            <div className="absolute -right-6 sm:-right-20 md:-right-32 top-1/2 -translate-y-1/2 flex flex-col items-start gap-5">
              {[
                { label: '⚛️ Physics', xOff: 0, delay: 0.4 },
                { label: '🌌 Universe', xOff: 6, delay: 1.2 },
                { label: '✨ Innovation', xOff: -6, delay: 2.0 },
              ].map((node, i) => (
                <motion.div
                  key={`right-${i}`}
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 4.0 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: node.delay }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white/95 backdrop-blur-md rounded-full border border-indigo-200/90 shadow-md font-mono text-xs font-bold text-slate-800"
                >
                  {node.label}
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Scene 14: Sitting on Airplane wing */}
        {id === 14 && (
          <motion.div
            animate={{ rotate: [-1, 2, -1], y: [0, 6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -bottom-8 w-96 h-12 bg-gradient-to-r from-slate-200 via-white to-slate-300 rounded-full border border-slate-300 shadow-xl rotate-[-8deg]"
          >
            <div className="w-full h-1 bg-sky-400/40 mt-3 rounded-full" />
          </motion.div>
        )}

      </div>

      {/* ── CORE ANIME SCIENTIST CHARACTER GROUP ────────────────────────────── */}
      <motion.div
        animate={{ 
          y: id === 10 ? [0, -8, 0] : [0, -12, 0],
          rotate: id === 10 ? [-2, 3, -2] : [0, 0.5, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 flex flex-col items-center"
      >
        {/* Shadow */}
        <div className="absolute -bottom-4 w-44 sm:w-56 h-6 bg-slate-900/10 blur-lg rounded-full" />

        {/* Character Illustration */}
        <div className="relative">
          <img
            src={alifCharacterImg}
            alt={`Alif - ${scene.title}`}
            className={`h-auto object-contain transition-transform duration-500 drop-shadow-[0_16px_32px_rgba(0,0,0,0.14)] ${
              id === 2
                ? 'max-w-[280px] sm:max-w-[320px] rotate-[10deg] translate-y-3' // Lying down on cloud examining device
                : id === 3
                ? 'max-w-[300px] sm:max-w-[340px] scale-100' // Cross-legged examining chip
                : id === 4
                ? 'max-w-[320px] sm:max-w-[360px] scale-105 -translate-y-2' // Tall dramatic standing
                : id === 5
                ? 'max-w-[290px] sm:max-w-[330px] -scale-x-100' // Facing telescope side
                : id === 6
                ? 'max-w-[310px] sm:max-w-[350px] scale-105' // Facing portal
                : id === 7 || id === 9
                ? 'max-w-[290px] sm:max-w-[330px]' // Sitting with laptop / workspace
                : id === 10
                ? 'max-w-[270px] sm:max-w-[300px] rotate-[-5deg] brightness-90' // Weathering storm
                : id === 11
                ? 'max-w-[330px] sm:max-w-[370px] brightness-105' // Breakthrough triumphant
                : id === 12
                ? 'max-w-[280px] sm:max-w-[310px] saturate-125' // Sunset calm
                : id === 16
                ? 'max-w-[340px] sm:max-w-[390px] scale-110' // Facing viewer directly
                : 'max-w-[310px] sm:max-w-[350px]'
            }`}
            referrerPolicy="no-referrer"
          />

          {/* ── FOREGROUND PROPS (IN FRONT OF CHARACTER) ──────────────────────── */}
          
          {/* Scene 02: Homemade electronic device with wires & batteries */}
          {id === 2 && (
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-amber-900/90 text-amber-100 px-3 py-1.5 rounded-lg border-2 border-amber-400/80 shadow-lg flex items-center gap-2 font-mono text-xs"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>[DIY Circuit v0.1]</span>
              <span className="text-[10px] text-amber-300">🔋 3.3V</span>
            </motion.div>
          )}

          {/* Scene 03: Floating circuit board & glowing bulb */}
          {id === 3 && (
            <>
              <motion.div
                animate={{ y: [0, -8, 0], rotate: [-4, 4, -4] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/3 -left-12 bg-emerald-800 text-emerald-200 p-2 rounded-lg border border-emerald-400/60 shadow-lg text-[10px] font-mono"
              >
                ⚡ Microcontroller
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-8 -right-8 text-2xl filter drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]"
              >
                💡
              </motion.div>
            </>
          )}

          {/* Scene 05: Brass telescope pointing to planet */}
          {id === 5 && (
            <motion.div
              animate={{ rotate: [-22, -26, -22] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-6 -right-14 w-28 h-7 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700 rounded-full border border-amber-300 shadow-xl flex items-center justify-end pr-1"
            >
              <div className="w-4 h-9 bg-amber-800 rounded-sm border border-amber-400" />
            </motion.div>
          )}

          {/* Scene 07: Laptop on knees */}
          {id === 7 && (
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-20 bg-slate-800 rounded-t-lg border-2 border-slate-600 shadow-2xl p-1.5 flex flex-col"
            >
              <div className="w-full h-12 bg-slate-950 rounded border border-cyan-500/40 p-1 flex items-center justify-center">
                <span className="font-mono text-[9px] text-cyan-400">&lt;web/dev&gt;</span>
              </div>
              <div className="h-4 bg-slate-700 rounded-b mt-auto flex items-center justify-center">
                <div className="w-6 h-0.5 bg-slate-400 rounded-full" />
              </div>
            </motion.div>
          )}

          {/* Scene 09: Futuristic workspace */}
          {id === 9 && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 h-6 bg-slate-800/80 backdrop-blur-md rounded-full border border-slate-600 flex items-center justify-around px-4 shadow-xl">
              <span className="text-[10px] font-mono text-cyan-300">⌨️ DevStation</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          )}

          {/* Scene 10: Broken website pieces */}
          {id === 10 && (
            <motion.div
              animate={{ rotate: [12, 16, 12], y: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -bottom-2 -left-6 bg-rose-950/80 text-rose-300 border border-rose-500/50 p-2 rounded-lg text-[9px] font-mono shadow-lg"
            >
              💥 404: Not Found
            </motion.div>
          )}

        </div>
      </motion.div>

    </div>
  );
});

StoryCharacter.displayName = 'StoryCharacter';
