// Light / dark theme. index.html sets the class before first paint (no flash);
// this hook keeps React in sync and saves the choice.
import { useEffect, useState } from "react";

export type Theme = "light" | "dark";
const KEY = "sy-theme";

const read = (): Theme => (document.documentElement.classList.contains("dark") ? "dark" : "light");

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(read);

  useEffect(() => {
    const mo = new MutationObserver(() => setThemeState(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

  const setTheme = (t: Theme) => {
    const root = document.documentElement;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!calm) root.classList.add("theme-anim");
    root.classList.toggle("dark", t === "dark");
    try { localStorage.setItem(KEY, t); } catch { /* storage blocked */ }
    if (!calm) window.setTimeout(() => root.classList.remove("theme-anim"), 400);
  };

  return { theme, setTheme, toggle: () => setTheme(read() === "dark" ? "light" : "dark") };
}
