import puppeteer from 'puppeteer';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    html {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    body {
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      width: 1200px;
      height: 256px;
      padding: 0;
    }
    .logo {
      font-family: 'Press Start 2P', cursive;
      font-size: 5rem; /* Higher resolution for crisp rendering */
      font-weight: 700; /* font-bold */
      letter-spacing: -0.025em; /* tracking-tight */
      line-height: 1.5;
      display: inline-block;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: geometricPrecision;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
    }
    .c {
      color: hsl(26, 65%, 54%); /* text-carrot-orange */
    }
    .rabbit {
      color: hsl(90, 46%, 71%); /* text-carrot-green */
    }
  </style>
</head>
<body>
  <div class="logo">
    <span class="c">C</span><span class="rabbit">RABBIT</span>
  </div>
</body>
</html>
`;

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setContent(html, { waitUntil: 'networkidle0' });
  // Use high DPI viewport for crisp rendering
  await page.setViewport({ 
    width: 1200, 
    height: 256,
    deviceScaleFactor: 2 // 2x device pixel ratio for retina quality
  });
  
  // Wait for font to fully load and render
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const element = await page.$('.logo');
  const screenshot = await element.screenshot({
    type: 'png',
    omitBackground: true,
    // Will capture at 2400x512 due to deviceScaleFactor: 2
  });
  
  writeFileSync(join(rootDir, 'public', 'logo.png'), screenshot);
  
  await browser.close();
  console.log('✅ Logo PNG generated successfully with exact Tailwind styles at public/logo.png');
})();

