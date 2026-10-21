# Portfolio Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add restrained visual polish and accessible motion while keeping the portfolio a static GitHub Pages site.

**Architecture:** Load a final local stylesheet for the visual layer and a small independent script for native scroll reveals and progress. Preserve content, timeline tabs, service modals, and the hidden contact form. Use native IntersectionObserver instead of the external AOS dependency; content stays visible when JavaScript is unavailable.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, existing local Swiper.

---

### Task 1: Visual layer

**Files:** Modify `index.html`; create `assets/css/polish.css`.

- [x] Load `./assets/css/polish.css?v=1` after the responsive stylesheet, add a March 2027 availability badge, and wrap the hero name for accent styling.
- [x] Implement hero background accents, glass header, typography, bordered skill cards, service shadows, contact styling, keyboard focus, and fine-pointer hover transitions. Avoid transforms on service card parents because their dialogs use fixed positioning.
- [x] Include `@media (prefers-reduced-motion: reduce)` rules to disable animation and smooth scrolling.

### Task 2: Local motion

**Files:** Modify `index.html`, `assets/js/main.js`; create `assets/js/effects.js`.

- [x] Remove AOS CDN references and its initialization. Implement IntersectionObserver reveal with `threshold: 0.08`, once per element, staggered delays capped at 140ms, and a visible-content fallback.
- [x] Drive a header progress line from `window.scrollY` using requestAnimationFrame and passive scroll events; honor reduced-motion preferences and preference changes.
- [x] Correct the existing header and back-to-top scroll handlers to use `window.scrollY` and skip unmatched navigation links.

### Task 3: Verification and hosting

**Files:** Inspect `.github` and existing asset URLs; add deployment notes only if needed.

- [x] Run `node --check assets/js/main.js`, `node --check assets/js/effects.js`, and `git diff --check`.
- [x] Render desktop and mobile previews with installed headless Chrome if available; inspect hero, contact alignment, service dialog positioning, timeline tab switching, and reduced-motion/no-JavaScript behavior.
- [x] Check all added local paths and keep project-subpath asset URLs relative for GitHub Pages. Do not publish or change repository settings without a request to deploy.

**Verification results:** Chromium at 1440px and 390px showed no horizontal overflow; the hidden form remained hidden, contact columns were equal width, tabs switched, and the service dialog filled the viewport. Mobile menu open/close was verified after disabling header backdrop filtering on mobile. Reduced-motion mode had zero hidden reveal elements. No runtime exceptions were recorded. No-JavaScript content rendering was inspected. All local asset paths exist.

**Execution:** Implement inline in this session; the referenced superpowers execution skills are not available here. No commits or remote changes are required.
