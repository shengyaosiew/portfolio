import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { CREDENTIAL, EXAM_SKILLS, STUDY_GUIDE, media } from "../data";
import { clamp01, easeOut, stickyProgress, useMedia, useReducedMotion } from "../lib/hooks";
import { useI18n } from "../i18n";
import { Term } from "./ui/tooltip-card";

const R = 84, GAP = 1.4;

/* Scroll-driven, like v3: the section pins and each exam skill draws its
   ring segment and lights its row in turn, so the visitor always sees it
   happen. Short or narrow screens get the same story without the pin. */
export default function PowerBI() {
  const reduce = useReducedMotion();
  const pin = useMedia("(min-width: 1024px) and (min-height: 720px)");
  const { t } = useI18n();
  const T = t.powerbi;
  const secRef = useRef<HTMLElement>(null);
  const segRefs = useRef<(SVGCircleElement | null)[]>([]);
  const rowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const starts: number[] = [];
  EXAM_SKILLS.reduce((acc, s, i) => ((starts[i] = acc), acc + s.weight), 0);

  useEffect(() => {
    const sec = secRef.current!;
    let raf = 0, live = false, last = -1;
    const draw = (p: number) => {
      let active = -1;
      EXAM_SKILLS.forEach((s, k) => {
        const a = 0.06 + k * 0.2;
        const len = Math.max(0, (s.weight - GAP) * easeOut(clamp01((p - a) / 0.15)));
        const seg = segRefs.current[k];
        if (seg) seg.style.strokeDasharray = `${len.toFixed(2)} ${(100 - len).toFixed(2)}`;
        if (p >= a) active = k;
      });
      const end = p >= 0.9;
      EXAM_SKILLS.forEach((_, j) => {
        const on = j === active && !end, done = j < active || end;
        const row = rowRefs.current[j];
        if (row) { row.dataset.state = on ? "on" : done ? "done" : "off"; }
        const seg = segRefs.current[j];
        if (seg) seg.style.stroke = on ? "var(--color-accent)" : "var(--chart-ink)";
      });
    };
    if (reduce) { draw(1); return; }
    const progress = () => {
      if (pin) return stickyProgress(sec);
      // no pin: run the story while the section crosses the screen
      const r = sec.getBoundingClientRect();
      return clamp01((innerHeight * 0.75 - r.top) / (r.height * 0.8));
    };
    const tick = () => {
      if (!live) return;
      const p = progress();
      if (Math.abs(p - last) > 0.0004) { draw(p); last = p; }
      raf = requestAnimationFrame(tick);
    };
    draw(0);
    const io = new IntersectionObserver((es) => es.forEach((e) => { const was = live; live = e.isIntersecting; if (live && !was) raf = requestAnimationFrame(tick); }), { rootMargin: "20% 0px" });
    io.observe(sec);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [reduce, pin]);

  const pinned = pin && !reduce;
  return (
    <section id="power-bi" ref={secRef} className={`relative overflow-x-clip bg-bone-2 ${pinned ? "h-[280vh]" : "py-24 md:py-32"}`}>
      <div className={pinned ? "sticky top-0 flex h-[100dvh] items-center pt-14" : ""}>
        <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 md:px-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative mx-auto aspect-square w-full max-w-[min(520px,68vh)]">
            <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" role="img" aria-label={T.ringAria}>
              <circle cx="100" cy="100" r={R} fill="none" style={{ stroke: "var(--chart-ink)" }} strokeOpacity="0.08" strokeWidth="14" />
              {EXAM_SKILLS.map((_, i) => (
                <circle
                  key={i}
                  ref={(el) => { segRefs.current[i] = el; }}
                  cx="100"
                  cy="100"
                  r={R}
                  fill="none"
                  pathLength={100}
                  strokeWidth="14"
                  strokeDasharray="0 100"
                  strokeDashoffset={-starts[i]}
                  style={{ stroke: "var(--chart-ink)", transition: "stroke 0.3s ease" }}
                />
              ))}
            </svg>
            <div className="absolute inset-0 grid place-content-center justify-items-center gap-2 text-center">
              <img src={media("ms-associate-badge.svg")} alt={T.badgeAlt} className="h-auto w-[34%] min-w-[96px] drop-shadow-[0_10px_18px_rgba(0,40,90,.18)]" />
              <p className="display latin mt-1 text-3xl sm:text-4xl">PL-300</p>
              <p className="text-sm font-semibold text-ink-soft">{T.pass}</p>
            </div>
          </div>

          <div>
            <p className="label text-msblue">{T.label}</p>
            <h2 className="display mt-4 text-4xl sm:text-5xl lg:text-[3.4rem]">
              {T.h2a}
              <span className="text-msblue">{T.h2b}</span>
            </h2>
            <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-ink-soft">
              {T.pPre}
              <Term tip={T.pl300Tip} title="PL-300">
                <b className="font-semibold text-ink">{T.pTerm}</b>
              </Term>
              {T.pPost}
            </p>

            <ol className="mt-7 border-t border-ink/25">
              {EXAM_SKILLS.map((s, i) => (
                <li
                  key={i}
                  ref={(el) => { rowRefs.current[i] = el; }}
                  data-state={reduce ? "done" : "off"}
                  className="skill-row relative grid grid-cols-[4.6rem_1fr] gap-4 border-b border-ink/10 py-3.5"
                >
                  <span className="skill-pct display latin whitespace-nowrap text-lg">{s.pct}</span>
                  <div>
                    <h3 className="text-lg font-bold leading-tight sm:text-xl">{T.skills[i].skill}</h3>
                    <p className="mt-1 text-[15px] text-ink-soft">
                      <b className="font-semibold text-ink">{T.atWork}</b> {T.skills[i].work}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a href={CREDENTIAL} target="_blank" rel="noopener" className="inline-flex items-center gap-2 rounded-full bg-[#0078d4] px-6 py-3 text-sm font-semibold text-white transition-transform duration-150 hover:scale-[1.03] active:scale-95">
                {T.verify} <ArrowUpRight size={16} aria-hidden="true" />
              </a>
              <a href={STUDY_GUIDE} target="_blank" rel="noopener" className="text-sm text-ink-soft underline decoration-ink/30 underline-offset-4 hover:text-ink">
                {T.guide}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
