import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const svgBuffer = readFileSync(join(rootDir, 'public', 'logo.svg'));

// Convert SVG to PNG with transparent background
sharp(svgBuffer)
  .resize(400, 80, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  })
  .png()
  .toFile(join(rootDir, 'public', 'logo.png'))
  .then(() => {
    console.log('✅ Logo PNG generated successfully at public/logo.png');
  })
  .catch((err) => {
    console.error('❌ Error generating logo:', err);
    process.exit(1);
  });

