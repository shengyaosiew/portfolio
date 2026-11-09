import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, MessageSquareText, ShoppingBag } from "lucide-react";
import { PROJECTS, media, type Project } from "../data";
import { useI18n } from "../i18n";
import { CardBody, CardContainer, CardItem } from "./ui/3d-card";
import { FollowerPointerCard } from "./ui/following-pointer";
import { CanvasText } from "./ui/canvas-text";

const host = (u?: string) => (u ? new URL(u).hostname.replace(/^www\./, "") : "");

function Shot({ p, name }: { p: Project; name: string }) {
  if (!p.img) {
    const Icon = p.slug === "chatbot" ? MessageSquareText : ShoppingBag;
    return (
      <div className="grid aspect-[16/10] w-full place-items-center rounded-xl bg-[radial-gradient(circle_at_30%_20%,var(--color-bone-2),var(--color-surface))] ring-1 ring-ink/10">
        <div className="text-center">
          <Icon size={56} strokeWidth={1.4} className="mx-auto text-accent" aria-hidden="true" />
          <p className="display mt-4 text-3xl text-ink">{name}</p>
        </div>
      </div>
    );
  }
  if (p.shape === "photo") {
    return (
      <div className="w-full overflow-hidden rounded-xl bg-white shadow-[0_2px_6px_rgba(20,15,10,.1),0_30px_60px_-24px_rgba(20,15,10,.45)] ring-1 ring-black/10">
        <img src={media(p.img)} alt={`${name}: preview`} loading="lazy" draggable={false} className="aspect-[16/10] w-full object-cover" />
      </div>
    );
  }
  if (p.shape === "phone") {
    return (
      <div className="grid aspect-[16/10] w-full place-items-center overflow-hidden rounded-xl bg-[linear-gradient(135deg,#2b1d3d,#191428_55%,#d99a56)] ring-1 ring-ink/10">
        <div className="h-[88%] overflow-hidden rounded-[1.6rem] border-[6px] border-[#0b0b0d] bg-black shadow-2xl">
          <img src={media(p.img)} alt={`${name}: screenshot`} loading="lazy" draggable={false} className="h-full w-auto object-cover" />
        </div>
      </div>
    );
  }
  return (
    <div className="w-full overflow-hidden rounded-xl bg-white shadow-[0_2px_6px_rgba(20,15,10,.1),0_30px_60px_-24px_rgba(20,15,10,.45)] ring-1 ring-black/10">
      <div className="flex items-center gap-1.5 border-b border-black/10 bg-[#f1f0ed] px-3 py-2" aria-hidden="true">
        <i className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <i className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <i className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 truncate rounded-md bg-white px-2.5 py-0.5 font-mono text-[10px] text-gray-500">{host(p.href)}</span>
      </div>
      <img src={media(p.img)} alt={`${name}: screenshot of the live site`} loading="lazy" draggable={false} className="aspect-[16/10] w-full object-cover object-top" />
    </div>
  );
}

