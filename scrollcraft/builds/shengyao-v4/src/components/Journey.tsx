import { useRef, useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Award, BriefcaseBusiness } from "lucide-react";
import { Timeline, type TimelineEntry } from "./ui/timeline";
import { CERTS, media } from "../data";
import { useReducedMotion } from "../lib/hooks";
import { useI18n } from "../i18n";

function Card({ role, org, when, points, img, alt, logo }: { role: string; org: string; when: string; points: string[]; img?: string; alt?: string; logo?: string }) {
  return (
    <div className="max-w-2xl">
      <div className="flex items-start gap-3">
        {logo && <img src={media(logo)} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-md border border-ink/10 bg-white object-contain p-1" />}
        <div>
          <p className="text-xl font-bold leading-tight sm:text-2xl">{role}</p>
          <p className="mt-1 text-ink-soft">{org} · {when}</p>
        </div>
      </div>
      <ul className="mt-5 space-y-2.5">
        {points.map((p) => (
          <li key={p} className="flex gap-3 text-[15px] leading-relaxed sm:text-base">
            <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
      {img && (
        <img src={media(img)} alt={alt ?? ""} loading="lazy" className="photo-dim mt-6 aspect-[16/9] w-full rounded-lg object-cover shadow-[0_2px_4px_rgba(30,25,20,.12),0_18px_40px_-12px_rgba(30,25,20,.3)]" />
      )}
    </div>
  );
}

// Media per entry, in the same order as t.journey.items.
const MEDIA: { logo?: string; img?: string }[] = [
  { logo: "frieslandcampina.jpg", img: "ev-director.webp" },
  { logo: "apu.jpg" },
  { img: "desk.webp" },
  { logo: "apu.jpg" },
  { img: "kedai.webp" },
  { img: "scouts.webp" },
];

type Tab = "career" | "certs";

function CertsAndSkills() {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const T = t.journey;
  const rise = (i: number) => ({
    initial: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.25 },
    transition: { duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] as const },
  });
  return (
    <div className="md:px-10"><div className="mx-auto max-w-7xl px-5 pb-24 pt-14 md:px-8 lg:px-10">
      <h3 className="label text-ink-soft">{T.certsTitle}</h3>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {CERTS.map((c, i) => {
          const main = c.key === "pl300";
          return (
            <motion.li
              key={c.key}
              {...rise(i)}
              className={`group relative flex items-center gap-4 rounded-2xl border p-4 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_-18px_rgba(20,16,12,.35)] sm:p-5 ${main ? "border-msblue/40 bg-msblue/[0.06]" : "border-ink/10 bg-bone-2"}`}
            >
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-ink/10 bg-white p-2">
                <img src={media(c.logo)} alt="" width={40} height={40} className="h-10 w-10 object-contain" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-bold leading-snug">{T.certs[c.key].name}</span>
                <span className="mt-1 block text-sm text-ink-soft">{T.certs[c.key].by} · {c.year}</span>
              </span>
              {"href" in c && c.href && (
                <a href={c.href} target="_blank" rel="noopener" className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#0078d4] px-3.5 py-2 text-xs font-semibold text-white transition-transform duration-150 hover:scale-105 active:scale-95">
                  {T.verify} <ArrowUpRight size={14} aria-hidden="true" />
                  <span className="absolute inset-0 rounded-2xl" aria-hidden="true" />
                </a>
              )}
            </motion.li>
          );
        })}
      </ul>

      <h3 className="label mt-14 text-ink-soft">{T.skillsTitle}</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {T.skills.map((g, i) => (
          <motion.div key={g.group} {...rise(i)} className={`rounded-2xl border border-ink/10 bg-bone-2 p-5`}>
            <h4 className="flex items-center gap-2 text-lg font-bold">
              <span className={`h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-msblue" : "bg-accent"}`} aria-hidden="true" />
              {g.group}
            </h4>
            <ul className="mt-4 flex flex-wrap gap-2">
              {g.items.map((s, j) => (
                <motion.li
                  key={s}
                  initial={{ opacity: reduce ? 1 : 0, scale: reduce ? 1 : 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.35, delay: 0.15 + i * 0.07 + j * 0.05 }}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium ${i === 0 && j === 0 ? "border-msblue bg-msblue text-white" : "border-ink/15 bg-bone"}`}
                >
                  {s}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div></div>
  );
}

export default function Journey() {
  const { t } = useI18n();
  const T = t.journey;
  const [tab, setTab] = useState<Tab>("career");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const TABS: { id: Tab; label: string; Icon: typeof Award }[] = [
    { id: "career", label: T.tabs.career, Icon: BriefcaseBusiness },
    { id: "certs", label: T.tabs.certs, Icon: Award },
  ];
  // Arrow keys move between tabs (WAI-ARIA tabs pattern).
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const i = TABS.findIndex((x) => x.id === tab);
    const n = (i + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length;
    setTab(TABS[n].id);
    tabRefs.current[n]?.focus();
  };

  const data: TimelineEntry[] = T.items.map((it, i) => ({
    title: it.title,
    content: <Card role={it.role} org={it.org} when={it.when} points={it.points} alt={it.alt} {...MEDIA[i]} />,
  }));

  return (
    <section id="journey" className="bg-bone">
      <div className="md:px-10"><div className="mx-auto max-w-7xl px-5 pt-20 md:px-8 lg:px-10">
        <h2 className="display max-w-4xl text-4xl sm:text-6xl">{T.heading}</h2>
        <p className="mt-4 max-w-md text-lg text-ink-soft">{T.intro}</p>
        <div role="tablist" aria-label={T.tabsAria} onKeyDown={onKey} className="mt-8 inline-flex rounded-full border border-ink/15 bg-bone-2 p-1">
          {TABS.map(({ id, label, Icon }, i) => {
            const on = tab === id;
            return (
              <button
                key={id}
                ref={(el) => { tabRefs.current[i] = el; }}
                type="button"
                role="tab"
                id={`tab-${id}`}
                aria-selected={on}
                aria-controls={`panel-${id}`}
                tabIndex={on ? 0 : -1}
                onClick={() => setTab(id)}
                className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors duration-200 sm:px-5 ${on ? "text-bone" : "text-ink-soft hover:text-ink"}`}
              >
                {on && <motion.span layoutId="journey-tab" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <Icon size={16} className="relative" aria-hidden="true" />
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </div>
      </div></div>
      <motion.div
        key={tab}
        id={`panel-${tab}`}
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {tab === "career" ? <Timeline data={data} /> : <CertsAndSkills />}
      </motion.div>
    </section>
  );
}
