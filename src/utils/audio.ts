// Web Audio API procedural sound effects, sleeping sounds & continuous in-the-sky ambient soundtrack engine
// Continuous floating soundtrack for 16 storyline scenes evolving naturally with soft felt piano,
// ethereal cloud pads, celestial bells, warm strings, digital sky textures, storm atmosphere, and sky breeze.

export type AtmosphereType = 
  | 'day-sky'         // Scenes 01-02: Soft daytime clouds, gentle piano, calm sky breeze
  | 'cosmic-wonder'   // Scenes 03-05: Celestial starlight shimmer, mystery, wide ambient pads
  | 'digital-web'     // Scenes 06-09: Warm analog synth pads, soft glowing digital textures, creative flow
  | 'storm'           // Scene 10: Dark turbulent wind, deep sub-rumble, tense minor chords
  | 'breakthrough'    // Scene 11: Radiant sunlight, soaring choir, high strings, triumphant D-Major
  | 'sunset-flight'   // Scenes 12-14: Nostalgic twilight strings, warm sunset cello, airplane wind
  | 'peaceful-reveal';// Scenes 15-16: Intimate, ultra-soft felt piano, quiet infinite horizon

export interface SceneAtmosphere {
  name: string;
  type: AtmosphereType;
  pianoGain: number;       // Soft felt piano / acoustic presence
  pianoOctave: number;     // 0 = standard, -1 = low tense, +1 = high sparkle
  cloudPadGain: number;    // Ethereal floating cloud pad
  stringsGain: number;     // Warm cinematic strings / cello drone
  starlightGain: number;   // Celestial chime / starlight shimmer
  digitalSynthGain: number;// Warm glowing synth textures / portal particles
  stormDroneGain: number;  // Dark sub-bass rumble & storm wind
  skyBreezeGain: number;   // High altitude organic cloud wind
  choirGain: number;       // Radiant airy angelic choir
}

export const SCENE_ATMOSPHERES: SceneAtmosphere[] = [
  // Scene 01 — The Beginning: Daytime open sky, soft felt piano, gentle airy clouds
  {
    name: 'The Beginning',
    type: 'day-sky',
    pianoGain: 0.85,
    pianoOctave: 0,
    cloudPadGain: 0.70,
    stringsGain: 0.20,
    starlightGain: 0.30,
    digitalSynthGain: 0.05,
    stormDroneGain: 0.0,
    skyBreezeGain: 0.40,
    choirGain: 0.15,
  },
  // Scene 02 — The Question: Curious daydreaming, soft bells, gentle cloud pads
  {
    name: 'The Question',
    type: 'day-sky',
    pianoGain: 0.85,
    pianoOctave: 0,
    cloudPadGain: 0.70,
    stringsGain: 0.25,
    starlightGain: 0.45,
    digitalSynthGain: 0.10,
    stormDroneGain: 0.0,
    skyBreezeGain: 0.35,
    choirGain: 0.20,
  },
  // Scene 03 — Curiosity: Floating gears, electronics, cosmic wonder bells
  {
    name: 'Curiosity',
    type: 'cosmic-wonder',
    pianoGain: 0.80,
    pianoOctave: 0,
    cloudPadGain: 0.65,
    stringsGain: 0.35,
    starlightGain: 0.60,
    digitalSynthGain: 0.25,
    stormDroneGain: 0.0,
    skyBreezeGain: 0.30,
    choirGain: 0.25,
  },
  // Scene 04 — More Questions: Deep space questions, shimmering stars
  {
    name: 'More Questions',
    type: 'cosmic-wonder',
    pianoGain: 0.75,
    pianoOctave: 0,
    cloudPadGain: 0.75,
    stringsGain: 0.50,
    starlightGain: 0.75,
    digitalSynthGain: 0.30,
    stormDroneGain: 0.0,
    skyBreezeGain: 0.30,
    choirGain: 0.45,
  },
  // Scene 05 — Exploring: Looking through telescope at glowing planet
  {
    name: 'Exploring',
    type: 'cosmic-wonder',
    pianoGain: 0.80,
    pianoOctave: 0,
    cloudPadGain: 0.70,
    stringsGain: 0.55,
    starlightGain: 0.65,
    digitalSynthGain: 0.35,
    stormDroneGain: 0.0,
    skyBreezeGain: 0.35,
    choirGain: 0.40,
  },
  // Scene 06 — A New World: Glowing light portal, digital particles in the sky
  {
    name: 'A New World',
    type: 'digital-web',
    pianoGain: 0.75,
    pianoOctave: 0,
    cloudPadGain: 0.70,
    stringsGain: 0.45,
    starlightGain: 0.50,
    digitalSynthGain: 0.75,
    stormDroneGain: 0.0,
    skyBreezeGain: 0.30,
    choirGain: 0.40,
  },
  // Scene 07 — The Web: Laptop on cloud, clean warm digital horizons
  {
    name: 'The Web',
    type: 'digital-web',
    pianoGain: 0.82,
    pianoOctave: 0,
    cloudPadGain: 0.65,
    stringsGain: 0.40,
    starlightGain: 0.40,
    digitalSynthGain: 0.70,
    stormDroneGain: 0.0,
    skyBreezeGain: 0.30,
    choirGain: 0.30,
  },
  // Scene 08 — Creativity: Dynamic glowing UI, colorful digital sparks
  {
    name: 'Creativity',
    type: 'digital-web',
    pianoGain: 0.85,
    pianoOctave: 0,
    cloudPadGain: 0.65,
    stringsGain: 0.45,
    starlightGain: 0.55,
    digitalSynthGain: 0.75,
    stormDroneGain: 0.0,
    skyBreezeGain: 0.32,
    choirGain: 0.35,
  },
  // Scene 09 — Building: High flow state, digital creations floating
  {
    name: 'Building',
    type: 'digital-web',
    pianoGain: 0.85,
    pianoOctave: 0,
    cloudPadGain: 0.65,
    stringsGain: 0.50,
    starlightGain: 0.50,
    digitalSynthGain: 0.70,
    stormDroneGain: 0.0,
    skyBreezeGain: 0.35,
    choirGain: 0.35,
  },
  // Scene 10 — The Storm: Dark clouds, sideways wind, deep rumble, tense minor chords
  {
    name: 'The Storm',
    type: 'storm',
    pianoGain: 0.65,
    pianoOctave: -1, // Deeper, brooding octave
    cloudPadGain: 0.55,
    stringsGain: 0.70,
    starlightGain: 0.0,
    digitalSynthGain: 0.15,
    stormDroneGain: 0.85, // Heavy sub rumble & storm wind
    skyBreezeGain: 0.75,
    choirGain: 0.10,
  },
  // Scene 11 — Breaking Through: Rising through storm into bright gold sun
  {
    name: 'Breaking Through',
    type: 'breakthrough',
    pianoGain: 0.90,
    pianoOctave: 1, // High soaring register
    cloudPadGain: 0.85,
    stringsGain: 0.80,
    starlightGain: 0.80,
    digitalSynthGain: 0.35,
    stormDroneGain: 0.0,
    skyBreezeGain: 0.45,
    choirGain: 0.85, // Angelic triumphant choir
  },
  // Scene 12 — The Realization: Peaceful massive orange sunset horizon
  {
    name: 'The Realization',
    type: 'sunset-flight',
    pianoGain: 0.85,
    pianoOctave: 0,
    cloudPadGain: 0.75,
    stringsGain: 0.70,
    starlightGain: 0.45,
    digitalSynthGain: 0.20,
    stormDroneGain: 0.0,
    skyBreezeGain: 0.38,
    choirGain: 0.45,
  },
  // Scene 13 — Unforgettable: Majestic glowing sky, emotional memories connected
  {
    name: 'Unforgettable',
    type: 'sunset-flight',
    pianoGain: 0.88,
    pianoOctave: 0,
    cloudPadGain: 0.75,
    stringsGain: 0.75,
    starlightGain: 0.55,
    digitalSynthGain: 0.25,
    stormDroneGain: 0.0,
    skyBreezeGain: 0.40,
    choirGain: 0.50,
  },
  // Scene 14 — Still Exploring: Sitting on airplane wing, endless wind and clouds
  {
    name: 'Still Exploring',
    type: 'sunset-flight',
    pianoGain: 0.85,
    pianoOctave: 0,
    cloudPadGain: 0.75,
    stringsGain: 0.70,
    starlightGain: 0.45,
    digitalSynthGain: 0.20,
    stormDroneGain: 0.0,
    skyBreezeGain: 0.48,
    choirGain: 0.40,
  },
  // Scene 15 — The Horizon: Airplane flies into distant glowing horizon
  {
    name: 'The Horizon',
    type: 'peaceful-reveal',
    pianoGain: 0.80,
    pianoOctave: 0,
    cloudPadGain: 0.70,
    stringsGain: 0.45,
    starlightGain: 0.50,
    digitalSynthGain: 0.10,
    stormDroneGain: 0.0,
    skyBreezeGain: 0.35,
    choirGain: 0.30,
  },
  // Scene 16 — The Reveal: Intimate, quiet, peaceful hello
  {
    name: 'The Reveal',
    type: 'peaceful-reveal',
    pianoGain: 0.85,
    pianoOctave: 0,
    cloudPadGain: 0.65,
    stringsGain: 0.35,
    starlightGain: 0.40,
    digitalSynthGain: 0.05,
    stormDroneGain: 0.0,
    skyBreezeGain: 0.30,
    choirGain: 0.25,
  },
];

// Compatibility alias
export const SCENE_SOUNDSCAPES = SCENE_ATMOSPHERES;

// Note frequencies
const NOTE = {
  D1: 36.71,
  E1: 41.20,
  Fsharp1: 46.25,
  G1: 49.00,
  A1: 55.00,
  B1: 61.74,
  Csharp2: 69.30,
  D2: 73.42,
  E2: 82.41,
  Fsharp2: 92.50,
  G2: 98.00,
  A2: 110.00,
  Asharp2: 116.54,
  B2: 123.47,
  Csharp3: 138.59,
  D3: 146.83,
  E3: 164.81,
  Fsharp3: 185.00,
  G3: 196.00,
  A3: 220.00,
  B3: 246.94,
  Csharp4: 277.18,
  D4: 293.66,
  E4: 329.63,
  Fsharp4: 369.99,
  G4: 392.00,
  A4: 440.00,
  B4: 493.88,
  Csharp5: 554.37,
  D5: 587.33,
  E5: 659.25,
  Fsharp5: 739.99,
  G5: 783.99,
  A5: 880.00,
  B5: 987.77,
  Csharp6: 1108.73,
  D6: 1174.66,
};

// Lush, floating harmonic chord voicings (D Major / B Minor Sky Progression)
const SKY_CHORDS = [
  // Bar 0: Dmaj9 (Pure open sky serenity)
  [NOTE.D2, NOTE.A2, NOTE.Fsharp3, NOTE.Csharp4, NOTE.E4],
  // Bar 1: Dmaj9/F# (Gentle floating motion)
  [NOTE.Fsharp2, NOTE.D3, NOTE.A3, NOTE.E4, NOTE.Fsharp4],
  // Bar 2: Gmaj7 (Expansive, wide clouds)
  [NOTE.G2, NOTE.D3, NOTE.B3, NOTE.Fsharp4, NOTE.A4],
  // Bar 3: Gmaj7(add9) (Warm morning updraft)
  [NOTE.G2, NOTE.D3, NOTE.A3, NOTE.B3, NOTE.D4],
  // Bar 4: Bm9 (Reflective, deep sky contemplation)
  [NOTE.B1, NOTE.Fsharp2, NOTE.D3, NOTE.A3, NOTE.Csharp4],
  // Bar 5: Bm7 / F# (Drifting onward)
  [NOTE.Fsharp2, NOTE.D3, NOTE.A3, NOTE.D4],
  // Bar 6: Asus4 / A (Soaring anticipation)
  [NOTE.A2, NOTE.E3, NOTE.A3, NOTE.D4, NOTE.E4],
  // Bar 7: A add9 (Gentle unresolved suspension)
  [NOTE.A2, NOTE.E3, NOTE.B3, NOTE.Csharp4, NOTE.E4],
];

