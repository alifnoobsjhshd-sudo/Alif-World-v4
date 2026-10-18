import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { dreamAudio } from '../utils/audio';

export const isVirtualCursorEnvEnabled = (): boolean => {
  if (typeof window === 'undefined') return false;

  const runtimeMeta = (import.meta as any).env || {};
  const envValues = [
    typeof process !== 'undefined' ? process.env?.CURSER : undefined,
    typeof process !== 'undefined' ? process.env?.VITE_CURSER : undefined,
    runtimeMeta.VITE_CURSER,
    runtimeMeta.CURSER,
    (window as any).__CURSER__,
    (window as any).CURSER,
  ];
  return envValues.some((value) => String(value ?? '').trim().toLowerCase() === 'true');
};

export const isDesktopScreenRatio = (): boolean => {
  if (typeof window === 'undefined') return true;
  if (window.innerWidth >= 1024) return true;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  if (!isTouchDevice) return true;
  return false;
};

export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  if (isDesktopScreenRatio()) return false;
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  return hasTouch || isCoarse;
};

// Returns the true landscape stage dimensions (accounting for 90deg AutoLandscape rotation on mobile phones)
export const getStageDimensions = (): { width: number; height: number } => {
  if (typeof window === 'undefined') return { width: 1024, height: 768 };
  const container = typeof document !== 'undefined' ? document.getElementById('auto-landscape-container') : null;
  const isAutoRotated = Boolean(container?.style.transform.includes('rotate(90deg)'));
  if (isAutoRotated) {
    return {
      width: Math.max(window.innerWidth, window.innerHeight),
      height: Math.min(window.innerWidth, window.innerHeight),
    };
  }
  return {
    width: container?.clientWidth || window.innerWidth,
    height: container?.clientHeight || window.innerHeight,
  };
};

interface MobileVirtualCursorContextType {
  isSupported: boolean;
  isCursorOn: boolean;
  isTransitioning: boolean;
  transitionMode: 'cursor' | 'normal' | null;
  cursorPos: { x: number; y: number };
  isClicking: boolean;
  isHovering: boolean;
  toggleCursor: () => void;
  setCursorOn: (val: boolean) => void;
  updateCursor: (x: number, y: number) => void;
  moveCursorBy: (deltaX: number, deltaY: number) => void;
  triggerClick: () => void;
  triggerScroll: (deltaY: number) => void;
}

const MobileVirtualCursorContext = createContext<MobileVirtualCursorContextType | null>(null);

const STORAGE_KEY = 'alif_mobile_virtual_cursor_on';

