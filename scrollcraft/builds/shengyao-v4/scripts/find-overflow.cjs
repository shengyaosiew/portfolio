// Lists elements whose right edge passes the viewport. Usage: node scripts/find-overflow.cjs <w> <h> <lang>
const { chromium } = require("playwright-core");
const [w = "1440", h = "900", lang = "zh"] = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const ctx = await browser.newContext({ viewport: { width: +w, height: +h } });
  await ctx.addInitScript((l) => localStorage.setItem("sy-lang", l), lang);
  const page = await ctx.newPage();
  await page.goto("http://localhost:4502/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  const hits = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth, out = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width && r.right > vw + 1) {
        // skip children of scrollers / clipped ancestors
        let p = el.parentElement, clipped = false;
        while (p && p !== document.body) { const s = getComputedStyle(p); if (/(auto|scroll|hidden|clip)/.test(s.overflowX)) { clipped = true; break; } p = p.parentElement; }
        if (!clipped) out.push({ tag: el.tagName, cls: (el.className && el.className.baseVal === undefined ? el.className : "").slice(0, 90), right: Math.round(r.right), text: (el.textContent || "").trim().slice(0, 40) });
      }
    }
    return out.slice(0, 12);
  });
  console.log(JSON.stringify(hits, null, 1));
  await browser.close();
})();
