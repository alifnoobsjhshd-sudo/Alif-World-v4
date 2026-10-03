import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const images = [
  { in: 'scientist_cloud_sitting_1789574180368.jpg', out: 'pose_sitting.png' },
  { in: 'scientist_cloud_lying_1789574194600.jpg', out: 'pose_lying.png' },
  { in: 'scientist_cloud_crosslegged_1789574207501.jpg', out: 'pose_crosslegged.png' },
  { in: 'scientist_cloud_standing_1789574219417.jpg', out: 'pose_standing.png' },
  { in: 'scientist_cloud_laptop_1789574234747.jpg', out: 'pose_laptop.png' },
  { in: 'scientist_cloud_wave_1789574249805.jpg', out: 'pose_wave.png' },
  { in: 'scientist_cloud_storm_1789574263237.jpg', out: 'pose_storm.png' },
  { in: 'scientist_cloud_sunset_1789574275827.jpg', out: 'pose_sunset.png' },
];

const imgDir = path.resolve('src/assets/images');

async function processImage({ in: inFile, out: outFile }) {
  const inputPath = path.join(imgDir, inFile);
  const outputPath = path.join(imgDir, outFile);

  console.log(`Processing ${inFile}...`);

  // Resize to max 640 for crisp sharpness and super fast rendering
  const { data, info } = await sharp(inputPath)
    .resize(640, 640, { fit: 'inside' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h, channels } = info;
  const visited = new Uint8Array(w * h);
  const queue = [];

  const isNearWhite = (idx) => {
    const r = data[idx * 4];
    const g = data[idx * 4 + 1];
    const b = data[idx * 4 + 2];
    return r > 228 && g > 228 && b > 228;
  };

  // Seed border pixels
  for (let x = 0; x < w; x++) {
    const topIdx = x;
    if (isNearWhite(topIdx)) {
      visited[topIdx] = 1;
      queue.push(topIdx);
    }
    const botIdx = (h - 1) * w + x;
    if (isNearWhite(botIdx)) {
      visited[botIdx] = 1;
      queue.push(botIdx);
    }
  }
  for (let y = 0; y < h; y++) {
    const leftIdx = y * w;
    if (!visited[leftIdx] && isNearWhite(leftIdx)) {
      visited[leftIdx] = 1;
      queue.push(leftIdx);
    }
    const rightIdx = y * w + (w - 1);
    if (!visited[rightIdx] && isNearWhite(rightIdx)) {
      visited[rightIdx] = 1;
      queue.push(rightIdx);
    }
  }

  // BFS flood fill
  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % w;
    const cy = Math.floor(curr / w);

    // Make transparent
    data[curr * 4 + 3] = 0;

    const neighbors = [
      cy > 0 ? curr - w : -1,
      cy < h - 1 ? curr + w : -1,
      cx > 0 ? curr - 1 : -1,
      cx < w - 1 ? curr + 1 : -1,
    ];

    for (const n of neighbors) {
      if (n !== -1 && !visited[n] && isNearWhite(n)) {
        visited[n] = 1;
        queue.push(n);
      }
    }
  }

  // Soft anti-aliasing on outer border
  for (let i = 0; i < visited.length; i++) {
    if (!visited[i]) {
      const r = data[i * 4];
      const g = data[i * 4 + 1];
      const b = data[i * 4 + 2];
      if (r > 215 && g > 215 && b > 215) {
        const x = i % w;
        const y = Math.floor(i / w);
        const hasTransparentNeighbor =
          (y > 0 && visited[i - w]) ||
          (y < h - 1 && visited[i + w]) ||
          (x > 0 && visited[i - 1]) ||
          (x < w - 1 && visited[i + 1]);
        if (hasTransparentNeighbor) {
          const lum = (r + g + b) / 3;
          const alpha = Math.max(0, Math.min(1, (255 - lum) / 40));
          data[i * 4 + 3] = Math.round(alpha * 255);
        }
      }
    }
  }

  // Save as clean, optimized PNG
  await sharp(data, {
    raw: {
      width: w,
      height: h,
      channels: 4,
    },
  })
    .png({ compressionLevel: 8, effort: 7 })
    .toFile(outputPath);

  console.log(`Saved ${outFile} (${w}x${h})`);
}

async function run() {
  for (const img of images) {
    await processImage(img);
  }
  console.log('All poses pre-processed successfully!');
}

run().catch(console.error);
