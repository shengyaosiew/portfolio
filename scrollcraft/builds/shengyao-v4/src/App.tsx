import { useEffect } from "react";
import Lenis from "lenis";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import PowerBI from "./components/PowerBI";
import Hours from "./components/Hours";
import AIIntro from "./components/AIIntro";
import Tickets from "./components/Tickets";
import Reach from "./components/Reach";
import Journey from "./components/Journey";
import Skills from "./components/Skills";
import Events from "./components/Events";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import { useReducedMotion } from "./lib/hooks";

export default function App() {
  const reduce = useReducedMotion();

  // Smooth wheel scrolling; off under reduced motion.
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, anchors: true });
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, [reduce]);

  return (
    <div className="min-h-screen bg-bone tracking-[-0.01em]">
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Skills />
        <Events />
        <PowerBI />
        <Hours />
        <AIIntro />
        <Tickets />
        <Reach />
        <Journey />
        <Projects />
        <Contact />
      </main>
    </div>
  );
}
