// Renders the Aceternity World Map's dotted base once, so dotted-map's world
// data stays out of the browser bundle. Run: node scripts/make-map.mjs
import { writeFileSync } from "node:fs";
import DottedMap from "dotted-map";
const map = new DottedMap({ height: 100, grid: "diagonal" });
const svg = map.getSVG({ radius: 0.22, color: "#12131640", shape: "circle", backgroundColor: "transparent" });
writeFileSync("public/media/world-dots.svg", svg);
console.log("public/media/world-dots.svg", svg.length, "bytes");
