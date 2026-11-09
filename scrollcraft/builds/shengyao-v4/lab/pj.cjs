const { chromium } = require("playwright-core");
(async () => {
  const b = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto("http://localhost:4502/", { waitUntil: "networkidle" });
  await p.evaluate(() => document.querySelector("#projects [role=region]").scrollIntoView({ block: "center", behavior: "instant" }));
  await p.waitForTimeout(800);
  const next = p.locator("#projects button").nth(1);
  for (let i = 0; i < 5; i++) { await next.click(); await p.waitForTimeout(700); }
  await p.evaluate(() => document.querySelector("#projects [role=region]").scrollIntoView({ block: "center", behavior: "instant" })); await p.waitForTimeout(900); await p.screenshot({ path: "lab/x-pj-end.png" });
  await p.locator("#projects button").nth(0).click();
  await p.waitForTimeout(900);
  await p.evaluate(() => document.querySelector("#projects [role=region]").scrollIntoView({ block: "center", behavior: "instant" })); await p.waitForTimeout(900);
  await p.screenshot({ path: "lab/x-pj-4.png" });
  await b.close();
})();
