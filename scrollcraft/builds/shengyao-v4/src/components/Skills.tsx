import type { PointerEvent } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, BadgeCheck, BrainCircuit, BriefcaseBusiness, ChartColumnBig, CodeXml, Languages } from "lucide-react";
import { CERTS, media } from "../data";
import { useReducedMotion } from "../lib/hooks";
import { useI18n } from "../i18n";

const EASE = [0.22, 1, 0.36, 1] as const;
const ICONS = [ChartColumnBig, BrainCircuit, BriefcaseBusiness, CodeXml, Languages];

// Cursor spotlight: the card's ::before glow follows the pointer.
const spot = (e: PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--sx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--sy", `${e.clientY - r.top}px`);
};

/* Certificates & skills: its own section under the career timeline.
   PL-300 leads with an animated border; the other certificates tilt in;
   skill cards light up under the cursor and their chips pop in one by one. */
export default function Skills() {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const T = t.journey;
  const tilt = (i: number) => ({
    initial: reduce ? { opacity: 1 } : { opacity: 0, y: 34, rotateX: 14 },
    whileInView: { opacity: 1, y: 0, rotateX: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.8, delay: i * 0.1, ease: EASE },
  });
  const [main, ...rest] = CERTS;

  return (
    <section id="skills" className="relative overflow-hidden bg-bone-2 py-24 md:py-32">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-msblue)_14%,transparent),transparent_65%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-12">
        <motion.p className="label text-msblue" {...tilt(0)}>{T.secLabel}</motion.p>
        <motion.h2 className="display mt-4 text-4xl sm:text-6xl" {...tilt(1)}>{T.secH2}</motion.h2>
        <motion.p className="mt-4 max-w-md text-lg text-ink-soft" {...tilt(2)}>{T.secIntro}</motion.p>

        {/* certificates */}
        <h3 className="label mt-14 text-ink-soft">{T.certsTitle}</h3>
        <div className="mt-5 grid gap-3 [perspective:1200px] lg:grid-cols-[1.15fr_1fr]">
          <motion.a
            href={"href" in main ? main.href : undefined}
            target="_blank"
            rel="noopener"
            onPointerMove={spot}
            {...tilt(0)}
            className="spot ring-border group flex flex-col justify-between gap-8 overflow-hidden rounded-3xl border border-msblue/25 bg-bone p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <motion.img
                src={media(main.logo)}
                alt=""
                width={120}
                height={120}
                className="h-24 w-24 drop-shadow-[0_12px_22px_rgba(0,60,130,.25)] sm:h-28 sm:w-28"
                initial={reduce ? false : { scale: 0.6, rotate: -14, opacity: 0 }}
                whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ type: "spring", stiffness: 180, damping: 14, delay: 0.25 }}
              />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0078d4] px-4 py-2 text-sm font-semibold text-white transition-transform duration-200 group-hover:scale-105">
                {T.verify} <ArrowUpRight size={15} aria-hidden="true" />
              </span>
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-msblue">
                <BadgeCheck size={17} aria-hidden="true" /> {T.certs[main.key].by} · {main.year}
              </p>
              <p className="display mt-2 text-3xl sm:text-4xl">{T.certs[main.key].name}</p>
            </div>
          </motion.a>

          <ul className="grid gap-3">
            {rest.map((c, i) => (
              <motion.li key={c.key} onPointerMove={spot} {...tilt(i + 1)} className="spot group flex items-center gap-4 rounded-2xl border border-ink/10 bg-bone p-4 transition-transform duration-300 hover:-translate-y-1 sm:p-5">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-ink/10 bg-white p-2 transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-110">
                  <img src={media(c.logo)} alt="" width={40} height={40} className="h-10 w-10 object-contain" />
                </span>
                <span className="min-w-0">
                  <span className="block font-bold leading-snug">{T.certs[c.key].name}</span>
                  <span className="mt-1 block text-sm text-ink-soft">{T.certs[c.key].by} · {c.year}</span>
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* skills */}
        <h3 className="label mt-16 text-ink-soft">{T.skillsTitle}</h3>
        <div className="mt-5 grid gap-3 [perspective:1200px] sm:grid-cols-2 lg:grid-cols-3">
          {T.skills.map((g, i) => {
            const Icon = ICONS[i];
            const lead = i === 0;
            return (
              <motion.div
                key={g.group}
                onPointerMove={spot}
                {...tilt(i)}
                className={`spot group overflow-hidden rounded-3xl border p-6 ${lead ? "ring-border border-msblue/25 bg-bone sm:col-span-2" : "border-ink/10 bg-bone"}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-xl font-bold">{g.group}</h4>
                  <span className={`grid h-11 w-11 place-items-center rounded-xl transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-110 ${lead ? "bg-msblue text-white" : "bg-accent/10 text-accent"}`}>
                    <Icon size={22} aria-hidden="true" />
                  </span>
                </div>
                <p className="display latin mt-1 text-5xl text-ink/10 transition-colors duration-500 group-hover:text-accent/25" aria-hidden="true">
                  {String(g.items.length).padStart(2, "0")}
                </p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {g.items.map((s, j) => (
                    <motion.li
                      key={s}
                      initial={reduce ? false : { opacity: 0, y: 12, scale: 0.8 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.25 + i * 0.08 + j * 0.06 }}
                      className={`cursor-default rounded-full border px-3.5 py-1.5 text-sm font-medium transition-[transform,background-color,color,border-color] duration-200 hover:-translate-y-0.5 ${
                        lead && j === 0 ? "border-msblue bg-msblue text-white" : "border-ink/15 bg-bone-2 hover:border-accent hover:text-accent"
                      }`}
                    >
                      {s}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
