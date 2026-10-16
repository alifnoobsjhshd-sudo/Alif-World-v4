import React, { useEffect, useState } from 'react';

interface AutoLandscapeWrapperProps {
  children: React.ReactNode;
}

export const AutoLandscapeWrapper: React.FC<AutoLandscapeWrapperProps> = ({ children }) => {
  const [dims, setDims] = useState(() => {
    if (typeof window === 'undefined') return { width: 1024, height: 768, isPortraitMobile: false };
    const w = window.innerWidth;
    const h = window.innerHeight;
    const isMobile = Math.min(w, h) <= 840;
    const isPortrait = h > w;
    return {
      width: w,
      height: h,
      isPortraitMobile: isMobile && isPortrait,
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isMobile = Math.min(w, h) <= 840;
      const isPortrait = h > w;

      setDims({
        width: w,
        height: h,
        isPortraitMobile: isMobile && isPortrait,
      });

      // Attempt standard browser orientation lock to landscape if available
      if (screen.orientation && 'lock' in screen.orientation) {
        try {
          (screen.orientation as any).lock('landscape').catch(() => {});
        } catch (_) {}
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // When mobile phone is in portrait orientation, automatically enforce landscape ratio
  // by rotating 90deg and sizing width=viewportHeight and height=viewportWidth
  if (dims.isPortraitMobile) {
    return (
      <div
        id="auto-landscape-container"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          width: `${dims.height}px`,
          height: `${dims.width}px`,
          transform: 'translate(-50%, -50%) rotate(90deg)',
          transformOrigin: 'center center',
          overflow: 'hidden',
          zIndex: 1,
        }}
        className="select-none touch-none"
      >
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
          {children}
        </div>
      </div>
    );
  }

  // Already landscape or desktop screen: standard 100% viewport container
  return (
    <div id="auto-landscape-container" className="w-full h-full relative overflow-hidden">
      {children}
    </div>
  );
};
