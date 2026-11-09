const { chromium } = require('playwright-core');
(async () => {
  const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  for (const [w,h] of [[360,640],[390,844],[1440,900]]) {
    const p = await b.newPage({ viewport: { width: w, height: h } });
    const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
    await p.goto('http://localhost:4501', { waitUntil: 'networkidle' });
    const r = await p.evaluate(() => {
      const over = [...document.querySelectorAll('main *')].filter(el => { const rc = el.getBoundingClientRect(); return rc.right > innerWidth + 1 && !el.closest('[data-sc-pan]') && getComputedStyle(el).position !== 'fixed'; }).slice(0,5).map(el => el.className || el.tagName);
      const rail = document.querySelector('.tl__rail');
      return { docW: document.documentElement.scrollWidth, over, railOverflow: rail.scrollWidth - innerWidth };
    });
    console.log(w + 'x' + h, JSON.stringify(r), 'errors:', errs.length ? errs : 'none');
  }
  await b.close();
})();
