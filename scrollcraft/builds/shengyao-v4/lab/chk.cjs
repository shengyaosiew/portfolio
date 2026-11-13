const { chromium } = require('playwright-core');
const [w,h,tag]=process.argv.slice(2); const W=+w,H=+h;
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const p=await b.newPage({viewport:{width:W,height:H}});
await p.goto('http://localhost:4502/',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
// power-bi panel (pass mark removed)
await p.evaluate(()=>document.querySelector('#power-bi').scrollIntoView()); await p.waitForTimeout(700); await p.screenshot({path:`lab/c-${tag}-powerbi.png`});
// reach / world map
await p.evaluate(()=>{const s=[...document.querySelectorAll('section')].find(x=>x.querySelector('svg path[stroke="url(#path-gradient)"]')); if(s) s.scrollIntoView();}); await p.waitForTimeout(1600); await p.screenshot({path:`lab/c-${tag}-map.png`});
// hours
await p.evaluate(()=>{const s=[...document.querySelectorAll('section')].find(x=>x.textContent.includes('working days')); if(s) s.scrollIntoView();}); await p.waitForTimeout(1400); await p.screenshot({path:`lab/c-${tag}-hours.png`});
const ov=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
console.log(tag, JSON.stringify({errs,ov}));
await b.close();})();