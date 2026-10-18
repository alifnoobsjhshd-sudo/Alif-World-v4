import React from 'react';
import { isVirtualCursorEnvEnabled } from '../context/MobileVirtualCursorContext';

export const isVirtualCursorEnabled = (): boolean => {
  return isVirtualCursorEnvEnabled();
};

/**
 * VirtualCursorPad is replaced by the requested streamlined MobileVirtualCursorOverlay
 * ("in the website will the virtual curser but with no mousepad, only will come a elements
 * where will have to button up and down by that user can control the forward and backwards scrolling").
 */
export const VirtualCursorPad: React.FC = () => {
  return null;
};
