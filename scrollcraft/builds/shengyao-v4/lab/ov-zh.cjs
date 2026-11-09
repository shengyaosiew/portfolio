const { chromium } = require("playwright-core");
(async () => {
  const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => localStorage.setItem("sy-lang", "zh"));
  const p = await ctx.newPage();
  await p.goto("http://localhost:4502/", { waitUntil: "networkidle" }); await p.waitForTimeout(1500);
  for (const sel of ["#top"]) {
    await p.evaluate((s) => document.querySelector(s).scrollIntoView({ behavior: "instant" }), sel); await p.waitForTimeout(900);
    const r = await p.evaluate(() => {
      const vw = document.documentElement.clientWidth; const sw = document.documentElement.scrollWidth;
      const wide = [...document.querySelectorAll("body *")].filter((e) => { const r = e.getBoundingClientRect(); return r.right > vw + 1 && !e.closest("[role=region]") && !e.classList.contains("grain"); })
        .map((e) => e.tagName + "." + String(e.className.baseVal ?? e.className).slice(0, 60) + " r=" + Math.round(e.getBoundingClientRect().right)).slice(0, 10);
      const body = document.body.scrollWidth; const main = document.querySelector("main").scrollWidth; const secs = [...document.querySelectorAll("main > section")].map((s) => (s.id || "?") + ":" + s.scrollWidth).join(" "); return { sw, vw, body, main, secs };
    });
    console.log(sel, JSON.stringify(r));
  }
  await b.close();
})();