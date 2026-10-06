const fs = require('fs');
const { execSync } = require('child_process');

const sampleRate = 44100;
const bpm = 58;
const beatSec = 60.0 / bpm;
const bars = 16;
const totalBeats = bars * 4;
const totalSec = totalBeats * beatSec; // ~66.2s
const totalSamples = Math.floor(sampleRate * totalSec);

const left = new Float32Array(totalSamples);
const right = new Float32Array(totalSamples);

// 1. Deep Ocean Current & Sub Drone
for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate;
  const sub = (
    0.18 * Math.sin(2 * Math.PI * 48 * t) +
    0.12 * Math.sin(2 * Math.PI * 72 * t) +
    0.08 * Math.sin(2 * Math.PI * 96 * t)
  );
  const tidal = 0.75 + 0.25 * Math.sin(2 * Math.PI * (1.0 / 11.0) * t);
  left[i] += sub * tidal;
  right[i] += sub * (0.75 + 0.25 * Math.sin(2 * Math.PI * (1.0 / 11.0) * t + 0.5));
}

// Filtered water wash
let lastVal = 0.0;
for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate;
  const white = Math.random() * 2 - 1;
  lastVal = 0.96 * lastVal + 0.04 * white;
  const lfo = 0.6 + 0.4 * Math.sin(2 * Math.PI * 0.14 * t);
  left[i] += lastVal * 0.09 * lfo;
  right[i] += lastVal * 0.09 * (0.6 + 0.4 * Math.sin(2 * Math.PI * 0.14 * t + 1.2));
}

// 2. Ambient Water Bubbles
const numBubbles = Math.floor(totalSec * 6);
for (let b = 0; b < numBubbles; b++) {
  const startT = Math.random() * (totalSec - 0.2);
  const startIdx = Math.floor(startT * sampleRate);
  const dur = 0.04 + Math.random() * 0.05;
  const durSamples = Math.floor(dur * sampleRate);
  if (startIdx + durSamples >= totalSamples) continue;

  const baseF = 380 + Math.random() * 440;
  const pan = 0.2 + Math.random() * 0.6;
  const amp = 0.015 + Math.random() * 0.023;

  let phase = 0;
  for (let s = 0; s < durSamples; s++) {
    const prog = s / durSamples;
    const f = baseF * (1.0 + 0.7 * Math.pow(prog, 1.2));
    phase += (2 * Math.PI * f) / sampleRate;
    const env = Math.pow(Math.sin(Math.PI * prog), 1.8);
    const sig = Math.sin(phase) * env * amp;
    left[startIdx + s] += sig * (1.0 - pan);
    right[startIdx + s] += sig * pan;
  }
}

// 3. Ethereal Aquatic Chords (Fmaj7 -> Cmaj7 -> Am9 -> G)
const chords = [
  { root: 43.65, harmonics: [174.61, 220.00, 261.63, 329.63] }, // Fmaj7
  { root: 32.70, harmonics: [130.81, 196.00, 246.94, 329.63] }, // Cmaj7
  { root: 27.50, harmonics: [110.00, 164.81, 220.00, 293.66] }, // Am9
  { root: 24.50, harmonics: [98.00, 146.83, 196.00, 246.94] },  // G
];

const barSec = 4 * beatSec;
for (let b = 0; b < bars; b++) {
  const chordIdx = Math.floor(b / 4) % chords.length;
  const chord = chords[chordIdx];
  const cStartIdx = Math.floor(b * barSec * sampleRate);
  let cSamples = Math.floor(barSec * 1.05 * sampleRate);
  if (cStartIdx + cSamples > totalSamples) cSamples = totalSamples - cStartIdx;

  const rootF = chord.root * 2;
  for (let s = 0; s < cSamples; s++) {
    const ct = s / sampleRate;
    const cEnv = Math.pow(Math.sin(Math.PI * Math.min(s / cSamples, 1.0)), 0.85);

    const rootSig = Math.sin(2 * Math.PI * rootF * ct) * 0.13 * cEnv;
    left[cStartIdx + s] += rootSig;
    right[cStartIdx + s] += rootSig;

    for (let h = 0; h < chord.harmonics.length; h++) {
      const freq = chord.harmonics[h];
      const p1 = Math.sin(2 * Math.PI * freq * 1.002 * ct) * 0.042 * cEnv;
      const p2 = Math.sin(2 * Math.PI * freq * 0.998 * ct) * 0.042 * cEnv;
      const warm = Math.sin(2 * Math.PI * (freq * 0.5) * ct) * 0.018 * cEnv;
      left[cStartIdx + s] += p1 + warm * 0.8;
      right[cStartIdx + s] += p2 + warm * 0.8;
    }
  }
}

