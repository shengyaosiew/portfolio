import { useRef } from "react";
import { useScroll, useTransform } from "motion/react";
import { GoogleGeminiEffect } from "./ui/google-gemini-effect";
import { useI18n } from "../i18n";
import { useReducedMotion } from "../lib/hooks";

/* Opens the machine-learning chapter: five data streams draw in as you
   scroll and meet in one point, then the ticket field takes over. */
export default function AIIntro() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p1 = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2]);
  const p2 = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2]);
  const p3 = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2]);
  const p4 = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2]);
  const p5 = useTransform(scrollYProgress, [0, 0.8], [0, 1.2]);
  const lengths = reduce ? [1, 1, 1, 1, 1] : [p1, p2, p3, p4, p5];

  return (
    <section id="impact" ref={ref} className={`relative bg-night text-night-ink ${reduce ? "" : "h-[240vh]"}`}>
      <div className="sticky top-0 h-[100dvh] min-h-[560px] overflow-hidden">
        <div className="relative z-10 mx-auto max-w-4xl px-5 pt-28 text-center md:pt-32">
          <p className="label text-night-soft">{t.tickets.label}</p>
          <h2 className="display mt-5 bg-gradient-to-b from-white to-[#c9ccd3] bg-clip-text pb-2 text-4xl text-transparent sm:text-6xl md:text-7xl">{t.gemini.title}</h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-night-soft md:text-xl">{t.gemini.desc}</p>
        </div>
        <GoogleGeminiEffect
          pathLengths={lengths}
          className="absolute left-1/2 top-[64%] w-[max(100vw,1100px)] -translate-x-1/2 -translate-y-1/2"
          center={
            <span className="block whitespace-nowrap rounded-full bg-white px-4 py-2 font-mono text-xs font-semibold text-[#121316] shadow-[0_0_40px_rgba(255,107,78,.35)] md:px-5 md:text-sm">
              {t.gemini.pill}
            </span>
          }
        />
      </div>
    </section>
  );
}
