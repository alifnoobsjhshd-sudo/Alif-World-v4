export interface SpaceProject {
  id: number;
  sectorCode: string;
  title: string;
  subtitle: string;
  badge: string;
  category: 'Featured' | 'AI & Systems' | 'Creative 3D' | 'Full-Stack' | 'Future Dock' | 'Transmission';
  depth: number;
  status: 'Operational' | 'In Orbit' | 'Live' | 'Prototype' | 'Ready to Dock';
  description: string;
  fullOverview: string;
  technologies: string[];
  stats: { label: string; value: string }[];
  highlights: string[];
  liveUrl?: string;
  githubUrl?: string;
  isFutureDock?: boolean;
  visualTheme: {
    primaryColor: string;
    glowColor: string;
    borderColor: string;
    accentGlow: string;
    celestialEmoji: string;
    sectorType: string;
  };
}

export const SPACE_STEP = 3600;

export const SPACE_PROJECT_SECTORS: SpaceProject[] = [
  // ── SECTOR 01: THE ORBITAL NEXUS ───────────────────────────────────────────
  {
    id: 1,
    sectorCode: 'ORBIT-01',
    title: 'Cosmic Command Hub',
    subtitle: 'Alif’s Digital Horizon & Creative Mission',
    badge: 'Mission Control',
    category: 'Featured',
    depth: 0,
    status: 'Operational',
    description:
      'Welcome to deep space. An interactive cosmic voyage through crafted codebases, spatial interfaces, and creative web technologies designed for the next generation of digital experiences.',
    fullOverview:
      'The Cosmic Command Hub coordinates all orbital operations, showcasing architectural philosophies, high-performance web development patterns, and the endless pursuit of delightful user interfaces.',
    technologies: ['React 18', 'TypeScript', 'Tailwind CSS', 'Motion', 'Web Audio API'],
    stats: [
      { label: 'Orbital Speed', value: 'Mach 24.8' },
      { label: 'Telemetry', value: 'Nominal' },
      { label: 'Sectors Mapped', value: '8 Orbital Pods' },
      { label: 'Atmospheric Drag', value: '0.00 μPa' },
    ],
    highlights: [
      'Zero-rotation silky 3D depth camera tracking',
      'Continuous celestial procedural soundtrack synthesis',
      'Hardware-accelerated cosmic particles & starlight field',
      'Dynamic telemetry HUD with real-time sector radar',
    ],
    liveUrl: '#',
    githubUrl: 'https://github.com',
    visualTheme: {
      primaryColor: '#38bdf8',
      glowColor: 'rgba(56, 189, 248, 0.35)',
      borderColor: 'rgba(56, 189, 248, 0.4)',
      accentGlow: '#0284c7',
      celestialEmoji: '🛰️',
      sectorType: 'Nexus Station',
    },
  },

  // ── SECTOR 02: NOVA STUDIO AI ──────────────────────────────────────────────
  {
    id: 2,
    sectorCode: 'ORBIT-02',
    title: 'Nova Studio AI',
    subtitle: 'Autonomous Generative Design & Code Engine',
    badge: 'AI & Intelligence',
    category: 'AI & Systems',
    depth: 1 * SPACE_STEP,
    status: 'Live',
    description:
      'An intelligent design platform that turns natural language into production-ready React UI hierarchies, design tokens, and synchronized Tailwind palettes in real time.',
    fullOverview:
      'Nova Studio AI pairs multi-modal language models with AST (Abstract Syntax Tree) manipulators to generate modular, accessible, and theme-adaptive web components with live in-browser preview and instant code generation.',
    technologies: ['Gemini 2.5 Pro', 'Next.js 14', 'TypeScript', 'Tailwind CSS', 'Monaco Editor', 'Node.js'],
    stats: [
      { label: 'Token Latency', value: '< 280ms' },
      { label: 'Components Synthesized', value: '14,200+' },
      { label: 'Accuracy Score', value: '99.4%' },
      { label: 'Test Coverage', value: '96%' },
    ],
    highlights: [
      'Multi-modal prompt translation directly into typed React components',
      'Live sandbox compiler with real-time hot patching',
      'Semantic color token extraction with WCAG AAA contrast guarantees',
      'Bi-directional code sync between visual drag-and-drop and code editor',
    ],
    liveUrl: 'https://example.com/nova-studio',
    githubUrl: 'https://github.com/example/nova-studio',
    visualTheme: {
      primaryColor: '#a855f7',
      glowColor: 'rgba(168, 85, 247, 0.35)',
      borderColor: 'rgba(168, 85, 247, 0.4)',
      accentGlow: '#9333ea',
      celestialEmoji: '✨',
      sectorType: 'Neural Nebula',
    },
  },

  // ── SECTOR 03: CELESTIAL CANVAS 3D ─────────────────────────────────────────
  {
    id: 3,
    sectorCode: 'ORBIT-03',
    title: 'Celestial Canvas 3D',
    subtitle: 'WebGL Shader Experiment & Generative Particles',
    badge: 'Creative 3D',
    category: 'Creative 3D',
    depth: 2 * SPACE_STEP,
    status: 'In Orbit',
    description:
      'High-performance GPU visualizer harnessing custom GLSL shaders, procedural volumetrics, and harmonic audio reactivity for immersive spatial storytelling.',
    fullOverview:
      'An open-source graphics playground pushing the limits of in-browser 60FPS WebGL rendering. Features custom raymarched signed distance fields (SDFs), dynamic bloom post-processing, and interactive fluid simulations.',
    technologies: ['Three.js', 'GLSL Shaders', 'WebGPU', 'TypeScript', 'Canvas API', 'GLTF Pipeline'],
    stats: [
      { label: 'Particle Count', value: '250,000+' },
      { label: 'Frame Rate', value: '60 FPS Solid' },
      { label: 'GPU Draw Calls', value: '4 Batched' },
      { label: 'Memory Footprint', value: '42 MB' },
    ],
    highlights: [
      'Real-time GLSL fragment shaders calculating cosmic volumetric nebulae',
      'Hardware instancing rendering 250k dynamic particles with mouse vortex',
      'Zero external asset load: mathematical procedural texture generation',
      'Adaptive resolution scaling ensuring fluid performance on mobile devices',
    ],
    liveUrl: 'https://example.com/celestial-canvas',
    githubUrl: 'https://github.com/example/celestial-canvas',
    visualTheme: {
      primaryColor: '#06b6d4',
      glowColor: 'rgba(6, 182, 212, 0.35)',
      borderColor: 'rgba(6, 182, 212, 0.4)',
      accentGlow: '#0891b2',
      celestialEmoji: '🌌',
      sectorType: 'Shader Supernova',
    },
  },

  // ── SECTOR 04: ORBITAL OS CLOUD ────────────────────────────────────────────
  {
    id: 4,
    sectorCode: 'ORBIT-04',
    title: 'Orbital OS',
    subtitle: 'Spatial Workspace & Cloud Container Orchestration',
    badge: 'Full-Stack Architecture',
    category: 'Full-Stack',
    depth: 3 * SPACE_STEP,
    status: 'Operational',
    description:
      'A sleek browser-based desktop operating system equipped with virtual file systems, multi-window sandboxed processes, and realtime collaborative syncing.',
    fullOverview:
      'Engineered for distributed teams and developers needing instant ephemeral computing workspaces. Integrates WebContainers to boot full Node.js runtimes right inside the browser tabs with zero server provisioning.',
    technologies: ['React', 'WebContainers', 'TypeScript', 'PostgreSQL', 'Docker', 'Tailwind CSS'],
    stats: [
      { label: 'Boot Time', value: '1.2s' },
      { label: 'Container Start', value: '< 800ms' },
      { label: 'Active Instances', value: '5,800+' },
      { label: 'Uptime SLA', value: '99.98%' },
    ],
    highlights: [
      'In-browser POSIX-compliant terminal with Node.js & npm execution',
      'Custom window manager with snapping, dock minimize, and gesture controls',
      'Encrypted local SQLite storage with optional cloud backup synchronization',
      'Zero latency collaborative multiplayer cursor and code pairing engine',
    ],
    liveUrl: 'https://example.com/orbital-os',
    githubUrl: 'https://github.com/example/orbital-os',
    visualTheme: {
      primaryColor: '#10b981',
      glowColor: 'rgba(16, 185, 129, 0.35)',
      borderColor: 'rgba(16, 185, 129, 0.4)',
      accentGlow: '#059669',
      celestialEmoji: '🪐',
      sectorType: 'Planetary Array',
    },
  },

  // ── SECTOR 05: PULSAR AUDIO SYNTH ──────────────────────────────────────────
  {
    id: 5,
    sectorCode: 'ORBIT-05',
    title: 'Pulsar Audio Synth',
    subtitle: 'Procedural Web Audio Engine & Spatial Soundscapes',
    badge: 'Audio DSP',
    category: 'Creative 3D',
    depth: 4 * SPACE_STEP,
    status: 'Live',
    description:
      'An interactive algorithmic music synthesizer and spatial binaural engine that turns code variables into breathing harmonic chords and celestial frequencies.',
    fullOverview:
      'Harnesses the native Web Audio API to create warm analog-modeled oscillators, moog-style ladder lowpass filters, stereo delays, and procedural FM chimes without loading megabytes of external audio samples.',
    technologies: ['Web Audio API', 'AudioWorklet', 'TypeScript', 'Canvas Spectrogram', 'DSP Math'],
    stats: [
      { label: 'Audio Latency', value: '5.8 ms' },
      { label: 'Sample Rate', value: '48.0 kHz' },
      { label: 'Polyphony Voices', value: '32 Parallel' },
      { label: 'Asset Payload', value: '0 KB (Code DSP)' },
    ],
    highlights: [
      'Pure procedural sound generation: zero static MP3/WAV audio dependencies',
      'Realtime FFT frequency visualizer and 3D floating oscilloscope',
      'Interactive XY modulation pad with resonance and overdrive saturation',
      'Adaptive musical scale quantization ensuring every chord remains harmonic',
    ],
    liveUrl: 'https://example.com/pulsar-audio',
    githubUrl: 'https://github.com/example/pulsar-audio',
    visualTheme: {
      primaryColor: '#ec4899',
      glowColor: 'rgba(236, 72, 153, 0.35)',
      borderColor: 'rgba(236, 72, 153, 0.4)',
      accentGlow: '#db2777',
      celestialEmoji: '🎵',
      sectorType: 'Harmonic Pulsar',
    },
  },

  // ── SECTOR 06: QUANTUM STREAM ANALYTICS ────────────────────────────────────
  {
    id: 6,
    sectorCode: 'ORBIT-06',
    title: 'Quantum Stream Analytics',
    subtitle: 'High-Frequency Realtime Telemetry & Data Dashboard',
    badge: 'Enterprise Systems',
    category: 'AI & Systems',
    depth: 5 * SPACE_STEP,
    status: 'Operational',
    description:
      'High-throughput real-time telemetry visualizer rendering millions of metric events per second with WebGL canvas charting and predictive anomaly detection.',
    fullOverview:
      'Designed to ingest continuous server health events, microservice traces, and IoT sensor streams. Built with custom WebGL buffer renderers to achieve buttery smooth 60fps graphs with zero garbage collection spikes.',
    technologies: ['TypeScript', 'WebGL2', 'WebSocket', 'Tailwind CSS', 'D3 Math', 'Apache Kafka'],
    stats: [
      { label: 'Events / Sec', value: '1.4M QPS' },
      { label: 'Render Latency', value: '16.6ms' },
      { label: 'Data Compression', value: '8.4x Gzip' },
      { label: 'Alert Detection', value: '< 50ms' },
    ],
    highlights: [
      'Continuous stream buffering supporting 100,000 live data points without lag',
      'Custom shader-rendered candlestick and sparkline graph components',
      'Automated outlier detection using local statistical streaming algorithms',
      'Dark-mode optimized telemetry interface with customizable bento widgets',
    ],
    liveUrl: 'https://example.com/quantum-stream',
    githubUrl: 'https://github.com/example/quantum-stream',
    visualTheme: {
      primaryColor: '#f59e0b',
      glowColor: 'rgba(245, 158, 11, 0.35)',
      borderColor: 'rgba(245, 158, 11, 0.4)',
      accentGlow: '#d97706',
      celestialEmoji: '⚡',
      sectorType: 'Cosmic Core',
    },
  },

  // ── SECTOR 07: FUTURE PROJECT DOCK ALPHA (FOR FUTURE PROJECTS) ─────────────
  {
    id: 7,
    sectorCode: 'DOCK-01',
    title: 'Future Project Dock Alpha',
    subtitle: 'Modular Orbital Hangar — Ready for New Deployment',
    badge: 'Future Works Slot',
    category: 'Future Dock',
    depth: 6 * SPACE_STEP,
    status: 'Ready to Dock',
    isFutureDock: true,
    description:
      'Reserved orbital docking bay for Alif’s upcoming projects. Ready to integrate next-generation client apps, mobile experiments, or open-source software tools.',
    fullOverview:
      'This hangar slot is fully scaffolded and engineered for easy updates. Whenever you build a new project, this space pod is pre-configured with interactive blueprints, tech stack pills, live demo links, and GitHub repository pointers.',
    technologies: ['Your Next Stack', 'React / Vue / Svelte', 'Cloud Backend', 'AI / WebGL', 'Tailwind'],
    stats: [
      { label: 'Bay Status', value: 'Available' },
      { label: 'Dock Power', value: '100% Ready' },
      { label: 'Slot Version', value: 'v2.0 Modular' },
      { label: 'Deploy Hook', value: 'Active' },
    ],
    highlights: [
      'Modular layout ready to replace title, overview, and screenshots',
      'Supports live preview iframes and direct GitHub repository badges',
      'One-click configuration in spaceWorks.ts data file',
      'Full responsive styling matching the cosmic exploration theme',
    ],
    liveUrl: '#',
    githubUrl: '#',
    visualTheme: {
      primaryColor: '#8b5cf6',
      glowColor: 'rgba(139, 92, 246, 0.4)',
      borderColor: 'rgba(139, 92, 246, 0.45)',
      accentGlow: '#7c3aed',
      celestialEmoji: '🛸',
      sectorType: 'Orbital Hangar',
    },
  },

  // ── SECTOR 08: FUTURE PROJECT DOCK BETA (FOR FUTURE EXPERIMENTS) ───────────
  {
    id: 8,
    sectorCode: 'DOCK-02',
    title: 'Future Project Dock Beta',
    subtitle: 'Experimental Research Bay & R&D Laboratory',
    badge: 'Future Works Slot',
    category: 'Future Dock',
    depth: 7 * SPACE_STEP,
    status: 'Ready to Dock',
    isFutureDock: true,
    description:
      'Second orbital expansion slot for machine learning prototypes, spatial audio installations, or full-stack cloud applications under active development.',
    fullOverview:
      'Dedicated staging hangar reserved for upcoming experimental engineering. Easily customize the project badges, video preview embeds, and metric scorecards.',
    technologies: ['Next-Gen AI', 'Rust / WebAssembly', 'Spatial Computing', 'Interactive 3D'],
    stats: [
      { label: 'Bay Status', value: 'Standby' },
      { label: 'Telemetry', value: 'Listening' },
      { label: 'R&D Buffer', value: 'Cleared' },
      { label: 'Launch Readiness', value: 'Ready' },
    ],
    highlights: [
      'Seamless expansion: simply add more sectors as your portfolio grows',
      'Includes interactive inspection modal with deep project architecture view',
      'Pre-styled with glowing cybernetic docking rings and space telemetry',
      'Easily link your personal demo URLs or GitHub source repositories',
    ],
    liveUrl: '#',
    githubUrl: '#',
    visualTheme: {
      primaryColor: '#0ea5e9',
      glowColor: 'rgba(14, 165, 233, 0.4)',
      borderColor: 'rgba(14, 165, 233, 0.45)',
      accentGlow: '#0284c7',
      celestialEmoji: '🚀',
      sectorType: 'Staging Bay',
    },
  },

  // ── SECTOR 09: DEEP SPACE TRANSMISSION (CONTACT & LINKS) ───────────────────
  {
    id: 9,
    sectorCode: 'COMM-01',
    title: 'Cosmic Uplink Station',
    subtitle: 'Establish Contact & Collaboration Frequencies',
    badge: 'Transmission Station',
    category: 'Transmission',
    depth: 8 * SPACE_STEP,
    status: 'Operational',
    description:
      'Open frequency channel for project inquiries, freelance engineering, or full-time creative technology opportunities. Send a direct transmission to Alif.',
    fullOverview:
      'All orbital communications are encrypted and routed directly to Alif’s inbox. Whether you have an exciting startup idea, an open-source collaboration, or want to say hello from across the digital galaxy, reach out anytime.',
    technologies: ['Email Uplink', 'GitHub', 'LinkedIn', 'Twitter / X', 'Discord', 'Telegram'],
    stats: [
      { label: 'Channel Status', value: 'Open 24/7' },
      { label: 'Response Velocity', value: '< 24 Hours' },
      { label: 'Signal Strength', value: '100% Solid' },
      { label: 'Availability', value: 'Open for Projects' },
    ],
    highlights: [
      'Direct contact transmission modal with instant form validation',
      'Social frequency hubs: GitHub, LinkedIn, and email links',
      'Quick jump back to Earth Base / Landing Desk at any time',
      'Interactive cosmic controls with custom sound feedback',
    ],
    liveUrl: '#contact',
    githubUrl: 'https://github.com',
    visualTheme: {
      primaryColor: '#10b981',
      glowColor: 'rgba(16, 185, 129, 0.4)',
      borderColor: 'rgba(16, 185, 129, 0.45)',
      accentGlow: '#059669',
      celestialEmoji: '📡',
      sectorType: 'Deep Space Relay',
    },
  },
];
