const puppeteer = require('puppeteer');
const { TICK_INTERVAL } = require('./src/config');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--window-size=1600,900',
      '--content-shell-host-window-size=990,700',
      '--auto-open-devtools-for-tabs'
    ]
  });
  const page = await browser.newPage();
  await page.goto('http://flappybird.io/', { waitUntil: 'networkidle' });

  await page.injectFile('./dist/bundle.js');
  await page.evaluate(() => Game.start());
})();
