// Adapted from Aceternity UI "Google Gemini Effect" (ui.aceternity.com/components/google-gemini-effect).
// Changes: paths kept verbatim (gemini-paths.ts) but rendered from one list,
// site colours, the centre button replaced by a caller-supplied label, layout
// moved to the caller so it can sit inside a sticky stage.
import { motion, type MotionValue } from "motion/react";
import type { ReactNode } from "react";
import { GEMINI_PATHS } from "./gemini-paths";

export const GEMINI_COLORS = ["#FF6B4E", "#FFB19C", "#B1C5FF", "#4FABFF", "#0078D4"];

export const GoogleGeminiEffect = ({
  pathLengths,
  colors = GEMINI_COLORS,
  center,
  className = "relative",
}: {
  pathLengths: (MotionValue<number> | number)[];
  colors?: string[];
  center?: ReactNode;
  className?: string;
}) => (
  <div className={className}>
    {/* centre label sits where the five lines meet (x 720, y ~512 of 1440 x 890) */}
    {center && (
      <div className="absolute left-1/2 top-[57.5%] z-30 -translate-x-1/2 -translate-y-1/2">{center}</div>
    )}
    <svg width="1440" height="890" viewBox="0 0 1440 890" xmlns="http://www.w3.org/2000/svg" className="h-auto w-full" aria-hidden="true">
      <defs>
        <filter id="gemini-blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
        </filter>
      </defs>
      {GEMINI_PATHS.map((d, i) => (
        <path key={`b${i}`} d={d} stroke={colors[i]} strokeWidth="2" fill="none" pathLength={1} filter="url(#gemini-blur)" opacity="0.55" />
      ))}
      {GEMINI_PATHS.map((d, i) => (
        <motion.path key={`p${i}`} d={d} stroke={colors[i]} strokeWidth="2" fill="none" initial={{ pathLength: 0 }} style={{ pathLength: pathLengths[i] }} transition={{ duration: 0, ease: "linear" }} />
      ))}
    </svg>
  </div>
);
