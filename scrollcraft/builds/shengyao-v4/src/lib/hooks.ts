import { useEffect, useState } from "react";

export function useReducedMotion() {
  const [reduce, setReduce] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduce(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduce;
}

export function useMedia(query: string) {
  const [match, setMatch] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

/** Progress (0..1) through a tall sticky section: 0 when its top hits the
 *  viewport top, 1 when its bottom hits the viewport bottom. Read inside rAF. */
export function stickyProgress(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const travel = r.height - window.innerHeight;
  if (travel <= 0) return 0;
  return Math.min(1, Math.max(0, -r.top / travel));
}

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
