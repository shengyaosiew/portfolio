# Hero copy and skills animation implementation plan

> Execute inline in the existing checkout; preserve the user's current changes and keep the preview local.

**Goal:** Explain the data analyst's value in simple English and make certificates and skills reveal as visitors scroll.

**Architecture:** Keep the existing multilingual hero fields and Motion library. Use a section scroll progress line, card reveals, and inherited staggered skill-chip variants, respecting reduced motion.

**Tech Stack:** React, TypeScript, Motion, Tailwind CSS, Vite.

### Task 1: Hero wording
- [x] Modify `scrollcraft/builds/shengyao-v4/src/i18n.tsx` English hero fields to render “I turn data into clear reports and useful insights.” Add “Helping businesses make better decisions.” to the supporting copy.

### Task 2: Scroll animations
- [x] Modify `scrollcraft/builds/shengyao-v4/src/components/Skills.tsx`: add section ref, Motion useScroll/useSpring progress line, fade/slide/blur certificate reveals, and skill-chip variants inherited from each card. Keep reduced-motion content visible.

### Task 3: Verification and handoff
- [x] Run `npm run build` in `scrollcraft/builds/shengyao-v4`; expect TypeScript and Vite success.
- [x] Start `npm run dev -- --host 127.0.0.1 --port 4502`; verify HTTP success and inspect hero and skills in a browser if available.
- [x] Give the user the localhost URL without publishing or committing.

Verification: production build passed and local HTTP returned 200. Browser visual inspection was unavailable because the browser access host could not connect. Dev server remains running for user review.

