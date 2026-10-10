import React from 'react';
import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GlobalChatButton: React.FC = () => (
  <Link
    to="/chat"
    aria-label="Open Alif's AI assistant"
    title="Chat with Alif's AI assistant"
    className="fixed left-[max(0.75rem,env(safe-area-inset-left))] top-[max(0.75rem,env(safe-area-inset-top))] z-[80] inline-flex min-h-11 items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-800 shadow-[0_8px_28px_rgba(36,74,111,0.14)] backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white hover:shadow-[0_12px_32px_rgba(36,74,111,0.2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 active:translate-y-0"
  >
    <MessageCircle className="h-4 w-4 text-sky-700" aria-hidden="true" />
    <span>Chat</span>
  </Link>
);
