import React from 'react';
import { motion } from 'motion/react';
import { StoryScene } from '../data/storyline';
import { SceneEngineeringElements } from './SceneEngineeringElements';
import { useDesktopCharacterParallax } from '../utils/useDesktopCharacterParallax';

// Import all 8 pre-processed clean transparent pose PNGs
import sittingImg from '../assets/images/pose_sitting.png';
import lyingImg from '../assets/images/pose_lying.png';
import crossleggedImg from '../assets/images/pose_crosslegged.png';
import standingImg from '../assets/images/pose_standing.png';
import laptopImg from '../assets/images/pose_laptop.png';
import waveImg from '../assets/images/pose_wave.png';
import stormImg from '../assets/images/pose_storm.png';
import sunsetImg from '../assets/images/pose_sunset.png';

interface SnappedCloudCharacterProps {
  scene: StoryScene;
}

// Select pose matching each of the 16 scenes
function getScenePose(sceneId: number) {
  switch (sceneId) {
    case 1:
      return sittingImg;      // Scene 01: Sitting casually on cloud looking at horizon
    case 2:
      return lyingImg;        // Scene 02: Lying on stomach examining electronic device
    case 3:
      return crossleggedImg;  // Scene 03: Crosslegged holding components & flasks
    case 4:
      return standingImg;     // Scene 04: Standing looking upward into sky
    case 5:
      return crossleggedImg;  // Scene 05: Sitting beside telescope exploring
    case 6:
      return standingImg;     // Scene 06: Standing facing digital portal
    case 7:
      return laptopImg;       // Scene 07: Sitting comfortably with laptop on knees
    case 8:
      return standingImg;     // Scene 08: Reaching hand toward interactive interface
    case 9:
      return laptopImg;       // Scene 09: Sitting at cloud workstation building websites
    case 10:
      return stormImg;        // Scene 10: Holding on tight during windy storm
    case 11:
      return standingImg;     // Scene 11: Breaking through clouds into bright sunlight
    case 12:
      return sunsetImg;       // Scene 12: Sitting quietly watching sunset
    case 13:
      return standingImg;     // Scene 13: Standing proudly on highest point of cloud
    case 14:
      return sittingImg;      // Scene 14: Sitting in flight looking toward horizon
    case 15:
      return sunsetImg;       // Scene 15: Peaceful horizon view
    case 16:
      return waveImg;         // Scene 16: Front-facing direct friendly wave to viewer
    default:
      return sittingImg;
  }
}

