// Adapted from Aceternity UI "Following Pointer" (ui.aceternity.com/components/following-pointer).
// Changes: measures the box on every move (the original cached it once, which
// drifts inside a horizontal scroller), fine pointers only, site accent colour
// instead of a random one, and the system cursor comes back under reduced motion.
import React, { useState } from "react";
import { AnimatePresence, motion, useMotionValue, type MotionValue } from "motion/react";
import { useMedia, useReducedMotion } from "../../lib/hooks";

export const FollowerPointerCard = ({ children, className = "", title }: { children: React.ReactNode; className?: string; title?: React.ReactNode }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [inside, setInside] = useState(false);
  const fine = useMedia("(hover: hover) and (pointer: fine)");
  const reduce = useReducedMotion();
  const on = fine && !reduce;

  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  return (
    <div
      onMouseEnter={(e) => { move(e); setInside(true); }}
      onMouseLeave={() => setInside(false)}
      onMouseMove={move}
      style={{ cursor: on ? "none" : undefined }}
      className={`relative ${className}`}
    >
      <AnimatePresence>{on && inside && <FollowPointer x={x} y={y} title={title} />}</AnimatePresence>
      {children}
    </div>
  );
};

export const FollowPointer = ({ x, y, title }: { x: MotionValue<number>; y: MotionValue<number>; title?: React.ReactNode }) => (
  <motion.div
    className="pointer-events-none absolute z-50 h-4 w-4 rounded-full"
    style={{ top: y, left: x }}
    initial={{ scale: 1, opacity: 1 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 0, opacity: 0 }}
    aria-hidden="true"
  >
    <svg stroke="currentColor" fill="currentColor" strokeWidth="1" viewBox="0 0 16 16" className="h-6 w-6 -translate-x-[12px] -translate-y-[10px] -rotate-[70deg] text-accent-hot" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.082 2.182a.5.5 0 0 1 .103.557L8.528 15.467a.5.5 0 0 1-.917-.007L5.57 10.694.803 8.652a.5.5 0 0 1-.006-.916l12.728-5.657a.5.5 0 0 1 .556.103z" />
    </svg>
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      className="min-w-max rounded-full bg-accent px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-white shadow-lg"
    >
      {title}
    </motion.div>
  </motion.div>
);
