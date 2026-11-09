import { motion } from "motion/react";
import { media } from "../data";
import { useReducedMotion } from "../lib/hooks";
import { useI18n } from "../i18n";

// Real photos only. Text for each is in i18n (events.photos, same order).
const PHOTOS = [
  { img: "ev-career-fair.webp", cls: "md:col-span-7 md:row-span-2", pos: "50% 40%" },
  { img: "ev-apu-lecture.webp", cls: "md:col-span-5", pos: "50% 50%" },
  { img: "ev-fyp.webp", cls: "md:col-span-5", pos: "50% 35%" },
];

export default function Events() {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const T = t.events;
  const rise = (delay: number) => ({
    initial: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="events" className="bg-bone-2 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-12">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="display text-4xl sm:text-6xl">{T.h2}</h2>
          <p className="max-w-[34ch] text-lg text-ink-soft">{T.p}</p>
        </div>
        <div className="mt-10 grid auto-rows-[15rem] gap-3 sm:auto-rows-[17rem] md:grid-cols-12">
          {PHOTOS.map((p, i) => (
            <motion.figure key={p.img} className={`group relative m-0 overflow-hidden rounded-xl bg-[#121316] text-white ${p.cls}`} {...rise(i * 0.08)}>
              <img src={media(p.img)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" style={{ objectPosition: p.pos }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <figcaption className="absolute inset-x-5 bottom-5">
                <span className="display block text-4xl sm:text-5xl">{T.photos[i].big}</span>
                <span className="mt-2 block font-semibold">{T.photos[i].what}</span>
                <span className="block text-sm text-white/75">{T.photos[i].where}</span>
              </figcaption>
            </motion.figure>
          ))}
          <motion.figure className="group relative m-0 flex flex-col justify-between overflow-hidden rounded-xl bg-[#121316] p-5 text-white md:col-span-6" {...rise(0.24)}>
            <img src={media("ev-pwc.webp")} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[50%_45%] transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/5" />
            <img src={media("pwc.webp")} alt="PwC" className="relative h-9 w-auto self-end rounded bg-white p-1.5" />
            <figcaption className="relative">
              <span className="display block text-5xl">{T.pwc.big}</span>
              <span className="mt-2 block font-semibold">{T.pwc.what}</span>
              <span className="block text-sm text-white/80">{T.pwc.where}</span>
            </figcaption>
          </motion.figure>
          <motion.figure className="group relative m-0 flex flex-col justify-between overflow-hidden rounded-xl bg-[#121316] p-5 text-white md:col-span-6" {...rise(0.32)}>
            <img src={media("scouts.webp")} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[50%_35%] transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
            <img src={media("scout-emblem.png")} alt={T.scouts.label} width={44} height={44} className="relative h-11 w-11 self-end rounded-full shadow-[0_4px_14px_rgba(0,0,0,.35)] ring-2 ring-white/80" />
            <figcaption className="relative">
              <span className="display block text-5xl">70+</span>
              <span className="mt-2 block font-semibold">{T.scouts.what}</span>
              <span className="block text-sm text-white/75">{T.scouts.where}</span>
            </figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
