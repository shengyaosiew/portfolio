// LinkedIn call-to-action: the logo hops every few seconds with a soft ring,
// and a light sweep crosses the button. All motion stops under reduced motion.
import { ArrowUpRight } from "lucide-react";
import { LINKEDIN } from "../../data";

export function LinkedInLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect width="24" height="24" rx="5" fill="#0A66C2" />
      <path fill="#fff" d="M7.1 9.6h2.4V18H7.1zM8.3 5.8a1.4 1.4 0 1 1 0 2.8 1.4 1.4 0 0 1 0-2.8zM11 9.6h2.3v1.15h.03c.32-.6 1.1-1.25 2.27-1.25 2.43 0 2.88 1.6 2.88 3.68V18h-2.4v-4.1c0-.98-.02-2.24-1.36-2.24-1.37 0-1.58 1.07-1.58 2.17V18H11z" />
    </svg>
  );
}

export function LinkedInCTA({ title, sub, tone = "light", onClick }: { title: string; sub: string; tone?: "light" | "dark"; onClick?: () => void }) {
  const dark = tone === "dark";
  return (
    <a
      href={LINKEDIN}
      target="_blank"
      rel="noopener"
      onClick={onClick}
      className={`li-cta group relative flex items-center gap-4 overflow-hidden rounded-2xl border p-3.5 pr-5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 active:scale-[0.98] ${
        dark
          ? "border-white/15 bg-white/[0.06] text-night-ink hover:border-[#0A66C2]/70 hover:shadow-[0_18px_40px_-16px_rgba(10,102,194,.6)]"
          : "border-ink/10 bg-bone-2 text-ink hover:border-[#0A66C2]/50 hover:shadow-[0_18px_40px_-18px_rgba(10,102,194,.45)]"
      }`}
    >
      <span className="relative grid h-12 w-12 shrink-0 place-items-center">
        <span className="li-ring absolute inset-0 rounded-xl bg-[#0A66C2]/35" aria-hidden="true" />
        <span className="li-hop relative">
          <LinkedInLogo size={40} />
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-bold leading-tight">{title}</span>
        <span className={`mt-0.5 block truncate text-sm ${dark ? "text-night-soft" : "text-ink-soft"}`}>{sub}</span>
      </span>
      <ArrowUpRight size={20} className="shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
      <span className="li-sweep pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent" aria-hidden="true" />
    </a>
  );
}
