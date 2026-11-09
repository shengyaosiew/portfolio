// Scrolls with the mouse wheel (like a visitor) and samples the ring + 750 count.
const { chromium } = require("playwright-core");
(async () => {
  const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: process.argv[2] === "reduce" ? "reduce" : "no-preference" });
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("ERR", e.message));
  await page.goto("http://localhost:4502/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.mouse.move(700, 450);
  const sample = () => page.evaluate(() => {
    const c = [...document.querySelectorAll("#power-bi svg circle")].slice(1).map((e) => getComputedStyle(e).strokeDasharray);
    const n = document.querySelector("#power-bi + section .tabular-nums")?.textContent;
    const sq = document.querySelector("#power-bi + section [role=img] span");
    return { y: Math.round(scrollY), ring: c.join(" | "), count: n, sq: sq && getComputedStyle(sq).opacity };
  });
  for (let i = 0; i < 40; i++) {
    await page.mouse.wheel(0, 120);
    await page.waitForTimeout(150);
    if (i % 3 === 0) console.log(JSON.stringify(await sample()));
  }
  await page.waitForTimeout(2500);
  console.log("END", JSON.stringify(await sample()));
  await browser.close();
})();
