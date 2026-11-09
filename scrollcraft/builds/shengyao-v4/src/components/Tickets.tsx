import { useEffect, useRef } from "react";
import { clamp01, easeOut, stickyProgress, useReducedMotion } from "../lib/hooks";
import { useI18n } from "../i18n";
import { Term } from "./ui/tooltip-card";

/* 580 dots = 58,000 tickets (1 dot ≈ 100). Scroll runs an NLP "scan";
   the 34 automatable dots (5.93%) light up and move into a tray. */
const N = 580, FLAG = 34, ACC = "#FF6B4E";

function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
type Dot = { jx: number; jy: number; flag: boolean; c: number; r: number; x: number; y: number; tx: number; ty: number; rank: number };

export default function Tickets() {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const T = t.tickets;
  const secRef = useRef<HTMLElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const cueRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const sec = secRef.current!, field = fieldRef.current!, cv = cvRef.current!, tray = trayRef.current!;
    const ctx = cv.getContext("2d")!;
    const rand = rng(58000);
    const dots: Dot[] = Array.from({ length: N }, () => ({ jx: (rand() - 0.5) * 0.55, jy: (rand() - 0.5) * 0.55, flag: false, c: 0, r: 0, x: 0, y: 0, tx: 0, ty: 0, rank: 0 }));
    const order = dots.map((_, k) => k);
    for (let s = order.length - 1; s > 0; s--) { const r = Math.floor(rand() * (s + 1)); [order[s], order[r]] = [order[r], order[s]]; }
    order.slice(0, FLAG).forEach((k) => (dots[k].flag = true));

    let W = 0, H = 0, cols = 29, rows = 20, cell = 10, fx = 0, fy = 0, last = -1, raf = 0, live = false;

    const layout = () => {
      const r = field.getBoundingClientRect(); W = r.width; H = r.height; if (!W || !H) return;
      const dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      let tcols: number, tcell: number, tx0: number, ty0: number;
      if (W >= 560) {
        cols = 29; rows = 20; cell = Math.min((W * 0.72) / cols, (H * 0.9) / rows); fx = 0; fy = (H - cell * rows) / 2;
        tcols = 5; tcell = cell * 1.3; tx0 = fx + cols * cell + Math.max(cell * 3, W * 0.06); ty0 = fy + cell * rows - tcell * Math.ceil(FLAG / tcols);
        tray.style.left = tx0 + "px"; tray.style.top = Math.max(0, ty0 - 96) + "px"; tray.style.maxWidth = Math.max(96, W - tx0 - 4) + "px";
      } else {
        cols = 20; rows = 29; tcols = 12; cell = Math.min(W / cols, (H * 0.82) / (rows + 4.5)); fx = (W - cols * cell) / 2; fy = 0;
        tcell = cell * 1.25; tx0 = fx; ty0 = fy + rows * cell + cell * 1.4;
        tray.style.left = fx + tcols * tcell + cell + "px"; tray.style.top = ty0 - 4 + "px"; tray.style.maxWidth = Math.max(96, W - (fx + tcols * tcell + cell) - 4) + "px";
      }
      const ranked: Dot[] = [];
      dots.forEach((d, k) => { d.c = k % cols; d.r = Math.floor(k / cols); d.x = fx + (d.c + 0.5 + d.jx) * cell; d.y = fy + (d.r + 0.5 + d.jy) * cell; if (d.flag) ranked.push(d); });
      ranked.sort((a, b) => a.c - b.c || a.r - b.r);
      ranked.forEach((d, k) => { d.rank = k; d.tx = tx0 + ((k % tcols) + 0.5) * tcell; d.ty = ty0 + (Math.floor(k / tcols) + 0.5) * tcell; });
      last = -1;
    };

    const draw = (p: number) => {
      const rad = Math.max(1.4, cell * 0.2);
      const scan = clamp01((p - 0.12) / 0.36), mig = clamp01((p - 0.5) / 0.3);
      ctx.clearRect(0, 0, W, H);
      const scanX = fx + scan * cols * cell;
      if (scan > 0 && scan < 1) {
        const g = ctx.createLinearGradient(scanX - cell * 6, 0, scanX, 0);
        g.addColorStop(0, "rgba(255,107,78,0)"); g.addColorStop(1, "rgba(255,107,78,0.14)");
        ctx.fillStyle = g; ctx.fillRect(scanX - cell * 6, fy - cell * 0.5, cell * 6, rows * cell + cell);
      }
      for (const d of dots) {
        const xn = (d.c + 0.5) / cols, passed = scan >= xn;
        if (d.flag && passed) {
          const t = easeOut(clamp01(mig * 1.6 - (d.rank / FLAG) * 0.6));
          if (t > 0.02) { ctx.beginPath(); ctx.arc(d.x, d.y, rad * 1.05, 0, Math.PI * 2); ctx.strokeStyle = `rgba(255,107,78,${(0.55 * t).toFixed(3)})`; ctx.lineWidth = 1.1; ctx.stroke(); }
          ctx.beginPath(); ctx.arc(d.x + (d.tx - d.x) * t, d.y + (d.ty - d.y) * t, rad * (1.25 + 0.2 * t), 0, Math.PI * 2); ctx.fillStyle = ACC; ctx.fill();
        } else {
          const near = scan > 0 && scan < 1 && Math.abs(xn - scan) < 1.5 / cols;
          ctx.beginPath(); ctx.arc(d.x, d.y, rad, 0, Math.PI * 2);
          ctx.fillStyle = near ? "rgba(238,236,230,0.95)" : passed ? "rgba(163,168,177,0.34)" : "rgba(163,168,177,0.72)"; ctx.fill();
        }
      }
      if (scan > 0 && scan < 1) { ctx.fillStyle = ACC; ctx.fillRect(scanX - 1, fy - cell * 0.8, 2, rows * cell + cell * 1.6); }
      tray.style.opacity = clamp01((mig - 0.55) / 0.35).toFixed(3);

      // copy cues: three lines crossfade, the last one holds
      // back-to-back windows: each cue is fully gone before the next starts
      const windows: [number, number][] = [[0, 0.3], [0.3, 0.58], [0.58, 1.01]];
      cueRefs.current.forEach((el, i) => {
        if (!el) return;
        const [a, b] = windows[i];
        const inA = i === 0 ? 1 : clamp01((p - a) / 0.06), outB = i === 2 ? 1 : 1 - clamp01((p - (b - 0.06)) / 0.06);
        const o = reduce ? (i === 2 ? 1 : 0) : Math.min(inA, outB);
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translateY(${((1 - o) * 14).toFixed(1)}px)`;
        el.style.pointerEvents = o > 0.5 ? "auto" : "none"; // hidden cues must not block the tooltip
      });
      if (pctRef.current) pctRef.current.textContent = (5.93 * easeOut(clamp01((p - 0.56) / 0.24))).toFixed(2);
    };

    const tick = () => {
      if (!live) return;
      const p = reduce ? 1 : stickyProgress(sec);
      if (Math.abs(p - last) > 0.0004) { draw(p); last = p; }
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver((es) => es.forEach((e) => { const was = live; live = e.isIntersecting; if (live && !was) { last = -1; raf = requestAnimationFrame(tick); } }), { rootMargin: "20% 0px" });
    io.observe(sec);
    const ro = new ResizeObserver(() => { layout(); draw(reduce ? 1 : stickyProgress(sec)); });
    ro.observe(field);
    layout(); draw(reduce ? 1 : stickyProgress(sec));
    return () => { io.disconnect(); ro.disconnect(); cancelAnimationFrame(raf); };
  }, [reduce]);

  return (
    <section ref={secRef} id="ai-tickets" className={`relative bg-night text-night-ink ${reduce ? "" : "h-[320vh]"}`}>
      <div className="sticky top-0 mx-auto grid h-[100dvh] w-full max-w-7xl overflow-x-clip grid-rows-[auto_minmax(0,1fr)_auto] gap-3 px-5 pb-6 pt-24 md:grid-cols-[4fr_7fr] md:grid-rows-1 md:gap-12 md:px-12 md:pb-8">
        <div className="relative min-h-[9.5rem] md:min-h-0 md:self-center">
          <div ref={(el) => { cueRefs.current[0] = el; }} className="absolute inset-x-0 top-0 md:top-1/2 md:-translate-y-1/2">
            <p className="label mb-4 text-night-soft">{T.label}</p>
            <h2 className="display text-3xl sm:text-5xl">{T.c1}</h2>
          </div>
          <div ref={(el) => { cueRefs.current[1] = el; }} className="absolute inset-x-0 top-0 opacity-0 md:top-1/2 md:-translate-y-1/2">
            <h2 className="display text-3xl sm:text-5xl">
              {T.c2Pre}
              <Term tip={T.mlTip}>
                <span className="text-accent-hot">{T.c2Term}</span>
              </Term>
              {T.c2Post}
            </h2>
          </div>
          <div ref={(el) => { cueRefs.current[2] = el; }} className="absolute inset-x-0 top-0 opacity-0 md:top-1/2 md:-translate-y-1/2">
            <h2 className="display text-3xl sm:text-5xl">
              <span className="text-accent-hot"><span ref={pctRef}>0.00</span>%</span>{T.c3Post}
            </h2>
            <p className="mt-4 hidden text-night-soft sm:block">{T.c3p}</p>
          </div>
        </div>
        <div className="flex min-h-0 flex-col">
          <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-night-soft" aria-hidden="true">
            <span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-[#6A707A]" />{T.legend[0]}</span>
            <span><i className="mr-2 inline-block h-2 w-2 rounded-full bg-accent-hot" />{T.legend[1]}</span>
            <span><i className="mr-2 inline-block h-2 w-2 rounded-full border border-accent-hot" />{T.legend[2]}</span>
          </div>
          <div ref={fieldRef} className="relative min-h-0 flex-1">
            <canvas ref={cvRef} className="absolute inset-0 h-full w-full" role="img" aria-label={T.aria} />
            <div ref={trayRef} className="pointer-events-none absolute max-w-[11rem] border-l-2 border-accent-hot pl-3 opacity-0">
              <b className="display latin block text-3xl text-accent-hot sm:text-4xl">≈3,440</b>
              <span className="mt-1 block text-[13px] leading-snug text-night-soft">{T.tray}</span>
            </div>
          </div>
          <p className="mt-3 border-t border-white/15 pt-3 text-xs text-night-soft">
            <b className="text-night-ink">{T.footB}</b>{T.footRest}
          </p>
        </div>
      </div>
    </section>
  );
}
