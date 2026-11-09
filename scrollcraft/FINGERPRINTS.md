# Fingerprints

Every site you build with **scroll-craft** gets one row here, appended after it
ships. The registry exists so your next build can prove it is a different page
rather than a re-skin of one you already made.

This file is **yours**. It starts empty on purpose: the gate is about not
repeating *yourself*, so it has nothing to say until you have built something.

The rules and the gate live in the skill's
`references/uniqueness.md`. Short version:

**A new build must differ from EVERY row below on at least 4 of the 6
dimensions.** Four against each row individually, not four on average across the
table. If a planned build fails, change the plan. Never edit a row to make room
for it.

The six dimensions are: **grammar**, **nav treatment**, **hero device**,
**act-sequence shape**, **close pattern**, **signature move**.

Dimension 6 is free, because a signature move is unique by definition. So the
gate really asks for three more out of the remaining five, and a build that
changes only grammar and world will fail it.

---

## The registry

| Build | Grammar | Nav treatment | Hero device | Act-sequence shape | Close pattern | Signature move | World | Port |
|---|---|---|---|---|---|---|---|---|
| shengyao-editorial | Chaptered editorial | Fixed margin folio (chapter label + no CTA bar), collapses to slim sticky top band on mobile | Title-page: name + one promise on paper, no media above the fold, almost still | flow(title) > flow+reveal(who) > flow+reveal(turn) > flow(dark peak, count figures + witness logos) > pan(project rail) > flow(colophon); ~14.9vh, 6 beats, one dark peak chapter | Colophon / masthead plate, CTA as running italic text (email + LinkedIn), holds full-screen | The verification ledger: margin rail logs a checked claim per real figure as you read, totalling by the colophon | Editorial, warm paper + near-black + one ink-blue accent (no photography-world; real photos only) | 4500 |
| shengyao-report (v2, supersedes shengyao-editorial, which the user rejected) | Exhibit report (new): each unit is claim + chart + source line | Thin running head: name, current exhibit, Email me | Layered cover: dot field, name in red behind a real alpha portrait cutout, name recedes on scroll, pointer depth | pin(cover) > flow(profile) > flow(day-grid exhibit) > pin(dark ticket-field peak, 3.4vh) > flow(bar + unit marks) > pan(Gantt) > flow(index list) > flow(sign-off); 8 acts, 13.2vh | Dark sign-off with the email address as the largest type, plus copy, LinkedIn and CV | The ticket field: 580 dots, scroll runs an NLP scan, 34 flagged dots migrate into a tray | Editorial data: off-white, near-black, one vermilion accent; real photo only | 4501 |

---

## What is taken

Add a bullet here whenever a build claims something a later build should avoid
reusing: a grammar, a nav treatment, a close pattern, a signature move, an
act-count-and-length band. The shared columns are what the next build inherits
as a constraint, so writing them down is the whole point.

- **Chaptered editorial** grammar, with full-stop intertitle plates between chapters and hard-cut grounds (no drift).
- **Fixed margin folio** nav (chapter label, no CTA bar), collapsing to a sticky top band on mobile.
- **Title-page hero** with no media above the fold.
- **Colophon close** with the CTA as running text rather than a button island.
- **The verification ledger** signature move (margin rail that logs real, checked claims as you scroll).
- **Exhibit report** grammar, **running-head** nav, **layered portrait-in-front-of-name** cover, **email-as-headline** close, **ticket field** signature (v2).
- Act band: ~**6 beats at ~14.9vh** with exactly **one dark peak chapter** on an otherwise paper page.

---

## Appending a row

After shipping, add one line to the table and one bullet to **What is taken** if
the build claimed something new. Fill every column. Say what the build shares
with existing rows.

Rows are append-only. A build that has been superseded stays in the table,
because the space it occupies is still occupied.

---

## Worked example

The skill's author kept a registry of twelve builds across eight page grammars.
If you want to see what a filled-in table looks like, and which shapes tend to
collide, read `EXAMPLES.md` in the scroll-craft repository. Treat it as
illustration only: those rows are somebody else's builds and they do **not**
constrain yours.
