const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const p = await b.newPage({ viewport: { width: 390, height: 844 } });
  await p.goto('http://localhost:4501/?v=' + Date.now(), { waitUntil: 'networkidle' });
  const y = await p.evaluate(() => { const s = document.getElementById('pl300'); return s.offsetTop + (s.offsetHeight - innerHeight) * 0.9; });
  await p.evaluate(y => scrollTo(0, y), y); await p.waitForTimeout(800);
  const lines = await p.evaluate(() => [...document.querySelectorAll('.skill__pct')].map(e => Math.round(e.getBoundingClientRect().height / parseFloat(getComputedStyle(e).lineHeight || 20))));
  console.log('lines per label', lines, await p.evaluate(() => getComputedStyle(document.querySelector('.skill__pct')).whiteSpace));
  await p.screenshot({ path: 'lab/m-cert.png' });
  await b.close();
})();