// 4. Meditative Electric Piano / Bell Pluck Melody
const melodyNotes = [
  [2, 329.63, 3.5],
  [5, 392.00, 3.0],
  [8, 440.00, 4.0],
  [13, 523.25, 3.5],
  [18, 493.88, 3.0],
  [21, 392.00, 3.5],
  [24, 329.63, 4.5],
  [29, 293.66, 3.0],
  [34, 329.63, 3.5],
  [38, 440.00, 3.0],
  [42, 523.25, 4.0],
  [46, 587.33, 3.0],
  [50, 659.25, 4.5],
  [55, 523.25, 3.0],
  [58, 440.00, 3.5],
  [61, 392.00, 4.0],
];

const dSamples = Math.floor(0.35 * sampleRate);
for (let n = 0; n < melodyNotes.length; n++) {
  const [beatPos, freq, durBeats] = melodyNotes[n];
  const mStartIdx = Math.floor(beatPos * beatSec * sampleRate);
  let mSamples = Math.floor(durBeats * beatSec * sampleRate);
  if (mStartIdx + mSamples > totalSamples) mSamples = totalSamples - mStartIdx;

  const pan = 0.5 + 0.25 * Math.sin(beatPos);

  for (let s = 0; s < mSamples; s++) {
    const mt = s / sampleRate;
    const mEnv = Math.exp(-mt * 1.8) * Math.sin(Math.PI * Math.min(mt / 0.04, 1.0));
    const bellSig = (
      0.08 * Math.sin(2 * Math.PI * freq * mt) +
      0.035 * Math.sin(2 * Math.PI * (freq * 2) * mt) +
      0.012 * Math.sin(2 * Math.PI * (freq * 3) * mt)
    ) * mEnv;

    left[mStartIdx + s] += bellSig * (1.0 - pan);
    right[mStartIdx + s] += bellSig * pan;

    if (mStartIdx + dSamples + s < totalSamples) {
      left[mStartIdx + dSamples + s] += bellSig * 0.26 * pan;
      right[mStartIdx + dSamples + s] += bellSig * 0.26 * (1.0 - pan);
    }
  }
}

// 5. Seamless Loop Crossfade
const fadeLen = Math.floor(sampleRate * 2.5);
for (let i = 0; i < fadeLen; i++) {
  const fi = i / fadeLen;
  const fo = 1.0 - fi;
  const tailIdx = totalSamples - fadeLen + i;
  left[i] = left[i] * fi + left[tailIdx] * fo;
  right[i] = right[i] * fi + right[tailIdx] * fo;
}

const finalSamples = totalSamples - fadeLen;
let peak = 0.0001;
for (let i = 0; i < finalSamples; i++) {
  const al = Math.abs(left[i]);
  const ar = Math.abs(right[i]);
  if (al > peak) peak = al;
  if (ar > peak) peak = ar;
}

const scale = 0.88 / peak;

// Build 16-bit PCM WAV buffer
const wavHeaderSize = 44;
const pcmByteLength = finalSamples * 4;
const wavBuffer = Buffer.alloc(wavHeaderSize + pcmByteLength);

// RIFF header
wavBuffer.write('RIFF', 0);
wavBuffer.writeUInt32LE(36 + pcmByteLength, 4);
wavBuffer.write('WAVE', 8);
wavBuffer.write('fmt ', 12);
wavBuffer.writeUInt32LE(16, 16);
wavBuffer.writeUInt16LE(1, 20); // PCM
wavBuffer.writeUInt16LE(2, 22); // Stereo
wavBuffer.writeUInt32LE(sampleRate, 24);
wavBuffer.writeUInt32LE(sampleRate * 4, 28); // byte rate
wavBuffer.writeUInt16LE(4, 32); // block align
wavBuffer.writeUInt16LE(16, 34); // bits per sample
wavBuffer.write('data', 36);
wavBuffer.writeUInt32LE(pcmByteLength, 40);

let offset = 44;
for (let i = 0; i < finalSamples; i++) {
  const sl = Math.max(-32767, Math.min(32767, Math.floor(left[i] * scale * 32767)));
  const sr = Math.max(-32767, Math.min(32767, Math.floor(right[i] * scale * 32767)));
  wavBuffer.writeInt16LE(sl, offset);
  wavBuffer.writeInt16LE(sr, offset + 2);
  offset += 4;
}

const wavPath = '/tmp/underwater_music.wav';
fs.writeFileSync(wavPath, wavBuffer);
console.log(`Wrote WAV: ${wavPath} (${wavBuffer.length} bytes)`);

// Convert to MP3
const mp3Path = 'public/underwater-background-music.mp3';
execSync(`ffmpeg -y -i ${wavPath} -codec:a libmp3lame -b:a 192k ${mp3Path}`);
console.log(`Created MP3: ${mp3Path} (${fs.statSync(mp3Path).size} bytes)`);
