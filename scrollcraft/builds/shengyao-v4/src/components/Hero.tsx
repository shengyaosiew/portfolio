import { useEffect, useRef } from "react";
import { BadgeCheck } from "lucide-react";
import { CREDENTIAL, CV, EMAIL, media } from "../data";
import { useMedia, useReducedMotion } from "../lib/hooks";
import { useI18n } from "../i18n";
import { CanvasText } from "./ui/canvas-text";
import { Term } from "./ui/tooltip-card";

/* Cover, brought back from v3: dot field (far), big name (mid), cut-out
   portrait (subject), PL-300 seal (near), copy (front). The layers drift a
   little with the pointer and the name lifts away as you scroll. */
export default function Hero() {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const H = t.hero;
  const fine = useMedia("(hover: hover) and (pointer: fine)");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduce) return;
    const sec = sectionRef.current!;
    let tx = 0, ty = 0, cx = 0, cy = 0, p = -1, raf = 0;
    const onMove = (e: PointerEvent) => {
      const r = sec.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
    };
    const onLeave = () => { tx = 0; ty = 0; };
    const tick = () => {
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      const np = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      if (np < 1 || p < 1) {
        sec.style.setProperty("--mx", cx.toFixed(4));
        sec.style.setProperty("--my", cy.toFixed(4));
        sec.style.setProperty("--p", np.toFixed(4));
      }
      p = np;
      raf = requestAnimationFrame(tick);
    };
    if (fine) { sec.addEventListener("pointermove", onMove); sec.addEventListener("pointerleave", onLeave); }
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); sec.removeEventListener("pointermove", onMove); sec.removeEventListener("pointerleave", onLeave); };
  }, [reduce, fine]);

  let k = 0;
  const words = H.bigName.split(" ");

  return (
    <section id="top" ref={sectionRef} className="hero relative isolate h-[100dvh] min-h-[600px] overflow-hidden bg-bone">
      {/* 1 dot field */}
      <div className="hero-dots pointer-events-none absolute inset-0 top-16 opacity-[0.16]" aria-hidden="true" />

      {/* 2 big name */}
      <p className="hero-name pointer-events-none absolute left-1/2 z-10 m-0 whitespace-nowrap text-accent" aria-hidden="true">
        {words.map((w, wi) => (
          <span key={wi} className="inline-block overflow-hidden pb-[0.04em] align-bottom">
            {[...w].map((ch) => {
              const d = 0.1 + k++ * 0.035;
              return <span key={k} className="name-letter" style={{ animationDelay: `${d}s` }}>{ch}</span>;
            })}
            {wi < words.length - 1 && <span className="inline-block w-[0.22em]" />}
          </span>
        ))}
      </p>

      {/* 3 portrait + 4 seal */}
      <div className="hero-subject absolute z-20">
        <img
          src={media("perfil.webp")}
          alt={H.portrait}
          width={500}
          height={500}
          fetchPriority="high"
          className="portrait-in photo-dim h-full w-full object-contain [mask-image:linear-gradient(to_bottom,#000_72%,transparent)] lg:[mask-image:none] drop-shadow-[0_18px_30px_rgba(40,32,24,.2)]"
        />
        <a
          href={CREDENTIAL}
          target="_blank"
          rel="noopener"
          className="hero-seal seal-in absolute grid aspect-square place-items-center rounded-full bg-[#121316] text-center text-[#F4F2ED] shadow-[0_2px_4px_rgba(20,16,12,.2),0_18px_40px_-10px_rgba(20,16,12,.45)]"
          aria-label={`PL-300 ${H.seal}. ${H.badgeSr}`}
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#F4F2ED" strokeOpacity="0.22" strokeWidth="1" />
            <g className="seal-spin">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#FF6B4E" strokeWidth="2.4" strokeDasharray="70 30" pathLength={100} strokeLinecap="round" />
            </g>
          </svg>
          <span className="relative grid justify-items-center gap-0.5">
            <img src={media("microsoft.png")} alt="" width={22} height={22} className="h-[18px] w-[18px] rounded-[3px] bg-white p-[2px] sm:h-[22px] sm:w-[22px]" />
            <b className="latin text-[1.15rem] font-extrabold leading-none tracking-tight [font-stretch:75%] sm:text-[1.6rem] lg:text-[2rem]">PL-300</b>
            <span className="text-[0.55rem] font-semibold uppercase tracking-[0.08em] text-[#C9CBD0] sm:text-[0.62rem]">{H.seal}</span>
          </span>
        </a>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[30svh] bg-gradient-to-t from-bone via-bone/80 to-transparent lg:h-[16svh] lg:via-transparent" />

      {/* 5 copy */}
      <div className="hero-copy absolute bottom-8 left-5 z-40 max-w-[330px] sm:bottom-12 sm:left-8 sm:max-w-md lg:bottom-16 lg:max-w-lg">
        <a
          href={CREDENTIAL}
          target="_blank"
          rel="noopener"
          className="hero-rise mb-5 inline-flex items-center gap-2.5 rounded-full border border-black/10 bg-white/80 py-1.5 pl-1.5 pr-4 text-[11px] font-semibold text-[#121316] backdrop-blur sm:text-xs"
          style={{ animationDelay: "0.15s" }}
        >
          <img src={media("ms-associate-badge.svg")} alt="" width="26" height="26" className="h-[26px] w-[26px]" />
          <span>
            {H.badgePre}<span className="text-[#0078d4]">{H.badgeMid}</span>{H.badgePost}
          </span>
          <BadgeCheck size={15} className="text-[#0078d4]" aria-hidden="true" />
          <span className="sr-only">{H.badgeSr}</span>
        </a>
        <h1 className="display hero-rise text-[2.6rem] text-ink sm:text-6xl md:text-7xl lg:[@media(max-height:800px)]:text-6xl" style={{ animationDelay: "0.3s" }}>
          {H.l1}
          <br />
          {H.l2}
          <br />
          {H.l3pre}
          <CanvasText text={H.accent} />
          {H.l3post}
        </h1>
        <p className="hero-rise mt-5 max-w-[34ch] text-[15px] leading-relaxed text-ink-soft sm:text-base" style={{ animationDelay: "0.5s" }}>
          {H.subPre}
          <Term tip={H.powerbiTip} title="Power BI">{H.subTerm}</Term>
          {H.subPost}
        </p>
        <div className="hero-rise mt-7 flex flex-wrap gap-3" style={{ animationDelay: "0.7s" }}>
          <a
            href={`mailto:${EMAIL}`}
            className="shine rounded-full bg-ink px-7 py-3 text-sm font-semibold text-bone shadow-lg shadow-black/20 transition-transform duration-200 hover:scale-[1.04] active:scale-95 sm:px-8 sm:py-3.5"
          >
            {H.email}
          </a>
          <a href={CV} download className="rounded-full border border-ink/25 bg-bone/60 px-7 py-3 text-sm font-semibold text-ink backdrop-blur transition-colors duration-150 hover:border-accent hover:text-accent sm:py-3.5">
            {H.cv}
          </a>
        </div>
      </div>
    </section>
  );
}
