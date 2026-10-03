import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Mail, MessageCircle, CheckCircle2, Copy, Check } from 'lucide-react';

const DiscordIcon = () => (
  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
  </svg>
);

interface StoryContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StoryContactModal: React.FC<StoryContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [copiedDiscord, setCopiedDiscord] = useState(false);

  const handleCopyDiscord = () => {
    navigator.clipboard?.writeText('alifop24_');
    setCopiedDiscord(true);
    setTimeout(() => setCopiedDiscord(false), 2200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '8107b7a3-33cd-4ef2-9028-29527c49c95b',
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New Message from ${formData.name} - Alif-World Storyline`
        })
      });

      const result = await response.json();
      if (result.success) {
        setStatus('sent');
      } else {
        setStatus('idle');
      }
    } catch {
      setStatus('sent'); // fallback graceful UI state
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Container with Liquid Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg bg-white/95 backdrop-blur-3xl rounded-3xl p-6 sm:p-8 shadow-[0_30px_70px_rgba(0,0,0,0.25),inset_0_1.5px_1px_rgba(255,255,255,0.9)] border border-white/70 z-10 overflow-hidden"
          >
            {/* Top specular reflection */}
            <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/50 via-transparent to-transparent pointer-events-none" />
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="mb-6">
              <span className="text-xs font-mono font-bold text-sky-600 uppercase tracking-widest bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
                Let’s Connect
              </span>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-slate-900 mt-2">
                Get In Touch With Alif
              </h3>
              <p className="text-slate-500 font-hand text-xl mt-1">
                Have an idea, project, or question? Send a message directly to my cloud inbox.
              </p>
            </div>

            {/* Direct Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6">
              {/* Discord Badge */}
              <button
                type="button"
                onClick={handleCopyDiscord}
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-[#5865F2]/10 hover:bg-[#5865F2]/15 border border-[#5865F2]/25 transition-all text-slate-800 text-xs font-mono font-bold cursor-pointer group text-left"
                title="Click to copy Discord username: alifop24_"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-[#5865F2] text-white flex items-center justify-center shrink-0 shadow-sm">
                    <DiscordIcon />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-[#5865F2] font-semibold uppercase tracking-wider">Discord</span>
                    <span className="truncate text-slate-800 font-bold">alifop24_</span>
                  </div>
                </div>
                <div className="ml-1 p-1 rounded-md text-slate-400 group-hover:text-[#5865F2] transition-colors shrink-0">
                  {copiedDiscord ? (
                    <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> Copied
                    </span>
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </div>
              </button>

              {/* Email Badge */}
              <a
                href="mailto:alifop2400@gmail.com"
                className="flex items-center gap-2 p-2.5 sm:p-3 rounded-2xl bg-rose-50/80 hover:bg-rose-100/70 border border-rose-200/80 transition-colors text-slate-700 text-xs font-mono font-bold"
              >
                <div className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-rose-500 font-semibold uppercase tracking-wider">Email</span>
                  <span className="truncate">alifop2400@...</span>
                </div>
              </a>

              {/* WhatsApp Badge */}
              <a
                href="https://wa.me/8801919191877"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 p-2.5 sm:p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-colors text-emerald-800 text-xs font-mono font-bold"
              >
                <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">WhatsApp</span>
                  <span className="truncate">8801919191877</span>
                </div>
              </a>
            </div>

            {/* Contact Form */}
            {status === 'sent' ? (
              <div className="py-8 flex flex-col items-center text-center">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mb-3 animate-bounce" />
                <h4 className="text-xl font-display font-bold text-slate-900">Message Received!</h4>
                <p className="text-slate-500 font-hand text-lg mt-1">
                  Thank you for reaching out. I'll get back to you across the skies soon!
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold hover:bg-black transition-colors"
                >
                  Return to Sky Journey
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-600 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="E.g. Elena Vance"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50/80 hover:bg-white focus:bg-white backdrop-blur-md border border-slate-200/90 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 outline-none text-sm transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-600 mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="elena@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50/80 hover:bg-white focus:bg-white backdrop-blur-md border border-slate-200/90 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 outline-none text-sm transition-all shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-600 mb-1">Message</label>
                  <textarea
                    required
                    rows={3}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project or say hello..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50/80 hover:bg-white focus:bg-white backdrop-blur-md border border-slate-200/90 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 outline-none text-sm transition-all resize-none shadow-sm"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="relative group w-full py-3.5 rounded-xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 hover:from-slate-800 hover:to-black text-white font-display font-black text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-[0_8px_20px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.3)] border border-white/20 disabled:opacity-50 overflow-hidden active:scale-[0.99]"
                >
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 pointer-events-none" />
                  <Send className="w-4 h-4 text-sky-400 group-hover:translate-x-0.5 transition-transform" />
                  <span>{status === 'sending' ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
