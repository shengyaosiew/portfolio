const { chromium } = require('playwright-core');
const [w,h,tag]=process.argv.slice(2); const W=+w,H=+h;
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const p=await b.newPage({viewport:{width:W,height:H}}); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
await p.goto('http://localhost:4502/',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
const ids=['skills','events','power-bi'];
for (const id of ids){ await p.evaluate(i=>document.getElementById(i).scrollIntoView(), id); await p.waitForTimeout(900); await p.screenshot({path:`lab/o-${tag}-${id}.png`}); }
console.log(tag, JSON.stringify({errs, ov: await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth)}));
await b.close();})();