const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const TARGET_URL = process.env.TARGET_URL || 'https://dj-discovery-ihhs.vercel.app';
const commitSha = (process.env.COMMIT_SHA || 'unknown').slice(0, 7);
const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
const filename = `${date}_${commitSha}.png`;
const outputDir = path.join(process.cwd(), 'screenshots');
const outputPath = path.join(outputDir, filename);

(async () => {
  console.log(`Taking screenshot of ${TARGET_URL}`);
  console.log(`Output: ${outputPath}`);

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    await page.goto(TARGET_URL, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(`Screenshot saved: ${filename}`);
  } finally {
    await browser.close();
  }
})().catch((err) => {
  console.error('Screenshot failed:', err);
  process.exit(1);
});
