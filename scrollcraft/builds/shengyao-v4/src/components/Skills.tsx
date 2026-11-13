import { useLayoutEffect, useRef, type PointerEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDownRight, ArrowUpRight, BadgeCheck, BrainCircuit, BriefcaseBusiness, ChartColumnBig, CodeXml, Languages } from "lucide-react";
import { CERTS, media } from "../data";
import { useReducedMotion } from "../lib/hooks";
import { useI18n } from "../i18n";

gsap.registerPlugin(ScrollTrigger);
const ICONS = [ChartColumnBig, BrainCircuit, BriefcaseBusiness, CodeXml, Languages];

export default function Skills() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useI18n();
  const T = t.journey;
  const [main, ...rest] = CERTS;
  const tiltControls = useRef(new Map<HTMLElement, { x: ReturnType<typeof gsap.quickTo>; y: ReturnType<typeof gsap.quickTo> }>());

  useLayoutEffect(() => {
    const section = sectionRef.current!;
    const ctx = gsap.context(() => {
      if (reduce) return;
      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      gsap.from(".skills-word", {
        yPercent: 115, rotation: 5, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 88%", end: "top 32%", scrub: 0.7 },
      });
      gsap.from(".skills-intro-detail", {
        autoAlpha: 0, y: 24, stagger: 0.12, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%", toggleActions: "play none none reverse" },
      });
      gsap.fromTo(".skills-progress", { scaleX: 0 }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: section, start: "top 55%", end: "bottom 80%", scrub: 0.5 },
      });
      gsap.to(".skills-orbit", {
        y: -180, rotation: 35, ease: "none",
        scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 1.2 },
      });
      gsap.utils.toArray<HTMLElement>(".skills-chapter").forEach((label) => {
        gsap.from(label, { autoAlpha: 0, x: -20, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: label, start: "top 90%", toggleActions: "play none none reverse" } });
      });
      gsap.utils.toArray<HTMLElement>(".skills-card-shell").forEach((shell, i) => {
        const card = shell.querySelector<HTMLElement>(".skills-card")!;
        // Separate scroll transforms from the pointer tilt on the inner card.
        const reveal = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: shell, start: "top 94%", end: "top 48%", scrub: 0.65 },
        });
        reveal.from(shell, { y: desktop ? 90 : 48, rotationX: desktop ? 12 : 4, rotationZ: desktop ? (i % 2 ? 2 : -2) : 0, scale: 0.94, autoAlpha: 0, duration: 1 }, 0);
        const chips = card.querySelectorAll(".skills-chip");
        if (chips.length) reveal.from(chips, { y: 20, autoAlpha: 0, scale: 0.9, stagger: 0.07, duration: 0.5 }, 0.35);
        const icon = card.querySelector(".skills-card-icon");
        if (icon) reveal.from(icon, { scale: 0.55, rotation: -25, autoAlpha: 0, duration: 0.7 }, 0.15);
        const rule = card.querySelector(".skills-card-rule");
        if (rule) reveal.from(rule, { scaleX: 0, duration: 0.8 }, 0.2);
        const sweep = card.querySelector(".skills-card-sweep");
        if (sweep) reveal.fromTo(sweep, { xPercent: -150 }, { xPercent: 350, duration: 1.1, ease: "power2.inOut" }, 0.15);
        tiltControls.current.set(card, {
          x: gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3.out" }),
          y: gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3.out" }),
        });
      });
    }, section);
    let active = true;
    void document.fonts.ready.then(() => { if (active) ScrollTrigger.refresh(); });
    const controls = tiltControls.current;
    return () => { active = false; ctx.revert(); controls.clear(); };
  }, [reduce, T]);

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const card = e.currentTarget;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--sx", `${e.clientX - r.left}px`);
    card.style.setProperty("--sy", `${e.clientY - r.top}px`);
    const tilt = tiltControls.current.get(card);
    tilt?.x((0.5 - (e.clientY - r.top) / r.height) * 6);
    tilt?.y(((e.clientX - r.left) / r.width - 0.5) * 6);
  };
  const onLeave = (e: PointerEvent<HTMLElement>) => {
    const tilt = tiltControls.current.get(e.currentTarget);
    tilt?.x(0); tilt?.y(0);
  };
  const pointer = { onPointerMove: onMove, onPointerLeave: onLeave };

  return (
    <section id="skills" ref={sectionRef} className="skills-premium relative isolate bg-bone-2 py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="skills-orbit absolute -right-48 top-40 h-[42rem] w-[42rem] rounded-full border border-msblue/10">
          <div className="absolute inset-12 rounded-full border border-msblue/10" />
          <div className="absolute inset-24 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-msblue)_12%,transparent),transparent_70%)]" />
          <span className="absolute left-20 top-20 h-3 w-3 rounded-full bg-msblue/40" />
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-12 lg:grid-cols-[0.7fr_1.6fr] lg:gap-14">
        <header className="self-start lg:sticky lg:top-32">
          <p className="skills-intro-detail label flex items-center gap-3 text-msblue"><span className="h-1.5 w-1.5 rounded-full bg-msblue" aria-hidden="true" />{T.secLabel}</p>
          <h2 className="display mt-5 text-5xl sm:text-6xl lg:text-7xl">
            {T.secH2.split(" ").map((word, i) => <span key={`${word}-${i}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom"><span className="skills-word inline-block origin-bottom-left">{word}</span>{"\u00a0"}</span>)}
          </h2>
          <p className="skills-intro-detail mt-5 max-w-[30ch] text-lg leading-relaxed text-ink-soft">{T.secIntro}</p>
          <div className="skills-intro-detail mt-9 flex items-center gap-5" aria-hidden="true">
            <div className="h-px flex-1 overflow-hidden bg-ink/15"><div className="skills-progress h-full origin-left bg-msblue" /></div>
            <ArrowDownRight size={24} strokeWidth={1.25} className="text-msblue" />
          </div>
        </header>

        <div className="min-w-0">
          <h3 className="skills-chapter label mb-6 flex items-center gap-4 text-ink-soft"><span className="text-msblue/60" aria-hidden="true">01 /</span>{T.certsTitle}<span className="h-px flex-1 bg-ink/10" aria-hidden="true" /></h3>
          <div className="grid gap-4 [perspective:1200px] xl:grid-cols-[1.1fr_1fr]">
            <div className="skills-card-shell flex min-w-0">
              <a href={"href" in main ? main.href : undefined} target="_blank" rel="noopener" {...pointer}
                className="skills-card skills-featured spot ring-border group relative flex w-full flex-col justify-between gap-10 overflow-hidden rounded-3xl border border-msblue/25 bg-bone p-6 sm:p-8">
                <span className="skills-card-sweep pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-msblue/10 to-transparent" aria-hidden="true" />
                <div className="flex items-start justify-between gap-4">
                  <img src={media(main.logo)} alt="" width={120} height={120} className="skills-card-icon h-24 w-24 drop-shadow-[0_12px_22px_rgba(0,60,130,.25)] sm:h-28 sm:w-28" />
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0078d4] px-4 py-2 text-sm font-semibold text-white">{T.verify}<ArrowUpRight size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></span>
                </div>
                <div>
                  <div className="skills-card-rule mb-5 h-px origin-left bg-msblue/25" aria-hidden="true" />
                  <p className="flex items-center gap-2 text-sm font-semibold text-msblue"><BadgeCheck size={17} aria-hidden="true" />{T.certs[main.key].by} · {main.year}</p>
                  <p className="display mt-3 text-3xl sm:text-4xl">{T.certs[main.key].name}</p>
                </div>
              </a>
            </div>
            <ul className="grid gap-4 [perspective:1200px]">
              {rest.map((c) => <li key={c.key} className="skills-card-shell min-w-0">
                <div {...pointer} className="skills-card spot group flex h-full items-center gap-4 rounded-2xl border border-ink/10 bg-bone p-5">
                  <span className="skills-card-icon grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-ink/10 bg-white p-2"><img src={media(c.logo)} alt="" width={40} height={40} className="h-10 w-10 object-contain" /></span>
                  <span className="min-w-0"><span className="block font-bold leading-snug">{T.certs[c.key].name}</span><span className="mt-2 block text-sm text-ink-soft">{T.certs[c.key].by} · {c.year}</span></span>
                </div>
              </li>)}
            </ul>
          </div>

          <h3 className="skills-chapter label mb-6 mt-16 flex items-center gap-4 text-ink-soft"><span className="text-msblue/60" aria-hidden="true">02 /</span>{T.skillsTitle}<span className="h-px flex-1 bg-ink/10" aria-hidden="true" /></h3>
          <div className="grid gap-4 [perspective:1200px] sm:grid-cols-2">
            {T.skills.map((g, i) => {
              const Icon = ICONS[i];
              const lead = i === 0;
              return <div key={g.group} className={`skills-card-shell min-w-0 ${lead ? "sm:col-span-2" : ""}`}>
                <div {...pointer} className={`skills-card spot group relative h-full overflow-hidden rounded-3xl border p-6 sm:p-7 ${lead ? "border-msblue/25 bg-bone" : "border-ink/10 bg-bone"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-xs text-ink-soft/60" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`skills-card-icon grid h-11 w-11 place-items-center rounded-xl ${lead ? "bg-msblue text-white" : "bg-accent/10 text-accent"}`}><Icon size={22} aria-hidden="true" /></span>
                  </div>
                  <h4 className="mt-5 text-xl font-bold sm:text-2xl">{g.group}</h4>
                  <div className={`skills-card-rule mt-5 h-px origin-left ${lead ? "bg-msblue/30" : "bg-ink/10"}`} aria-hidden="true" />
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {g.items.map((s, j) => <li key={s} className={`skills-chip cursor-default rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors duration-200 ${lead && j === 0 ? "border-msblue bg-msblue text-white" : "border-ink/15 bg-bone-2 hover:border-accent hover:text-accent"}`}>{s}</li>)}
                  </ul>
                </div>
              </div>;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