export const MobileVirtualCursorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSupported, setIsSupported] = useState<boolean>(() => {
    return isVirtualCursorEnvEnabled() && isMobileDevice();
  });

  const [isCursorOn, setIsCursorOnState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    if (!isVirtualCursorEnvEnabled() || isDesktopScreenRatio()) return false;
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved === 'true';
  });

  // Loading transition screen state when switching modes
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [transitionMode, setTransitionMode] = useState<'cursor' | 'normal' | null>(null);

  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>(() => {
    if (typeof window === 'undefined') return { x: 500, y: 350 };
    const { width, height } = getStageDimensions();
    return {
      x: Math.round(width / 2),
      y: Math.round(height / 2),
    };
  });

  const [isClicking, setIsClicking] = useState<boolean>(false);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const cursorPosRef = useRef(cursorPos);
  cursorPosRef.current = cursorPos;

  const rafSyncIdRef = useRef<number | null>(null);
  const lastHoverTargetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkSupport = () => {
      const supported = isVirtualCursorEnvEnabled() && isMobileDevice();
      setIsSupported(supported);
      if (isDesktopScreenRatio()) {
        setIsCursorOnState(false);
      }
    };
    checkSupport();
    window.addEventListener('resize', checkSupport, { passive: true });
    window.addEventListener('orientationchange', checkSupport, { passive: true });
    return () => {
      window.removeEventListener('resize', checkSupport);
      window.removeEventListener('orientationchange', checkSupport);
      if (rafSyncIdRef.current) cancelAnimationFrame(rafSyncIdRef.current);
    };
  }, []);

  // Sync body class so all touch listeners and components across the site know virtual cursor is active
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isCursorOn && isSupported) {
      document.body.classList.add('mobile-virtual-cursor-active');
    } else {
      document.body.classList.remove('mobile-virtual-cursor-active');
    }
    return () => {
      document.body?.classList.remove('mobile-virtual-cursor-active');
    };
  }, [isCursorOn, isSupported]);

  const setCursorOn = useCallback((val: boolean) => {
    setIsCursorOnState(val);
    try {
      sessionStorage.setItem(STORAGE_KEY, val ? 'true' : 'false');
    } catch (_) {}
    window.dispatchEvent(new CustomEvent('mobile-cursor-state-change', { detail: { isOn: val } }));
  }, []);

  // Mode switch with full-screen transition animation as requested
  const toggleCursor = useCallback(() => {
    if (isTransitioning) return;
    const nextTarget = isCursorOn ? 'normal' : 'cursor';
    setIsTransitioning(true);
    setTransitionMode(nextTarget);
    dreamAudio.playPop();

    // 1.35s transition duration: preserves exact progress and page
    setTimeout(() => {
      const nextVal = nextTarget === 'cursor';
      setCursorOn(nextVal);
      dreamAudio.playWarpJumpSound();
    }, 1350);

    setTimeout(() => {
      setIsTransitioning(false);
      setTransitionMode(null);
    }, 1600);
  }, [isCursorOn, isTransitioning, setCursorOn]);

  // Translate stage coordinates to physical coordinates if AutoLandscape is rotated
  const getElementUnderPoint = useCallback((stageX: number, stageY: number): HTMLElement => {
    if (typeof document === 'undefined') return null as any;
    const container = document.getElementById('auto-landscape-container');
    const isAutoRotated = Boolean(container?.style.transform.includes('rotate(90deg)'));

    let physX = stageX;
    let physY = stageY;

    if (container && isAutoRotated) {
      physX = window.innerWidth - stageY;
      physY = stageX;
    }

    physX = Math.max(1, Math.min(window.innerWidth - 1, physX));
    physY = Math.max(1, Math.min(window.innerHeight - 1, physY));

    const elements = document.elementsFromPoint(physX, physY);
    const target = elements.find((el) => {
      if (el.closest('[data-cursor-ignore]')) return false;
      if (el.closest('[data-virtual-cursor-layer]')) return false;
      if (el.id === 'custom-cursor-root' || el.closest('#custom-cursor-root')) return false;
      if (el.id === 'auto-landscape-container' || el.id === 'root') return false;
      return true;
    });

    return (target as HTMLElement) || document.body;
  }, []);

  // Butter-smooth delta movement: drives all interactive desktop animations in real time
  const moveCursorBy = useCallback((deltaX: number, deltaY: number) => {
    const { width: stageW, height: stageH } = getStageDimensions();
    const maxX = stageW - 4;
    const maxY = stageH - 4;

    const currentX = cursorPosRef.current.x;
    const currentY = cursorPosRef.current.y;

    const nextX = Math.max(4, Math.min(maxX, Math.round(currentX + deltaX)));
    const nextY = Math.max(4, Math.min(maxY, Math.round(currentY + deltaY)));

    if (nextX === currentX && nextY === currentY) return;

    cursorPosRef.current = { x: nextX, y: nextY };

    // Fire immediately to sync CustomCursor with zero lag or stutter
    window.dispatchEvent(
      new CustomEvent('virtual-cursor-move', {
        detail: { x: nextX, y: nextY },
      })
    );

    // Schedule RAF for state sync, hover hit-test, and full desktop event propagation
    if (!rafSyncIdRef.current) {
      rafSyncIdRef.current = requestAnimationFrame(() => {
        rafSyncIdRef.current = null;
        const curX = cursorPosRef.current.x;
        const curY = cursorPosRef.current.y;
        setCursorPos({ x: curX, y: curY });

        const target = getElementUnderPoint(curX, curY);
        if (target) {
          const interactive = Boolean(
            target.closest(
              'button, a, input, textarea, select, [role="button"], [role="link"], .cursor-pointer, [title], summary, [data-hoverable]'
            )
          );
          setIsHovering(interactive);

          // Handle pointerenter/pointerleave transitions for buttons & cards
          if (lastHoverTargetRef.current && lastHoverTargetRef.current !== target) {
            const prev = lastHoverTargetRef.current;
            const outInit = { bubbles: true, cancelable: true, view: window, clientX: curX, clientY: curY, relatedTarget: target };
            prev.dispatchEvent(new PointerEvent('pointerout', { ...outInit, pointerId: 1, pointerType: 'mouse' }));
            prev.dispatchEvent(new PointerEvent('pointerleave', { ...outInit, bubbles: false, pointerId: 1, pointerType: 'mouse' }));
            prev.dispatchEvent(new MouseEvent('mouseout', outInit));
            prev.dispatchEvent(new MouseEvent('mouseleave', { ...outInit, bubbles: false }));
          }

          if (target !== lastHoverTargetRef.current) {
            const enterInit = { bubbles: true, cancelable: true, view: window, clientX: curX, clientY: curY, relatedTarget: lastHoverTargetRef.current };
            target.dispatchEvent(new PointerEvent('pointerover', { ...enterInit, pointerId: 1, pointerType: 'mouse' }));
            target.dispatchEvent(new PointerEvent('pointerenter', { ...enterInit, bubbles: false, pointerId: 1, pointerType: 'mouse' }));
            target.dispatchEvent(new MouseEvent('mouseover', enterInit));
            target.dispatchEvent(new MouseEvent('mouseenter', { ...enterInit, bubbles: false }));
            lastHoverTargetRef.current = target;
          }

          // Dispatch pointermove & mousemove on both target and window for full desktop interaction effects
          const eventInit = {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: curX,
            clientY: curY,
            screenX: curX,
            screenY: curY,
          };
          const pEvent = new PointerEvent('pointermove', { ...eventInit, pointerId: 1, pointerType: 'mouse', isPrimary: true });
          const mEvent = new MouseEvent('mousemove', eventInit);
          target.dispatchEvent(pEvent);
          target.dispatchEvent(mEvent);
          window.dispatchEvent(pEvent);
          window.dispatchEvent(mEvent);
        }
      });
    }
  }, [getElementUnderPoint]);

  const updateCursor = useCallback((x: number, y: number) => {
    const { width: stageW, height: stageH } = getStageDimensions();
    const maxX = stageW - 4;
    const maxY = stageH - 4;
    const clampedX = Math.max(4, Math.min(maxX, Math.round(x)));
    const clampedY = Math.max(4, Math.min(maxY, Math.round(y)));

    cursorPosRef.current = { x: clampedX, y: clampedY };
    setCursorPos({ x: clampedX, y: clampedY });

    const target = getElementUnderPoint(clampedX, clampedY);
    if (!target) return;

    const interactive = Boolean(
      target.closest(
        'button, a, input, textarea, select, [role="button"], [role="link"], .cursor-pointer, [title], summary, [data-hoverable]'
      )
    );
    setIsHovering(interactive);

    const eventInit = {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: clampedX,
      clientY: clampedY,
      screenX: clampedX,
      screenY: clampedY,
    };
    target.dispatchEvent(new PointerEvent('pointermove', { ...eventInit, pointerId: 1, pointerType: 'mouse' }));
    target.dispatchEvent(new MouseEvent('mousemove', eventInit));
    window.dispatchEvent(new PointerEvent('pointermove', { ...eventInit, pointerId: 1, pointerType: 'mouse' }));
    window.dispatchEvent(new MouseEvent('mousemove', eventInit));

    window.dispatchEvent(
      new CustomEvent('virtual-cursor-move', {
        detail: { x: clampedX, y: clampedY, isHovering: interactive, target },
      })
    );
  }, [getElementUnderPoint]);

  const triggerClick = useCallback(() => {
    const { x, y } = cursorPosRef.current;
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 240);

    window.dispatchEvent(new CustomEvent('virtual-cursor-click', { detail: { x, y } }));

    const target = getElementUnderPoint(x, y);
    if (!target) return;

    const interactiveTarget = target.closest(
      'button, a, input, textarea, select, [role="button"], [role="link"], .cursor-pointer, [title], summary'
    ) as HTMLElement | null;
    const clickTarget = interactiveTarget || target;

    const eventInit = {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: x,
      clientY: y,
      screenX: x,
      screenY: y,
      button: 0,
      buttons: 1,
    };

    target.dispatchEvent(new PointerEvent('pointerdown', { ...eventInit, pointerId: 1, pointerType: 'mouse', isPrimary: true }));
    target.dispatchEvent(new MouseEvent('mousedown', eventInit));

    setTimeout(() => {
      target.dispatchEvent(new PointerEvent('pointerup', { ...eventInit, buttons: 0, pointerId: 1, pointerType: 'mouse', isPrimary: true }));
      target.dispatchEvent(new MouseEvent('mouseup', { ...eventInit, buttons: 0 }));

      const focusTarget = target.closest('input, textarea, select, [contenteditable="true"]') as HTMLElement | null;
      focusTarget?.focus({ preventScroll: true });

      if (clickTarget && !clickTarget.matches(':disabled')) {
        if (typeof clickTarget.click === 'function') {
          clickTarget.click();
        } else {
          target.dispatchEvent(new MouseEvent('click', { ...eventInit, buttons: 0 }));
        }
      }
    }, 35);
  }, [getElementUnderPoint]);

  const triggerScroll = useCallback((deltaY: number) => {
    const { x, y } = cursorPosRef.current;
    const target = getElementUnderPoint(x, y);

    const wheelEv = new WheelEvent('wheel', {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: x,
      clientY: y,
      deltaX: deltaY,
      deltaY: deltaY,
    });
    if (target) {
      target.dispatchEvent(wheelEv);
    }
    window.dispatchEvent(wheelEv);
  }, [getElementUnderPoint]);

  return (
    <MobileVirtualCursorContext.Provider
      value={{
        isSupported,
        isCursorOn,
        isTransitioning,
        transitionMode,
        cursorPos,
        isClicking,
        isHovering,
        toggleCursor,
        setCursorOn,
        updateCursor,
        moveCursorBy,
        triggerClick,
        triggerScroll,
      }}
    >
      {children}
    </MobileVirtualCursorContext.Provider>
  );
};

export const useMobileVirtualCursor = () => {
  const context = useContext(MobileVirtualCursorContext);
  if (!context) {
    throw new Error('useMobileVirtualCursor must be used within MobileVirtualCursorProvider');
  }
  return context;
};
