// The Streamlit app sleeps when idle. Press its wake button, wait, then shoot.
const { chromium } = require("playwright-core");
(async () => {
  const browser = await chromium.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("https://iai-chatbot-15.streamlit.app/", { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForTimeout(5000);
  const btn = page.getByRole("button", { name: /get this app back up/i });
  if (await btn.count()) { await btn.click(); console.log("woke"); }
  for (let i = 0; i < 12; i++) {
    await page.waitForTimeout(10000);
    const asleep = await page.getByText(/gone to sleep|Your app is in the oven|spinning up/i).count();
    const frames = page.frames().length;
    console.log("t", (i + 1) * 10, "asleep", asleep, "frames", frames);
    if (!asleep && i >= 2) break;
  }
  await page.screenshot({ path: "lab/projects/chatbot.png" });
  await browser.close();
})();
