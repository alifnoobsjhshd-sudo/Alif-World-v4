/**
 * Detects touch-first phones and tablets without treating ordinary desktop
 * windows or laptops as mobile just because their viewport is short.
 */
export const isTouchFirstViewport = (): boolean => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false;
  }

  return window.matchMedia('(pointer: coarse) and (hover: none)').matches;
};
