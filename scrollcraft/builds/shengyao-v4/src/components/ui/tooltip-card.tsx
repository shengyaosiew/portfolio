// Adapted from Aceternity UI "Tooltip Card" (ui.aceternity.com/components/tooltip-card).
// Changes: site palette that follows the theme, opens on keyboard focus too,
// clamps to the viewport, and a <Term> helper for plain-English explainers.
import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const W = 260;

export const Tooltip = ({
  content,
  children,
  containerClassName = "",
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  containerClassName?: string;
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [height, setHeight] = useState(0);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const contentRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);
  const hideTimer = useRef<number>(0);

  useEffect(() => {
    if (isVisible && contentRef.current) setHeight(contentRef.current.scrollHeight);
  }, [isVisible, content]);
  useEffect(() => () => window.clearTimeout(hideTimer.current), []);

  // Position relative to the trigger, flipped/clamped so it stays on screen.
  const place = (mx: number, my: number) => {
    const c = containerRef.current;
    if (!c) return;
    const r = c.getBoundingClientRect();
    const th = contentRef.current?.scrollHeight ?? 120;
    let x = mx + 12, y = my + 14;
    if (r.left + x + W > innerWidth - 8) x = innerWidth - 8 - W - r.left;
    if (r.left + x < 8) x = 8 - r.left;
    if (r.top + y + th > innerHeight - 8) y = my - th - 14;
    if (r.top + y < 8) y = 8 - r.top;
    setPos({ x, y });
  };

  const fromEvent = (e: { clientX: number; clientY: number }) => {
    const r = containerRef.current!.getBoundingClientRect();
    place(e.clientX - r.left, e.clientY - r.top);
  };

  const show = () => { window.clearTimeout(hideTimer.current); setIsVisible(true); };
  const hide = () => setIsVisible(false);

  return (
    <span
      ref={containerRef}
      className={`relative inline ${containerClassName}`}
      onMouseEnter={(e) => { show(); fromEvent(e); }}
      onMouseMove={(e) => isVisible && fromEvent(e)}
      onMouseLeave={hide}
      onTouchStart={(e) => { show(); fromEvent(e.touches[0]); }}
      onTouchEnd={() => { hideTimer.current = window.setTimeout(hide, 3200); }}
      onFocus={() => { show(); const r = containerRef.current!.getBoundingClientRect(); place(0, r.height); }}
      onBlur={hide}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.span
            key="tip"
            role="tooltip"
            initial={{ height: 0, opacity: 1 }}
            animate={{ height, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="pointer-events-none absolute z-50 block overflow-hidden rounded-lg bg-bone text-left shadow-lg ring-1 shadow-black/10 ring-ink/10 dark:bg-surface"
            style={{ top: pos.y, left: pos.x, width: W }}
          >
            <span ref={contentRef} className="block p-3.5 font-sans text-sm font-normal leading-relaxed tracking-normal text-ink-soft normal-case [font-stretch:100%]">
              {content}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

/** A word with a dotted underline that explains itself on hover, tap or focus. */
export function Term({ children, tip, title }: { children: React.ReactNode; tip: React.ReactNode; title?: string }) {
  return (
    <Tooltip
      content={
        <>
          {title && <b className="mb-1 block font-semibold text-ink">{title}</b>}
          {tip}
        </>
      }
    >
      <span tabIndex={0} className="cursor-help underline decoration-current/40 decoration-dotted decoration-2 underline-offset-[0.18em] outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-accent">
        {children}
      </span>
    </Tooltip>
  );
}
