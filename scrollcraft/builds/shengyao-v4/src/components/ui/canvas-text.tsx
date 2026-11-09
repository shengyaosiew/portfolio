// Adapted from Aceternity UI "Canvas Text" (ui.aceternity.com/components/canvas-text).
// Changes: matches the condensed display face (font-stretch + letter-spacing),
// leaves room for descenders, pauses off-screen, draws one still frame under
// reduced motion, and re-reads colours when the theme class changes.
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "../../lib/hooks";

interface CanvasTextProps {
  text: string;
  className?: string;
  /** CSS colour or var(--token) used to fill the letters */
  fill?: string;
  /** line colours drawn inside the letters */
  colors?: string[];
  animationDuration?: number;
  lineWidth?: number;
  lineGap?: number;
  curveIntensity?: number;
}

function resolve(color: string): string {
  if (!color.startsWith("var(")) return color;
  const v = getComputedStyle(document.documentElement).getPropertyValue(color.slice(4, -1).trim()).trim();
  return v || color;
}

export function CanvasText({
  text,
  className = "",
  fill = "var(--color-accent)",
  colors = ["#ff6b4e", "#ff8a6e", "#ffb19c", "#ffd3c6"],
  animationDuration = 14,
  lineWidth = 1.2,
  lineGap = 4,
  curveIntensity = 40,
}: CanvasTextProps) {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [box, setBox] = useState<{ w: number; h: number; font: string; spacing: string; stretch: CanvasFontStretch }>({ w: 0, h: 0, font: "", spacing: "0px", stretch: "normal" });
  const [palette, setPalette] = useState<{ fill: string; lines: string[] }>({ fill: "", lines: [] });

  useEffect(() => {
    const read = () => setPalette({ fill: resolve(fill), lines: colors.map(resolve) });
    read();
    const mo = new MutationObserver(read);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fill, colors.join("|")]);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const st = parseFloat(cs.fontStretch) || 100;
      // canvas only takes keywords; pick the nearest one
      const stretch: CanvasFontStretch = st <= 70 ? "extra-condensed" : st <= 81 ? "condensed" : st <= 93 ? "semi-condensed" : "normal";
      setBox({ w: Math.ceil(r.width), h: Math.ceil(r.height), font: `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`, spacing: cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing, stretch });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [text, className]);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv || !box.w || !box.font || !palette.lines.length) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const padY = Math.round(box.h * 0.35); // room for descenders / accents
    const W = box.w + 8, H = box.h + padY * 2;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = W + "px"; cv.style.height = H + "px"; cv.style.top = -padY + "px";

    const c = ctx as CanvasRenderingContext2D;
    const lines = Math.floor(H / lineGap) + 6;
    const t0 = performance.now();
    let raf = 0, live = true;

    const frame = (now: number) => {
      const phase = (((now - t0) / 1000) / animationDuration) * Math.PI * 2;
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      c.clearRect(0, 0, W, H);
      c.globalCompositeOperation = "source-over";
      c.font = box.font;
      if ("fontStretch" in c) c.fontStretch = box.stretch as CanvasFontStretch;
      if ("letterSpacing" in c) c.letterSpacing = box.spacing;
      const m = c.measureText(text);
      const baseline = padY + (box.h + m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
      c.textBaseline = "alphabetic";
      c.fillStyle = palette.fill;
      c.fillText(text, 0, baseline);
      c.globalCompositeOperation = "source-atop";
      c.lineWidth = lineWidth;
      for (let i = 0; i < lines; i++) {
        const y = i * lineGap;
        c.strokeStyle = palette.lines[i % palette.lines.length];
        c.beginPath();
        c.moveTo(0, y);
        c.bezierCurveTo(W * 0.33, y + Math.sin(phase) * curveIntensity, W * 0.66, y + Math.sin(phase + 0.5) * curveIntensity * 0.6, W, y);
        c.stroke();
      }
      if (!reduce && live) raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([e]) => {
      const was = live;
      live = e.isIntersecting;
      if (live && !was && !reduce) raf = requestAnimationFrame(frame);
    });
    io.observe(cv);
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [text, box, palette, animationDuration, lineWidth, lineGap, curveIntensity, reduce]);

  return (
    <span className={`relative inline-block ${className}`}>
      <span ref={textRef} className="invisible inline-block" aria-hidden="true">{text}</span>
      <canvas ref={canvasRef} className="pointer-events-none absolute left-0" role="img" aria-label={text} />
    </span>
  );
}
