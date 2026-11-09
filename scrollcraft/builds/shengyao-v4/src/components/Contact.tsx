import { useState } from "react";
import { motion } from "motion/react";
import { Copy, Check } from "lucide-react";
import { CREDENTIAL, CV, EMAIL, GITHUB, LINKEDIN } from "../data";
import { useReducedMotion } from "../lib/hooks";
import { useI18n } from "../i18n";

const TOOLS = ["Power BI", "DAX", "Power Query", "Python", "SQL", "Excel", "BERTopic", "NLP", "ServiceNow", "AWS", "GitHub"];
const EASE = [0.22, 1, 0.36, 1] as const;

/* Last page. Always dark. The email types itself in letter by letter, the
   buttons follow, two soft glows drift behind, and a tool strip slides by. */
export default function Contact() {
  const reduce = useReducedMotion();
  const { t } = useI18n();
  const T = t.contact;
  const [status, setStatus] = useState<"" | "copied" | "fail">("");
  const copy = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setStatus("copied"); }
    catch { setStatus("fail"); }
    setTimeout(() => setStatus(""), 2400);
  };
  const view = { once: true, amount: 0.4 };
  const rise = (delay: number) => ({
    initial: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: view,
    transition: { duration: 0.7, delay, ease: EASE },
  });
  const [user, domain] = EMAIL.split("@");
  const chars = [...user, "@", ...domain];

  return (
    <section id="contact" className="relative overflow-hidden bg-night text-night-ink">
      {/* background: drifting glows + dot grid */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="glow-drift absolute left-[10%] top-[18%] h-[48vmax] w-[48vmax] rounded-full bg-[radial-gradient(circle,rgba(255,107,78,.22),transparent_62%)] blur-2xl" />
        <div className="glow-drift-2 absolute bottom-[-10%] right-[0%] h-[42vmax] w-[42vmax] rounded-full bg-[radial-gradient(circle,rgba(74,163,255,.16),transparent_62%)] blur-2xl" />
        <div className="absolute inset-0 opacity-[0.14] [background-image:radial-gradient(circle,#eeece6_1px,transparent_1.4px)] [background-size:22px_22px] [mask-image:radial-gradient(70%_60%_at_40%_45%,#000,transparent_80%)]" />
      </div>

      <div className="relative mx-auto flex min-h-[100dvh] max-w-7xl flex-col px-5 pb-8 pt-28 md:px-12">
        <div className="my-auto pb-12">
        <motion.p className="label flex items-center gap-2 text-night-soft" {...rise(0)}>
          <span className="relative flex h-2 w-2" aria-hidden="true">
            {!reduce && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-hot opacity-70" />}
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-hot" />
          </span>
          {T.label}
        </motion.p>

        <motion.a
          href={`mailto:${EMAIL}`}
          aria-label={EMAIL}
          className="display latin mt-5 block break-all text-[11vw] leading-[1] transition-colors duration-150 hover:text-accent-hot sm:break-normal md:text-[7.4vw]"
          initial="hide"
          whileInView="show"
          viewport={view}
          variants={{ show: { transition: { staggerChildren: reduce ? 0 : 0.035, delayChildren: 0.15 } } }}
        >
          {chars.map((c, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.06em] align-bottom" aria-hidden="true">
              <motion.span
                className={`inline-block ${c === "@" ? "text-accent-hot" : ""}`}
                variants={{ hide: { y: reduce ? 0 : "110%" }, show: { y: 0, transition: { duration: 0.7, ease: EASE } } }}
              >
                {c}
              </motion.span>
            </span>
          ))}
        </motion.a>

        <motion.span
          className="mt-4 block h-[2px] origin-left bg-gradient-to-r from-accent-hot via-accent-hot/60 to-transparent"
          initial={{ scaleX: reduce ? 1 : 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={view}
          transition={{ duration: 1.2, delay: 0.8, ease: EASE }}
          aria-hidden="true"
        />

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <motion.a {...rise(0.9)} href={`mailto:${EMAIL}`} className="shine rounded-full bg-night-ink px-7 py-3.5 text-sm font-semibold text-[#121316] transition-transform duration-200 hover:scale-[1.04] active:scale-95">{T.email}</motion.a>
          <motion.a {...rise(1)} href={LINKEDIN} target="_blank" rel="noopener" className="rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold transition-colors duration-150 hover:border-accent-hot hover:text-accent-hot">{T.linkedin}</motion.a>
          <motion.a {...rise(1.1)} href={CV} download className="rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold transition-colors duration-150 hover:border-accent-hot hover:text-accent-hot">{T.cv}</motion.a>
          <motion.button {...rise(1.2)} type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold transition-colors duration-150 hover:border-accent-hot hover:text-accent-hot">
            {status === "copied" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />} {T.copy}
          </motion.button>
          <span role="status" className="min-w-[8ch] text-sm text-accent-hot">{status === "copied" ? T.copied : status === "fail" ? T.fail : ""}</span>
        </div>

        {/* tool strip */}
        <div className="relative mt-16 overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]" aria-hidden="true">
          <div className={`flex w-max whitespace-nowrap ${reduce ? "" : "marquee"}`}>
            {[...TOOLS, ...TOOLS].map((s, i) => (
              <span key={i} className="display latin flex items-center gap-10 pr-10 text-2xl text-white/25 sm:text-3xl">
                {s}<span className="h-1.5 w-1.5 rounded-full bg-accent-hot/60" />
              </span>
            ))}
          </div>
        </div>

        </div>
        <div className="flex flex-wrap justify-between gap-4 border-t border-white/15 pt-6 text-sm text-night-soft">
          <span>{T.footer}</span>
          <span className="flex gap-5">
            <a href={CREDENTIAL} target="_blank" rel="noopener" className="hover:text-night-ink">{T.cert}</a>
            <a href={GITHUB} target="_blank" rel="noopener" className="hover:text-night-ink">GitHub</a>
            <span>{T.city}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
