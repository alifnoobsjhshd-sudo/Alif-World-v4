import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface CinematicVideoCutsceneProps {
  isActive: boolean;
  onComplete: () => void;
  shouldPreload: boolean;
  videoSrc: string;
}

type PlaybackIssue = 'blocked' | 'stalled' | 'error';

const STARTUP_TIMEOUT_MS = 12_000;
const STALL_TIMEOUT_MS = 8_000;
const PLAYBACK_FAILSAFE_MS = 30_000;

export const CinematicVideoCutscene: React.FC<CinematicVideoCutsceneProps> = ({
  isActive,
  onComplete,
  shouldPreload,
  videoSrc,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const windAudioRef = useRef<HTMLAudioElement | null>(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  const activeRef = useRef(isActive);
  const timersRef = useRef<{ startup?: number; stall?: number; failsafe?: number }>({});
  const [playbackIssue, setPlaybackIssue] = useState<PlaybackIssue | null>(null);
  const prefersReducedMotion = useReducedMotion();

  onCompleteRef.current = onComplete;
  activeRef.current = isActive;

  const clearPlaybackTimers = useCallback(() => {
    const { startup, stall, failsafe } = timersRef.current;
    [startup, stall, failsafe].forEach((timer) => {
      if (timer !== undefined) window.clearTimeout(timer);
    });
    timersRef.current = {};
  }, []);

  const getWindAudio = useCallback(() => {
    if (!windAudioRef.current) {
      const audio = new Audio('/cutscene-wind.mp3');
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = 0.58;
      windAudioRef.current = audio;
    }
    return windAudioRef.current;
  }, []);

  const stopWindAudio = useCallback((reset = true) => {
    const audio = windAudioRef.current;
    if (!audio) return;
    audio.pause();
    if (reset) {
      try {
        audio.currentTime = 0;
      } catch {}
    }
  }, []);

  const complete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    clearPlaybackTimers();
    stopWindAudio();
    videoRef.current?.pause();
    onCompleteRef.current();
  }, [clearPlaybackTimers, stopWindAudio]);

  useEffect(() => {
    if (!shouldPreload || isActive) return;
    const audio = getWindAudio();
    if (audio.readyState === HTMLMediaElement.HAVE_NOTHING) audio.load();
  }, [getWindAudio, isActive, shouldPreload]);

  useEffect(() => {
    if (!isActive) {
      completedRef.current = false;
      setPlaybackIssue(null);
      clearPlaybackTimers();
      stopWindAudio();
      return;
    }

    completedRef.current = false;
    setPlaybackIssue(null);
    clearPlaybackTimers();

    const video = videoRef.current;
    if (!video) return;
    const windAudio = getWindAudio();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    video.muted = false;
    video.preload = 'auto';

    const scheduleFailsafe = (delay: number) => {
      if (timersRef.current.failsafe !== undefined) {
        window.clearTimeout(timersRef.current.failsafe);
      }
      timersRef.current.failsafe = window.setTimeout(complete, delay);
    };

    const handlePlaying = () => {
      if (timersRef.current.startup !== undefined) {
        window.clearTimeout(timersRef.current.startup);
        timersRef.current.startup = undefined;
      }
      if (timersRef.current.stall !== undefined) {
        window.clearTimeout(timersRef.current.stall);
        timersRef.current.stall = undefined;
      }
      setPlaybackIssue(null);
      if (windAudio.paused) {
        if (Number.isFinite(windAudio.duration) && windAudio.duration > 0) {
          const expectedTime = video.currentTime % windAudio.duration;
          if (Math.abs(windAudio.currentTime - expectedTime) > 0.75) {
            try {
              windAudio.currentTime = expectedTime;
            } catch {}
          }
        }
        windAudio.play().then(() => {
          if (!activeRef.current || completedRef.current || video.paused || video.ended) {
            windAudio.pause();
          }
        }).catch(() => {});
      }
    };

    const handleWaiting = () => {
      windAudio.pause();
      if (timersRef.current.stall !== undefined) {
        window.clearTimeout(timersRef.current.stall);
      }
      timersRef.current.stall = window.setTimeout(() => {
        if (activeRef.current && !completedRef.current) setPlaybackIssue('stalled');
      }, STALL_TIMEOUT_MS);
    };

    const handleError = () => {
      windAudio.pause();
      setPlaybackIssue('error');
    };
    const handlePause = () => windAudio.pause();
    const handleMetadata = () => {
      if (Number.isFinite(video.duration) && video.duration > 0) {
        scheduleFailsafe(Math.max(PLAYBACK_FAILSAFE_MS, video.duration * 1000 + 20_000));
      }
    };

    const playWithMutedFallback = async () => {
      if (!activeRef.current || completedRef.current) return;
      try {
        await video.play();
      } catch {
        if (!activeRef.current || completedRef.current) return;
        video.muted = true;
        try {
          await video.play();
        } catch {
          if (activeRef.current && !completedRef.current) setPlaybackIssue('blocked');
        }
      }
    };

    const handleCanPlay = () => void playWithMutedFallback();

    video.addEventListener('playing', handlePlaying);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('error', handleError);
    video.addEventListener('pause', handlePause);
    video.addEventListener('loadedmetadata', handleMetadata);
    scheduleFailsafe(PLAYBACK_FAILSAFE_MS);
    timersRef.current.startup = window.setTimeout(() => {
      if (video.paused && !video.ended) setPlaybackIssue('blocked');
    }, STARTUP_TIMEOUT_MS);

    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      handleCanPlay();
    } else {
      video.addEventListener('canplay', handleCanPlay, { once: true });
      if (video.networkState === HTMLMediaElement.NETWORK_EMPTY) video.load();
    }

    return () => {
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('error', handleError);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('loadedmetadata', handleMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.pause();
      stopWindAudio();
      clearPlaybackTimers();
      document.body.style.overflow = previousOverflow;
    };
  }, [clearPlaybackTimers, complete, getWindAudio, isActive, stopWindAudio, videoSrc]);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') complete();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [complete, isActive]);

  const retryPlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    setPlaybackIssue(null);
    try {
      if (video.error) video.load();
      video.muted = false;
      await video.play();
    } catch {
      try {
        video.muted = true;
        await video.play();
      } catch {
        setPlaybackIssue('blocked');
      }
    }
  };

  if (!isActive && !shouldPreload) return null;

  return (
    <motion.div
      className={
        isActive
          ? 'fixed inset-0 z-[130] h-screen w-screen overflow-hidden bg-black'
          : 'pointer-events-none fixed left-0 top-0 z-[-1] h-px w-px overflow-hidden opacity-0'
      }
      initial={false}
      animate={{ opacity: isActive ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.2 }}
      role={isActive ? 'dialog' : undefined}
      aria-modal={isActive || undefined}
      aria-hidden={!isActive}
      aria-label={isActive ? "Alif's portfolio film" : undefined}
      style={{
        height: isActive ? '100dvh' : '1px',
        width: isActive ? '100vw' : '1px',
      }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        playsInline
        preload={isActive || shouldPreload ? 'auto' : 'none'}
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        onEnded={complete}
        className={
          isActive
            ? 'absolute inset-0 h-full w-full bg-black object-cover'
            : 'absolute inset-0 h-px w-px object-cover'
        }
        aria-label="Portfolio introduction film"
      />

      {isActive && playbackIssue && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 px-6 text-center text-white"
          role="alert"
        >
          <div>
            <p className="font-mono text-sm uppercase tracking-[0.16em]">
              {playbackIssue === 'stalled'
                ? 'The film is taking longer than expected'
                : playbackIssue === 'error'
                  ? 'The film could not be loaded'
                  : 'The film could not start automatically'}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={retryPlayback}
                className="min-h-11 border border-white/70 px-5 font-mono text-xs uppercase tracking-wider hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Try again
              </button>
              <button
                type="button"
                onClick={complete}
                className="min-h-11 border border-white/30 px-5 font-mono text-xs uppercase tracking-wider hover:border-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Continue to Worlds
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CinematicVideoCutscene;
