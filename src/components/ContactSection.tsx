import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SketchyCloud } from './SketchyCloud';

const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="16" fill="#25D366"/>
    <path d="M23.5 8.5A10.44 10.44 0 0 0 16 5.5C10.75 5.5 6.5 9.75 6.5 15c0 1.65.43 3.25 1.25 4.67L6.5 26.5l7-1.25A10.44 10.44 0 0 0 16 26.5c5.25 0 9.5-4.25 9.5-9.5 0-2.54-.99-4.93-2.79-6.72l.79.22zM16 24.75c-1.4 0-2.77-.38-3.96-1.09l-.28-.17-2.91.52.53-2.84-.18-.29A8.7 8.7 0 0 1 7.75 16 8.26 8.26 0 0 1 16 7.75c2.21 0 4.28.86 5.84 2.41A8.21 8.21 0 0 1 24.25 16c0 4.55-3.71 8.26-8.25 8.26zm4.53-6.19c-.25-.12-1.47-.72-1.7-.81-.23-.09-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.09-.17.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.04s.88 2.37 1 2.53c.12.17 1.73 2.64 4.19 3.7.59.25 1.04.4 1.4.51.59.18 1.12.16 1.54.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.06-.11-.22-.17-.47-.29z" fill="white"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="16" fill="#EA4335"/>
    <path d="M7 10.5v11C7 22.33 7.67 23 8.5 23h15c.83 0 1.5-.67 1.5-1.5v-11L16 17 7 10.5z" fill="white" opacity="0.9"/>
    <path d="M25 10.5L16 17 7 10.5C7 9.67 7.67 9 8.5 9h15c.83 0 1.5.67 1.5 1.5z" fill="white"/>
  </svg>
);

const DiscordIcon = () => (
  <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="16" r="16" fill="#5865F2"/>
    <path d="M21.5 11.2a13.2 13.2 0 0 0-3.3-1 .05.05 0 0 0-.05.02c-.14.25-.3.58-.4.83a12.2 12.2 0 0 0-3.6 0c-.11-.25-.28-.58-.42-.83a.05.05 0 0 0-.05-.02 13.2 13.2 0 0 0-3.3 1 .05.05 0 0 0-.02.02c-2.1 3.1-2.7 6.1-2.4 9.1a.06.06 0 0 0 .02.04 13.3 13.3 0 0 0 4 2 .05.05 0 0 0 .06-.02c.31-.42.58-.86.82-1.33a.05.05 0 0 0-.03-.07 8.7 8.7 0 0 1-1.25-.6.05.05 0 0 1 0-.08c.08-.06.17-.13.25-.2a.05.05 0 0 1 .05 0c2.6 1.2 5.5 1.2 8.1 0a.05.05 0 0 1 .05 0c.08.07.16.14.25.2a.05.05 0 0 1 0 .08 8.2 8.2 0 0 1-1.25.6.05.05 0 0 0-.03.07c.24.47.52.91.82 1.33a.05.05 0 0 0 .06.02 13.2 13.2 0 0 0 4-2 .05.05 0 0 0 .02-.04c.3-3.5-.6-6.5-2.4-9.1a.04.04 0 0 0-.02-.02zM13.3 18.6c-.8 0-1.4-.7-1.4-1.6s.6-1.6 1.4-1.6c.8 0 1.5.7 1.4 1.6 0 .9-.6 1.6-1.4 1.6zm5.4 0c-.8 0-1.4-.7-1.4-1.6s.6-1.6 1.4-1.6c.8 0 1.4.7 1.4 1.6 0 .9-.6 1.6-1.4 1.6z" fill="white"/>
  </svg>
);

