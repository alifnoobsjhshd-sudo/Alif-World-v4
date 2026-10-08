import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface CinematicVideoCutsceneProps {
  isActive: boolean;
  onComplete: () => void;
  videoSrc: string;
}

const BAR_HEIGHT = 'clamp(3.75rem, 8vh, 7rem)';

export const CinematicVideoCutscene: React.FC<CinematicVideoCutsceneProps> = ({
  isActive,
  onComplete,
  videoSrc,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const activeRef = useRef(isActive);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackBlocked, setPlaybackBlocked] = useState(false);
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  onCompleteRef.current = onComplete;
  activeRef.current = isActive;

  const complete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    videoRef.current?.pause();
    onCompleteRef.current();
  }, []);

  useEffect(() => {
    if (!isActive) {
      completedRef.current = false;
      setPlaybackBlocked(false);
      setProgress(0);
      return;
    }

    completedRef.current = false;
    setPlaybackBlocked(false);
    setProgress(0);
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    setIsMuted(false);

    const playWithMutedFallback = async () => {
      try {
        await video.play();
      } catch {
        if (!activeRef.current || completedRef.current) return;

        video.muted = true;
        setIsMuted(true);
        try {
          await video.play();
        } catch {
          if (activeRef.current && !completedRef.current) setPlaybackBlocked(true);
        }
      }
    };

    void playWithMutedFallback();
    return () => video.pause();
  }, [isActive, videoSrc]);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') complete();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [complete, isActive]);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !video.muted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const retryPlayback = async () => {
    const video = videoRef.current;
    if (!video) return;
    try {
      await video.play();
      setPlaybackBlocked(false);
    } catch {
      setPlaybackBlocked(true);
    }
  };

  if (!isActive) return null;

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 1.25, ease: [0.76, 0, 0.24, 1] as [number, number, number, number] };

  return (
    <motion.div
      className="fixed inset-0 z-[130] overflow-hidden bg-[#08090b] text-[#eee9df]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.45 }}
      role="dialog"
      aria-modal="true"
      aria-label="Alif's portfolio film"
    >
      <motion.div
        className="absolute inset-x-0 bg-black"
        style={{ top: 0, height: BAR_HEIGHT, transformOrigin: 'top' }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={transition}
        aria-hidden="true"
      />
      <motion.div
        className="absolute inset-x-0 bg-black"
        style={{ bottom: 0, height: BAR_HEIGHT, transformOrigin: 'bottom' }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={transition}
        aria-hidden="true"
      />

      <motion.div
        className="absolute inset-x-0 z-10"
        initial={{ top: 0, bottom: 0 }}
        animate={{ top: BAR_HEIGHT, bottom: BAR_HEIGHT }}
        transition={transition}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          playsInline
          preload="auto"
          onEnded={complete}
          onTimeUpdate={(event) => {
            const video = event.currentTarget;
            if (Number.isFinite(video.duration) && video.duration > 0) {
              setProgress(video.currentTime / video.duration);
            }
          }}
          onError={() => setPlaybackBlocked(true)}
          className="h-full w-full bg-[#08090b] object-contain"
          aria-label="Portfolio introduction film"
        />
      </motion.div>

      <motion.header
        className="absolute inset-x-0 top-0 z-20 flex h-[clamp(3.75rem,8vh,7rem)] items-center justify-between px-5 sm:px-8 lg:px-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.45 }}
      >
        <span className="font-mono text-[10px] font-medium uppercase tracking-[0.28em] text-[#e9e2d5]/90 sm:text-xs">
          Alif <span className="mx-2 text-[#b49c76]/70">/</span> Portfolio film
        </span>
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.24em] text-[#e9e2d5]/45 sm:block">
          A world unfolding
        </span>
      </motion.header>

      <motion.footer
        className="absolute inset-x-0 bottom-0 z-20 flex h-[clamp(3.75rem,8vh,7rem)] items-center gap-5 px-5 sm:px-8 lg:px-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.55 }}
      >
        <div className="hidden min-w-24 font-mono text-[9px] uppercase tracking-[0.2em] text-[#e9e2d5]/45 sm:block">
          Introduction
        </div>
        <div
          className="h-px flex-1 overflow-hidden bg-[#eee9df]/20"
          role="progressbar"
          aria-label="Film progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(progress * 100)}
        >
          <div
            className="h-full origin-left bg-[#c6aa7e]"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
        <div className="flex shrink-0 items-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={toggleMute}
            className="inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#eee9df]/75 transition-colors hover:text-[#fff] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#c6aa7e]"
            aria-label={isMuted ? 'Unmute film' : 'Mute film'}
            aria-pressed={isMuted}
          >
            {isMuted ? (
              <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none">
                <path d="M9 4 5.5 7H3v6h2.5L9 16V4Z" stroke="currentColor" strokeWidth="1.3" />
                <path d="m13 7 4 6m0-6-4 6" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            ) : (
              <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4" fill="none">
                <path d="M9 4 5.5 7H3v6h2.5L9 16V4Z" stroke="currentColor" strokeWidth="1.3" />
                <path d="M12 7.5a3.5 3.5 0 0 1 0 5m2-7a6.5 6.5 0 0 1 0 9" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            )}
            <span className="hidden sm:inline">{isMuted ? 'Sound off' : 'Sound on'}</span>
          </button>
          <button
            type="button"
            onClick={complete}
            className="group inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#eee9df]/90 transition-colors hover:text-white focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#c6aa7e]"
            aria-label="Skip introduction film"
          >
            Skip
            <span aria-hidden="true" className="text-[#c6aa7e] transition-transform group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </motion.footer>

      {playbackBlocked && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#08090b]/75 px-6 text-center backdrop-blur-sm">
          <div className="max-w-sm">
            <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#c6aa7e]">
              The film is ready
            </p>
            <p className="mt-3 font-serif text-2xl text-[#eee9df]">Begin when you are.</p>
            <button
              type="button"
              onClick={retryPlayback}
              className="mt-6 min-h-11 border border-[#eee9df]/35 px-5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#eee9df] transition-colors hover:border-[#c6aa7e] hover:text-[#d9c29a] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#c6aa7e]"
            >
              Play film
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CinematicVideoCutscene;
