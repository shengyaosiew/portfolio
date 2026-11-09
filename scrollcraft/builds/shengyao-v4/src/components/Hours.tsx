import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import { clamp01, easeOut, useReducedMotion } from "../lib/hooks";
import { useI18n } from "../i18n";

function CountUp({ to, ms = 1400 }: { to: number; ms?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) { if (reduce) setV(to); return; }
    let raf = 0; const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to, ms]);
  return <span ref={ref} className="tabular-nums">{v.toLocaleString("en-US")}</span>;
}
export { CountUp };

/* Scroll-driven: the 750 counts up and the 94 day squares fill as the
   section moves up the screen, so it plays while the visitor is looking. */
export default function Hours() {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const T = t.hours;
  const days = Array.from({ length: 95 }, (_, i) => i);
  const secRef = useRef<HTMLElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sec = secRef.current!, num = numRef.current!, grid = gridRef.current!;
    const cells = [...grid.querySelectorAll<HTMLElement>("[data-day]")];
    let raf = 0, live = false, lastN = -1, lastLit = -1;
    const draw = (p: number) => {
      const n = Math.round(750 * easeOut(clamp01(p / 0.85)));
      if (n !== lastN) { num.textContent = n.toLocaleString("en-US"); lastN = n; }
      const lit = Math.round(94 * clamp01((p - 0.08) / 0.82));
      if (lit !== lastLit) { cells.forEach((c, i) => (c.dataset.on = i < lit ? "1" : "0")); lastLit = lit; }
    };
    if (reduce) { draw(1); return; }
    const tick = () => {
      if (!live) return;
      const r = sec.getBoundingClientRect();
      draw(clamp01((innerHeight * 0.9 - r.top) / (innerHeight * 0.65)));
      raf = requestAnimationFrame(tick);
    };
    draw(0);
    const io = new IntersectionObserver((es) => es.forEach((e) => { const was = live; live = e.isIntersecting; if (live && !was) raf = requestAnimationFrame(tick); }));
    io.observe(sec);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [reduce]);

  return (
    <section ref={secRef} className="bg-bone py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-[5fr_7fr] md:gap-20 md:px-12">
        <div>
          <p className="display latin flex items-baseline gap-3 text-[5.5rem] leading-none sm:text-[8rem] md:text-[10rem]">
            <span ref={numRef} className="tabular-nums" aria-hidden="true">0</span>
            <span className="sr-only">750</span>
            <span className="text-xl font-semibold tracking-tight text-ink-soft sm:text-2xl">{T.unit}</span>
          </p>
          <h2 className="display mt-6 text-3xl sm:text-4xl">{T.h2}</h2>
          <p className="mt-4 text-lg text-ink-soft">{T.p}</p>
        </div>
        <figure>
          <p className="mb-4 font-semibold">{T.gridTitle}</p>
          <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
            <div className="grid grid-rows-5 gap-[3px] text-[11px] text-ink-soft sm:gap-[5px]" aria-hidden="true">
              {T.days.map((d) => <span key={d} className="flex items-center">{d}</span>)}
            </div>
            <div ref={gridRef} className="grid grid-flow-col grid-rows-5 gap-[3px] [grid-auto-columns:minmax(0,1fr)] sm:gap-[5px]" role="img" aria-label={T.aria}>
              {days.map((i) =>
                i < 94 ? (
                  <span key={i} data-day data-on="0" className="day-cell aspect-square rounded-[2px] bg-accent" />
                ) : (
                  <span key={i} className="aspect-square rounded-[2px] outline outline-1 -outline-offset-1 outline-dashed outline-ink/30" title={T.spare} />
                )
              )}
            </div>
          </div>
          <figcaption className="mt-5 border-t border-ink/10 pt-3 text-sm text-ink-soft">
            <b className="text-ink">{T.capB}</b>{T.capRest}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
