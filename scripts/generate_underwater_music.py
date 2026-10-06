import math
import wave
import struct
import random
import subprocess
import os

sample_rate = 44100
bpm = 58
beat_sec = 60.0 / bpm
bars = 16
total_beats = bars * 4
total_sec = total_beats * beat_sec
total_samples = int(sample_rate * total_sec)

left = [0.0] * total_samples
right = [0.0] * total_samples

# 1. Deep Ocean Current Drone
for i in range(total_samples):
    t = i / sample_rate
    sub = (
        0.18 * math.sin(2 * math.pi * 48 * t) +
        0.12 * math.sin(2 * math.pi * 72 * t) +
        0.08 * math.sin(2 * math.pi * 96 * t)
    )
    tidal = 0.75 + 0.25 * math.sin(2 * math.pi * (1.0 / 11.0) * t)
    left[i] += sub * tidal
    right[i] += sub * (0.75 + 0.25 * math.sin(2 * math.pi * (1.0 / 11.0) * t + 0.5))

# Filtered water wash noise
random.seed(42)
last_val = 0.0
for i in range(total_samples):
    t = i / sample_rate
    white = random.uniform(-1, 1)
    last_val = 0.96 * last_val + 0.04 * white
    lfo = 0.6 + 0.4 * math.sin(2 * math.pi * 0.14 * t)
    left[i] += last_val * 0.09 * lfo
    right[i] += last_val * 0.09 * (0.6 + 0.4 * math.sin(2 * math.pi * 0.14 * t + 1.2))

# 2. Ambient Water Bubbles
num_bubbles = int(total_sec * 6)
for _ in range(num_bubbles):
    start_t = random.uniform(0, total_sec - 0.2)
    start_idx = int(start_t * sample_rate)
    dur = random.uniform(0.04, 0.09)
    dur_samples = int(dur * sample_rate)
    if start_idx + dur_samples >= total_samples:
        continue

    base_f = random.uniform(380, 820)
    pan = random.uniform(0.2, 0.8)
    amp = random.uniform(0.015, 0.038)

    phase = 0.0
    for s in range(dur_samples):
        progress = s / dur_samples
        f = base_f * (1.0 + 0.7 * (progress ** 1.2))
        phase += 2 * math.pi * f / sample_rate
        env = (math.sin(math.pi * progress)) ** 1.8
        sig = math.sin(phase) * env * amp
        left[start_idx + s] += sig * (1.0 - pan)
        right[start_idx + s] += sig * pan

# 3. Chord Progressions
chords = [
    [43.65, [174.61, 220.00, 261.63, 329.63]],  # Fmaj7
    [32.70, [130.81, 196.00, 246.94, 329.63]],  # Cmaj7
    [27.50, [110.00, 164.81, 220.00, 293.66]],  # Am9
    [24.50, [98.00, 146.83, 196.00, 246.94]],   # G
]

bar_sec = 4 * beat_sec
for b in range(bars):
    chord_idx = (b // 4) % len(chords)
    chord_info = chords[chord_idx]
    c_start_idx = int(b * bar_sec * sample_rate)
    c_samples = int(bar_sec * 1.05 * sample_rate)
    if c_start_idx + c_samples > total_samples:
        c_samples = total_samples - c_start_idx

    root_f = chord_info[0] * 2
    harmonics = chord_info[1]

    for s in range(c_samples):
        ct = s / sample_rate
        c_env = (math.sin(math.pi * min(s / c_samples, 1.0))) ** 0.85

        root_sig = math.sin(2 * math.pi * root_f * ct) * 0.13 * c_env
        left[c_start_idx + s] += root_sig
        right[c_start_idx + s] += root_sig

        for freq in harmonics:
            p1 = math.sin(2 * math.pi * freq * 1.002 * ct) * 0.042 * c_env
            p2 = math.sin(2 * math.pi * freq * 0.998 * ct) * 0.042 * c_env
            warm = math.sin(2 * math.pi * (freq * 0.5) * ct) * 0.018 * c_env
            left[c_start_idx + s] += p1 + warm * 0.8
            right[c_start_idx + s] += p2 + warm * 0.8

# 4. Meditative Electric Piano / Aquatic Bell Melody
melody_notes = [
    (2, 329.63, 3.5),    # E4
    (5, 392.00, 3.0),    # G4
    (8, 440.00, 4.0),    # A4
    (13, 523.25, 3.5),   # C5
    (18, 493.88, 3.0),   # B4
    (21, 392.00, 3.5),   # G4
    (24, 329.63, 4.5),   # E4
    (29, 293.66, 3.0),   # D4
    (34, 329.63, 3.5),   # E4
    (38, 440.00, 3.0),   # A4
    (42, 523.25, 4.0),   # C5
    (46, 587.33, 3.0),   # D5
    (50, 659.25, 4.5),   # E5
    (55, 523.25, 3.0),   # C5
    (58, 440.00, 3.5),   # A4
    (61, 392.00, 4.0),   # G4
]

for beat_pos, freq, dur_beats in melody_notes:
    m_start_idx = int(beat_pos * beat_sec * sample_rate)
    m_samples = int(dur_beats * beat_sec * sample_rate)
    if m_start_idx + m_samples > total_samples:
        m_samples = total_samples - m_start_idx

    pan = 0.5 + 0.25 * math.sin(beat_pos)
    d_samples = int(0.35 * sample_rate)

    for s in range(m_samples):
        mt = s / sample_rate
        m_env = math.exp(-mt * 1.8) * math.sin(math.pi * min(mt / 0.04, 1.0))
        bell_sig = (
            0.08 * math.sin(2 * math.pi * freq * mt) +
            0.035 * math.sin(2 * math.pi * (freq * 2) * mt) +
            0.012 * math.sin(2 * math.pi * (freq * 3) * mt)
        ) * m_env

        left[m_start_idx + s] += bell_sig * (1.0 - pan)
        right[m_start_idx + s] += bell_sig * pan

        if m_start_idx + d_samples + s < total_samples:
            rev_idx = m_start_idx + d_samples + s
            left[rev_idx] += bell_sig * 0.26 * pan
            right[rev_idx] += bell_sig * 0.26 * (1.0 - pan)

# 5. Seamless Loop Crossfade
fade_len = int(sample_rate * 2.5)
for i in range(fade_len):
    fi = i / fade_len
    fo = 1.0 - fi
    tail_idx = total_samples - fade_len + i
    left[i] = left[i] * fi + left[tail_idx] * fo
    right[i] = right[i] * fi + right[tail_idx] * fo

left = left[:-fade_len]
right = right[:-fade_len]

# Soft Normalization
peak = 0.0001
for i in range(len(left)):
    al = abs(left[i])
    ar = abs(right[i])
    if al > peak: peak = al
    if ar > peak: peak = ar

scale = 0.88 / peak

wav_path = '/tmp/underwater_music.wav'
with wave.open(wav_path, 'w') as wf:
    wf.setnchannels(2)
    wf.setsampwidth(2)
    wf.setframerate(sample_rate)
    frames = bytearray()
    for i in range(len(left)):
        sl = int(max(-32767, min(32767, left[i] * scale * 32767)))
        sr = int(max(-32767, min(32767, right[i] * scale * 32767)))
        frames.extend(struct.pack('<hh', sl, sr))
    wf.writeframes(frames)

mp3_out = 'public/underwater-background-music.mp3'
cmd = ['ffmpeg', '-y', '-i', wav_path, '-codec:a', 'libmp3lame', '-b:a', '192k', mp3_out]
subprocess.run(cmd, check=True)
print(f"Generated {mp3_out} successfully: {os.path.getsize(mp3_out)} bytes")
