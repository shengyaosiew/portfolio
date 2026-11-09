// Spot shots: node lab/spot.cjs <w> <h> <name> <selector> <offsetPx> <waitMs> [dark] [zh|ms]
const { chromium } = require("playwright-core");
const [w, h, ...rest] = process.argv.slice(2);
(async () => {
  const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const flags = rest.filter((x) => ["dark", "zh", "ms"].includes(x));
  const jobs = rest.filter((x) => !flags.includes(x));
  const ctx = await b.newContext({ viewport: { width: +w, height: +h } });
  await ctx.addInitScript(([d, l]) => { localStorage.setItem("sy-theme", d ? "dark" : "light"); localStorage.setItem("sy-lang", l); }, [flags.includes("dark"), flags.find((f) => f !== "dark") || "en"]);
  const p = await ctx.newPage();
  p.on("pageerror", (e) => console.log("ERR", e.message));
  await p.goto("http://localhost:4502/", { waitUntil: "networkidle" });
  await p.waitForTimeout(1500);
  for (let i = 0; i + 3 < jobs.length + 1; i += 4) {
    const [name, sel, off, wait] = jobs.slice(i, i + 4);
    await p.evaluate(([s, o]) => scrollTo({ top: document.querySelector(s).getBoundingClientRect().top + scrollY + +o, behavior: "instant" }), [sel, off]);
    await p.waitForTimeout(+wait);
    await p.screenshot({ path: `lab/x-${name}.png` });
    console.log("shot", name);
  }
  await b.close();
})();