export const ContactSection = React.memo(() => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // To use this, get a free Access Key from https://web3forms.com/
    const accessKey = '8107b7a3-33cd-4ef2-9028-29527c49c95b'; 

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: `New Message from ${formData.name}`
        })
      });

      const result = await response.json();
      if (result.success) {
        setStatus('sent');
      } else {
        console.error('Error:', result);
        setStatus('idle');
        alert('Something went wrong. Please try again or use the email badge above.');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('idle');
      alert('Network error. Please try again later.');
    }
  };

  return (
    <SketchyCloud>
      {/* Compact card — wider, shorter */}
      <div className="flex flex-col items-center w-full px-3 py-4" style={{ maxWidth: 560 }}>
        
        {/* Header row */}
        <h2 className="text-3xl sm:text-4xl font-display font-black text-gray-800 uppercase tracking-widest mb-1">
          CONTACT ME
        </h2>
        <p className="text-gray-400 font-hand text-lg italic mb-4">
          let's build something amazing together
        </p>

        {/* Contact badges — side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full mb-4">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText('alifop24_');
              alert('Copied Discord ID: alifop24_ to clipboard!');
            }}
            className="flex items-center gap-2 bg-[#5865F2]/10 border border-[#5865F2]/25 rounded-xl px-3 py-2.5 hover:shadow-md transition-all group text-left cursor-pointer"
            title="Click to copy Discord ID: alifop24_"
          >
            <DiscordIcon />
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-display font-bold uppercase tracking-widest text-[#5865F2]">Discord</span>
              <span className="font-hand text-sm text-gray-800 font-bold truncate">alifop24_</span>
            </div>
          </button>
          <a
            href="https://wa.me/8801919191877"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#e8fdf0] border border-[#25D366]/25 rounded-xl px-3 py-2.5 hover:shadow-md transition-all group"
          >
            <WhatsAppIcon />
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-display font-bold uppercase tracking-widest text-gray-400">WhatsApp</span>
              <span className="font-hand text-sm text-gray-700 group-hover:text-gray-900 transition-colors truncate">8801919191877</span>
            </div>
          </a>
          <a
            href="mailto:alifop2400@gmail.com"
            className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 hover:shadow-md transition-all group"
          >
            <EmailIcon />
            <div className="flex flex-col min-w-0">
              <span className="text-[9px] font-display font-bold uppercase tracking-widest text-gray-400">Email</span>
              <span className="font-hand text-xs text-gray-700 group-hover:text-gray-900 transition-colors truncate">alifop2400@...</span>
            </div>
          </a>
        </div>

        {/* Form */}
        {status === 'sent' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-3 py-6"
          >
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <p className="text-xl font-hand text-gray-600 text-center">message sent! i'll get back to you soon.</p>
            <button
              onClick={() => { setStatus('idle'); setFormData({ name: '', email: '', message: '' }); }}
              className="text-xs font-display font-bold uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
            >
              send another?
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
            {/* Name + Email side by side on larger screens */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-display font-bold uppercase tracking-widest text-gray-400">name</label>
                <input
                  required name="name" type="text" value={formData.name}
                  onChange={handleChange} placeholder="your name"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5 font-hand text-base focus:outline-none focus:border-blue-200 transition-all"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-display font-bold uppercase tracking-widest text-gray-400">email</label>
                <input
                  required name="email" type="email" value={formData.email}
                  onChange={handleChange} placeholder="hello@example.com"
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5 font-hand text-base focus:outline-none focus:border-blue-200 transition-all"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-display font-bold uppercase tracking-widest text-gray-400">message</label>
              <textarea
                required name="message" rows={3} value={formData.message}
                onChange={handleChange} placeholder="what's on your mind?"
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-xl px-4 py-2.5 font-hand text-base focus:outline-none focus:border-blue-200 transition-all resize-none"
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              disabled={status === 'sending'}
              className="bg-gray-800 text-white rounded-xl py-3.5 font-display font-black text-base uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50 sketchy-border"
            >
              {status === 'sending' ? 'opening...' : 'send message →'}
            </motion.button>
          </form>
        )}
      </div>
    </SketchyCloud>
  );
});

ContactSection.displayName = 'ContactSection';
