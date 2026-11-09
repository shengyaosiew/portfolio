const { chromium } = require('playwright-core');
const [w,h,tag,...fl]=process.argv.slice(2); const W=+w,H=+h;
(async()=>{const b=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const ctx=await b.newContext({viewport:{width:W,height:H},deviceScaleFactor:1,reducedMotion:fl.includes('reduce')?'reduce':'no-preference'});
const p=await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e))); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
const lg=fl.find(x=>x==='zh'||x==='ms'); if(lg) await p.addInitScript(l=>localStorage.setItem('sy-lang',l),lg);
await p.goto('http://localhost:4502/',{waitUntil:'networkidle'}); await p.waitForTimeout(2600);
for (const pr of (fl.includes('reduce')?[1]:[0,0.3,0.5,0.7,1])){
  await p.evaluate(pr=>{const f=[...document.querySelectorAll('figure')].find(x=>x.querySelector('.tok')).parentElement.parentElement;const top=f.getBoundingClientRect().top+scrollY;window.scrollTo(0,top+Math.min(pr,1)*(f.offsetHeight-innerHeight)-(pr>1?0:0));},pr);
  await p.waitForTimeout(900);
  await p.screenshot({path:`lab/ai-${tag}-${pr}.png`});
}
const ov=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
console.log(JSON.stringify({errs,ov})); await b.close();})();