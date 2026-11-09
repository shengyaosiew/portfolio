// Real screenshots of each live project for the project carousel.
// Usage: node scripts/shoot-projects.cjs  -> lab/projects/<slug>.png
const { chromium } = require("playwright-core");
const fs = require("fs");
const SITES = [
  ["chatbot", "https://iai-chatbot-15.streamlit.app/", 14000],
  ["klt", "https://www.klt.com.my/", 5000],
  ["artivo", "https://edu-artivo.com/en/", 5000],
  ["ipsskin", "https://ibeautynew.demo.com.my/en/", 5000],
  ["namecard", "https://weycang.my.canva.site/", 6000],
];
(async () => {
  fs.mkdirSync("lab/projects", { recursive: true });
  const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  for (const [slug, url, wait] of SITES) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(wait);
      await page.screenshot({ path: `lab/projects/${slug}.png` });
      console.log("ok", slug, await page.title());
    } catch (e) {
      console.log("FAIL", slug, e.message.split("\n")[0]);
    }
    await page.close();
  }
  await browser.close();
})();
