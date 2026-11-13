// Adapted from Aceternity UI "World Map" (ui.aceternity.com/components/world-map).
// Changes: no next-themes (fixed light palette), arcs draw when the map
// scrolls into view, labelled endpoints, reduced-motion support, and pins use
// dotted-map's own Mercator projection so they land on the right dots (the
// upstream equirectangular formula puts Kuala Lumpur near Myanmar).
import { motion } from "motion/react";
// The dotted base is pre-rendered by scripts/make-map.mjs (same DottedMap
// settings as the original) so the world data is not shipped as JavaScript.
const MAP_SRC = "./media/world-dots.svg";

export interface MapPoint {
  lat: number;
  lng: number;
  label?: string;
  side?: "left" | "right";
}
export interface MapArc {
  start: MapPoint;
  end: MapPoint;
}

interface MapProps {
  dots?: MapArc[];
  lineColor?: string;
  reduce?: boolean;
}

// dotted-map, height 100: viewBox 198 x 100, region lng -168..168, lat -56..71, Mercator.
const W = 198, H = 100;
const LNG0 = -168, LNG1 = 168, LAT0 = -56, LAT1 = 71;
const merc = (lat: number) => Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
const projectPoint = (lat: number, lng: number) => ({
  x: ((lng - LNG0) / (LNG1 - LNG0)) * W,
  y: ((merc(LAT1) - merc(lat)) / (merc(LAT1) - merc(LAT0))) * H,
});

const curved = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const midX = (a.x + b.x) / 2;
  const lift = Math.min(14, Math.hypot(b.x - a.x, b.y - a.y) * 0.3);
  const midY = Math.min(a.y, b.y) - lift;
  return `M ${a.x} ${a.y} Q ${midX} ${midY} ${b.x} ${b.y}`;
};

export default function WorldMap({ dots = [], lineColor = "#C93A22", reduce = false }: MapProps) {
  // one pin per place, even when several arcs share it
  const pins = new Map<string, MapPoint>();
  dots.forEach((d) => [d.start, d.end].forEach((p) => pins.set(`${p.lat},${p.lng}`, p)));

  return (
    <div className="relative aspect-[3/2] w-full font-sans sm:aspect-[2/1]">
      <img
        src={MAP_SRC}
        className="pointer-events-none h-full w-full select-none dark:invert [mask-image:linear-gradient(to_bottom,transparent,white_10%,white_90%,transparent)]"
        alt=""
        height="495"
        width="1056"
        draggable={false}
      />
      {/* same viewBox as the dotted base, so both scale identically */}
      <svg viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 h-full w-full select-none" aria-hidden="true">
        <defs>
          <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0" />
            <stop offset="5%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="95%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        {dots.map((dot, i) => (
          <motion.path
            key={`p-${i}`}
            d={curved(projectPoint(dot.start.lat, dot.start.lng), projectPoint(dot.end.lat, dot.end.lng))}
            fill="none"
            stroke="url(#path-gradient)"
            strokeWidth="0.32"
            initial={{ pathLength: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.2, delay: 0.3 + 0.22 * i, ease: "easeOut" }}
          />
        ))}
        {[...pins.values()].map((pt, i) => {
          const p = projectPoint(pt.lat, pt.lng);
          const left = pt.side === "left";
          // pin 0 is the shared start; each other pin appears as its arc lands
          return (
            <motion.g
              key={`pin-${i}`}
              initial={{ opacity: reduce ? 1 : 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.4, delay: i === 0 ? 0.1 : 0.3 + 0.22 * (i - 1) + 1 }}
            >
              <circle cx={p.x} cy={p.y} r="0.65" fill={lineColor} />
              {!reduce && (
                <circle cx={p.x} cy={p.y} r="0.65" fill={lineColor} opacity="0.5">
                  <animate attributeName="r" from="0.65" to="2.4" dur="1.6s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.5" to="0" dur="1.6s" repeatCount="indefinite" />
                </circle>
              )}
              {pt.label && (
                <text
                  className="max-sm:hidden"
                  x={p.x + (left ? -1.8 : 1.8)}
                  y={p.y + 0.8}
                  textAnchor={left ? "end" : "start"}
                  fontSize="2.4"
                  fontWeight="650"
                  style={{ fill: "var(--chart-ink)", stroke: "var(--color-bone)" }}
                  fontFamily="Archivo, Noto Sans SC, sans-serif"
                  paintOrder="stroke"
                  strokeWidth="0.6"
                >
                  {pt.label}
                </text>
              )}
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
