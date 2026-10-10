import React from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ROUTES_WITH_PAGE_BACK = new Set([
  '/world',
  '/journey',
  '/story',
  '/explore-works',
  '/explore-work',
  '/not-available',
  '/unavailable',
  '/about',
  '/about-me',
  '/more-about-him',
  '/chat',
]);

export const GlobalChatButton: React.FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const routePath = pathname.replace(/\/+$/, '') || '/';
  const isLanding = routePath === '/';
  const needsGlobalBack = !isLanding && !ROUTES_WITH_PAGE_BACK.has(routePath);

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      {needsGlobalBack && (
        <button
          type="button"
          onClick={handleBack}
          aria-label="Go back"
          title="Go back"
          className="fixed left-[max(0.75rem,env(safe-area-inset-left))] top-[max(0.75rem,env(safe-area-inset-top))] z-[80] inline-flex min-h-10 min-w-10 items-center justify-center rounded-full border border-white/70 bg-white/80 text-slate-800 shadow-[0_8px_28px_rgba(36,74,111,0.14)] backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 active:translate-y-0"
        >
          <ArrowLeft className="h-4 w-4 text-sky-700" aria-hidden="true" />
        </button>
      )}

      <Link
        to="/chat"
        aria-label="Open Alif's AI assistant"
        title="Chat with Alif's AI assistant"
        className={isLanding
          ? 'fixed left-[max(0.75rem,env(safe-area-inset-left))] top-[max(0.75rem,env(safe-area-inset-top))] z-[80] inline-flex min-h-11 items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-800 shadow-[0_8px_28px_rgba(36,74,111,0.14)] backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white hover:shadow-[0_12px_32px_rgba(36,74,111,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 active:translate-y-0'
          : 'fixed right-[max(0.75rem,env(safe-area-inset-right))] top-[calc(max(0.75rem,env(safe-area-inset-top))+3.25rem)] z-[80] inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/80 text-slate-800 shadow-[0_8px_28px_rgba(36,74,111,0.14)] backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white hover:shadow-[0_12px_32px_rgba(36,74,111,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 active:translate-y-0'}
      >
        <MessageCircle className="h-4 w-4 text-sky-700" aria-hidden="true" />
        {isLanding && <span>Chat</span>}
      </Link>
    </>
  );
};
