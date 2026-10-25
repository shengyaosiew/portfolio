# Language Toggle Implementation Plan

**Goal:** Add EN / ä¸­æ–‡ selection to the portfolio, with English on every page load and a complete Simplified Chinese translation in JSON.

**Architecture:** Keep the English HTML as the default. Load a JSON dictionary when Chinese is selected and update existing text nodes and descriptive attributes without replacing elements or their event handlers.

**Tech Stack:** Static HTML, CSS, vanilla JavaScript, JSON.

### Implementation

- [x] Add a native language selector beside the theme control in `index.html` and load `assets/js/i18n.js` after the existing scripts.
- [x] Add `assets/i18n/zh-CN.json`, keyed by the normalized English text, covering prose, labels, timelines, popups, projects, metadata, and image descriptions. Preserve proper names and technical product names.
- [x] Implement dictionary loading, reversible text updates, document language, and an accessible loading failure message in `assets/js/i18n.js`. Preserve English whitespace and existing child elements.
- [x] Style the selector in `assets/css/polish.css`, including narrow desktop navigation and Chinese typography.
- [x] Update `README.md` with dictionary maintenance and local HTTP preview instructions.
- [x] Check JavaScript syntax, dictionary coverage, English/Chinese round trips, loading failures, and layout where browser tooling is available.


Validation: JavaScript syntax and git diff checks passed. Headless Chrome verified English/Chinese round trips at 320, 390, 768, 820, 1024, and 1440 pixels, selector/nav layout, translated service modals, qualification tabs, mobile menu, English default after reload, and failed fetch/retry. External resources were blocked for the local browser check; icon controls were exercised through DOM click events. Reviewed the Chinese mobile page screenshot.