export const SnappedCloudCharacter: React.FC<SnappedCloudCharacterProps> = React.memo(({ scene }) => {
  const { id } = scene;
  const poseSrc = getScenePose(id);
  const {
    isDesktop,
    avatarX,
    avatarY,
    avatarRotateX,
    avatarRotateY,
    shadowX,
    shadowScale,
    shadowOpacity,
  } = useDesktopCharacterParallax();

  return (
    <div className="relative flex flex-col items-center justify-center select-none origin-center">
      
      {/* ── AMBIENT SCENE BACKDROP PROPS (LAYERED BEHIND CHARACTER) ────────── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          
          {/* Engineering & Creative Elements for All Scenes */}
          <SceneEngineeringElements scene={scene} />
          
          {/* Scene 04: Cosmic questions & atoms floating */}
          {id === 4 && (
            <div className="absolute w-[440px] h-[340px] pointer-events-none">
              {[
                { text: '?', top: '5%', left: '15%', size: 'text-4xl', dur: 4 },
                { text: '⚛', top: '10%', left: '78%', size: 'text-3xl', dur: 5 },
                { text: '?', top: '22%', left: '86%', size: 'text-5xl', dur: 3.8 },
                { text: '★', top: '6%', left: '48%', size: 'text-2xl', dur: 4.5 },
                { text: '⚙', top: '35%', left: '8%', size: 'text-3xl', dur: 6 },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  animate={{ 
                    y: [0, -12, 0], 
                    opacity: [0.4, 0.9, 0.4],
                    scale: [0.95, 1.08, 0.95]
                  }}
                  transition={{ duration: item.dur, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.3 }}
                  className={`absolute font-mono font-bold text-sky-600/80 ${item.size} drop-shadow-[0_0_10px_rgba(56,189,248,0.6)]`}
                  style={{ top: item.top, left: item.left }}
                >
                  {item.text}
                </motion.div>
              ))}
            </div>
          )}

          {/* Scene 05: Distant glowing ringed planet */}
          {id === 5 && (
            <motion.div
              animate={{ scale: [1, 1.05, 1], y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-32 right-2 sm:-right-20 w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 via-purple-400 to-amber-200 shadow-[0_0_40px_rgba(168,85,247,0.4)] flex items-center justify-center"
            >
              <div className="w-32 h-7 rounded-full border-2 border-indigo-200/60 rotate-[-25deg] shadow-inner" />
            </motion.div>
          )}

          {/* Scene 06: Gigantic glowing digital portal */}
          {id === 6 && (
            <motion.div
              animate={{ scale: [0.98, 1.02, 0.98] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-12 -right-6 sm:-right-24 w-60 sm:w-72 h-72 sm:h-84 rounded-3xl bg-gradient-to-b from-cyan-400/25 via-indigo-600/35 to-fuchsia-500/25 p-1 border-2 border-cyan-300/80 shadow-[0_0_50px_rgba(6,182,212,0.4)] backdrop-blur-md flex flex-col items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-2 border border-cyan-400/40 rounded-2xl flex flex-col items-center justify-center p-3 text-cyan-200 font-mono text-xs">
                <p>&lt;world builder="alif"&gt;</p>
                <p className="pl-3">&lt;dimension: web /&gt;</p>
                <p className="pl-3">&lt;portal: active /&gt;</p>
                <p>&lt;/world&gt;</p>
              </div>
            </motion.div>
          )}

          {/* Scene 08: Floating creative website shapes (placed on left to avoid top-right bubble collision) */}
          {id === 8 && (
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-8 -left-4 sm:-left-20 md:-left-30 w-52 sm:w-60 h-60 rounded-2xl bg-white/95 border-2 border-sky-300 shadow-xl p-3 flex flex-col gap-2 z-0 pointer-events-auto hover:scale-105 transition-transform"
            >
              <div className="flex items-center gap-1.5 border-b border-gray-100 pb-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="text-[9px] font-mono text-gray-400 ml-2">creative.alif/ui</span>
              </div>
              <div className="h-14 rounded-xl bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold shadow-md">
                Creative UI Engine
              </div>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="h-9 bg-sky-50 rounded-lg border border-sky-100 flex items-center justify-center text-[10px] font-bold text-sky-700">Components</div>
                <div className="h-9 bg-purple-50 rounded-lg border border-purple-100 flex items-center justify-center text-[10px] font-bold text-purple-700">Animations</div>
              </div>
            </motion.div>
          )}

          {/* Scene 10: Storm wind streaks */}
          {id === 10 && (
            <div className="absolute inset-0 pointer-events-none">
              <motion.div 
                animate={{ x: [-120, 220], opacity: [0, 0.8, 0] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: 'easeIn' }}
                className="absolute top-1/4 left-0 w-48 h-1 bg-gradient-to-r from-transparent via-cyan-200 to-transparent -rotate-12"
              />
              <motion.div 
                animate={{ x: [-160, 200], opacity: [0, 0.7, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeIn', delay: 0.3 }}
                className="absolute top-1/2 left-6 w-60 h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent -rotate-6"
              />
            </div>
          )}

          {/* Scene 12: Warm sunset gradient glow behind cloud */}
          {id === 12 && (
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 7, repeat: Infinity }}
              className="absolute -top-16 w-80 sm:w-[450px] h-64 rounded-full bg-gradient-to-t from-orange-500/25 via-rose-500/20 to-purple-500/10 blur-3xl"
            />
          )}

          {/* Scene 13: Memory constellation nodes flanking the main character */}
          {id === 13 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
              {/* Constellation SVG linking lines */}
              <svg className="absolute inset-0 w-full h-full overflow-visible opacity-30 pointer-events-none">
                <motion.line 
                  x1="-120" y1="-60" x2="-80" y2="0" 
                  stroke="#818cf8" strokeWidth="1.5" strokeDasharray="3 3" 
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.line 
                  x1="-80" y1="0" x2="-110" y2="60" 
                  stroke="#818cf8" strokeWidth="1.5" strokeDasharray="3 3" 
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                />
                <motion.line 
                  x1="120" y1="-60" x2="90" y2="0" 
                  stroke="#818cf8" strokeWidth="1.5" strokeDasharray="3 3" 
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3.2, repeat: Infinity, delay: 0.2 }}
                />
                <motion.line 
                  x1="90" y1="0" x2="110" y2="60" 
                  stroke="#818cf8" strokeWidth="1.5" strokeDasharray="3 3" 
                  animate={{ opacity: [0.3, 0.7, 0.3] }}
                  transition={{ duration: 3.8, repeat: Infinity, delay: 0.7 }}
                />
              </svg>

              {/* Left Side Elements */}
              <div className="absolute -left-6 sm:-left-20 md:-left-32 top-1/2 -translate-y-1/2 flex flex-col items-end gap-5 sm:gap-6 pointer-events-auto">
                {[
                  { label: '⚙️ Hardware', xOff: 0, delay: 0 },
                  { label: '💻 Web UI', xOff: -6, delay: 0.8 },
                  { label: '⚡ Electronics', xOff: 6, delay: 1.6 },
                ].map((node, i) => (
                  <motion.div
                    key={`left-${i}`}
                    animate={{ y: [-5, 5, -5], x: [node.xOff, node.xOff - 3, node.xOff] }}
                    transition={{ duration: 3.8 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: node.delay }}
                    className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-white/95 backdrop-blur-md rounded-full border border-indigo-200/90 shadow-[0_8px_25px_rgba(99,102,241,0.18)] font-mono text-[11px] sm:text-xs font-bold text-slate-800 whitespace-nowrap hover:scale-105 transition-transform cursor-default"
                  >
                    <span>{node.label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Right Side Elements */}
              <div className="absolute -right-6 sm:-right-20 md:-right-32 top-1/2 -translate-y-1/2 flex flex-col items-start gap-5 sm:gap-6 pointer-events-auto">
                {[
                  { label: '⚛️ Physics', xOff: 0, delay: 0.4 },
                  { label: '🌌 Universe', xOff: 6, delay: 1.2 },
                  { label: '✨ Innovation', xOff: -6, delay: 2.0 },
                ].map((node, i) => (
                  <motion.div
                    key={`right-${i}`}
                    animate={{ y: [5, -5, 5], x: [node.xOff, node.xOff + 3, node.xOff] }}
                    transition={{ duration: 4.0 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: node.delay }}
                    className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 bg-white/95 backdrop-blur-md rounded-full border border-indigo-200/90 shadow-[0_8px_25px_rgba(99,102,241,0.18)] font-mono text-[11px] sm:text-xs font-bold text-slate-800 whitespace-nowrap hover:scale-105 transition-transform cursor-default"
                  >
                    <span>{node.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

      </div>

      {/* ── SNAPPED CLOUD + CHARACTER MAIN ELEMENT ─────────────────────────── */}
      <motion.div
        animate={{ 
          y: id === 10 ? [0, -6, 0] : [0, -10, 0],
          rotate: id === 10 ? [-2, 2.5, -2] : [0, 0.4, 0]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-20 flex flex-col items-center justify-center"
      >
        {/* Soft grounding shadow beneath the cloud base */}
        <motion.div
          style={isDesktop ? { x: shadowX, scaleX: shadowScale, opacity: shadowOpacity } : undefined}
          className="absolute -bottom-6 w-64 sm:w-84 h-8 bg-slate-900/10 blur-xl rounded-full"
        />

        {/* The character naturally snapped on top of the cloud with desktop 3D mouse parallax */}
        <motion.div
          style={isDesktop ? {
            x: avatarX,
            y: avatarY,
            rotateX: avatarRotateX,
            rotateY: avatarRotateY,
            transformPerspective: 950,
          } : undefined}
          className="relative flex items-center justify-center transform-gpu"
        >
          {/* Subtle living floating levitation loop (Desktop only) */}
          <motion.div
            animate={isDesktop ? {
              y: [-4, 4, -4],
              rotate: [-0.5, 0.5, -0.5],
            } : undefined}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative flex items-center justify-center transform-gpu"
          >
            <img
              src={poseSrc}
              alt={`Alif on Cloud - Scene ${id}`}
              width="480"
              height="480"
              loading="eager"
              decoding="async"
              className={id === 16 
                ? "w-full max-w-[270px] sm:max-w-[320px] md:max-w-[360px] h-auto object-contain select-none drop-shadow-[0_22px_36px_rgba(0,0,0,0.13)] pointer-events-none"
                : "w-full max-w-[320px] sm:max-w-[400px] md:max-w-[450px] h-auto object-contain select-none drop-shadow-[0_22px_36px_rgba(0,0,0,0.13)] pointer-events-none"
              }
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </motion.div>
      </motion.div>

    </div>
  );
});

SnappedCloudCharacter.displayName = 'SnappedCloudCharacter';