// Storm Minor Progression (Tension, turbulence, darker skies)
const STORM_CHORDS = [
  [NOTE.B1, NOTE.Fsharp2, NOTE.D3, NOTE.Fsharp3],
  [NOTE.B1, NOTE.Fsharp2, NOTE.D3, NOTE.A3],
  [NOTE.G1, NOTE.D2, NOTE.B2, NOTE.Fsharp3],
  [NOTE.G1, NOTE.D2, NOTE.Csharp3, NOTE.G3],
  [NOTE.E1, NOTE.B1, NOTE.G2, NOTE.D3],
  [NOTE.E1, NOTE.B1, NOTE.G2, NOTE.E3],
  [NOTE.Fsharp1, NOTE.Csharp2, NOTE.Asharp2, NOTE.E3],
  [NOTE.Fsharp1, NOTE.Csharp2, NOTE.Fsharp2, NOTE.D3],
];

// Breakthrough Progression (Bursting into triumphant brilliant golden light)
const BREAKTHROUGH_CHORDS = [
  [NOTE.D2, NOTE.A2, NOTE.Fsharp3, NOTE.D4, NOTE.A4],
  [NOTE.D2, NOTE.A2, NOTE.Fsharp3, NOTE.Csharp4, NOTE.Fsharp4],
  [NOTE.G2, NOTE.D3, NOTE.B3, NOTE.D4, NOTE.G4],
  [NOTE.G2, NOTE.D3, NOTE.B3, NOTE.Fsharp4, NOTE.B4],
  [NOTE.A2, NOTE.E3, NOTE.A3, NOTE.Csharp4, NOTE.E4],
  [NOTE.A2, NOTE.E3, NOTE.B3, NOTE.D4, NOTE.A4],
  [NOTE.D2, NOTE.A2, NOTE.D3, NOTE.Fsharp4, NOTE.D5],
  [NOTE.D2, NOTE.A2, NOTE.Fsharp3, NOTE.Csharp4, NOTE.E4],
];

// Core peaceful felt piano melody motif (Sparse, gentle, poignant phrases)
const SKY_MELODIES = [
  // Phrase A (Bars 0-1): Gentle question in the sky
  { bar: 0, beat: 1.5, note: NOTE.Fsharp4, duration: 2.0, vel: 0.70 },
  { bar: 0, beat: 3.5, note: NOTE.A4, duration: 1.5, vel: 0.75 },
  { bar: 1, beat: 1.0, note: NOTE.Csharp5, duration: 2.2, vel: 0.85 },
  { bar: 1, beat: 3.0, note: NOTE.B4, duration: 2.5, vel: 0.70 },

  // Phrase B (Bars 2-3): Floating across clouds
  { bar: 2, beat: 1.5, note: NOTE.D4, duration: 1.8, vel: 0.70 },
  { bar: 2, beat: 3.0, note: NOTE.Fsharp4, duration: 1.8, vel: 0.75 },
  { bar: 3, beat: 1.0, note: NOTE.A4, duration: 2.4, vel: 0.80 },
  { bar: 3, beat: 3.5, note: NOTE.Fsharp4, duration: 2.0, vel: 0.65 },

  // Phrase C (Bars 4-5): Thoughtful wonder
  { bar: 4, beat: 1.5, note: NOTE.B4, duration: 2.2, vel: 0.80 },
  { bar: 4, beat: 3.5, note: NOTE.Csharp5, duration: 1.5, vel: 0.75 },
  { bar: 5, beat: 1.0, note: NOTE.D5, duration: 2.4, vel: 0.85 },
  { bar: 5, beat: 3.0, note: NOTE.A4, duration: 2.8, vel: 0.75 },

  // Phrase D (Bars 6-7): Uplifting resolution fading into breeze
  { bar: 6, beat: 1.5, note: NOTE.E4, duration: 1.8, vel: 0.70 },
  { bar: 6, beat: 3.0, note: NOTE.Fsharp4, duration: 1.8, vel: 0.75 },
  { bar: 7, beat: 1.0, note: NOTE.E4, duration: 2.0, vel: 0.68 },
  { bar: 7, beat: 3.0, note: NOTE.D4, duration: 3.5, vel: 0.75 },
];

class SkyAudioPlayer {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private lastHoverTime: number = 0;
  private lastSceneTickTime: number = 0;
  private noiseBufferCache: AudioBuffer | null = null;

  // ── SLEEPING SOUND & NAPPING THEME ENGINE (LANDING PAGE) ─────────────────
  private isSleepingSoundRunning: boolean = false;
  private sleepingMasterGain: GainNode | null = null;
  private sleepBreathTimeout: number | null = null;
  private sleepMusicIntervalId: number | null = null;
  private sleepNodes: (AudioBufferSourceNode | OscillatorNode)[] = [];
  private sleepMusicStartTime: number = 0;
  private lastScheduledNapBeat: number = -1;

  // Dedicated nap stems
  private napStemMusic: GainNode | null = null;
  private napStemBreath: GainNode | null = null;
  private napStemClock: GainNode | null = null;
  private napStemAmbience: GainNode | null = null;

  // ── CONTINUOUS SKY BACKGROUND MUSIC ENGINE (JOURNEY PAGE) ─────────────────
  private isMusicRunning: boolean = false;
  private currentSceneIdx: number = 0;
  private targetSceneIdx: number = 0;
  private bgmMasterGain: GainNode | null = null;

  // Stem buses
  private stemPiano: GainNode | null = null;
  private stemPad: GainNode | null = null;
  private stemStrings: GainNode | null = null;
  private stemStarlight: GainNode | null = null;
  private stemDigitalSynth: GainNode | null = null;
  private stemStormDrone: GainNode | null = null;
  private stemSkyBreeze: GainNode | null = null;
  private stemChoir: GainNode | null = null;

  // Continuous drone & breeze nodes
  private skyBreezeSource: AudioBufferSourceNode | null = null;
  private skyBreezeFilter: BiquadFilterNode | null = null;
  private stormRumbleOsc: OscillatorNode | null = null;
  private choirOscs: OscillatorNode[] = [];

  // Musical loop parameters (Continuous, peaceful, non-stop ambient flow)
  private tempoBPM: number = 64; // Serene, breathing ambient tempo
  private secondsPerBeat: number = 60 / 64; // ~0.9375s
  private totalBars: number = 8;
  private beatsPerBar: number = 4;
  private barDuration: number = 4 * (60 / 64); // ~3.75s per bar
  private loopDuration: number = 8 * 4 * (60 / 64); // ~30.0s per complete cycle
  private musicStartTime: number = 0;
  private schedulerIntervalId: number | null = null;
  private lastScheduledBeat: number = -1;

