import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Globe, Sparkles, Maximize2, X, ArrowUpRight } from 'lucide-react';
import { dreamAudio } from '../../utils/audio';

interface OtherProject {
  name: string;
  url: string;
  screenshot: string;
  tagline?: string;
}

const OTHER_PROJECTS: OtherProject[] = [
  {
    name: 'Nexa Mobile',
    url: 'https://nexamobile.pages.dev/',
    screenshot: 'https://api.microlink.io/?url=https%3A%2F%2Fnexamobile.pages.dev&screenshot=true&meta=false&embed=screenshot.url',
    tagline: 'Modern tech presentation for phone restoration',
  },
  {
    name: 'Verdant Earth',
    url: 'https://verdant-earth-e98.pages.dev/',
    screenshot: 'https://api.microlink.io/?url=https%3A%2F%2Fverdant-earth-e98.pages.dev&screenshot=true&meta=false&embed=screenshot.url',
    tagline: 'Immersive global reforestation landing experience',
  },
  {
    name: 'Noir Cafe',
    url: 'https://noir-cafe.pages.dev/',
    screenshot: 'https://api.microlink.io/?url=https%3A%2F%2Fnoir-cafe.pages.dev&screenshot=true&meta=false&embed=screenshot.url',
    tagline: 'Atmospheric artisan coffeehouse showcase',
  },
  {
    name: 'Adil Portfolio',
    url: 'https://adil-portfolio-bkw.pages.dev/',
    screenshot: 'https://api.microlink.io/?url=https%3A%2F%2Fadil-portfolio-bkw.pages.dev&screenshot=true&meta=false&embed=screenshot.url',
    tagline: 'Cinematic visual showcase for creative video editor',
  },
  {
    name: 'SmileCraft',
    url: 'https://dental-website-3je.pages.dev/',
    screenshot: 'https://api.microlink.io/?url=https%3A%2F%2Fdental-website-3je.pages.dev&screenshot=true&meta=false&embed=screenshot.url',
    tagline: 'Pristine modern landing page for elite dental clinic',
  },
  {
    name: 'Lumiere BookShop',
    url: 'https://p-ohskoob.pages.dev/',
    screenshot: 'https://api.microlink.io/?url=https%3A%2F%2Fp-ohskoob.pages.dev&screenshot=true&meta=false&embed=screenshot.url',
    tagline: 'Curated online bookstore layout with rich typography',
  },
  {
    name: 'Bites Restaurant',
    url: 'https://bites-restaurant.pages.dev/',
    screenshot: 'https://api.microlink.io/?url=https%3A%2F%2Fbites-restaurant.pages.dev&screenshot=true&meta=false&embed=screenshot.url',
    tagline: 'Appetizing culinary menus and restaurant booking',
  },
  {
    name: 'Sprout',
    url: 'https://plushie-site.alifop2400.workers.dev',
    screenshot: 'https://api.microlink.io/?url=https%3A%2F%2Fplushie-site.alifop2400.workers.dev&screenshot=true&meta=false&embed=screenshot.url',
    tagline: 'Delightful companion plushie brand storefront',
  },
  {
    name: 'Aether',
    url: 'https://aether-ubs.pages.dev/',
    screenshot: 'https://api.microlink.io/?url=https%3A%2F%2Faether-ubs.pages.dev%2F&screenshot=true&meta=false&embed=screenshot.url',
    tagline: 'Minimalist spatial web concept',
  },
  {
    name: 'Frooto Juice',
    url: 'https://frooto-juice.pages.dev/',
    screenshot: 'https://api.microlink.io/?url=https%3A%2F%2Ffrooto-juice.pages.dev%2F&screenshot=true&meta=false&embed=screenshot.url',
    tagline: 'Vibrant tropical mango beverage presentation',
  },
];

export const OtherWebsitesSection: React.FC = () => {
  const [selectedScreenshot, setSelectedScreenshot] = useState<OtherProject | null>(null);

  const handleOpenSite = (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dreamAudio.playHover();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleOpenPreview = (p: OtherProject) => {
    dreamAudio.playPaperPlaneFlutter();
    setSelectedScreenshot(p);
  };

  return (
    <div
      id="space-project-other-websites"
      className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col items-center justify-center pointer-events-auto select-none"
    >
      {/* ── AMBIENT GLOW ──────────────────────────────────────────────────── */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] rounded-full bg-cyan-600/10 blur-[110px]" />
        <div className="w-[450px] h-[300px] rounded-full bg-sky-500/10 blur-[90px]" />
      </div>

      {/* ── HEADER ────────────────────────────────────────────────────────── */}
      <div className="text-center max-w-xl mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-950/70 border border-sky-500/30 text-[11px] font-mono text-sky-300 tracking-wider uppercase mb-2 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
          <Globe className="w-3.5 h-3.5 text-sky-400" />
          <span>PORTFOLIO DIRECTORY ARCHIVE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-1">
          Web Creations & Landings
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-normal">
          Landing page screenshots from all web applications in Alif's creative portfolio.
        </p>
      </div>

      {/* ── SCREENSHOT GALLERY GRID ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4 w-full max-h-[55vh] overflow-y-auto pr-1 custom-scrollbar">
        {OTHER_PROJECTS.map((item) => (
          <motion.div
            key={item.name}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative rounded-xl p-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-sky-500/50 transition-all duration-200 flex flex-col shadow-lg cursor-pointer"
            onClick={() => handleOpenPreview(item)}
          >
            {/* Screenshot Frame */}
            <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden bg-slate-950">
              <img
                src={item.screenshot}
                alt={item.name}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  // If screenshot service buffers, keep card visually clean
                  const img = e.target as HTMLImageElement;
                  img.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

              {/* Inspect overlay icon */}
              <div className="absolute top-1.5 right-1.5 p-1 rounded-md bg-slate-950/80 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3 h-3 text-sky-400" />
              </div>
            </div>

            {/* Title & Direct Live Link */}
            <div className="pt-2 px-1 flex items-center justify-between gap-1">
              <h3 className="text-xs font-semibold text-white truncate group-hover:text-sky-300 transition-colors">
                {item.name}
              </h3>
              <button
                type="button"
                onClick={(e) => handleOpenSite(item.url, e)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title={`Visit ${item.name}`}
              >
                <ArrowUpRight className="w-3.5 h-3.5 text-sky-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── LIGHTBOX INSPECTOR MODAL ──────────────────────────────────────── */}
      {selectedScreenshot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md"
          onClick={() => setSelectedScreenshot(null)}
        >
          <div
            className="relative max-w-3xl w-full rounded-2xl overflow-hidden border border-sky-500/40 shadow-2xl bg-slate-900 p-3 sm:p-4 flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">{selectedScreenshot.name}</h3>
                <p className="text-xs text-slate-400">{selectedScreenshot.tagline || selectedScreenshot.url}</p>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  type="button"
                  onClick={(e) => handleOpenSite(selectedScreenshot.url, e)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-mono font-medium transition-colors cursor-pointer"
                >
                  <span>VISIT SITE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </motion.button>
                <button
                  type="button"
                  onClick={() => setSelectedScreenshot(null)}
                  className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Full Screenshot View */}
            <div className="w-full max-h-[68vh] overflow-hidden rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
              <img
                src={selectedScreenshot.screenshot}
                alt={selectedScreenshot.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain max-h-[65vh]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
