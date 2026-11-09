import { useEffect, useRef } from "react";
import { Scissors } from "lucide-react";
import { clamp01, easeOut, stickyProgress, useReducedMotion } from "../lib/hooks";
import { useI18n } from "../i18n";

/* AI pipeline: 100 squares = the tokens one run used before (1 square = 1%).
   On scroll they pass a "cut" gate: 48 drop away, 52 pack into a smaller
   block, and the cost bar shrinks with them, 100 -> 52. */
const N = 100, CUT = 48;

function cutSet() {
  let s = 4852;
  const r = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return s / 0x7fffffff; };
  const idx = Array.from({ length: N }, (_, i) => i);
  for (let i = N - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  return new Set(idx.slice(0, CUT));
}
const CUTS = cutSet();
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export default function AIPipeline() {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const T = t.reach;
  const wrapRef = useRef<HTMLDivElement>(null);
  const figRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const toks = useRef<(HTMLSpanElement | null)[]>([]);
  const gateRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLDivElement>(null);
  const lblA = useRef<HTMLParagraphElement>(null);
  const lblB = useRef<HTMLParagraphElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const costRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const savedRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!, fig = figRef.current!, stage = stageRef.current!;
    type P = { k: number; cut: boolean; fx: number; fy: number; tx: number; ty: number; gx: number; gy: number; dir: number };
    let pts: P[] = [], wide = true, cell = 20, H = 0, raf = 0, live = false, last = -1, lastCount = -1;

    const layout = () => {
      const W = stage.clientWidth; if (!W) return;
      wide = W >= 640;
      // pinned: the whole panel must fit on screen, so the squares size to the space left
      const other = fig.offsetHeight - stage.offsetHeight;
      const avail = reduce ? 1e4 : innerHeight - 96 - other;
      const sz = (c: number) => toks.current.forEach((el) => { if (el) { el.style.width = el.style.height = c * 0.74 + "px"; } });
      const gate = gateRef.current!, chip = chipRef.current!, a = lblA.current!, b = lblB.current!;
      pts = [];
      let order = 0, kept = 0;
      if (wide) {
        cell = Math.max(12, Math.min((W * 0.3) / 10, 34, avail / 10.6)); H = cell * 10;
        const ax = W - cell * 10, ay = (H - cell * 6) / 2, gx = W / 2;
        for (let c = 0; c < 10; c++) for (let r = 0; r < 10; r++) {
          const i = r * 10 + c, isCut = CUTS.has(i), k = order++;
          const j = isCut ? 0 : kept++;
          pts[i] = { k, cut: isCut, fx: c * cell, fy: r * cell, tx: ax + (j % 10) * cell, ty: ay + Math.floor(j / 10) * cell, gx: gx - cell * 0.37, gy: r * cell, dir: ((i * 7) % 5) - 2 };
        }
        Object.assign(gate.style, { left: gx + "px", top: "0px", width: "0px", height: H + "px", borderLeftWidth: "2px", borderTopWidth: "0px" });
        Object.assign(chip.style, { left: gx + "px", top: -cell * 0.2 - 34 + "px" });
        Object.assign(a.style, { left: "0px", top: "-34px" });
        Object.assign(b.style, { left: "auto", right: "0px", top: ay - 34 + "px" });
      } else {
        cell = Math.max(10, Math.min(W / 10, 30, (avail - 70) / 16));
        const ox = (W - cell * 10) / 2, gy = cell * 10 + 22, ay = gy + 48; H = ay + cell * 6;
        for (let r = 0; r < 10; r++) for (let c = 0; c < 10; c++) {
          const i = r * 10 + c, isCut = CUTS.has(i), k = order++;
          const j = isCut ? 0 : kept++;
          pts[i] = { k, cut: isCut, fx: ox + c * cell, fy: r * cell, tx: ox + (j % 10) * cell, ty: ay + Math.floor(j / 10) * cell, gx: ox + c * cell, gy: gy - cell * 0.37, dir: c < 5 ? -1 : 1 };
        }
        Object.assign(gate.style, { left: ox + "px", top: gy + "px", width: cell * 10 + "px", height: "0px", borderLeftWidth: "0px", borderTopWidth: "2px" });
        Object.assign(chip.style, { left: W / 2 + "px", top: gy - 16 + "px" });
        Object.assign(a.style, { left: ox + "px", top: "-30px" });
        Object.assign(b.style, { left: ox + "px", right: "auto", top: ay - 26 + "px" });
      }
      stage.style.height = H + "px";
      sz(cell);
      last = -1;
    };

    const draw = (p: number) => {
      const flow = clamp01((p - 0.06) / 0.74);
      let gone = 0;
      for (let i = 0; i < N; i++) {
        const el = toks.current[i], d = pts[i]; if (!el || !d) continue;
        const u = clamp01((flow - (d.k / N) * 0.62) / 0.38);
        let x: number, y: number, o = 1, s = 1, st = "idle";
        if (!d.cut) {
          const e = ease(u);
          x = d.fx + (d.tx - d.fx) * e; y = d.fy + (d.ty - d.fy) * e;
          if (e > 0.5) st = "kept";
        } else if (u < 0.55) {
          const e = ease(u / 0.55);
          x = d.fx + (d.gx - d.fx) * e; y = d.fy + (d.gy - d.fy) * e;
        } else {
          const w = (u - 0.55) / 0.45; gone++; st = "cut";
          if (wide) { x = d.gx + d.dir * w * cell * 0.9; y = d.gy + w * w * cell * 5; }
          else { x = d.gx + d.dir * w * cell * 3; y = d.gy + w * w * cell * 1.2; }
          o = 1 - w; s = 1 - 0.45 * w;
        }
        el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) scale(${s.toFixed(3)})`;
        el.style.opacity = o.toFixed(3);
        if (el.dataset.s !== st) el.dataset.s = st;
      }
      const count = N - gone;
      if (count !== lastCount) {
        lastCount = count;
        countRef.current!.textContent = String(count);
        costRef.current!.textContent = String(count);
        barRef.current!.style.width = count + "%";
        savedRef.current!.style.width = 100 - count + "%";
      }
      const done = clamp01((flow - 0.9) / 0.1);
      badgeRef.current!.style.opacity = done.toFixed(3);
      badgeRef.current!.style.transform = `scale(${(0.7 + 0.3 * easeOut(done)).toFixed(3)})`;
      lblB.current!.style.opacity = clamp01((flow - 0.45) / 0.3).toFixed(3);
      chipRef.current!.dataset.on = flow > 0.02 && flow < 0.98 ? "1" : "0";
    };

    const tick = () => {
      if (!live) return;
      const p = stickyProgress(wrap);
      if (Math.abs(p - last) > 0.0005) { draw(p); last = p; }
      raf = requestAnimationFrame(tick);
    };
    const ro = new ResizeObserver(() => { layout(); draw(reduce ? 1 : last < 0 ? 0 : last); });
    ro.observe(stage);
    layout(); draw(reduce ? 1 : 0);
    if (reduce) return () => ro.disconnect();
    const io = new IntersectionObserver((es) => es.forEach((e) => { const was = live; live = e.isIntersecting; if (live && !was) { last = -1; raf = requestAnimationFrame(tick); } }));
    io.observe(wrap);
    return () => { io.disconnect(); ro.disconnect(); cancelAnimationFrame(raf); };
  }, [reduce]);

  return (
    <div ref={wrapRef} className={reduce ? "mt-20 md:mt-28" : "relative mt-12 h-[260vh] md:mt-16"}>
    <div className={reduce ? "" : "sticky top-0 flex h-[100dvh] items-center pb-4 pt-20"}>
    <figure ref={figRef} className="w-full overflow-hidden rounded-3xl bg-night p-5 text-night-ink sm:p-10 sm:[@media(max-height:760px)]:p-7">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label text-night-soft">{T.aiLabel}</p>
          <h3 className="display mt-3 text-[1.7rem] sm:text-5xl">{T.aiH}</h3>
        </div>
        <p className="max-w-[40ch] text-sm text-night-soft sm:text-base">{T.aiP}</p>
      </div>

      <div className="mt-10 sm:mt-16 sm:[@media(max-height:760px)]:mt-11">
        <div ref={stageRef} className="relative w-full" role="img" aria-label={T.aiAria}>
          <p ref={lblA} className="label absolute whitespace-nowrap text-night-soft">{T.before} · 100 {T.unit}</p>
          <p ref={lblB} className="label absolute whitespace-nowrap text-accent-hot opacity-0">{T.after} · 52 {T.unit}</p>
          <div ref={gateRef} className="absolute border-dashed border-accent-hot/60" aria-hidden="true" />
          <div ref={chipRef} data-on="0" className="cut-chip absolute z-10 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-accent-hot/50 bg-night px-3 py-1 text-xs font-semibold text-accent-hot" aria-hidden="true">
            <Scissors size={13} /> {T.gate} 48%
          </div>
          {Array.from({ length: N }, (_, i) => (
            <span key={i} ref={(el) => { toks.current[i] = el; }} data-s="idle" className="tok" aria-hidden="true" />
          ))}
        </div>
      </div>

      <div className="mt-6 grid items-end gap-4 border-t border-white/15 pt-5 sm:mt-12 sm:[@media(max-height:760px)]:mt-6 md:grid-cols-[auto_minmax(0,1fr)] md:gap-12">
        <p className="display latin flex items-baseline gap-2 text-5xl leading-none sm:text-7xl" aria-hidden="true">
          <span ref={countRef} className="tabular-nums">100</span>
          <span className="text-base font-semibold tracking-normal text-night-soft">{T.unit}</span>
        </p>
        <div>
          <div className="mb-2 flex items-center justify-between text-sm text-night-soft">
            <span>{T.cost}</span>
            <span ref={badgeRef} className="rounded-full bg-accent-hot px-3 py-1 text-sm font-bold text-white opacity-0">−48% {T.saved}</span>
          </div>
          <div className="relative h-12 overflow-hidden rounded-lg bg-white/[0.06]">
            <div ref={barRef} className="absolute inset-y-0 left-0 flex items-center justify-end rounded-lg bg-accent-hot pr-3 text-lg font-bold tabular-nums text-white transition-[width] duration-150" style={{ width: "100%" }}>
              <span ref={costRef}>100</span>
            </div>
            <div ref={savedRef} className="saved-hatch absolute inset-y-0 right-0 transition-[width] duration-150" style={{ width: "0%" }} />
          </div>
          <div className="mt-1.5 flex justify-between text-xs text-night-soft" aria-hidden="true">
            <span>0</span><span>{T.before} = 100</span>
          </div>
        </div>
      </div>
    </figure>
    </div>
    </div>
  );
}