export default function Projects() {
  const { t } = useI18n();
  const T = t.projects;
  const track = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const [prog, setProg] = useState(0);
  const drag = useRef({ on: false, x: 0, left: 0, moved: 0 });

  const step = () => {
    const el = track.current!;
    const first = el.children[0] as HTMLElement | undefined;
    const second = el.children[1] as HTMLElement | undefined;
    return first && second ? second.offsetLeft - first.offsetLeft : el.clientWidth;
  };
  const go = (i: number) => {
    const el = track.current!;
    const n = Math.max(0, Math.min(PROJECTS.length - 1, i));
    el.scrollTo({ left: n * step(), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  useEffect(() => {
    const el = track.current!;
    const on = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProg(max > 0 ? el.scrollLeft / max : 0);
      // the last card can't reach the left edge, so the end of the track counts as "last"
      setIdx(max > 0 && el.scrollLeft >= max - 4 ? PROJECTS.length - 1 : Math.round(el.scrollLeft / step()));
    };
    on();
    el.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { el.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);

  // Mouse drag to scroll (touch already scrolls natively).
  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = track.current!;
    drag.current = { on: true, x: e.clientX, left: el.scrollLeft, moved: 0 };
    el.style.scrollSnapType = "none";
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d.on) return;
    const dx = e.clientX - d.x;
    d.moved = Math.max(d.moved, Math.abs(dx));
    track.current!.scrollLeft = d.left - dx;
  };
  const onUp = () => {
    const d = drag.current;
    if (!d.on) return;
    d.on = false;
    const el = track.current!;
    const target = Math.round(el.scrollLeft / step());
    el.style.scrollSnapType = "";
    go(target);
  };
  // A drag should not count as a click on the card link.
  const onClickCapture = (e: React.MouseEvent) => {
    if (drag.current.moved > 6) { e.preventDefault(); e.stopPropagation(); drag.current.moved = 0; }
  };

  const pad = "pl-5 md:pl-12 xl:pl-[calc((100vw-80rem)/2+3rem)]";

  return (
    <section id="projects" className="overflow-hidden bg-bone py-24 md:py-32">
      <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-5 md:px-12">
        <div>
          <h2 className="display text-4xl sm:text-6xl">
            {T.h2pre}
            <CanvasText text={T.h2accent} />
          </h2>
          <p className="mt-4 max-w-md text-lg text-ink-soft">{T.intro}</p>
        </div>
        <div className="flex items-center gap-4">
          <p className="font-mono text-sm tabular-nums text-ink-soft" aria-live="polite">
            <b className="text-ink">{String(idx + 1).padStart(2, "0")}</b> / {String(PROJECTS.length).padStart(2, "0")}
          </p>
          <button type="button" onClick={() => go(idx - 1)} disabled={idx === 0} aria-label={T.prev} className="grid h-12 w-12 place-items-center rounded-full border border-ink/20 transition-colors duration-150 hover:border-accent hover:text-accent disabled:opacity-30 disabled:hover:border-ink/20 disabled:hover:text-current">
            <ArrowLeft size={20} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => go(idx + 1)} disabled={idx >= PROJECTS.length - 1} aria-label={T.next} className="grid h-12 w-12 place-items-center rounded-full bg-ink text-bone transition-transform duration-150 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100">
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref={track}
        role="region"
        aria-label={T.rail}
        tabIndex={0}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onClickCapture={onClickCapture}
        onKeyDown={(e) => { if (e.key === "ArrowRight") { e.preventDefault(); go(idx + 1); } if (e.key === "ArrowLeft") { e.preventDefault(); go(idx - 1); } }}
        className={`mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 pr-5 [scrollbar-width:none] md:gap-8 md:pr-12 [&::-webkit-scrollbar]:hidden ${pad} scroll-pl-5 md:scroll-pl-12 xl:scroll-pl-[calc((100vw-80rem)/2+3rem)] cursor-grab active:cursor-grabbing outline-none focus-visible:ring-2 focus-visible:ring-accent/60`}
      >
        {PROJECTS.map((p, i) => {
          const it = T.items[p.slug];
          const visual = (
            <CardContainer containerClassName="w-full" className="w-full">
              <CardBody className="relative w-full">
                <CardItem translateZ={50} className="w-full">
                  <Shot p={p} name={it.name} />
                </CardItem>
                <CardItem translateZ={90} translateY={-6} className="absolute bottom-4 left-4">
                  <span className="rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur">{it.tags}</span>
                </CardItem>
              </CardBody>
            </CardContainer>
          );
          return (
            <article
              key={p.slug}
              className={`grid w-[86vw] shrink-0 snap-start items-center gap-6 rounded-[1.75rem] border border-ink/10 bg-bone-2 p-4 transition-opacity duration-500 sm:p-6 md:w-[min(1060px,78vw)] md:grid-cols-[1.5fr_1fr] md:gap-10 md:p-8 ${i === idx ? "opacity-100" : "opacity-60"}`}
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${PROJECTS.length}: ${it.name}`}
            >
              {p.href ? (
                <FollowerPointerCard title={<span className="inline-flex items-center gap-1">{it.go} {it.name} <ArrowUpRight size={12} /></span>}>
                  <a href={p.href} target="_blank" rel="noopener" draggable={false} aria-label={`${it.go}: ${it.name}`} className="block rounded-xl">
                    {visual}
                  </a>
                </FollowerPointerCard>
              ) : (
                visual
              )}

              <div className="flex h-full flex-col justify-center select-none md:select-auto">
                <p className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="display mt-3 text-4xl md:text-5xl">{it.name}</h3>
                <p className="label mt-3 text-ink-soft">{it.tags}</p>
                <p className="mt-5 max-w-[36ch] text-lg leading-relaxed text-ink-soft">{it.desc}</p>
                {p.note && <p className="mt-4 max-w-[38ch] border-l-2 border-accent/60 pl-3 text-sm text-ink-soft">{T[p.note]}</p>}
                {p.href && (
                  <a href={p.href} target="_blank" rel="noopener" draggable={false} className="group mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-bone transition-transform duration-150 hover:scale-[1.04] active:scale-95">
                    {it.go} <ArrowUpRight size={16} className="transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mx-auto mt-4 max-w-7xl px-5 md:px-12" aria-hidden="true">
        <div className="h-[3px] overflow-hidden rounded-full bg-ink/10">
          <div className="h-full origin-left rounded-full bg-accent transition-transform duration-150" style={{ transform: `scaleX(${Math.max(1 / PROJECTS.length, prog)})` }} />
        </div>
      </div>
    </section>
  );
}
