import { motion } from "motion/react";
import WorldMap from "./ui/world-map";
import { CountUp } from "./Hours";
import { useReducedMotion } from "../lib/hooks";
import { useI18n } from "../i18n";

// Countries Sheng Yao listed as users of the dashboard (a sample of the 20+).
// Pins sit near each country's centre; Malaysia is Kuala Lumpur, where it was built.
const PLACES: { key: string; lat: number; lng: number; side: "left" | "right" }[] = [
  { key: "sg", lat: 1.35, lng: 103.82, side: "right" },
  { key: "id", lat: -4.5, lng: 120.5, side: "right" },
  { key: "th", lat: 15.87, lng: 100.99, side: "left" },
  { key: "vn", lat: 14.06, lng: 108.28, side: "right" },
  { key: "pk", lat: 30.38, lng: 69.35, side: "left" },
  { key: "sa", lat: 23.89, lng: 45.08, side: "left" },
  { key: "nl", lat: 52.13, lng: 5.29, side: "left" },
  { key: "de", lat: 51.17, lng: 10.45, side: "right" },
  { key: "us", lat: 39.8, lng: -98.6, side: "right" },
];

export default function Reach() {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const T = t.reach;
  const KL = { lat: 3.139, lng: 101.687, label: T.countries.my, side: "left" as const };
  const ARCS = PLACES.map((p) => ({ start: KL, end: { lat: p.lat, lng: p.lng, label: T.countries[p.key], side: p.side } }));
  return (
    <section className="bg-bone py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        <div className="grid gap-10 md:grid-cols-[5fr_7fr] md:items-end">
          <div>
            <p className="label text-ink-soft">{T.label}</p>
            <p className="display mt-4 text-[5.5rem] leading-none sm:text-[8rem]">
              <CountUp to={20} />
              <span className="text-accent">+</span>
            </p>
            <h2 className="display mt-3 text-3xl sm:text-4xl">{T.h2}</h2>
            <p className="mt-4 max-w-[40ch] text-lg text-ink-soft">
              {T.p}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="border-t-2 border-ink pt-4">
              <p className="display text-5xl">5+</p>
              <p className="mt-2 text-ink-soft">{T.s1}</p>
            </div>
            <div className="border-t-2 border-ink pt-4">
              <p className="display text-5xl">10+</p>
              <p className="mt-2 text-ink-soft">{T.s2}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 md:mt-16">
          <WorldMap dots={ARCS} reduce={reduce} />
          {/* phones: the map is too small for labels, so list the countries */}
          <ul className="mt-2 flex flex-wrap gap-1.5 sm:sr-only">
            {[T.countries.my, ...PLACES.map((p) => T.countries[p.key])].map((c) => (
              <li key={c} className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-2.5 py-1 text-xs font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />{c}
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-ink/10 pt-3 text-sm text-ink-soft">
            <b className="text-ink">{T.mapB}</b>{T.mapRest}
          </p>
        </div>

        <figure className="mt-20 border-t-2 border-ink pt-6 md:mt-28">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="label text-ink-soft">{T.aiLabel}</p>
              <h3 className="display mt-3 text-3xl sm:text-4xl">{T.aiH}</h3>
            </div>
            <p className="max-w-[36ch] text-ink-soft">{T.aiP}</p>
          </div>
          <div className="mt-8 grid gap-5">
            {[
              { k: T.before, w: 100, cls: "bg-ink/15 text-ink" },
              { k: T.after, w: 52, cls: "bg-accent text-white" },
            ].map((b, i) => (
              <div key={b.k} className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[6rem_minmax(0,1fr)]">
                <span className="label text-ink-soft">{b.k}</span>
                <div className="relative h-14">
                  <motion.div
                    className={`absolute inset-y-0 left-0 flex items-center justify-end rounded-[3px] pr-3 text-lg font-bold tabular-nums ${b.cls}`}
                    style={{ width: `${b.w}%`, transformOrigin: "0 50%" }}
                    initial={{ scaleX: reduce ? 1 : 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{ duration: 0.9, delay: 0.2 + i * 0.25, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {b.w}
                  </motion.div>
                  {i === 1 && (
                    <motion.div
                      className="display absolute -inset-y-1.5 left-[52%] right-0 flex items-center justify-center rounded-[3px] border-[1.5px] border-dashed border-accent text-3xl text-accent"
                      initial={{ opacity: reduce ? 1 : 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true, amount: 0.8 }}
                      transition={{ duration: 0.5, delay: 1 }}
                    >
                      −48%
                    </motion.div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </figure>
      </div>
    </section>
  );
}
