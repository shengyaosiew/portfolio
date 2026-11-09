// Adapted from Aceternity UI "Timeline" (ui.aceternity.com/components/timeline).
// Changes: site palette, heading passed in as props, height re-measured on
// resize and image load, red progress beam.
import { motion, useScroll, useTransform } from "motion/react";
import React, { useEffect, useRef, useState } from "react";

export interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export function Timeline({ data, heading, intro }: { data: TimelineEntry[]; heading?: React.ReactNode; intro?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setHeight(el.getBoundingClientRect().height);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start 10%", "end 50%"] });
  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full md:px-10" ref={containerRef}>
      {(heading || intro) && (
        <div className="mx-auto max-w-7xl px-5 py-20 md:px-8 lg:px-10">
          {heading}
          {intro}
        </div>
      )}
      <div ref={ref} className="relative mx-auto max-w-7xl pb-20">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-10 md:gap-10 md:pt-32">
            <div className="sticky top-32 z-40 flex max-w-xs flex-col items-center self-start md:w-full md:flex-row lg:max-w-sm">
              <div className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-bone">
                <div className="h-4 w-4 rounded-full border border-ink/25 bg-surface" />
              </div>
              <h3 className="display hidden text-4xl text-ink-soft md:block md:pl-20 lg:text-5xl">{item.title}</h3>
            </div>
            <div className="relative w-full pl-20 pr-5 md:pl-4">
              <h3 className="display mb-4 block text-left text-3xl text-ink-soft md:hidden">{item.title}</h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{ height: height + "px" }}
          className="absolute left-8 top-0 w-[2px] overflow-hidden bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-ink/15 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] rounded-full bg-gradient-to-t from-accent from-[0%] via-accent-hot via-[10%] to-transparent"
          />
        </div>
      </div>
    </div>
  );
}
