// Renders the 🦊 emoji to PNG icons (apple-touch-icon + 32px fallback),
// for browsers that do not use SVG favicons. Run: node scripts/make-fox-icon.cjs
const { chromium } = require("playwright-core");
(async () => {
  const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  for (const [size, file, bg] of [[180, "public/media/fox-180.png", "#f4f2ed"], [32, "public/media/fox-32.png", "transparent"]]) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    await page.setContent(`<html><body style="margin:0;background:${bg};display:grid;place-items:center;width:${size}px;height:${size}px;overflow:hidden">
      <span style="font-size:${Math.round(size * (bg === "transparent" ? 0.9 : 0.72))}px;line-height:1;font-family:'Segoe UI Emoji','Apple Color Emoji','Noto Color Emoji',sans-serif">🦊</span></body></html>`);
    await page.screenshot({ path: file, omitBackground: bg === "transparent" });
    await page.close();
    console.log(file);
  }
  await browser.close();
})();
