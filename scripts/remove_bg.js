import sharp from 'sharp';
import fs from 'fs';

async function removeWhiteBgFloodFill(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  
  // Create an RGBA buffer
  const rgba = Buffer.alloc(width * height * 4);
  const visited = new Uint8Array(width * height);
  const isBg = new Uint8Array(width * height);

  // Helper to check if pixel is near white
  function isNearWhite(idx) {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    // Check brightness and low saturation (near neutral white/very light grey)
    const brightness = (r + g + b) / 3;
    const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
    return brightness >= 238 && maxDiff <= 24;
  }

  // Flood fill from all 4 borders
  const queue = [];

  for (let x = 0; x < width; x++) {
    // Top border
    let pIdx = (0 * width + x);
    if (isNearWhite(pIdx * channels)) {
      visited[pIdx] = 1;
      isBg[pIdx] = 1;
      queue.push(pIdx);
    }
    // Bottom border
    pIdx = ((height - 1) * width + x);
    if (isNearWhite(pIdx * channels)) {
      visited[pIdx] = 1;
      isBg[pIdx] = 1;
      queue.push(pIdx);
    }
  }

  for (let y = 0; y < height; y++) {
    // Left border
    let pIdx = (y * width + 0);
    if (!visited[pIdx] && isNearWhite(pIdx * channels)) {
      visited[pIdx] = 1;
      isBg[pIdx] = 1;
      queue.push(pIdx);
    }
    // Right border
    pIdx = (y * width + (width - 1));
    if (!visited[pIdx] && isNearWhite(pIdx * channels)) {
      visited[pIdx] = 1;
      isBg[pIdx] = 1;
      queue.push(pIdx);
    }
  }

  let head = 0;
  while (head < queue.length) {
    const curr = queue[head++];
    const cx = curr % width;
    const cy = Math.floor(curr / width);

    // 4 neighbors
    const neighbors = [
      cx > 0 ? curr - 1 : -1,
      cx < width - 1 ? curr + 1 : -1,
      cy > 0 ? curr - width : -1,
      cy < height - 1 ? curr + width : -1,
    ];

    for (const n of neighbors) {
      if (n !== -1 && !visited[n]) {
        visited[n] = 1;
        if (isNearWhite(n * channels)) {
          isBg[n] = 1;
          queue.push(n);
        }
      }
    }
  }

  // Distance / feathering for smooth edge
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = y * width + x;
      const srcIdx = idx * channels;
      const dstIdx = idx * 4;

      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      if (isBg[idx]) {
        // Completely transparent background
        rgba[dstIdx] = r;
        rgba[dstIdx + 1] = g;
        rgba[dstIdx + 2] = b;
        rgba[dstIdx + 3] = 0;
      } else {
        // Check if adjacent to background for anti-aliasing
        let bgNeighbors = 0;
        for (let dy = -1; dy <= 1; dy++) {
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              if (isBg[ny * width + nx]) bgNeighbors++;
            }
          }
        }

        rgba[dstIdx] = r;
        rgba[dstIdx + 1] = g;
        rgba[dstIdx + 2] = b;

        if (bgNeighbors > 0) {
          // Soft edge blending
          const brightness = (r + g + b) / 3;
          if (brightness > 220) {
            rgba[dstIdx + 3] = Math.max(0, Math.min(255, Math.round(255 * (1 - (brightness - 220) / 35) * (1 - bgNeighbors / 12))));
          } else {
            rgba[dstIdx + 3] = 255;
          }
        } else {
          rgba[dstIdx + 3] = 255;
        }
      }
    }
  }

  // Save as high-quality PNG
  await sharp(rgba, {
    raw: {
      width,
      height,
      channels: 4,
    },
  })
    .png({ compressionLevel: 9 })
    .toFile(outputPath);

  console.log(`Saved transparent PNG to ${outputPath}`);
}

async function run() {
  await removeWhiteBgFloodFill('src/assets/images/islands/story_raw.jpg', 'src/assets/images/islands/island_story.png');
  await removeWhiteBgFloodFill('src/assets/images/islands/about_raw.jpg', 'src/assets/images/islands/island_about.png');
  await removeWhiteBgFloodFill('src/assets/images/islands/works_raw.jpg', 'src/assets/images/islands/island_works.png');
}

run().catch(console.error);