  public initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Generate pink/filtered atmospheric air noise buffer for realistic wind & cloud breathing
  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBufferCache && this.noiseBufferCache.sampleRate === ctx.sampleRate) {
      return this.noiseBufferCache;
    }
    const sampleRate = ctx.sampleRate;
    const duration = 5;
    const bufferSize = sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
    const data = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.07;
      b6 = white * 0.115926;
    }

    this.noiseBufferCache = buffer;
    return buffer;
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // ── 1. NAPPING THEME & SLEEPING SOUNDS ENGINE (LANDING PAGE) ────────────────
  // ═════════════════════════════════════════════════════════════════════════════
  // A heartwarming, deeply peaceful "Napping Theme" background soundscape:
  // - Cozy Lo-Fi Felt Piano & Rhodes Sleep Lullaby (soothing, gentle chord swells)
  // - Delicate Bedside Music Box Chimes (tender lullaby sparkles in the boy's nap)
  // - Soft Muted Wooden Desk Clock (slow, reassuring "tick... tock..." of a quiet room)
  // - Natural Rhythmic Sleeping Breath (peaceful human inhale & exhale cycle)
  // - Cozy Bedroom Window Ambience (soft afternoon window breeze & warm room tone)

  public startSleepingSounds() {
    this.initContext();
    if (!this.ctx) return;

    if (this.isSleepingSoundRunning) {
      if (this.sleepingMasterGain) {
        const now = this.ctx.currentTime;
        this.sleepingMasterGain.gain.cancelScheduledValues(now);
        this.sleepingMasterGain.gain.linearRampToValueAtTime(this.isMuted ? 0.0 : 0.72, now + 1.0);
      }
      return;
    }

    this.isSleepingSoundRunning = true;
    const now = this.ctx.currentTime;
    this.sleepMusicStartTime = now;
    this.lastScheduledNapBeat = -1;

    // Master sleeping sound bus (increased volume for landing page)
    this.sleepingMasterGain = this.ctx.createGain();
    this.sleepingMasterGain.gain.setValueAtTime(0.001, now);
    const targetVolume = this.isMuted ? 0.0 : 0.72;
    this.sleepingMasterGain.gain.linearRampToValueAtTime(targetVolume, now + 2.0);
    this.sleepingMasterGain.connect(this.ctx.destination);

    // Sub-stems for careful mixing balance
    this.napStemMusic = this.ctx.createGain();
    this.napStemMusic.gain.setValueAtTime(0.75, now); // Warm, comforting lo-fi lullaby
    this.napStemMusic.connect(this.sleepingMasterGain);

    this.napStemClock = this.ctx.createGain();
    this.napStemClock.gain.setValueAtTime(0.24, now); // Gentle background clock tick
    this.napStemClock.connect(this.sleepingMasterGain);

    this.napStemBreath = this.ctx.createGain();
    this.napStemBreath.gain.setValueAtTime(0.35, now); // Quiet breathing
    this.napStemBreath.connect(this.sleepingMasterGain);

    this.napStemAmbience = this.ctx.createGain();
    this.napStemAmbience.gain.setValueAtTime(0.30, now); // Cozy room presence & breeze
    this.napStemAmbience.connect(this.sleepingMasterGain);

    // 1. Cozy Bedroom Ambience (Warm quiet room tone + soft window breeze)
    this.startNapAmbienceNodes(now);

    // 2. Start Natural Rhythmic Sleep Breathing Loop (~4.8s human cycle)
    this.triggerSleepBreathingCycle();

    // 3. Start Nap Music & Clock Scheduler (50 BPM slow, hypnotic lullaby tempo)
    this.startNapMusicScheduler();
  }

  // Cozy room acoustics: low warmth + gentle swaying afternoon breeze outside window
  private startNapAmbienceNodes(now: number) {
    if (!this.ctx || !this.napStemAmbience) return;

    try {
      // Warm low room presence (65Hz hum of a quiet house in the afternoon)
      const roomNoise = this.ctx.createBufferSource();
      roomNoise.buffer = this.getNoiseBuffer(this.ctx);
      roomNoise.loop = true;

      const roomFilter = this.ctx.createBiquadFilter();
      roomFilter.type = 'lowpass';
      roomFilter.frequency.setValueAtTime(85, now);

      const roomGain = this.ctx.createGain();
      roomGain.gain.setValueAtTime(0.08, now);

      roomNoise.connect(roomFilter);
      roomFilter.connect(roomGain);
      roomGain.connect(this.napStemAmbience);
      roomNoise.start(now);
      this.sleepNodes.push(roomNoise);

      // Soft window breeze (relaxing afternoon air through curtains)
      const breezeNoise = this.ctx.createBufferSource();
      breezeNoise.buffer = this.getNoiseBuffer(this.ctx);
      breezeNoise.loop = true;

      const breezeFilter = this.ctx.createBiquadFilter();
      breezeFilter.type = 'bandpass';
      breezeFilter.frequency.setValueAtTime(420, now);
      breezeFilter.Q.value = 1.6;

      // Slow 10-second swaying breeze LFO
      const breezeLfo = this.ctx.createOscillator();
      const breezeLfoGain = this.ctx.createGain();
      breezeLfo.frequency.value = 0.1;
      breezeLfoGain.gain.value = 140;
      breezeLfo.connect(breezeLfoGain);
      breezeLfoGain.connect(breezeFilter.frequency);

      const breezeGain = this.ctx.createGain();
      breezeGain.gain.setValueAtTime(0.045, now);

      breezeNoise.connect(breezeFilter);
      breezeFilter.connect(breezeGain);
      breezeGain.connect(this.napStemAmbience);

      breezeNoise.start(now);
      breezeLfo.start(now);
      this.sleepNodes.push(breezeNoise);
      this.sleepNodes.push(breezeLfo);
    } catch {}
  }

  // Precise lookahead scheduler for napping lullaby chords, music box, and clock tick
  private startNapMusicScheduler() {
    if (this.sleepMusicIntervalId) clearInterval(this.sleepMusicIntervalId);

    const napTempoBPM = 50; // Ultra relaxing, slow napping tempo
    const napSecondsPerBeat = 60 / napTempoBPM; // 1.20s per beat
    const beatsPerBar = 4;
    const totalBars = 8;
    const scheduleAheadTime = 0.35;
    const lookaheadMs = 50;

    // Cozy Nap Chords (warm, comforting bedroom progression in D / G / Bm)
    const NAP_CHORD_PROG = [
      [NOTE.D3, NOTE.A3, NOTE.Fsharp4, NOTE.Csharp5],   // Bar 0: Dmaj7 (peaceful home)
      [NOTE.G2, NOTE.D3, NOTE.B3, NOTE.Fsharp4],       // Bar 1: Gmaj7 (warm sunbeam)
      [NOTE.Fsharp2, NOTE.Csharp3, NOTE.A3, NOTE.E4],   // Bar 2: F#m7 (eyelids getting heavy)
      [NOTE.B2, NOTE.Fsharp3, NOTE.D4, NOTE.A4, NOTE.Csharp5], // Bar 3: Bm9 (drifting to sleep)
      [NOTE.G2, NOTE.D3, NOTE.A3, NOTE.B3, NOTE.Fsharp4], // Bar 4: Gmaj9 (deep resting sigh)
      [NOTE.E2, NOTE.B2, NOTE.G3, NOTE.D4, NOTE.Fsharp4], // Bar 5: Em9 (warm cozy blanket)
      [NOTE.A2, NOTE.E3, NOTE.A3, NOTE.D4, NOTE.E4],   // Bar 6: Asus4 (soft suspension)
      [NOTE.D3, NOTE.A3, NOTE.E4, NOTE.Fsharp4],       // Bar 7: Dadd9 (content resolution)
    ];

    // Delicate Music Box Sparkles (sweet dream lullaby melodies)
    const NAP_BELLS = [
      { bar: 0, beat: 2.5, note: NOTE.A5 },
      { bar: 0, beat: 4.0, note: NOTE.Fsharp5 },
      { bar: 1, beat: 2.5, note: NOTE.D5 },
      { bar: 1, beat: 3.5, note: NOTE.E5 },
      { bar: 2, beat: 2.5, note: NOTE.Csharp5 },
      { bar: 2, beat: 4.0, note: NOTE.A4 },
      { bar: 3, beat: 2.0, note: NOTE.Fsharp5 },
      { bar: 3, beat: 3.5, note: NOTE.D5 },
      { bar: 4, beat: 2.5, note: NOTE.B4 },
      { bar: 4, beat: 4.0, note: NOTE.D5 },
      { bar: 5, beat: 2.0, note: NOTE.G5 },
      { bar: 5, beat: 3.5, note: NOTE.Fsharp5 },
      { bar: 6, beat: 2.5, note: NOTE.E5 },
      { bar: 6, beat: 4.0, note: NOTE.A4 },
      { bar: 7, beat: 2.0, note: NOTE.Fsharp5 },
      { bar: 7, beat: 3.5, note: NOTE.D5 },
    ];

    this.sleepMusicIntervalId = window.setInterval(() => {
      if (!this.ctx || !this.isSleepingSoundRunning) return;
      const currentTime = this.ctx.currentTime;
      const elapsedTime = currentTime - this.sleepMusicStartTime;
      const totalBeatsElapsed = Math.floor(elapsedTime / napSecondsPerBeat);

      for (let b = this.lastScheduledNapBeat + 1; b <= totalBeatsElapsed + 2; b++) {
        const beatTime = this.sleepMusicStartTime + b * napSecondsPerBeat;
        if (beatTime >= currentTime && beatTime < currentTime + scheduleAheadTime) {
          const beatInCycle = b % (totalBars * beatsPerBar);
          const currentBar = Math.floor(beatInCycle / beatsPerBar);
          const beatInBar = (beatInCycle % beatsPerBar) + 1;

          // 1. Soft Warm Lullaby Chord Swell on Downbeat of each bar
          if (beatInBar === 1) {
            const chord = NAP_CHORD_PROG[currentBar];
            this.playSoftNapChord(chord, beatTime, napSecondsPerBeat * 4);
          }

          // 2. Soft Wooden Desk Clock Tick ("tick" on 1 & 3, "tock" on 2 & 4)
          const isTick = beatInBar % 2 === 1;
          this.playNapClockTick(isTick, beatTime);

          // 3. Delicate Bedside Music Box Notes
          const bellMatches = NAP_BELLS.filter(
            (item) => item.bar === currentBar && Math.abs(item.beat - beatInBar) < 0.15
          );
          bellMatches.forEach((m) => {
            this.playNapMusicBoxBell(m.note, beatTime);
          });

          this.lastScheduledNapBeat = b;
        }
      }
    }, lookaheadMs);
  }

  // Soft Lo-Fi Warm Felt & Rhodes Chord Swell
  private playSoftNapChord(notes: number[], time: number, duration: number) {
    if (!this.ctx || !this.napStemMusic) return;

    notes.forEach((freq, idx) => {
      try {
        const osc = this.ctx!.createOscillator();
        const osc2 = this.ctx!.createOscillator();
        osc.type = 'triangle';
        osc2.type = 'sine';

        // Very slight analog chorus detune
        osc.frequency.setValueAtTime(freq, time);
        osc2.frequency.setValueAtTime(freq * (idx % 2 === 0 ? 1.0008 : 0.9992), time);

        // Warm muffled lowpass filter for dreamy bedside warmth
        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(550, time);
        filter.frequency.linearRampToValueAtTime(750, time + duration * 0.4);
        filter.frequency.linearRampToValueAtTime(450, time + duration);

        const gain = this.ctx!.createGain();
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.048, time + 1.2); // Smooth slow 1.2s swell
        gain.gain.setValueAtTime(0.048, time + duration - 0.9);
        gain.gain.linearRampToValueAtTime(0.0001, time + duration + 0.8);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.napStemMusic!);

        osc.start(time);
        osc2.start(time);
        osc.stop(time + duration + 0.9);
        osc2.stop(time + duration + 0.9);
      } catch {}
    });
  }

  // Delicate Bedside Music Box / Celesta Chime
  private playNapMusicBoxBell(freq: number, time: number) {
    if (!this.ctx || !this.napStemMusic) return;

    try {
      const osc = this.ctx.createOscillator();
      const overtone = this.ctx.createOscillator();
      osc.type = 'sine';
      overtone.type = 'sine';

      osc.frequency.setValueAtTime(freq, time);
      overtone.frequency.setValueAtTime(freq * 2.003, time); // Subtle bell shimmer

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, time);
      filter.frequency.exponentialRampToValueAtTime(800, time + 1.2);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.038, time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.2);

      osc.connect(filter);
      overtone.connect(filter);
      filter.connect(gain);
      gain.connect(this.napStemMusic);

      osc.start(time);
      overtone.start(time);
      osc.stop(time + 2.3);
      overtone.stop(time + 2.3);
    } catch {}
  }

  // Soft Muted Wooden Desk Clock ("tick... tock...")
  private playNapClockTick(isTick: boolean, time: number) {
    if (!this.ctx || !this.napStemClock) return;

    try {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      const centerFreq = isTick ? 1400 : 920; // Tick is slightly higher than tock
      osc.frequency.setValueAtTime(centerFreq, time);
      osc.frequency.exponentialRampToValueAtTime(centerFreq * 0.6, time + 0.035);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(centerFreq, time);
      filter.Q.value = 4.5; // Resonant wooden click

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.024, time + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.napStemClock);

      osc.start(time);
      osc.stop(time + 0.04);
    } catch {}
  }

  // Natural Rhythmic Sleeping Breath (Peaceful human breathing loop)
  private triggerSleepBreathingCycle() {
    if (!this.ctx || !this.isSleepingSoundRunning || !this.napStemBreath) return;

    const now = this.ctx.currentTime;
    const cycleDuration = 4.8; // 2.2s gentle inhale, 0.4s pause, 2.2s relaxing exhale

    try {
      // ── INHALE (Soft airy chest breath: rises smoothly) ──
      const inhaleSource = this.ctx.createBufferSource();
      inhaleSource.buffer = this.getNoiseBuffer(this.ctx);

      const inhaleFilter = this.ctx.createBiquadFilter();
      inhaleFilter.type = 'bandpass';
      inhaleFilter.frequency.setValueAtTime(220, now);
      inhaleFilter.frequency.exponentialRampToValueAtTime(450, now + 1.9);
      inhaleFilter.Q.value = 2.4;

      const breathResonance = this.ctx.createOscillator();
      breathResonance.type = 'sine';
      breathResonance.frequency.setValueAtTime(145, now);
      breathResonance.frequency.linearRampToValueAtTime(158, now + 1.9);

      const breathResonanceGain = this.ctx.createGain();
      breathResonanceGain.gain.setValueAtTime(0.001, now);
      breathResonanceGain.gain.linearRampToValueAtTime(0.014, now + 1.2);
      breathResonanceGain.gain.linearRampToValueAtTime(0.0001, now + 2.1);

      breathResonance.connect(breathResonanceGain);
      breathResonanceGain.connect(this.napStemBreath);

      const inhaleGain = this.ctx.createGain();
      inhaleGain.gain.setValueAtTime(0.001, now);
      inhaleGain.gain.linearRampToValueAtTime(0.065, now + 1.4);
      inhaleGain.gain.linearRampToValueAtTime(0.001, now + 2.15);

      inhaleSource.connect(inhaleFilter);
      inhaleFilter.connect(inhaleGain);
      inhaleGain.connect(this.napStemBreath);

      inhaleSource.start(now);
      breathResonance.start(now);
      inhaleSource.stop(now + 2.2);
      breathResonance.stop(now + 2.2);

      // ── EXHALE (Gentle relaxing breath release) ──
      const exhaleTime = now + 2.4;
      const exhaleSource = this.ctx.createBufferSource();
      exhaleSource.buffer = this.getNoiseBuffer(this.ctx);

      const exhaleFilter = this.ctx.createBiquadFilter();
      exhaleFilter.type = 'bandpass';
      exhaleFilter.frequency.setValueAtTime(400, exhaleTime);
      exhaleFilter.frequency.exponentialRampToValueAtTime(185, exhaleTime + 2.0);
      exhaleFilter.Q.value = 2.0;

      const exhaleGain = this.ctx.createGain();
      exhaleGain.gain.setValueAtTime(0.001, exhaleTime);
      exhaleGain.gain.linearRampToValueAtTime(0.058, exhaleTime + 0.5);
      exhaleGain.gain.linearRampToValueAtTime(0.0001, exhaleTime + 2.1);

      exhaleSource.connect(exhaleFilter);
      exhaleFilter.connect(exhaleGain);
      exhaleGain.connect(this.napStemBreath);

      exhaleSource.start(exhaleTime);
      exhaleSource.stop(exhaleTime + 2.2);
    } catch {}

    // Schedule next breath
    this.sleepBreathTimeout = window.setTimeout(() => {
      if (this.isSleepingSoundRunning) {
        this.triggerSleepBreathingCycle();
      }
    }, cycleDuration * 1000);
  }

  public stopSleepingSounds(fadeDuration: number = 1.0) {
    if (!this.isSleepingSoundRunning) return;
    this.isSleepingSoundRunning = false;

    if (this.sleepBreathTimeout) {
      clearTimeout(this.sleepBreathTimeout);
      this.sleepBreathTimeout = null;
    }

    if (this.sleepMusicIntervalId) {
      clearInterval(this.sleepMusicIntervalId);
      this.sleepMusicIntervalId = null;
    }

    if (this.sleepingMasterGain && this.ctx) {
      const now = this.ctx.currentTime;
      try {
        this.sleepingMasterGain.gain.cancelScheduledValues(now);
        this.sleepingMasterGain.gain.setValueAtTime(this.sleepingMasterGain.gain.value, now);
        this.sleepingMasterGain.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);
      } catch {}
    }

    setTimeout(() => {
      this.sleepNodes.forEach((n) => {
        try { n.stop(); } catch {}
      });
      this.sleepNodes = [];
    }, fadeDuration * 1000 + 50);
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // ── 2. CONTINUOUS IN-THE-SKY BACKGROUND MUSIC (JOURNEY PAGE) ────────────────
  // ═════════════════════════════════════════════════════════════════════════════
  // Soft, floating, ethereal sky theme music that plays continuously non-stop.
  // Adapts smoothly to atmospheric / environmental changes over scenes 01 to 16.

  public startJourneyMusic() {
    this.initContext();
    if (!this.ctx) return;

    if (this.isMusicRunning) {
      if (this.bgmMasterGain && !this.isMuted) {
        const now = this.ctx.currentTime;
        this.bgmMasterGain.gain.cancelScheduledValues(now);
        this.bgmMasterGain.gain.linearRampToValueAtTime(0.40, now + 1.5);
      }
      return;
    }

    this.isMusicRunning = true;
    const now = this.ctx.currentTime;
    this.musicStartTime = now;
    this.lastScheduledBeat = -1;

    // 1. Create BGM Master Bus
    this.bgmMasterGain = this.ctx.createGain();
    this.bgmMasterGain.gain.setValueAtTime(0.001, now);
    const targetVolume = this.isMuted ? 0.0 : 0.40;
    this.bgmMasterGain.gain.linearRampToValueAtTime(targetVolume, now + 2.5);
    this.bgmMasterGain.connect(this.ctx.destination);

    // 2. Setup Individual Stem Buses with initial Scene 01 values
    const initScene = SCENE_ATMOSPHERES[0];
    this.stemPiano = this.createStemGain(initScene.pianoGain);
    this.stemPad = this.createStemGain(initScene.cloudPadGain);
    this.stemStrings = this.createStemGain(initScene.stringsGain);
    this.stemStarlight = this.createStemGain(initScene.starlightGain);
    this.stemDigitalSynth = this.createStemGain(initScene.digitalSynthGain);
    this.stemStormDrone = this.createStemGain(initScene.stormDroneGain);
    this.stemSkyBreeze = this.createStemGain(initScene.skyBreezeGain);
    this.stemChoir = this.createStemGain(initScene.choirGain);

    // 3. Start Continuous Ambient Sky Wind & Resonances
    this.startContinuousSkyAtmospheres();

    // 4. Start Lookahead Sequencer for continuous, soft sky music
    this.startLookaheadSequencer();
  }

  private createStemGain(initialGain: number): GainNode {
    const gainNode = this.ctx!.createGain();
    gainNode.gain.setValueAtTime(initialGain, this.ctx!.currentTime);
    gainNode.connect(this.bgmMasterGain!);
    return gainNode;
  }

  // ── SEAMLESS ENVIRONMENTAL ADAPTATION (SCENES 01 TO 16) ───────────────────
  // Gently morphs the musical stems and environmental filters over 2.5s
  public setStoryScene(sceneIndex: number) {
    const idx = Math.min(Math.max(sceneIndex, 0), SCENE_ATMOSPHERES.length - 1);
    this.targetSceneIdx = idx;
    this.currentSceneIdx = idx;

    if (!this.ctx || !this.isMusicRunning) return;
    const now = this.ctx.currentTime;
    const atmo = SCENE_ATMOSPHERES[idx];
    const rampTime = 2.5; // Smooth, peaceful cross-fade ramp

    // Ramp all instrument & atmospheric channels smoothly
    this.rampStem(this.stemPiano, atmo.pianoGain, now, rampTime);
    this.rampStem(this.stemPad, atmo.cloudPadGain, now, rampTime);
    this.rampStem(this.stemStrings, atmo.stringsGain, now, rampTime);
    this.rampStem(this.stemStarlight, atmo.starlightGain, now, rampTime);
    this.rampStem(this.stemDigitalSynth, atmo.digitalSynthGain, now, rampTime);
    this.rampStem(this.stemStormDrone, atmo.stormDroneGain, now, rampTime);
    this.rampStem(this.stemSkyBreeze, atmo.skyBreezeGain, now, rampTime);
    this.rampStem(this.stemChoir, atmo.choirGain, now, rampTime);

    // Dynamically adjust sky breeze filter frequency to match environment
    if (this.skyBreezeFilter) {
      const targetBreezeFreq = atmo.type === 'storm' ? 1800 : (atmo.type === 'breakthrough' ? 1200 : 700);
      try {
        this.skyBreezeFilter.frequency.cancelScheduledValues(now);
        this.skyBreezeFilter.frequency.linearRampToValueAtTime(targetBreezeFreq, now + rampTime);
      } catch {}
    }
  }

  private rampStem(stem: GainNode | null, targetValue: number, now: number, duration: number) {
    if (!stem) return;
    try {
      stem.gain.cancelScheduledValues(now);
      stem.gain.setValueAtTime(stem.gain.value, now);
      stem.gain.linearRampToValueAtTime(targetValue, now + duration);
    } catch {}
  }

  public stopJourneyMusic(fadeDuration: number = 2.5) {
    if (!this.ctx || !this.bgmMasterGain || !this.isMusicRunning) return;
    const now = this.ctx.currentTime;

    try {
      this.bgmMasterGain.gain.cancelScheduledValues(now);
      this.bgmMasterGain.gain.setValueAtTime(this.bgmMasterGain.gain.value, now);
      this.bgmMasterGain.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);
    } catch {}

    setTimeout(() => {
      this.cleanupJourneyMusic();
    }, fadeDuration * 1000 + 100);
  }

  private cleanupJourneyMusic() {
    if (this.schedulerIntervalId) {
      clearInterval(this.schedulerIntervalId);
      this.schedulerIntervalId = null;
    }
    if (this.skyBreezeSource) {
      try { this.skyBreezeSource.stop(); } catch {}
      this.skyBreezeSource = null;
    }
    if (this.stormRumbleOsc) {
      try { this.stormRumbleOsc.stop(); } catch {}
      this.stormRumbleOsc = null;
    }
    this.choirOscs.forEach((osc) => {
      try { osc.stop(); } catch {}
    });
    this.choirOscs = [];
    this.isMusicRunning = false;
  }

  // ── CONTINUOUS SKY AMBIENCE (ORGANIC BREEZE & SUB-RESONANCE) ───────────────
  private startContinuousSkyAtmospheres() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Continuous High-Altitude Cloud Breeze (Warm organic wind)
    try {
      const breezeBuffer = this.getNoiseBuffer(this.ctx);
      const breezeSource = this.ctx.createBufferSource();
      breezeSource.buffer = breezeBuffer;
      breezeSource.loop = true;

      const breezeFilter = this.ctx.createBiquadFilter();
      breezeFilter.type = 'bandpass';
      breezeFilter.frequency.setValueAtTime(750, now);
      breezeFilter.Q.value = 1.8;
      this.skyBreezeFilter = breezeFilter;

      // Slow organic breathing LFO (0.08Hz ~ 12 second breathing cycle)
      const breezeLfo = this.ctx.createOscillator();
      const breezeLfoGain = this.ctx.createGain();
      breezeLfo.frequency.value = 0.08;
      breezeLfoGain.gain.value = 220;
      breezeLfo.connect(breezeLfoGain);
      breezeLfoGain.connect(breezeFilter.frequency);

      breezeSource.connect(breezeFilter);
      breezeFilter.connect(this.stemSkyBreeze!);
      breezeSource.start(now);
      breezeLfo.start(now);
      this.skyBreezeSource = breezeSource;
    } catch {}

    // 2. Storm Sub-Bass Rumble (Activated seamlessly during Scene 10)
    try {
      const rumbleOsc = this.ctx.createOscillator();
      rumbleOsc.type = 'triangle';
      rumbleOsc.frequency.setValueAtTime(46.25, now); // Low F#1 / D1 rumble

      const rumbleFilter = this.ctx.createBiquadFilter();
      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.setValueAtTime(80, now);

      rumbleOsc.connect(rumbleFilter);
      rumbleFilter.connect(this.stemStormDrone!);
      rumbleOsc.start(now);
      this.stormRumbleOsc = rumbleOsc;
    } catch {}

    // 3. Ethereal Radiant Sky Choir (Active during Breakthrough & Horizons)
    try {
      [NOTE.A4, NOTE.D5, NOTE.Fsharp5].forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const choirFilter = this.ctx.createBiquadFilter();
        choirFilter.type = 'bandpass';
        choirFilter.frequency.setValueAtTime(freq * 1.4, now);
        choirFilter.Q.value = 3.2;

        const choirVoiceGain = this.ctx.createGain();
        choirVoiceGain.gain.setValueAtTime(0.045, now);

        osc.connect(choirFilter);
        choirFilter.connect(choirVoiceGain);
        choirVoiceGain.connect(this.stemChoir!);
        osc.start(now);
        this.choirOscs.push(osc);
      });
    } catch {}
  }

  // ── PRECISE LOOKAHEAD SEQUENCER (CONTINUOUS AMBIENT FLOW) ─────────────────
  // Runs continuously in the background on the journey page, regardless of scrolling
  private startLookaheadSequencer() {
    if (this.schedulerIntervalId) clearInterval(this.schedulerIntervalId);

    const lookaheadMs = 50;
    const scheduleAheadTime = 0.35; // 350ms lookahead

    this.schedulerIntervalId = window.setInterval(() => {
      if (!this.ctx || !this.isMusicRunning) return;
      const currentTime = this.ctx.currentTime;
      const elapsedTime = currentTime - this.musicStartTime;
      const totalBeatsElapsed = Math.floor(elapsedTime / this.secondsPerBeat);

      for (let b = this.lastScheduledBeat + 1; b <= totalBeatsElapsed + 2; b++) {
        const beatTime = this.musicStartTime + b * this.secondsPerBeat;
        if (beatTime >= currentTime && beatTime < currentTime + scheduleAheadTime) {
          this.scheduleAmbientBeat(b, beatTime);
          this.lastScheduledBeat = b;
        }
      }
    }, lookaheadMs);
  }

  private scheduleAmbientBeat(globalBeat: number, time: number) {
    if (!this.ctx) return;
    const beatInCycle = globalBeat % (this.totalBars * this.beatsPerBar); // 0 to 31
    const currentBar = Math.floor(beatInCycle / this.beatsPerBar);         // 0 to 7
    const beatInBar = (beatInCycle % this.beatsPerBar) + 1;                // 1 to 4
    const atmo = SCENE_ATMOSPHERES[this.currentSceneIdx];

    // 1. Ethereal Floating Cloud Pad (Triggered on Bar Downbeat, breathing continuously)
    if (beatInBar === 1) {
      let chordNotes = SKY_CHORDS[currentBar];
      if (atmo.type === 'storm') {
        chordNotes = STORM_CHORDS[currentBar];
      } else if (atmo.type === 'breakthrough') {
        chordNotes = BREAKTHROUGH_CHORDS[currentBar];
      }

      // Play continuous, slow-blooming cloud pad (3.8s duration with 1.8s release)
      this.playSoftCloudPad(chordNotes, time, this.barDuration);

      // Warm Cinematic Strings (Swells gently in deep scenes)
      if (atmo.stringsGain > 0.1) {
        this.playWarmStrings(chordNotes, time, this.barDuration);
      }
    }

    // 2. Soft Felt Piano / Rhodes Melodic Phrases (Poignant, sparse, thoughtful)
    const matchingMelodies = SKY_MELODIES.filter(
      (m) => m.bar === currentBar && Math.abs(m.beat - beatInBar) < 0.15
    );

    matchingMelodies.forEach((m) => {
      let freq = m.note;
      if (atmo.pianoOctave === -1) {
        freq = freq * 0.5; // Deeper octave in storm
      } else if (atmo.pianoOctave === 1) {
        freq = freq * 2.0; // Radiant higher octave in breakthrough
      }

      const noteDuration = m.duration * this.secondsPerBeat;
      const velocity = m.vel * (atmo.type === 'peaceful-reveal' ? 0.75 : 1.0);
      this.playSoftFeltPianoNote(freq, time, noteDuration, velocity);
    });

    // 3. Starlight Celestial Chimes (Active in Cosmic, Day-Sky, and Breakthrough scenes)
    if (atmo.starlightGain > 0.15 && (beatInBar === 2 || beatInBar === 4)) {
      const bellFreqs = [NOTE.A5, NOTE.D6, NOTE.Fsharp5, NOTE.Csharp6, NOTE.E5];
      const bellNote = bellFreqs[(currentBar * 2 + beatInBar) % bellFreqs.length];
      this.playStarlightChime(bellNote, time + 0.18);
    }

    // 4. Digital Sky Portal Pulses (Warm analog synth sparkles in Web & Creative scenes)
    if (atmo.digitalSynthGain > 0.25) {
      if (beatInBar === 2 || beatInBar === 3 || beatInBar === 4) {
        const synthNotes = [NOTE.D4, NOTE.Fsharp4, NOTE.A4, NOTE.Csharp5, NOTE.D5];
        const synthNote = synthNotes[(currentBar + beatInBar) % synthNotes.length];
        this.playWarmDigitalSynthPluck(synthNote, time + 0.12);
      }
    }
  }

  // ── INSTRUMENT VOICING SYNTHESIS (SOFT, AIRY, ORGANIC) ─────────────────────

  // A. Soft Felt Piano (Warm rounded acoustic hammer, gentle dampening filter)
  private playSoftFeltPianoNote(frequency: number, time: number, duration: number, velocity: number) {
    if (!this.ctx || !this.stemPiano) return;

    try {
      // Dual oscillators (Triangle body + soft Sine fundamental)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(frequency, time);
      osc2.frequency.setValueAtTime(frequency * 0.9995, time); // Subtle organic acoustic detune

      // Warm acoustic felt damping filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      const initialCutoff = Math.min(frequency * 3.2, 2200);
      filter.frequency.setValueAtTime(initialCutoff, time);
      filter.frequency.exponentialRampToValueAtTime(Math.max(frequency * 1.1, 280), time + duration);

      const gain = this.ctx.createGain();
      const peakGain = 0.20 * velocity;
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(peakGain, time + 0.015); // Soft felt hammer touch
      gain.gain.exponentialRampToValueAtTime(peakGain * 0.4, time + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.stemPiano);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + duration);
      osc2.stop(time + duration);
    } catch {}
  }

  // B. Ethereal Floating Cloud Pad (Slow-blooming, seamless harmonic chords)
  private playSoftCloudPad(notes: number[], time: number, duration: number) {
    if (!this.ctx || !this.stemPad) return;

    notes.forEach((freq) => {
      try {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(650, time);
        filter.frequency.linearRampToValueAtTime(950, time + duration * 0.5);
        filter.frequency.linearRampToValueAtTime(650, time + duration);

        const gain = this.ctx!.createGain();
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.042, time + 1.2); // 1.2s slow cloud swell
        gain.gain.setValueAtTime(0.042, time + duration - 0.8);
        gain.gain.linearRampToValueAtTime(0.0001, time + duration + 0.8); // Gentle tail overlap

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.stemPad!);

        osc.start(time);
        osc.stop(time + duration + 0.9);
      } catch {}
    });
  }

  // C. Warm Cinematic Strings (Lush, emotional, wide cello/violin harmony)
  private playWarmStrings(notes: number[], time: number, duration: number) {
    if (!this.ctx || !this.stemStrings) return;

    notes.forEach((freq, idx) => {
      try {
        const osc = this.ctx!.createOscillator();
        osc.type = 'sawtooth';
        osc.detune.setValueAtTime(idx % 2 === 0 ? 6 : -6, time);
        osc.frequency.setValueAtTime(freq, time);

        const filter = this.ctx!.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(700, time);
        filter.Q.value = 1.2;

        const gain = this.ctx!.createGain();
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.025, time + 1.0);
        gain.gain.setValueAtTime(0.025, time + duration - 0.6);
        gain.gain.linearRampToValueAtTime(0.0001, time + duration + 0.5);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.stemStrings!);

        osc.start(time);
        osc.stop(time + duration + 0.6);
      } catch {}
    });
  }

  // D. Celestial Starlight Chime
  private playStarlightChime(frequency: number, time: number) {
    if (!this.ctx || !this.stemStarlight) return;

    try {
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.038, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 2.2);

      osc.connect(gain);
      gain.connect(this.stemStarlight);

      osc.start(time);
      osc.stop(time + 2.3);
    } catch {}
  }

  // E. Warm Digital Synth Pluck (Glowing portal particles)
  private playWarmDigitalSynthPluck(frequency: number, time: number) {
    if (!this.ctx || !this.stemDigitalSynth) return;

    try {
      const osc = this.ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(frequency, time);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, time);
      filter.frequency.exponentialRampToValueAtTime(500, time + 0.35);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.028, time + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.stemDigitalSynth);

      osc.start(time);
      osc.stop(time + 0.42);
    } catch {}
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // ── SOUND EFFECTS (UI, SWING WHOOSH, FLUTTER, GUST) ─────────────────────────
  // ═════════════════════════════════════════════════════════════════════════════

  // ── 1. SOFT AIRY HOVER BREEZE ("wshhh") ───────────────────────────────────
  playHover() {
    if (this.isMuted) return;
    const nowMs = Date.now();
    if (nowMs - this.lastHoverTime < 70) return;
    this.lastHoverTime = nowMs;

    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(this.ctx);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(1900, now + 0.06);
      filter.frequency.exponentialRampToValueAtTime(1100, now + 0.14);
      filter.Q.value = 2.2;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.035, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.15);
    } catch {}
  }

  // ── 2. CLOUD PUFF / AIR TAP ("wisshh-puff") ──────────────────────────────
  playPop() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const noise = this.ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(this.ctx);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);
      filter.frequency.exponentialRampToValueAtTime(140, now + 0.16);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(210, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.14);

      oscGain.gain.setValueAtTime(0.04, now);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.17);
      osc.start(now);
      osc.stop(now + 0.15);
    } catch {}
  }

  // ── 3. EPIC SKY & CLOUD WISSHH SWING (ONLY in Going to Dream Animation) ────
  playDreamZoom() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const duration = 4.0;

      // Layer 1: Deep rushing atmospheric air stream
      const lowNoise = this.ctx.createBufferSource();
      lowNoise.buffer = this.getNoiseBuffer(this.ctx);
      const lowFilter = this.ctx.createBiquadFilter();
      lowFilter.type = 'bandpass';
      lowFilter.frequency.setValueAtTime(180, now);
      lowFilter.frequency.exponentialRampToValueAtTime(550, now + 2.4);
      lowFilter.frequency.exponentialRampToValueAtTime(280, now + duration);
      lowFilter.Q.value = 1.8;

      const lowGain = this.ctx.createGain();
      lowGain.gain.setValueAtTime(0.001, now);
      lowGain.gain.linearRampToValueAtTime(0.12, now + 1.8);
      lowGain.gain.linearRampToValueAtTime(0.08, now + 3.2);
      lowGain.gain.linearRampToValueAtTime(0.001, now + duration);

      lowNoise.connect(lowFilter);
      lowFilter.connect(lowGain);
      lowGain.connect(this.ctx.destination);

      // Layer 2: Mid-range soaring cloud whoosh
      const midNoise = this.ctx.createBufferSource();
      midNoise.buffer = this.getNoiseBuffer(this.ctx);
      const midFilter = this.ctx.createBiquadFilter();
      midFilter.type = 'bandpass';
      midFilter.frequency.setValueAtTime(320, now);
      midFilter.frequency.exponentialRampToValueAtTime(1450, now + 2.8);
      midFilter.frequency.exponentialRampToValueAtTime(420, now + duration);
      midFilter.Q.value = 2.8;

      const midGain = this.ctx.createGain();
      midGain.gain.setValueAtTime(0.001, now);
      midGain.gain.linearRampToValueAtTime(0.14, now + 2.4);
      midGain.gain.linearRampToValueAtTime(0.001, now + duration);

      midNoise.connect(midFilter);
      midFilter.connect(midGain);
      midGain.connect(this.ctx.destination);

      // Layer 3: High altitude wind whistle / sky rush
      const highNoise = this.ctx.createBufferSource();
      highNoise.buffer = this.getNoiseBuffer(this.ctx);
      const highFilter = this.ctx.createBiquadFilter();
      highFilter.type = 'bandpass';
      highFilter.frequency.setValueAtTime(900, now + 0.8);
      highFilter.frequency.exponentialRampToValueAtTime(2400, now + 2.9);
      highFilter.frequency.exponentialRampToValueAtTime(800, now + duration);
      highFilter.Q.value = 3.5;

      const highGain = this.ctx.createGain();
      highGain.gain.setValueAtTime(0.001, now);
      highGain.gain.setValueAtTime(0.001, now + 0.8);
      highGain.gain.linearRampToValueAtTime(0.09, now + 2.6);
      highGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      highNoise.connect(highFilter);
      highFilter.connect(highGain);
      highGain.connect(this.ctx.destination);

      lowNoise.start(now);
      midNoise.start(now);
      highNoise.start(now + 0.8);

      lowNoise.stop(now + duration);
      midNoise.stop(now + duration);
      highNoise.stop(now + duration);
    } catch {}
  }

  // ── 4. PAPER AIRPLANE GLIDE & FLUTTER ("fwwiiissshhhh") ───────────────────
  playPaperPlaneFlutter() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const noise = this.ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(this.ctx);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(1550, now + 0.12);
      filter.frequency.exponentialRampToValueAtTime(450, now + 0.38);
      filter.Q.value = 3.2;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.42);
    } catch {}
  }

  // ── 5. SCENE GUST / PASSING CLOUD MILESTONE ("shhh-oo") ────────────────────
  playSceneTick() {
    if (this.isMuted) return;
    const nowMs = Date.now();
    if (nowMs - this.lastSceneTickTime < 380) return;
    this.lastSceneTickTime = nowMs;

    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const noise = this.ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(this.ctx);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(500, now);
      filter.frequency.exponentialRampToValueAtTime(950, now + 0.08);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.22);
      filter.Q.value = 2.4;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.25);
    } catch {}
  }

  // ── 6. OPEN SKY HARMONIC BREEZE ("wisshh-chime") ─────────────────────────
  playChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const noise = this.ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(this.ctx);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(700, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 0.2);
      filter.frequency.exponentialRampToValueAtTime(500, now + 0.7);
      filter.Q.value = 2.2;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.06, now + 0.12);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      [587.33, 880.00].forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        oscGain.gain.setValueAtTime(0.001, now + idx * 0.08);
        oscGain.gain.linearRampToValueAtTime(0.035, now + idx * 0.08 + 0.04);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.7);

        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.75);
      });

      noise.start(now);
      noise.stop(now + 0.75);
    } catch {}
  }

  // ── 7. AIRY CLOUD PARTING WHOOSH ──────────────────────────────────────────
  public playCloudWhoosh(): void {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      const noise = this.ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(this.ctx);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.frequency.linearRampToValueAtTime(880, now + 0.6);
      filter.frequency.exponentialRampToValueAtTime(220, now + 1.8);
      filter.Q.value = 1.6;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 2.1);
    } catch {}
  }

  // ── SPACE & ROCKET AMBIENCE SYSTEM (EXPLORE WORKS) ───────────────────────
  private spaceMasterGain: GainNode | null = null;
  private isSpaceMusicRunning: boolean = false;
  private spaceDroneOscs: OscillatorNode[] = [];
  private spaceIntervalId: number | null = null;
  private spacePadIntervalId: number | null = null;
  private spaceWindSource: AudioBufferSourceNode | null = null;
  private lastFireblastTime: number = 0;

  // ── SUSTAINED ROCKET SPEED THRUSTER ENGINE (PLAYS FOR HOW LONG USER SCROLLS/HOLDS) ──
  private isRocketSpeedSoundRunning: boolean = false;
  private rocketMasterGain: GainNode | null = null;
  private rocketNoiseSource: AudioBufferSourceNode | null = null;
  private rocketNoiseFilter: BiquadFilterNode | null = null;
  private rocketOsc1: OscillatorNode | null = null;
  private rocketOsc2: OscillatorNode | null = null;
  private rocketSubOsc: OscillatorNode | null = null;

  // Toggle Mute
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.ctx) {
      const now = this.ctx.currentTime;
      if (this.bgmMasterGain) {
        this.bgmMasterGain.gain.cancelScheduledValues(now);
        this.bgmMasterGain.gain.setValueAtTime(this.bgmMasterGain.gain.value, now);
        this.bgmMasterGain.gain.linearRampToValueAtTime(this.isMuted ? 0.0 : 0.40, now + 0.3);
      }
      if (this.sleepingMasterGain) {
        this.sleepingMasterGain.gain.cancelScheduledValues(now);
        this.sleepingMasterGain.gain.setValueAtTime(this.sleepingMasterGain.gain.value, now);
        this.sleepingMasterGain.gain.linearRampToValueAtTime(this.isMuted ? 0.0 : 0.72, now + 0.3);
      }
      if (this.spaceMasterGain) {
        this.spaceMasterGain.gain.cancelScheduledValues(now);
        this.spaceMasterGain.gain.setValueAtTime(this.spaceMasterGain.gain.value, now);
        this.spaceMasterGain.gain.linearRampToValueAtTime(this.isMuted ? 0.0 : 0.55, now + 0.3);
      }
      if (this.isMuted && this.isRocketSpeedSoundRunning) {
        this.stopRocketSpeedSound();
      }
    }
    return this.isMuted;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ── ROCKET LAUNCH & WARP AUDIO ENGINE ───────────────────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  public playRocketLaunch(): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Sub-Bass Rumble & Ignition
      const rumbleOsc = this.ctx.createOscillator();
      const rumbleGain = this.ctx.createGain();
      rumbleOsc.type = 'sawtooth';
      rumbleOsc.frequency.setValueAtTime(32, now);
      rumbleOsc.frequency.exponentialRampToValueAtTime(95, now + 2.5);
      rumbleOsc.frequency.exponentialRampToValueAtTime(350, now + 4.0);

      const rumbleFilter = this.ctx.createBiquadFilter();
      rumbleFilter.type = 'lowpass';
      rumbleFilter.frequency.setValueAtTime(80, now);
      rumbleFilter.frequency.linearRampToValueAtTime(450, now + 2.8);

      rumbleGain.gain.setValueAtTime(0.001, now);
      rumbleGain.gain.linearRampToValueAtTime(0.35, now + 0.8);
      rumbleGain.gain.linearRampToValueAtTime(0.40, now + 2.8);
      rumbleGain.gain.exponentialRampToValueAtTime(0.001, now + 4.5);

      rumbleOsc.connect(rumbleFilter);
      rumbleFilter.connect(rumbleGain);
      rumbleGain.connect(this.ctx.destination);
      rumbleOsc.start(now);
      rumbleOsc.stop(now + 4.6);

      // 2. Heavy Plasma Rocket Roar (filtered noise)
      const noiseBuffer = this.getNoiseBuffer(this.ctx);
      const roarSource = this.ctx.createBufferSource();
      roarSource.buffer = noiseBuffer;
      roarSource.loop = true;

      const roarFilter = this.ctx.createBiquadFilter();
      roarFilter.type = 'bandpass';
      roarFilter.frequency.setValueAtTime(140, now);
      roarFilter.frequency.exponentialRampToValueAtTime(900, now + 3.2);
      roarFilter.Q.setValueAtTime(2.2, now);

      const roarGain = this.ctx.createGain();
      roarGain.gain.setValueAtTime(0.001, now);
      roarGain.gain.linearRampToValueAtTime(0.42, now + 1.2);
      roarGain.gain.exponentialRampToValueAtTime(0.001, now + 4.8);

      roarSource.connect(roarFilter);
      roarFilter.connect(roarGain);
      roarGain.connect(this.ctx.destination);
      roarSource.start(now);
      roarSource.stop(now + 4.8);

      // 3. Supersonic Boom & Cosmic Warp Chime at Mach Break (at 2.8s)
      const boomTime = now + 2.6;
      const boomOsc = this.ctx.createOscillator();
      const boomGain = this.ctx.createGain();
      boomOsc.type = 'sine';
      boomOsc.frequency.setValueAtTime(120, boomTime);
      boomOsc.frequency.exponentialRampToValueAtTime(30, boomTime + 0.6);

      boomGain.gain.setValueAtTime(0.45, boomTime);
      boomGain.gain.exponentialRampToValueAtTime(0.001, boomTime + 1.2);

      boomOsc.connect(boomGain);
      boomGain.connect(this.ctx.destination);
      boomOsc.start(boomTime);
      boomOsc.stop(boomTime + 1.3);

      // 4. Starlight Warp Harmonic Ascent
      const chord = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      chord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const warpOsc = this.ctx.createOscillator();
        const warpGain = this.ctx.createGain();
        warpOsc.type = 'triangle';
        warpOsc.frequency.setValueAtTime(freq * 0.7, now + 2.2 + idx * 0.08);
        warpOsc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 3.8);

        warpGain.gain.setValueAtTime(0.001, now + 2.2 + idx * 0.08);
        warpGain.gain.linearRampToValueAtTime(0.05, now + 2.6 + idx * 0.08);
        warpGain.gain.exponentialRampToValueAtTime(0.001, now + 4.5);

        warpOsc.connect(warpGain);
        warpGain.connect(this.ctx.destination);
        warpOsc.start(now + 2.2 + idx * 0.08);
        warpOsc.stop(now + 4.6);
      });
    } catch {}
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ── ROCKET TAIL FIREBLAST EFFECT (DURING SCROLL) ───────────────────────────
  // ═══════════════════════════════════════════════════════════════════════════
  public playRocketFireblast(intensity: number = 1.0): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    // Throttle to avoid audio glitching on high-frequency scroll ticks
    if (now - this.lastFireblastTime < 0.12) return;
    this.lastFireblastTime = now;

    try {
      const clampedIntensity = Math.min(Math.max(intensity, 0.4), 2.2);

      // Low rumble burst
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(45 * (1 + Math.random() * 0.2), now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.28);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220 * clampedIntensity, now);

      oscGain.gain.setValueAtTime(0.08 * clampedIntensity, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);

      // Plasma hiss burst
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(this.ctx);
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(480 + Math.random() * 200, now);
      noiseFilter.Q.setValueAtTime(1.5, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.06 * clampedIntensity, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.28);
    } catch {}
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ── SPACE AMBIENT MUSIC ENGINE (CONTINUOUS COSMIC SOUNDSCAPE) ─────────────
  // ═══════════════════════════════════════════════════════════════════════════
  public startSpaceAmbientMusic(): void {
    this.initContext();
    if (!this.ctx) return;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (this.isSpaceMusicRunning) {
      if (this.spaceMasterGain) {
        const now = this.ctx.currentTime;
        this.spaceMasterGain.gain.cancelScheduledValues(now);
        this.spaceMasterGain.gain.linearRampToValueAtTime(this.isMuted ? 0.0 : 0.55, now + 1.0);
      }
      return;
    }
    this.isSpaceMusicRunning = true;

    try {
      const now = this.ctx.currentTime;
      this.spaceMasterGain = this.ctx.createGain();
      this.spaceMasterGain.gain.setValueAtTime(0.001, now);
      this.spaceMasterGain.gain.linearRampToValueAtTime(this.isMuted ? 0.0 : 0.55, now + 2.0);
      this.spaceMasterGain.connect(this.ctx.destination);

      // 1. Deep Cosmic Drone (D Minor / Void Resonance: 55Hz, 73.4Hz, 110Hz, 146.8Hz, 220Hz)
      const droneFrequencies = [55.0, 73.42, 110.0, 146.83, 220.0];
      droneFrequencies.forEach((freq, idx) => {
        if (!this.ctx || !this.spaceMasterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.detune.setValueAtTime((idx - 2) * 5, now);

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(280, now);

        gain.gain.setValueAtTime(0.045 / (idx + 1), now);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.spaceMasterGain);
        osc.start(now);
        this.spaceDroneOscs.push(osc);
      });

      // 2. Solar Wind / Cosmic Ether Ambience (gentle filtered atmospheric pink noise)
      try {
        const windNoise = this.ctx.createBufferSource();
        windNoise.buffer = this.getNoiseBuffer(this.ctx);
        windNoise.loop = true;

        const windFilter = this.ctx.createBiquadFilter();
        windFilter.type = 'bandpass';
        windFilter.frequency.setValueAtTime(320, now);
        windFilter.Q.value = 2.2;

        const windLfo = this.ctx.createOscillator();
        const windLfoGain = this.ctx.createGain();
        windLfo.frequency.value = 0.12;
        windLfoGain.gain.value = 160;
        windLfo.connect(windLfoGain);
        windLfoGain.connect(windFilter.frequency);

        const windGain = this.ctx.createGain();
        windGain.gain.setValueAtTime(0.038, now);

        windNoise.connect(windFilter);
        windFilter.connect(windGain);
        windGain.connect(this.spaceMasterGain);

        windNoise.start(now);
        windLfo.start(now);
        this.spaceWindSource = windNoise;
      } catch {}

      // 3. Ethereal Interstellar Polyphonic Pads (Atmospheric rotating chords)
      const cosmicChords = [
        [146.83, 220.0, 261.63, 329.63, 392.0], // Dm9
        [116.54, 174.61, 220.0, 293.66, 349.23], // Bbmaj9
        [87.31, 130.81, 174.61, 220.0, 261.63, 329.63], // Fmaj7
        [110.0, 164.81, 196.0, 261.63, 329.63], // Am7
      ];
      let chordIndex = 0;
      const playNextPadChord = () => {
        if (!this.ctx || !this.spaceMasterGain || this.isMuted) return;
        const chord = cosmicChords[chordIndex % cosmicChords.length];
        chordIndex++;
        const chordTime = this.ctx.currentTime;
        const chordDuration = 6.2;

        chord.forEach((freq, idx) => {
          if (!this.ctx || !this.spaceMasterGain) return;
          try {
            const padOsc = this.ctx.createOscillator();
            const padFilter = this.ctx.createBiquadFilter();
            const padGain = this.ctx.createGain();

            padOsc.type = 'triangle';
            padOsc.frequency.setValueAtTime(freq, chordTime);
            padOsc.detune.setValueAtTime((idx % 2 === 0 ? 1 : -1) * 4, chordTime);

            padFilter.type = 'lowpass';
            padFilter.frequency.setValueAtTime(450, chordTime);
            padFilter.frequency.linearRampToValueAtTime(750, chordTime + 2.5);
            padFilter.frequency.exponentialRampToValueAtTime(350, chordTime + chordDuration);

            padGain.gain.setValueAtTime(0.001, chordTime);
            padGain.gain.linearRampToValueAtTime(0.024, chordTime + 1.8);
            padGain.gain.setValueAtTime(0.024, chordTime + chordDuration - 1.5);
            padGain.gain.exponentialRampToValueAtTime(0.0001, chordTime + chordDuration);

            padOsc.connect(padFilter);
            padFilter.connect(padGain);
            padGain.connect(this.spaceMasterGain);

            padOsc.start(chordTime);
            padOsc.stop(chordTime + chordDuration + 0.1);
          } catch {}
        });
      };

      playNextPadChord();
      this.spacePadIntervalId = window.setInterval(playNextPadChord, 5800);

      // 4. Shimmering Cosmic Starlight Pulses (generative celestial star chimes)
      const starScale = [440, 523.25, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51];
      this.spaceIntervalId = window.setInterval(() => {
        if (!this.ctx || !this.spaceMasterGain || this.isMuted) return;
        const chimeFreq = starScale[Math.floor(Math.random() * starScale.length)];
        const chimeNow = this.ctx.currentTime;

        const chimeOsc = this.ctx.createOscillator();
        const chimeGain = this.ctx.createGain();
        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(chimeFreq, chimeNow);

        chimeGain.gain.setValueAtTime(0.001, chimeNow);
        chimeGain.gain.linearRampToValueAtTime(0.035, chimeNow + 0.06);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, chimeNow + 2.0);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(this.spaceMasterGain);
        chimeOsc.start(chimeNow);
        chimeOsc.stop(chimeNow + 2.1);
      }, 1400);
    } catch {}
  }

  public stopSpaceAmbientMusic(fadeDuration: number = 1.5): void {
    if (!this.isSpaceMusicRunning) return;
    this.isSpaceMusicRunning = false;

    if (this.spaceIntervalId) {
      clearInterval(this.spaceIntervalId);
      this.spaceIntervalId = null;
    }
    if (this.spacePadIntervalId) {
      clearInterval(this.spacePadIntervalId);
      this.spacePadIntervalId = null;
    }

    if (this.spaceWindSource) {
      try {
        this.spaceWindSource.stop();
        this.spaceWindSource.disconnect();
      } catch {}
      this.spaceWindSource = null;
    }

    if (this.ctx && this.spaceMasterGain) {
      const now = this.ctx.currentTime;
      this.spaceMasterGain.gain.cancelScheduledValues(now);
      this.spaceMasterGain.gain.setValueAtTime(this.spaceMasterGain.gain.value, now);
      this.spaceMasterGain.gain.linearRampToValueAtTime(0.001, now + fadeDuration);

      setTimeout(() => {
        this.spaceDroneOscs.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
        this.spaceDroneOscs = [];
        if (this.spaceMasterGain) {
          try {
            this.spaceMasterGain.disconnect();
          } catch {}
          this.spaceMasterGain = null;
        }
      }, fadeDuration * 1000 + 100);
    }
  }

  // ── SPACE SOUND EFFECTS ───────────────────────────────────────────────────

  // Navigational Holographic Sector Ping (Arrival at Sector Waypoint)
  public playSpaceSectorPing(): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // High glass chime harmonic
      const freqs = [1046.5, 1567.98, 2093.0];
      freqs.forEach((f, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.05);

        gain.gain.setValueAtTime(0.001, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.045 / (idx + 1), now + idx * 0.05 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + 1.3);
      });
    } catch {}
  }

  // Aerospace UI Tactile Beep (Clicking buttons, interactive links in Space)
  public playCosmicBeep(): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1480, now);
      osc.frequency.exponentialRampToValueAtTime(1860, now + 0.06);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch {}
  }

  // Deep Space Gravitational Wave Pulse Sound (Interactive tap on space canvas)
  public playGravitationalPulse(): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.42);

      gain.gain.setValueAtTime(0.055, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.65);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.68);
    } catch {}
  }

  // Hyperdrive Warp Jump Sound (Accelerating through light barrier)
  public playWarpJumpSound(): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.65);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.35);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.0);
    } catch {}
  }

  // ── SUSTAINED ROCKET SPEED THRUSTER AUDIO (CONTINUOUS ENGINE SOUND WHILE SCROLLING/HOLDING) ──
  public startRocketSpeedSound(): void {
    if (this.isMuted) return;
    if (this.isRocketSpeedSoundRunning) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      this.isRocketSpeedSoundRunning = true;
      const now = this.ctx.currentTime;

      // Master Rocket Thruster Gain with smooth fast ramp-in
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(0.42, now + 0.12);
      masterGain.connect(this.ctx.destination);
      this.rocketMasterGain = masterGain;

      // 1. Continuous Roaring Rocket Combustion Noise (Looped Buffer + Swept Lowpass)
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(this.ctx);
      noise.loop = true;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(420, now);
      noiseFilter.frequency.linearRampToValueAtTime(1400, now + 0.35);
      noiseFilter.Q.value = 2.2;
      this.rocketNoiseFilter = noiseFilter;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.value = 0.55;

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noise.start(now);
      this.rocketNoiseSource = noise;

      // 2. Continuous Jet Turbine & Ion Propulsion Core (Dual Detuned Sawtooth/Triangle)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(118, now);
      osc2.frequency.setValueAtTime(122.5, now);

      const synthFilter = this.ctx.createBiquadFilter();
      synthFilter.type = 'lowpass';
      synthFilter.frequency.setValueAtTime(850, now);

      const synthGain = this.ctx.createGain();
      synthGain.gain.value = 0.35;

      osc1.connect(synthFilter);
      osc2.connect(synthFilter);
      synthFilter.connect(synthGain);
      synthGain.connect(masterGain);
      osc1.start(now);
      osc2.start(now);
      this.rocketOsc1 = osc1;
      this.rocketOsc2 = osc2;

      // 3. Deep Sub-Bass Vibration (Heavy physical rumble)
      const sub = this.ctx.createOscillator();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(56, now);

      const subGain = this.ctx.createGain();
      subGain.gain.value = 0.45;

      sub.connect(subGain);
      subGain.connect(masterGain);
      sub.start(now);
      this.rocketSubOsc = sub;
    } catch {}
  }

  public stopRocketSpeedSound(): void {
    if (!this.isRocketSpeedSoundRunning) return;
    this.isRocketSpeedSoundRunning = false;
    if (!this.ctx || !this.rocketMasterGain) return;
    try {
      const now = this.ctx.currentTime;
      this.rocketMasterGain.gain.cancelScheduledValues(now);
      this.rocketMasterGain.gain.setValueAtTime(this.rocketMasterGain.gain.value, now);
      this.rocketMasterGain.gain.linearRampToValueAtTime(0.0001, now + 0.22);

      const noise = this.rocketNoiseSource;
      const osc1 = this.rocketOsc1;
      const osc2 = this.rocketOsc2;
      const sub = this.rocketSubOsc;
      const master = this.rocketMasterGain;

      setTimeout(() => {
        try {
          noise?.stop();
          noise?.disconnect();
          osc1?.stop();
          osc1?.disconnect();
          osc2?.stop();
          osc2?.disconnect();
          sub?.stop();
          sub?.disconnect();
          master?.disconnect();
        } catch {}
      }, 250);

      this.rocketNoiseSource = null;
      this.rocketNoiseFilter = null;
      this.rocketOsc1 = null;
      this.rocketOsc2 = null;
      this.rocketSubOsc = null;
      this.rocketMasterGain = null;
    } catch {}
  }

  // Cosmic Forward Speed Effect / Warp Boost Sound (Significant, powerful & easily heard)
  public playSpeedBoostSound(): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      const now = this.ctx.currentTime;

      // 1. Powerful Jet Thruster / Warp Combustion Whoosh (White Noise + Swept Bandpass)
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(this.ctx);
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(320, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(2600, now + 0.32);
      noiseFilter.frequency.exponentialRampToValueAtTime(700, now + 0.85);
      noiseFilter.Q.value = 1.8;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, now);
      noiseGain.gain.linearRampToValueAtTime(0.35, now + 0.15);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.95);

      // 2. Rising Hypersonic Warp Riser (Dual Detuned Oscillators)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const synthGain = this.ctx.createGain();
      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.42);
      osc2.frequency.setValueAtTime(144, now);
      osc2.frequency.exponentialRampToValueAtTime(895, now + 0.42);

      const synthFilter = this.ctx.createBiquadFilter();
      synthFilter.type = 'lowpass';
      synthFilter.frequency.setValueAtTime(650, now);
      synthFilter.frequency.exponentialRampToValueAtTime(3200, now + 0.38);

      synthGain.gain.setValueAtTime(0.02, now);
      synthGain.gain.linearRampToValueAtTime(0.32, now + 0.16);
      synthGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      osc1.connect(synthFilter);
      osc2.connect(synthFilter);
      synthFilter.connect(synthGain);
      synthGain.connect(this.ctx.destination);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.85);
      osc2.stop(now + 0.85);

      // 3. Deep Sub-Bass Sonic Boom Pulse (Physical low punch)
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(125, now);
      sub.frequency.exponentialRampToValueAtTime(42, now + 0.45);
      subGain.gain.setValueAtTime(0.02, now);
      subGain.gain.linearRampToValueAtTime(0.38, now + 0.08);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.75);

      // 4. Ionization Laser Sparkle Sweep
      const zap = this.ctx.createOscillator();
      const zapGain = this.ctx.createGain();
      zap.type = 'sine';
      zap.frequency.setValueAtTime(950, now);
      zap.frequency.exponentialRampToValueAtTime(2400, now + 0.28);
      zapGain.gain.setValueAtTime(0.01, now);
      zapGain.gain.linearRampToValueAtTime(0.18, now + 0.12);
      zapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      zap.connect(zapGain);
      zapGain.connect(this.ctx.destination);
      zap.start(now);
      zap.stop(now + 0.55);
    } catch {}
  }

  // ── LANDING PAGE DREAM TOUCH / CLICK RIPPLE SOUND ─────────────────────────
  public playDreamRipple(): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      const now = this.ctx.currentTime;

      // 1. Soft melodic droplet / dream bell chime (Dual harmonic: D5 + A5)
      const pitches = [587.33, 880.0];
      pitches.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine';
        // Subtle downward pitch swoop for gentle water/dream drop feel
        osc.frequency.setValueAtTime(freq * 1.12, now + idx * 0.025);
        osc.frequency.exponentialRampToValueAtTime(freq, now + idx * 0.025 + 0.08);

        oscGain.gain.setValueAtTime(0.001, now + idx * 0.025);
        oscGain.gain.linearRampToValueAtTime(0.055 / (idx + 1), now + idx * 0.025 + 0.02);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.025 + 0.45);

        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);
        osc.start(now + idx * 0.025);
        osc.stop(now + idx * 0.025 + 0.48);
      });

      // 2. Gentle tactile puff (cloud/paper whisper underneath)
      const noise = this.ctx.createBufferSource();
      noise.buffer = this.getNoiseBuffer(this.ctx);
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, now);
      filter.Q.value = 2.4;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.035, now + 0.015);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.18);

      // 3. Subtle high sparkle bell overtone (D6 crystal shimmer)
      const shimmer = this.ctx.createOscillator();
      const shimmerGain = this.ctx.createGain();
      shimmer.type = 'sine';
      shimmer.frequency.setValueAtTime(1174.66, now + 0.02);

      shimmerGain.gain.setValueAtTime(0.001, now + 0.02);
      shimmerGain.gain.linearRampToValueAtTime(0.025, now + 0.04);
      shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      shimmer.connect(shimmerGain);
      shimmerGain.connect(this.ctx.destination);
      shimmer.start(now + 0.02);
      shimmer.stop(now + 0.38);
    } catch {}
  }

  // ── UNDERWATER MARINE AMBIENT SOUNDTRACK & SYNTHESIS ───────────────────────
  private underwaterOsc: OscillatorNode | null = null;
  private underwaterGain: GainNode | null = null;
  private underwaterFilter: BiquadFilterNode | null = null;
  private underwaterLfo: OscillatorNode | null = null;
  private underwaterPadGain: GainNode | null = null;
  private underwaterPadOscs: OscillatorNode[] = [];
  private underwaterMelodyTimer: ReturnType<typeof setInterval> | null = null;

  public startUnderwaterMusic(): void {
    this.startUnderwaterAmbience();
  }

  public stopUnderwaterMusic(fadeDuration: number = 1.0): void {
    this.stopUnderwaterAmbience(fadeDuration);
  }

  public startUnderwaterAmbience(): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      if (this.underwaterGain) return; // already active

      const now = this.ctx.currentTime;
      this.underwaterGain = this.ctx.createGain();
      this.underwaterGain.gain.setValueAtTime(0.001, now);
      this.underwaterGain.gain.linearRampToValueAtTime(0.09, now + 1.8);

      // 1. Low aquatic rumble drone (A1 = 55Hz)
      this.underwaterOsc = this.ctx.createOscillator();
      this.underwaterOsc.type = 'sine';
      this.underwaterOsc.frequency.setValueAtTime(55, now);

      // Aquatic lowpass filter with slow wave modulation
      this.underwaterFilter = this.ctx.createBiquadFilter();
      this.underwaterFilter.type = 'lowpass';
      this.underwaterFilter.frequency.setValueAtTime(260, now);
      this.underwaterFilter.Q.setValueAtTime(2.2, now);

      this.underwaterLfo = this.ctx.createOscillator();
      this.underwaterLfo.type = 'sine';
      this.underwaterLfo.frequency.setValueAtTime(0.16, now); // ~6.2s wave cycle

      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(110, now);
      this.underwaterLfo.connect(lfoGain);
      lfoGain.connect(this.underwaterFilter.frequency);

      this.underwaterOsc.connect(this.underwaterFilter);
      this.underwaterFilter.connect(this.underwaterGain);

      // 2. Ethereal Sub-aquatic Coral Pad (Lush Dm9 / Fmaj7 chord: D3, F3, A3, C4, E4)
      this.underwaterPadGain = this.ctx.createGain();
      this.underwaterPadGain.gain.setValueAtTime(0.001, now);
      this.underwaterPadGain.gain.linearRampToValueAtTime(0.055, now + 2.5);

      const padFilter = this.ctx.createBiquadFilter();
      padFilter.type = 'lowpass';
      padFilter.frequency.setValueAtTime(420, now);
      padFilter.Q.setValueAtTime(1.5, now);

      const chordFreqs = [146.83, 174.61, 220.00, 261.63, 329.63]; // D3, F3, A3, C4, E4
      this.underwaterPadOscs = chordFreqs.map((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 0.8, now); // subtle detune
        osc.connect(padFilter);
        osc.start(now);
        return osc;
      });

      padFilter.connect(this.underwaterPadGain);
      this.underwaterPadGain.connect(this.underwaterGain);
      this.underwaterGain.connect(this.ctx.destination);

      this.underwaterOsc.start(now);
      this.underwaterLfo.start(now);

      // 3. Gentle Underwater Kalimba / Coral Droplet Arpeggio Lullaby
      const dropletNotes = [349.23, 392.00, 440.00, 523.25, 587.33, 659.25]; // F4, G4, A4, C5, D5, E5
      if (this.underwaterMelodyTimer) clearInterval(this.underwaterMelodyTimer);
      this.underwaterMelodyTimer = setInterval(() => {
        if (!this.underwaterGain || !this.ctx || this.isMuted) return;
        try {
          const t = this.ctx.currentTime;
          const noteOsc = this.ctx.createOscillator();
          const noteGain = this.ctx.createGain();
          const noteFilter = this.ctx.createBiquadFilter();

          const f = dropletNotes[Math.floor(Math.random() * dropletNotes.length)];
          noteOsc.type = 'sine';
          noteOsc.frequency.setValueAtTime(f, t);

          noteFilter.type = 'lowpass';
          noteFilter.frequency.setValueAtTime(800, t);
          noteFilter.frequency.exponentialRampToValueAtTime(300, t + 0.9);

          noteGain.gain.setValueAtTime(0.001, t);
          noteGain.gain.linearRampToValueAtTime(0.032, t + 0.04);
          noteGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

          noteOsc.connect(noteFilter);
          noteFilter.connect(noteGain);
          noteGain.connect(this.underwaterGain);

          noteOsc.start(t);
          noteOsc.stop(t + 1.25);
        } catch {}
      }, 1600);
    } catch {}
  }

  public stopUnderwaterAmbience(fadeDuration: number = 1.0): void {
    if (this.underwaterMelodyTimer) {
      clearInterval(this.underwaterMelodyTimer);
      this.underwaterMelodyTimer = null;
    }
    if (!this.underwaterGain || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      this.underwaterGain.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);
      setTimeout(() => {
        try {
          this.underwaterOsc?.stop();
          this.underwaterLfo?.stop();
          this.underwaterOsc?.disconnect();
          this.underwaterLfo?.disconnect();
          this.underwaterPadOscs.forEach(o => {
            try { o.stop(); o.disconnect(); } catch {}
          });
          this.underwaterPadOscs = [];
          this.underwaterPadGain?.disconnect();
          this.underwaterGain?.disconnect();
          this.underwaterFilter?.disconnect();
        } catch {}
        this.underwaterOsc = null;
        this.underwaterLfo = null;
        this.underwaterGain = null;
        this.underwaterFilter = null;
        this.underwaterPadGain = null;
      }, fadeDuration * 1000 + 50);
    } catch {}
  }

  // ── CELESTIAL WORLD SKY REALM BACKGROUND SOUNDTRACK ─────────────────────────
  private worldSkyGain: GainNode | null = null;
  private worldSkyWind: AudioBufferSourceNode | null = null;
  private worldSkyPadOscs: OscillatorNode[] = [];
  private worldSkyChimeTimer: ReturnType<typeof setInterval> | null = null;

  public startWorldSkyMusic(): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      if (this.worldSkyGain) return; // already active

      const now = this.ctx.currentTime;
      this.worldSkyGain = this.ctx.createGain();
      this.worldSkyGain.gain.setValueAtTime(0.001, now);
      this.worldSkyGain.gain.linearRampToValueAtTime(0.08, now + 1.8);

      // 1. High Altitude Organic Sky Wind Stream
      const bufferSize = this.ctx.sampleRate * 4;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }

      this.worldSkyWind = this.ctx.createBufferSource();
      this.worldSkyWind.buffer = noiseBuffer;
      this.worldSkyWind.loop = true;

      const windFilter = this.ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(450, now);
      windFilter.Q.setValueAtTime(1.8, now);

      // Wind breathing LFO
      const windLfo = this.ctx.createOscillator();
      windLfo.type = 'sine';
      windLfo.frequency.setValueAtTime(0.22, now); // ~4.5s breathe cycle
      const windLfoGain = this.ctx.createGain();
      windLfoGain.gain.setValueAtTime(180, now);
      windLfo.connect(windLfoGain);
      windLfoGain.connect(windFilter.frequency);

      const windVol = this.ctx.createGain();
      windVol.gain.setValueAtTime(0.42, now);
      this.worldSkyWind.connect(windFilter);
      windFilter.connect(windVol);
      windVol.connect(this.worldSkyGain);

      this.worldSkyWind.start(now);
      windLfo.start(now);

      // 2. Ethereal Celestial Sky Pad (Open 5ths in D: D3, A3, D4, F#4, A4)
      const skyPadFilter = this.ctx.createBiquadFilter();
      skyPadFilter.type = 'lowpass';
      skyPadFilter.frequency.setValueAtTime(620, now);
      skyPadFilter.Q.setValueAtTime(1.2, now);

      const skyChord = [146.83, 220.00, 293.66, 369.99, 440.00];
      this.worldSkyPadOscs = skyChord.map((freq, i) => {
        const osc = this.ctx!.createOscillator();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 0.6, now);
        const oscGain = this.ctx!.createGain();
        oscGain.gain.setValueAtTime(0.18, now);
        osc.connect(oscGain);
        oscGain.connect(skyPadFilter);
        osc.start(now);
        return osc;
      });

      skyPadFilter.connect(this.worldSkyGain);
      this.worldSkyGain.connect(this.ctx.destination);

      // 3. Gentle Celestial Cloud Bell Chimes
      const skyChimes = [587.33, 659.25, 739.99, 880.00, 987.77, 1174.66]; // D5, E5, F#5, A5, B5, D6
      if (this.worldSkyChimeTimer) clearInterval(this.worldSkyChimeTimer);
      this.worldSkyChimeTimer = setInterval(() => {
        if (!this.worldSkyGain || !this.ctx || this.isMuted) return;
        try {
          const t = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          const f = skyChimes[Math.floor(Math.random() * skyChimes.length)];
          osc.frequency.setValueAtTime(f, t);

          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(0.038, t + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);

          osc.connect(gain);
          gain.connect(this.worldSkyGain);

          osc.start(t);
          osc.stop(t + 1.85);
        } catch {}
      }, 2400);
    } catch {}
  }

  public stopWorldSkyMusic(fadeDuration: number = 1.0): void {
    if (this.worldSkyChimeTimer) {
      clearInterval(this.worldSkyChimeTimer);
      this.worldSkyChimeTimer = null;
    }
    if (!this.worldSkyGain || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      this.worldSkyGain.gain.linearRampToValueAtTime(0.0001, now + fadeDuration);
      setTimeout(() => {
        try {
          this.worldSkyWind?.stop();
          this.worldSkyWind?.disconnect();
          this.worldSkyPadOscs.forEach(o => {
            try { o.stop(); o.disconnect(); } catch {}
          });
          this.worldSkyPadOscs = [];
          this.worldSkyGain?.disconnect();
        } catch {}
        this.worldSkyWind = null;
        this.worldSkyGain = null;
      }, fadeDuration * 1000 + 50);
    } catch {}
  }

  // ── AIR WAVE WHOOSH SOUND EFFECT (Stereo sweeping wind gust) ────────────────
  public playAirWaveWhoosh(direction: 'left-to-right' | 'right-to-left' = 'left-to-right'): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const duration = 2.4;

      // Noise source for the wind gust
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      let lastVal = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastVal = (lastVal + (0.04 * white)) / 1.04;
        data[i] = lastVal * 2.8;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      // Sweeping resonant bandpass filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(260, now);
      filter.frequency.linearRampToValueAtTime(750, now + duration * 0.45);
      filter.frequency.exponentialRampToValueAtTime(220, now + duration);
      filter.Q.setValueAtTime(2.8, now);

      // Stereo Panner (if available) for spatial sound passing left-to-right or right-to-left
      let panner: StereoPannerNode | null = null;
      if (typeof this.ctx.createStereoPanner === 'function') {
        panner = this.ctx.createStereoPanner();
        const startPan = direction === 'left-to-right' ? -0.85 : 0.85;
        const endPan = direction === 'left-to-right' ? 0.85 : -0.85;
        panner.pan.setValueAtTime(startPan, now);
        panner.pan.linearRampToValueAtTime(endPan, now + duration);
      }

      // Smooth volume swell curve
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.09, now + duration * 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      noise.connect(filter);
      if (panner) {
        filter.connect(panner);
        panner.connect(gain);
      } else {
        filter.connect(gain);
      }
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration + 0.1);
    } catch {}
  }

  // Resonant water bubble "bloop"
  public playUnderwaterBubble(pitchVariation: number = 1.0): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const baseFreq = (380 + Math.random() * 180) * pitchVariation;
      osc.frequency.setValueAtTime(baseFreq, now);
      // Rapid upward pitch sweep creates classic aquatic bubble sound
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.9, now + 0.08);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.065, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {}
  }

  // Soft aquatic fish tail swish
  public playFishTailSwish(): void {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.04, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {}
  }
}

export const dreamAudio = new SkyAudioPlayer();
