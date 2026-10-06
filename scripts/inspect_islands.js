import sharp from 'sharp';

async function inspect(name, path) {
  const meta = await sharp(path).metadata();
  console.log(name, meta.width, meta.height, meta.channels, meta.format);
  
  // Sample pixels at the corners
  const { data, info } = await sharp(path).raw().toBuffer({ resolveWithObject: true });
  console.log(`${name} corner [0,0]:`, data[0], data[1], data[2]);
  console.log(`${name} corner [top-right]:`, data[(info.width - 1) * info.channels], data[(info.width - 1) * info.channels + 1], data[(info.width - 1) * info.channels + 2]);
}

async function main() {
  await inspect('story', 'src/assets/images/islands/story_raw.jpg');
  await inspect('about', 'src/assets/images/islands/about_raw.jpg');
  await inspect('works', 'src/assets/images/islands/works_raw.jpg');
}

main().catch(console.error);
