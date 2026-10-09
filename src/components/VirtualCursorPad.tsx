import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';
import { MousePointer, Move, Zap, Crosshair, ChevronDown, ChevronUp, RotateCcw, Power } from 'lucide-react';

export const isVirtualCursorEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;

  const runtimeEnv = (import.meta as any).env;
  const envValues = [
    typeof process !== 'undefined' ? process.env.CURSER : undefined,
    runtimeEnv?.VITE_CURSER,
    runtimeEnv?.CURSER,
  ];
  return envValues.some((value) => String(value ?? '').trim().toLowerCase() === 'true');
};

export const VirtualCursorPad: React.FC = () => {
  const location = useLocation();
  const enabled = isVirtualCursorEnabled();

  const path = location.pathname.toLowerCase();
  const isJourney = path.startsWith('/journey') || path.startsWith('/story');
  const isCosmic = path.startsWith('/explore-work') || path.startsWith('/space');
  const hideReticle = isJourney || isCosmic;

  // Virtual cursor coordinates on screen
  const [cursorPos, setCursorPos] = useState({
    x: typeof window !== 'undefined' ? Math.round(window.innerWidth / 2) : 500,
    y: typeof window !== 'undefined' ? Math.round(window.innerHeight / 2) : 400,
  });

  // Touchpad window position on screen (draggable anywhere, starts docked neatly on mobile)
  const [padPos, setPadPos] = useState(() => ({
    x: typeof window !== 'undefined' ? (window.innerWidth < 640 ? 12 : 24) : 20,
    y: typeof window !== 'undefined' ? (window.innerWidth < 640 ? Math.max(70, window.innerHeight - 260) : Math.max(70, window.innerHeight - 340)) : 400,
  }));

  const [isMinimized, setIsMinimized] = useState(() => typeof window !== 'undefined' && window.innerWidth < 640);
  const [isDraggingPad, setIsDraggingPad] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [sensitivity, setSensitivity] = useState<number>(1.8);
  const [hoveredTag, setHoveredTag] = useState<string>('viewport');

  const padDragStartRef = useRef<{ startX: number; startY: number; padStartX: number; padStartY: number } | null>(null);
  const lastTouchRef = useRef<{ x: number; y: number } | null>(null);
  const touchMovedRef = useRef(false);
  const activePointerIdRef = useRef<number | null>(null);
  const lastHoverTargetRef = useRef<HTMLElement | null>(null);

  const cursorPosRef = useRef(cursorPos);
  cursorPosRef.current = cursorPos;

  const getTargetAt = useCallback((x: number, y: number): HTMLElement => {
    const elements = document.elementsFromPoint(x, y);
    const target = elements.find((element) => !element.closest('[data-virtual-cursor-pad]'));
    return (target as HTMLElement | undefined) || document.body;
  }, []);

  // Dispatch real mouse and pointer events at the virtual cursor coordinates
  const dispatchEventsAt = useCallback((x: number, y: number) => {
    if (typeof document === 'undefined') return;

    // Clamp coordinates safely within viewport
    const clampedX = Math.max(1, Math.min(window.innerWidth - 1, Math.round(x)));
    const clampedY = Math.max(1, Math.min(window.innerHeight - 1, Math.round(y)));

    const target = getTargetAt(clampedX, clampedY);

    // Dispatch hover enter/leave when target element changes
    if (lastHoverTargetRef.current && lastHoverTargetRef.current !== target) {
      const previousTarget = lastHoverTargetRef.current;
      const exitInit = { bubbles: true, clientX: clampedX, clientY: clampedY, relatedTarget: target };
      previousTarget.dispatchEvent(new PointerEvent('pointerout', { ...exitInit, pointerId: 1, pointerType: 'mouse' }));
      previousTarget.dispatchEvent(new PointerEvent('pointerleave', { ...exitInit, bubbles: false, pointerId: 1, pointerType: 'mouse' }));
      previousTarget.dispatchEvent(new MouseEvent('mouseout', exitInit));
      previousTarget.dispatchEvent(new MouseEvent('mouseleave', { ...exitInit, bubbles: false }));
    }
    if (target && target !== lastHoverTargetRef.current) {
      const enterInit = { bubbles: true, clientX: clampedX, clientY: clampedY, relatedTarget: lastHoverTargetRef.current };
      target.dispatchEvent(new PointerEvent('pointerover', { ...enterInit, pointerId: 1, pointerType: 'mouse' }));
      target.dispatchEvent(new PointerEvent('pointerenter', { ...enterInit, bubbles: false, pointerId: 1, pointerType: 'mouse' }));
      target.dispatchEvent(new MouseEvent('mouseover', enterInit));
      target.dispatchEvent(new MouseEvent('mouseenter', { ...enterInit, bubbles: false }));
      lastHoverTargetRef.current = target;
    }

    // Update hovered element tag for HUD
    const tag = target.tagName ? target.tagName.toLowerCase() : 'element';
    const id = target.id ? `#${target.id}` : '';
    const cls = target.className && typeof target.className === 'string'
      ? `.${target.className.split(' ').filter(Boolean).slice(0, 1).join('.')}`
      : '';
    setHoveredTag(`${tag}${id}${cls}`);

    const isInteractive = Boolean(
      target.closest('button') ||
      target.closest('a') ||
      target.closest('input') ||
      target.closest('textarea') ||
      target.closest('select') ||
      target.closest('[role="button"]') ||
      target.closest('[role="link"]') ||
      target.closest('.cursor-pointer') ||
      target.closest('[title]') ||
      target.closest('summary')
    );

    const eventInit = {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: clampedX,
      clientY: clampedY,
      screenX: clampedX,
      screenY: clampedY,
    };

    // 1. Dispatch mousemove & pointermove directly on target element
    const mouseMoveEvent = new MouseEvent('mousemove', eventInit);
    target.dispatchEvent(mouseMoveEvent);

    const pointerMoveEvent = new PointerEvent('pointermove', {
      ...eventInit,
      pointerId: 1,
      pointerType: 'mouse',
      isPrimary: true,
    });
    target.dispatchEvent(pointerMoveEvent);

    // The bubbling mouse event reaches window listeners once; sync the themed cursor separately.
    window.dispatchEvent(
      new CustomEvent('virtual-cursor-move', {
        detail: { x: clampedX, y: clampedY, isHovering: isInteractive },
      })
    );
  }, [getTargetAt]);

  // Update cursor position and dispatch events
  const updateCursorPosition = useCallback(
    (newX: number, newY: number) => {
      const clampedX = Math.max(4, Math.min(window.innerWidth - 4, Math.round(newX)));
      const clampedY = Math.max(4, Math.min(window.innerHeight - 4, Math.round(newY)));
      const nextPosition = { x: clampedX, y: clampedY };
      cursorPosRef.current = nextPosition;
      setCursorPos(nextPosition);
      dispatchEventsAt(clampedX, clampedY);
    },
    [dispatchEventsAt]
  );

  // Trigger a full mouse click at the current virtual cursor position
  const triggerClick = useCallback(() => {
    const { x, y } = cursorPosRef.current;
    const clampedX = Math.max(0, Math.min(window.innerWidth - 1, x));
    const clampedY = Math.max(0, Math.min(window.innerHeight - 1, y));

    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 240);

    // Notify custom cursor click visual
    window.dispatchEvent(new CustomEvent('virtual-cursor-click'));

    const target = getTargetAt(clampedX, clampedY);
    const interactiveTarget = target.closest(
      'button, a, input, textarea, select, [role="button"], [role="link"], .cursor-pointer, [title], summary',
    ) as HTMLElement | null;
    const clickTarget = interactiveTarget || target;

    const eventInit = {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: clampedX,
      clientY: clampedY,
      screenX: clampedX,
      screenY: clampedY,
      button: 0,
      buttons: 1,
    };

    // PointerDown and MouseDown
    target.dispatchEvent(new PointerEvent('pointerdown', { ...eventInit, pointerId: 1, pointerType: 'mouse', isPrimary: true }));
    target.dispatchEvent(new MouseEvent('mousedown', eventInit));

    // PointerUp and MouseUp, followed by exactly one click/default activation.
    setTimeout(() => {
      target.dispatchEvent(new PointerEvent('pointerup', { ...eventInit, buttons: 0, pointerId: 1, pointerType: 'mouse', isPrimary: true }));
      target.dispatchEvent(new MouseEvent('mouseup', { ...eventInit, buttons: 0 }));
      const focusTarget = target.closest('input, textarea, select, [contenteditable="true"]') as HTMLElement | null;
      focusTarget?.focus({ preventScroll: true });
      if (clickTarget.matches(':disabled')) return;
      if (interactiveTarget && typeof clickTarget.click === 'function') {
        clickTarget.click();
      } else {
        target.dispatchEvent(new MouseEvent('click', { ...eventInit, buttons: 0 }));
      }
    }, 45);
  }, [getTargetAt]);

  const triggerScroll = useCallback((deltaY: number) => {
    const { x, y } = cursorPosRef.current;
    const target = getTargetAt(x, y);
    target.dispatchEvent(new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: x,
      clientY: y,
      deltaY,
      deltaMode: WheelEvent.DOM_DELTA_PIXEL,
    }));
  }, [getTargetAt]);

  // ── Dragging the Touchpad Widget Window Anywhere on Screen ─────────────────
  const handlePadHeaderPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    setIsDraggingPad(true);
    padDragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      padStartX: padPos.x,
      padStartY: padPos.y,
    };

    const handlePointerMove = (ev: PointerEvent) => {
      if (!padDragStartRef.current) return;
      const dx = ev.clientX - padDragStartRef.current.startX;
      const dy = ev.clientY - padDragStartRef.current.startY;
      const newX = Math.max(8, Math.min(window.innerWidth - 240, padDragStartRef.current.padStartX + dx));
      const newY = Math.max(8, Math.min(window.innerHeight - 100, padDragStartRef.current.padStartY + dy));
      setPadPos({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
      setIsDraggingPad(false);
      padDragStartRef.current = null;
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // ── Trackpad Surface Interaction (Relative Mouse Movement + Tap to Click) ─
  // Uses Pointer Capture so touching never cancels, loses focus, or hides the cursor
  const handleTrackpadPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!e.isPrimary || activePointerIdRef.current !== null) return;
    e.preventDefault();
    e.stopPropagation();

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}

    activePointerIdRef.current = e.pointerId;
    lastTouchRef.current = { x: e.clientX, y: e.clientY };
    touchMovedRef.current = false;
  };

  const handleTrackpadPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId || !lastTouchRef.current) return;
    e.preventDefault();
    e.stopPropagation();

    const dx = (e.clientX - lastTouchRef.current.x) * sensitivity;
    const dy = (e.clientY - lastTouchRef.current.y) * sensitivity;

    if (Math.abs(dx) > 1.2 || Math.abs(dy) > 1.2) {
      touchMovedRef.current = true;
    }

    lastTouchRef.current = { x: e.clientX, y: e.clientY };

    // Continuously update position - cursor NEVER hides!
    updateCursorPosition(cursorPosRef.current.x + dx, cursorPosRef.current.y + dy);
  };

  const handleTrackpadPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    e.preventDefault();
    e.stopPropagation();

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    // Quick tap without dragging fires click at cursor coordinates
    if (!touchMovedRef.current) {
      triggerClick();
    }

    activePointerIdRef.current = null;
    lastTouchRef.current = null;
    touchMovedRef.current = false;
  };

  const handleTrackpadPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePointerIdRef.current !== e.pointerId) return;
    activePointerIdRef.current = null;
    lastTouchRef.current = null;
    touchMovedRef.current = false;
  };

  const toggleTouchpad = () => {
    const expand = isMinimized;
    if (expand) {
      setPadPos((position) => ({
        ...position,
        y: Math.max(8, Math.min(position.y, window.innerHeight - 390)),
      }));
    }
    setIsMinimized((prev) => !prev);
  };

  const stopPageTouch = (event: React.TouchEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  // Center cursor shortcut
  const handleCenterCursor = () => {
    updateCursorPosition(window.innerWidth / 2, window.innerHeight / 2);
  };

  if (!enabled) return null;

  return (
    <>
      {/* ── 1. VIRTUAL CURSOR RETICLE ON SCREEN (Hidden on Journey & Space pages) ── */}
      {!hideReticle && (
        <div
          className="fixed pointer-events-none z-[100000] select-none will-change-transform"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            transform: 'translate(-4px, -4px)',
          }}
        >
          <div className="relative">
            {/* Luminous Glow Halo behind cursor arrow for high contrast on all scenes */}
            <div className="absolute -inset-1 rounded-full bg-cyan-400/50 blur-[5px]" />

            {/* Main Pointer Arrow SVG */}
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              className={`drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] transition-transform duration-75 ${
                isClicking ? 'scale-90 rotate-[-8deg]' : 'scale-100'
              }`}
            >
              <path
                d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                fill="#06b6d4"
                stroke="#ffffff"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
            </svg>

            {/* Click Ripple Indicator */}
            <AnimatePresence>
              {isClicking && (
                <motion.div
                  initial={{ scale: 0.2, opacity: 1 }}
                  animate={{ scale: 3.2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="absolute -top-3.5 -left-3.5 w-9 h-9 rounded-full border-2 border-cyan-300 bg-cyan-400/40"
                />
              )}
            </AnimatePresence>

            {/* Target Reticle Coordinates Tag */}
            <div className="absolute top-5 left-4 whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-950/90 border border-cyan-500/50 text-[10px] font-mono text-cyan-200 shadow-md pointer-events-none backdrop-blur-md">
              {Math.round(cursorPos.x)}, {Math.round(cursorPos.y)}
            </div>
          </div>
        </div>
      )}

      {/* ── 2. DRAGGABLE VIRTUAL TOUCHPAD CONTROLLER WINDOW ────────────────────── */}
      <div
        data-virtual-cursor-pad
        onTouchStart={stopPageTouch}
        onTouchMove={stopPageTouch}
        onTouchEnd={stopPageTouch}
        onTouchCancel={stopPageTouch}
        className="fixed z-[99998] select-none touch-none"
        style={{
          left: padPos.x,
          top: padPos.y,
        }}
      >
        <div
          className={`flex flex-col bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.65),0_0_20px_rgba(6,182,212,0.25)] text-slate-100 font-sans transition-all duration-200 overflow-hidden ${
            isMinimized ? 'w-52 xs:w-56' : 'w-64 xs:w-72 sm:w-80'
          }`}
        >
          {/* Header Drag Handle Bar (Grab here to move pad to any place) */}
          <div
            onPointerDown={handlePadHeaderPointerDown}
            className={`flex items-center justify-between px-3 py-2 bg-gradient-to-r from-cyan-950/80 via-slate-900 to-indigo-950/80 border-b border-cyan-500/30 cursor-grab active:cursor-grabbing ${
              isDraggingPad ? 'bg-cyan-900/60' : ''
            }`}
            title="Drag to move Touchpad anywhere on screen"
          >
            <div className="flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="text-[11px] font-bold tracking-wide text-cyan-200 uppercase font-mono">
                Virtual Cursor
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="text-[9px] font-mono text-cyan-400/80 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-500/30">
                {sensitivity}x
              </span>
              <button
                type="button"
                onClick={toggleTouchpad}
                className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title={isMinimized ? 'Expand Touchpad' : 'Minimize Touchpad'}
              >
                {isMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Expanded Touchpad Surface and Controls */}
          {!isMinimized && (
            <div className="p-3 flex flex-col gap-2.5">
              {/* Target Element Inspector HUD */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-950/60 px-2 py-1 rounded border border-white/5">
                <span className="text-cyan-400/90 font-semibold truncate max-w-[170px]">
                  {hoveredTag || 'viewport'}
                </span>
                <span className="text-slate-500 text-[9px]">Tap to Click</span>
              </div>

              {/* ── THE TRACKPAD SURFACE (Never loses cursor on touch) ── */}
              <div
                onPointerDown={handleTrackpadPointerDown}
                onPointerMove={handleTrackpadPointerMove}
                onPointerUp={handleTrackpadPointerUp}
                onPointerCancel={handleTrackpadPointerCancel}
                onLostPointerCapture={handleTrackpadPointerCancel}
                className="relative w-full h-36 sm:h-40 rounded-xl bg-gradient-to-b from-slate-950/90 to-slate-900/90 border border-cyan-500/30 shadow-inner flex flex-col items-center justify-center cursor-crosshair active:border-cyan-400 transition-colors overflow-hidden group touch-none"
              >
                {/* Subtle Grid texture */}
                <div
                  className="absolute inset-0 opacity-15 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 1px 1px, rgba(56,189,248,0.6) 1px, transparent 0)',
                    backgroundSize: '16px 16px',
                  }}
                />

                {/* Center crosshair watermark */}
                <Crosshair className="w-7 h-7 text-cyan-500/25 pointer-events-none group-active:text-cyan-400/60 transition-colors" />
                <span className="text-[11px] font-medium text-slate-400/60 mt-1 pointer-events-none group-active:text-cyan-300/80">
                  Slide finger/mouse to move cursor
                </span>
                <span className="text-[9px] text-slate-500 pointer-events-none">
                  Quick tap = Click
                </span>
              </div>

              {/* Action Buttons Row */}
              <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                {/* 1. Left Click Button */}
                <button
                  type="button"
                  onClick={triggerClick}
                  className={`flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg font-bold text-[11px] transition-all border ${
                    isClicking
                      ? 'bg-cyan-400 text-slate-950 border-cyan-300 scale-95 shadow-[0_0_12px_#22d3ee]'
                      : 'bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border-cyan-500/40 hover:border-cyan-400'
                  }`}
                >
                  <Zap className="w-3 h-3 text-cyan-300" />
                  <span>Click</span>
                </button>

                {/* 2. Recenter Button */}
                <button
                  type="button"
                  onClick={handleCenterCursor}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg font-medium text-[11px] bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 border border-slate-700 hover:border-slate-500 transition-colors"
                  title="Recenter cursor to center of screen"
                >
                  <RotateCcw className="w-3 h-3 text-slate-400" />
                  <span>Center</span>
                </button>

                {/* 3. Sensitivity Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    setSensitivity((prev) => (prev === 1.2 ? 1.8 : prev === 1.8 ? 2.5 : 1.2));
                  }}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg font-medium text-[11px] bg-slate-800/60 hover:bg-slate-700/60 text-slate-300 border border-slate-700 hover:border-slate-500 transition-colors"
                  title="Toggle trackpad sensitivity speed"
                >
                  <MousePointer className="w-3 h-3 text-cyan-400" />
                  <span>{sensitivity === 1.2 ? 'Slow' : sensitivity === 1.8 ? 'Norm' : 'Fast'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => triggerScroll(-60)}
                  aria-label="Scroll up at the virtual cursor"
                  className="flex min-h-9 items-center justify-center gap-1 rounded-lg border border-cyan-500/40 bg-cyan-600/20 px-2 py-1.5 text-[11px] font-medium text-cyan-100 transition-colors hover:bg-cyan-600/40"
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                  <span>Scroll up</span>
                </button>
                <button
                  type="button"
                  onClick={() => triggerScroll(60)}
                  aria-label="Scroll down at the virtual cursor"
                  className="flex min-h-9 items-center justify-center gap-1 rounded-lg border border-cyan-500/40 bg-cyan-600/20 px-2 py-1.5 text-[11px] font-medium text-cyan-100 transition-colors hover:bg-cyan-600/40"
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                  <span>Scroll down</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
