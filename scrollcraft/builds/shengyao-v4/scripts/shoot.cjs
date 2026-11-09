// Visual check: screenshots at set points inside each section, plus console
// errors, failed requests, horizontal overflow and video scrub state.
// Usage: node scripts/shoot.cjs <outDir> <width> <height> [reduce] [dark] [zh|ms]
const { chromium } = require("playwright-core");
const fs = require("fs");
const [out = "lab/desk", w = "1440", h = "900", ...flags] = process.argv.slice(2);
const reduce = flags.includes("reduce");
const dark = flags.includes("dark");
const lang = flags.find((f) => f === "zh" || f === "ms") || "en";

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const ctx = await browser.newContext({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1, reducedMotion: reduce ? "reduce" : "no-preference" });
  await ctx.addInitScript(([dark, lang]) => {
    try { localStorage.setItem("sy-theme", dark ? "dark" : "light"); localStorage.setItem("sy-lang", lang); } catch (e) {}
  }, [dark, lang]);
  const page = await ctx.newPage();
  const errors = [], failed = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("requestfailed", (r) => failed.push(r.url() + " " + (r.failure() || {}).errorText));
  page.on("response", (r) => r.status() >= 400 && failed.push(r.status() + " " + r.url()));
  await page.goto("http://localhost:4502/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2600);
  const meta = await page.evaluate(() => ({ title: document.title, lang: document.documentElement.lang, dark: document.documentElement.classList.contains("dark") }));

  const plan = [
    ["hero", "#top", [0]],
    ["powerbi", "#power-bi", [0.15, 0.5, 1]],
    ["hours", "#power-bi + section", [0.3]],
    ["ai", "#impact", [0, 0.5, 1]],
    ["tickets", "#ai-tickets", [0.3, 0.55, 1]],
    ["reach", "#ai-tickets + section", [0.45]],
    ["journey", "#journey", [0.4]],
    ["skills", "#skills", [0, 0.6]],
    ["events", "#events", [0.1]],
    ["projects", "#projects", [0.2]],
    ["contact", "#contact", [0]],
  ];
  let n = 0;
  const report = [];
  const shot = async (name) => {
    const vt = await page.evaluate(() => { const v = document.querySelector("video"); return v ? +v.currentTime.toFixed(2) : null; });
    const file = `${out}/${String(n).padStart(2, "0")}-${name}.png`;
    await page.screenshot({ path: file });
    report.push({ file, videoTime: vt });
    n++;
  };
  for (const [name, sel, fracs] of plan) {
    for (const f of fracs) {
      const y = await page.evaluate(([sel, f]) => {
        const el = document.querySelector(sel);
        const top = el.getBoundingClientRect().top + scrollY;
        const travel = Math.max(0, el.offsetHeight - innerHeight);
        return Math.round(top + travel * f);
      }, [sel, f]);
      await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
      await page.waitForTimeout(1300);
      await shot(`${name}-${f}`);
    }
    if (name === "projects") {
      // step the carousel twice with the arrow button
      const next = page.locator("#projects button").nth(1);
      for (let k = 0; k < 2; k++) { await next.click(); await page.waitForTimeout(900); }
      await shot("projects-step2");
    }
  }
  if (+w < 768) {
    // mobile menu over the hero: must sit above the hero copy
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(600);
    await page.click("[aria-controls=mobile-menu]"); await page.waitForTimeout(900); await shot("menu-open");
    await page.mouse.click(+w / 2, +h - 40); await page.waitForTimeout(500);
    const closed = await page.evaluate(() => !document.getElementById("mobile-menu"));
    report.push({ menuClosedByOutsideTap: closed });
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  fs.writeFileSync(`${out}/report.json`, JSON.stringify({ meta, errors, failed, overflow, report }, null, 2));
  console.log(JSON.stringify({ meta, shots: n, errors, failed, overflow, videoTimes: report.filter((r) => r.videoTime !== null).map((r) => r.videoTime) }));
  await browser.close();
})();
