import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const inputPath = join(publicDir, 'formulation-lab-bg.png');
const outputPath = join(publicDir, 'formulation-lab-bg.png');

const image = sharp(inputPath);
const meta = await image.metadata();
const w = meta.width || 1920;
const h = meta.height || 1080;

await sharp(inputPath)
  .resize(Math.round(w * 2), Math.round(h * 2), { kernel: 'lanczos3' })
  .toFile(outputPath);

console.log('Upscaled formulation-lab-bg.png to 2x dimensions');
