import { Timeline, type TimelineEntry } from "./ui/timeline";
import { media } from "../data";
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

export default function Journey() {
  const { t } = useI18n();
  const T = t.journey;
  const data: TimelineEntry[] = T.items.map((it, i) => ({
    title: it.title,
    content: <Card role={it.role} org={it.org} when={it.when} points={it.points} alt={it.alt} {...MEDIA[i]} />,
  }));
  return (
    <section id="journey" className="bg-bone">
      <Timeline
        data={data}
        heading={<h2 className="display max-w-4xl text-4xl sm:text-6xl">{T.heading}</h2>}
        intro={<p className="mt-4 max-w-md text-lg text-ink-soft">{T.intro}</p>}
      />
    </section>
  );
}