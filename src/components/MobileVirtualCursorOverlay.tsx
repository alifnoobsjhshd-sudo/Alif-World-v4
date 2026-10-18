import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { useMobileVirtualCursor, getStageDimensions } from '../context/MobileVirtualCursorContext';
import { dreamAudio } from '../utils/audio';

export const MobileVirtualCursorOverlay: React.FC = () => {
  const { isSupported, isCursorOn, moveCursorBy, triggerClick, triggerScroll } =
    useMobileVirtualCursor();

  // ── 1. Movable Controller Offset State ───────────────────────────────────────
  // Default docked at right-4 bottom-6 (dragOffset: { x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingController, setIsDraggingController] = useState<boolean>(false);
  const dragOffsetRef = useRef(dragOffset);
  dragOffsetRef.current = dragOffset;

  // Re-bound controller offset on screen resize or orientation change so it never escapes bounds
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleRebound = () => {
      const { width, height } = getStageDimensions();
      const minX = -(width - 72);
      const minY = -(height - 140);
      setDragOffset((prev) => ({
        x: Math.max(minX, Math.min(8, prev.x)),
        y: Math.max(minY, Math.min(10, prev.y)),
      }));
    };
    window.addEventListener('resize', handleRebound, { passive: true });
    window.addEventListener('orientationchange', handleRebound, { passive: true });
    return () => {
      window.removeEventListener('resize', handleRebound);
      window.removeEventListener('orientationchange', handleRebound);
    };
  }, []);

  // ── Drag & Tap on Drag Line Handle ──────────────────────────────────────────
  const dragStartRef = useRef<{ touchX: number; touchY: number; startX: number; startY: number } | null>(null);
  const hasDraggedRef = useRef<boolean>(false);

  const handleDragStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    e.stopPropagation();
    const touch = e.touches[0];
    dragStartRef.current = {
      touchX: touch.clientX,
      touchY: touch.clientY,
      startX: dragOffsetRef.current.x,
      startY: dragOffsetRef.current.y,
    };
    hasDraggedRef.current = false;
    setIsDraggingController(true);
  };

  const handleDragMove = (e: React.TouchEvent) => {
    if (!dragStartRef.current || e.touches.length !== 1) return;
    e.stopPropagation();
    if (e.cancelable) e.preventDefault();

    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.touchX;
    const dy = touch.clientY - dragStartRef.current.touchY;

    if (Math.hypot(dx, dy) > 5) {
      hasDraggedRef.current = true;
    }

    const container = document.getElementById('auto-landscape-container');
    const isAutoRotated = Boolean(container?.style.transform.includes('rotate(90deg)'));
    const stageDx = isAutoRotated ? dy : dx;
    const stageDy = isAutoRotated ? -dx : dy;

    const { width: stageW, height: stageH } = getStageDimensions();
    const minX = -(stageW - 72);
    const minY = -(stageH - 140);

    const nextX = Math.max(minX, Math.min(8, dragStartRef.current.startX + stageDx));
    const nextY = Math.max(minY, Math.min(10, dragStartRef.current.startY + stageDy));

    setDragOffset({ x: nextX, y: nextY });
  };

  const handleDragEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    setIsDraggingController(false);

    // If user tapped on the drag handle line without dragging: smoothly hop between right and left sides
    if (!hasDraggedRef.current) {
      const { width: stageW } = getStageDimensions();
      const midPoint = -(stageW - 72) / 2;
      const targetX = dragOffsetRef.current.x < midPoint ? 0 : -(stageW - 72);
      setDragOffset((prev) => ({ ...prev, x: targetX }));
      dreamAudio.playPop();
    }

    dragStartRef.current = null;
    hasDraggedRef.current = false;
  };

  // ── 2. Scroll Buttons Long-press Auto-repeat ─────────────────────────────────
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startContinuousScroll = useCallback((deltaY: number) => {
    if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    triggerScroll(deltaY);
    dreamAudio.playHover();

    scrollIntervalRef.current = setInterval(() => {
      triggerScroll(deltaY);
    }, 70);
  }, [triggerScroll]);

  const stopContinuousScroll = useCallback(() => {
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current);
      scrollIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    };
  }, []);

  // ── 3. Smooth Screen Touch & Virtual Cursor Handler ──────────────────────────
  // Listeners are attached ONCE while cursor is active, eradicating right-side shaking
  const touchOnButtonRef = useRef<boolean>(false);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const lastTouchPos = useRef<{ x: number; y: number } | null>(null);
  const touchStartTime = useRef<number>(0);
  const hasMovedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isSupported || !isCursorOn) return;

    const onGlobalTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const target = e.target as HTMLElement | null;

      // Check if user touched any interactive button, link, input, or control directly
      const interactiveBtn = target?.closest(
        'button, a, input, textarea, select, [role="button"], [role="link"], [data-cursor-ignore], [data-interactive]'
      );

      if (interactiveBtn) {
        // Direct finger tap on button: allow native button click, NEVER move virtual cursor
        touchOnButtonRef.current = true;
        touchStartPos.current = null;
        lastTouchPos.current = null;
        hasMovedRef.current = false;
        return;
      }

      // Touched on empty screen/background:
      touchOnButtonRef.current = false;
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();

      const touch = e.touches[0];
      touchStartPos.current = { x: touch.clientX, y: touch.clientY };
      lastTouchPos.current = { x: touch.clientX, y: touch.clientY };
      touchStartTime.current = Date.now();
      hasMovedRef.current = false;
    };

    const onGlobalTouchMove = (e: TouchEvent) => {
      if (touchOnButtonRef.current) return;
      if (e.touches.length !== 1 || !lastTouchPos.current) return;

      if (e.cancelable) e.preventDefault();
      e.stopPropagation();

      const touch = e.touches[0];
      const dx = touch.clientX - lastTouchPos.current.x;
      const dy = touch.clientY - lastTouchPos.current.y;

      if (touchStartPos.current) {
        const dist = Math.hypot(touch.clientX - touchStartPos.current.x, touch.clientY - touchStartPos.current.y);
        if (dist > 5) {
          hasMovedRef.current = true;
        }
      }

      lastTouchPos.current = { x: touch.clientX, y: touch.clientY };

      const container = document.getElementById('auto-landscape-container');
      const isAutoRotated = Boolean(container?.style.transform.includes('rotate(90deg)'));

      // Move cursor accounting for mobile landscape 90deg rotation:
      // Physical UP/DOWN (+/-dy) -> horizontal stage X (+/-deltaX)
      // Physical LEFT (-dx) -> cursor goes DOWN (+deltaY)
      // Physical RIGHT (+dx) -> cursor goes TOP/UP (-deltaY)
      const deltaX = isAutoRotated ? dy : dx;
      const deltaY = isAutoRotated ? -dx : dy;

      const sensitivity = 1.25;
      moveCursorBy(deltaX * sensitivity, deltaY * sensitivity);
    };

    const onGlobalTouchEnd = (e: TouchEvent) => {
      if (touchOnButtonRef.current) {
        touchOnButtonRef.current = false;
        return;
      }

      if (e.cancelable) e.preventDefault();
      e.stopPropagation();

      const duration = Date.now() - touchStartTime.current;

      // Quick tap on empty background (<350ms and <6px movement):
      // Click strictly WHERE THE VIRTUAL CURSOR IS, never where finger tapped!
      if (!hasMovedRef.current && duration < 350) {
        triggerClick();
        dreamAudio.playPop();
      }

      touchStartPos.current = null;
      lastTouchPos.current = null;
      hasMovedRef.current = false;
    };

    const onGlobalTouchCancel = () => {
      touchOnButtonRef.current = false;
      touchStartPos.current = null;
      lastTouchPos.current = null;
      hasMovedRef.current = false;
    };

    // Capture phase listeners ensure background touches never leak into native page scrolling
    window.addEventListener('touchstart', onGlobalTouchStart, { capture: true, passive: false });
    window.addEventListener('touchmove', onGlobalTouchMove, { capture: true, passive: false });
    window.addEventListener('touchend', onGlobalTouchEnd, { capture: true, passive: false });
    window.addEventListener('touchcancel', onGlobalTouchCancel, { capture: true, passive: false });

    return () => {
      window.removeEventListener('touchstart', onGlobalTouchStart, { capture: true });
      window.removeEventListener('touchmove', onGlobalTouchMove, { capture: true });
      window.removeEventListener('touchend', onGlobalTouchEnd, { capture: true });
      window.removeEventListener('touchcancel', onGlobalTouchCancel, { capture: true });
    };
  }, [isSupported, isCursorOn, moveCursorBy, triggerClick]);

  if (!isSupported || !isCursorOn) return null;

  return (
    <>
      {/* ── MINIMAL MOVABLE UP & DOWN CONTROLLER ───────────────────────────── */}
      {/* Anchored at fixed right-4 bottom-6, guaranteed visible, moveable anywhere */}
      <div
        data-cursor-ignore="true"
        style={{
          transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0)`,
          transition: isDraggingController ? 'none' : 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`fixed right-4 bottom-6 z-[99998] pointer-events-auto select-none touch-none flex flex-col items-center gap-1.5 p-1 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-sky-400/40 shadow-[0_10px_32px_rgba(0,0,0,0.65),0_0_18px_rgba(56,189,248,0.35)] lg:hidden ${
          isDraggingController ? 'scale-105 shadow-[0_14px_40px_rgba(0,0,0,0.8),0_0_26px_rgba(56,189,248,0.5)]' : ''
        }`}
      >
        {/* 1. UP ARROW BUTTON (Scrolls forward +150) */}
        <button
          type="button"
          data-cursor-ignore="true"
          onClick={(e) => {
            e.stopPropagation();
            triggerScroll(150);
            dreamAudio.playHover();
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            startContinuousScroll(150);
          }}
          onPointerUp={stopContinuousScroll}
          onPointerLeave={stopContinuousScroll}
          onContextMenu={(e) => e.preventDefault()}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-500/15 hover:bg-sky-500/30 active:bg-sky-500/50 text-amber-300 border border-sky-400/30 active:border-amber-300 active:scale-95 transition-all shadow-sm cursor-pointer"
          title="Scroll UP / Forward"
          aria-label="Scroll UP / Forward"
        >
          <ChevronUp className="w-5 h-5 text-amber-300 active:-translate-y-0.5 transition-transform" />
        </button>

        {/* 2. DRAG HANDLE LINE (Drag to move anywhere, or tap to switch side) */}
        <div
          data-cursor-ignore="true"
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          onTouchCancel={handleDragEnd}
          className="w-full py-2 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none select-none group"
          title="Drag to move, tap to switch side"
          aria-label="Drag controller handle"
        >
          <div className="w-6 h-1 rounded-full bg-gradient-to-r from-sky-400 via-amber-300 to-sky-400 shadow-[0_0_8px_rgba(251,191,36,0.65)] group-active:scale-110 group-active:brightness-125 transition-transform" />
        </div>

        {/* 3. DOWN ARROW BUTTON (Scrolls backward -150) */}
        <button
          type="button"
          data-cursor-ignore="true"
          onClick={(e) => {
            e.stopPropagation();
            triggerScroll(-150);
            dreamAudio.playHover();
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            startContinuousScroll(-150);
          }}
          onPointerUp={stopContinuousScroll}
          onPointerLeave={stopContinuousScroll}
          onContextMenu={(e) => e.preventDefault()}
          className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-500/15 hover:bg-sky-500/30 active:bg-sky-500/50 text-amber-300 border border-sky-400/30 active:border-amber-300 active:scale-95 transition-all shadow-sm cursor-pointer"
          title="Scroll DOWN / Backward"
          aria-label="Scroll DOWN / Backward"
        >
          <ChevronDown className="w-5 h-5 text-amber-300 active:translate-y-0.5 transition-transform" />
        </button>
      </div>
    </>
  );
};
