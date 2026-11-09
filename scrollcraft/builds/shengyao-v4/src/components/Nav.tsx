import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import { LinkedInCTA } from "./ui/linkedin-cta";
import { EMAIL, NAV, media } from "../data";
import { LANGS, useI18n } from "../i18n";
import { useTheme } from "../theme";

function Mark() {
  return <img src={media("logo-192.png")} alt="" width={26} height={26} className="h-[26px] w-[26px] rounded-full" />;
}

/** Language picker: globe-style icon + short code; the menu lists full names. */
function LangPicker({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cur = LANGS.find((l) => l.id === lang)!;

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", esc); };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`${t.nav.lang}: ${cur.name}`}
        className={`flex items-center gap-1.5 rounded-full text-sm font-semibold text-white transition-colors duration-150 hover:bg-white/10 ${compact ? "bg-black/65 px-3 py-2.5 backdrop-blur-md" : "px-3 py-1.5"}`}
      >
        <img src={media(cur.flag)} alt="" width={20} height={14} className="h-[14px] w-5 rounded-[3px] object-cover ring-1 ring-white/25" />
        <span>{cur.short}</span>
        <ChevronDown size={14} className={`opacity-70 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && (
        <div role="menu" aria-label={t.nav.lang} className="absolute right-0 top-[calc(100%+10px)] z-50 min-w-[11.5rem] overflow-hidden rounded-2xl border border-white/10 bg-[#121316]/95 p-1.5 text-white shadow-2xl backdrop-blur-md">
          {LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              role="menuitemradio"
              aria-checked={l.id === lang}
              lang={l.html}
              onClick={() => { setLang(l.id); setOpen(false); }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors duration-150 hover:bg-white/10"
            >
              <img src={media(l.flag)} alt="" width={24} height={16} className="h-4 w-6 shrink-0 rounded-[3px] object-cover ring-1 ring-white/20" />
              <span className="flex-1 font-medium">{l.name}</span>
              <span className="font-mono text-[11px] font-semibold text-white/45">{l.short}</span>
              {l.id === lang && <Check size={15} className="text-accent-hot" aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggle } = useTheme();
  const { t } = useI18n();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? t.nav.toLight : t.nav.toDark}
      aria-pressed={dark}
      title={dark ? t.nav.toLight : t.nav.toDark}
      className={`grid place-items-center rounded-full text-white transition-colors duration-150 hover:bg-white/10 ${compact ? "h-[42px] w-[42px] bg-black/65 backdrop-blur-md" : "h-8 w-8"}`}
    >
      <span className="relative block h-[18px] w-[18px]">
        <Sun size={18} aria-hidden="true" className={`absolute inset-0 transition-all duration-300 ${dark ? "rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100"}`} />
        <Moon size={18} aria-hidden="true" className={`absolute inset-0 transition-all duration-300 ${dark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-50 opacity-0"}`} />
      </span>
    </button>
  );
}

export default function Nav() {
  const { t } = useI18n();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const els = NAV.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <nav className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-2 p-4 sm:p-5 md:justify-center" aria-label="Main">
        <div className="nav-drop hidden items-center gap-1 rounded-full bg-black/65 py-2 pl-3 pr-2 backdrop-blur-md md:flex">
          <a href="#top" className="mr-2 flex items-center gap-2 rounded-full px-1 text-sm font-semibold text-white" aria-label={t.nav.top}>
            <Mark />
            <span className="hidden lg:inline">{t.nav.name}</span>
          </a>
          {NAV.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors duration-150 hover:bg-white/10 hover:text-white ${active === id ? "text-white" : "text-gray-300"}`}
            >
              {t.nav.links[id]}
            </a>
          ))}
          <span className="mx-1 h-5 w-px bg-white/20" aria-hidden="true" />
          <LangPicker />
          <ThemeToggle />
          <a href={`mailto:${EMAIL}`} className="ml-1 rounded-full bg-white px-5 py-1.5 text-sm font-semibold text-gray-900 transition-colors duration-150 hover:bg-gray-100">
            {t.nav.email}
          </a>
        </div>

        <a href="#top" className="nav-drop flex items-center gap-2 rounded-full bg-black/65 px-3 py-2.5 text-sm font-semibold text-white backdrop-blur-md md:hidden" aria-label={t.nav.top}>
          <Mark /> {t.nav.short}
        </a>
        <div className="nav-drop flex items-center gap-2 md:hidden">
          <LangPicker compact />
          <ThemeToggle compact />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 rounded-full bg-black/65 p-2.5 text-white backdrop-blur-md"
            aria-label={open ? t.nav.close : t.nav.open}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <>
        {/* tap anywhere outside the menu to close it */}
        <div className="menu-fade fixed inset-0 z-[48] bg-black/40 backdrop-blur-[2px] md:hidden" onClick={() => setOpen(false)} aria-hidden="true" />
        <div id="mobile-menu" className="menu-in fixed inset-x-0 top-0 z-[49] max-h-[100dvh] overflow-y-auto rounded-b-3xl bg-bone px-5 pb-6 pt-20 text-ink shadow-2xl md:hidden">
          {NAV.map((id) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="block border-b border-ink/10 py-3 text-lg font-medium">
              {t.nav.links[id]}
            </a>
          ))}
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="mr-1 text-ink-soft">{t.nav.theme}</span>
            {(["light", "dark"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setTheme(m)}
                aria-pressed={theme === m}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-semibold ${theme === m ? "border-ink bg-ink text-bone" : "border-ink/20"}`}
              >
                {m === "light" ? <Sun size={14} aria-hidden="true" /> : <Moon size={14} aria-hidden="true" />}
                {m === "light" ? t.nav.light : t.nav.dark}
              </button>
            ))}
          </div>
          <a href={`mailto:${EMAIL}`} onClick={() => setOpen(false)} className="mt-5 inline-flex rounded-full bg-ink px-6 py-3 font-semibold text-bone">
            {t.nav.email}
          </a>
          <div className="mt-4">
            <LinkedInCTA title={t.nav.linkedin} sub={t.nav.linkedinSub} onClick={() => setOpen(false)} />
          </div>
        </div>
        </>
      )}
    </>
  );
}
