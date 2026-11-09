# Asset prompts: Siew Sheng Yao portfolio (v4 plan)

All prompts are built from facts in `Resume_Siew Sheng Yao.pdf`.

## How to use these

- **Paste the style block at the top of every image prompt, word for word.** That keeps 8 separate images looking like one photo shoot.
- **Never ask for text in an image.** Numbers, names and "PL-300" are added later as real website text, so they stay sharp and correct.
- **Use only these aspect ratios:** 16:9, 9:16 or 3:4. (The kie.ai Seedream model rejects 4:5.)
- **Save each result with the file name shown**, then put it in `scrollcraft/builds/shengyao-report/assets/gen/`.
- **Do not generate event photos.** A fake photo of a real event is a trust risk on a job-hunting site. Use your real LinkedIn photos for events.

---

## Style block (paste at the top of prompts 1, 2, 5, 6, 7, 8)

```
Premium editorial studio photograph for a data analyst's portfolio. Medium-format camera, 85mm lens, f/4. Warm bone-white seamless paper backdrop (#ECE9E2), soft large key light from the upper left, gentle falloff, soft floor shadow. Palette: bone white, charcoal black (#121316) and one vermilion red accent (#C93A22) only. Fine film grain. Calm, precise, high-end, like an annual-report cover shoot. No text, no letters, no numbers, no logos, no watermarks, no user interface, no screens with readable content.
```

---

## 1. Hero portrait (desktop) · `hero-16x9.png`

- **Type:** image. **Ratio:** 16:9. **Reference image:** your sharpest, largest headshot (the current `perfil.png` is only 500×500).
- **Used for:** the cover, which is the base layer of the cursor-reveal effect.

```
[STYLE BLOCK]

The same young man as the reference photo: same face, same black rectangular glasses, same short black hair swept back. He wears a charcoal suit, a light-blue shirt and a dark patterned tie. Waist-up portrait, body turned slightly to his left, eyes to camera, calm confident expression with a slight smile. He stands in the right third of the frame. The left 55% of the frame is empty backdrop for a headline. Whole head and shoulders in frame with generous space above the head. Sharp focus on the eyes.
```

## 2. Hero portrait (phone) · `hero-9x16.png`

- **Type:** image. **Ratio:** 9:16. **Reference image:** the same headshot.
- **Used for:** the cover on phones, framed separately so nothing gets cropped.

```
[STYLE BLOCK]

The same young man as the reference photo: same face, same black rectangular glasses, same short black hair swept back. Charcoal suit, light-blue shirt, dark patterned tie. Chest-up portrait, facing the camera, calm confident expression. He fills the lower 60% of the frame, centred. The top 35% of the frame is empty backdrop for a headline. Sharp focus on the eyes.
```

## 3. Hero "data scan" reveal · `hero-scan-16x9.png`

- **Type:** image-to-image. **Ratio:** 16:9. **Input image:** result 1.
- **Used for:** a second layer that appears inside a spotlight following the mouse (the cyberpunk-example effect).
- **Must match result 1 edge for edge.** If his outline shifts, the spotlight will show a doubled face, so regenerate.

```
Keep the exact same composition, pose, framing, camera angle and lighting as the input image. Transform the man into a data visualisation of himself: his face, hair, glasses and suit are rendered as thousands of tiny glowing vermilion (#FF6B4E) and white dots and fine contour lines, like a 3D point-cloud scan. The background becomes deep charcoal (#0F1217) instead of bone white. His silhouette must match the input image exactly. No text, no numbers, no letters, no user interface.
```

## 4. Empty backdrop plate · `hero-plate-16x9.png` (optional)

- **Type:** image-to-image. **Ratio:** 16:9. **Input image:** result 1.
- **Used for:** depth. "SHENG YAO" sits on this plate, behind a cut-out of you.
- **Alternative:** skip this prompt and cut yourself out of result 1 with remove.bg or Photoshop.

```
The same image with the person completely removed. Rebuild the empty seamless backdrop and soft floor shadow where he stood. Change nothing else: same light, same colour, same grain.
```

## 5. Ticket sculpture (start frame for the video) · `sculpture-16x9.png`

- **Type:** image. **Ratio:** 16:9.
- **Used for:** the first frame of the scroll video, and the still image on phones.
- **Idea:** your 58,000+ IT tickets as a physical object. The red bars stand for the 5.93% that can be automated.

```
[STYLE BLOCK]

A physical sculpture on a low charcoal plinth in the centre of the frame: a 3D bar chart built from thousands of thin stacked paper index cards, like a printed archive of support tickets. Most bars are bone-white paper. One small cluster of bars is solid vermilion. Front three-quarter view at eye level. The whole sculpture and plinth are in frame, with wide empty margins on every side and a soft shadow on the floor. Clean, minimal, gallery-like.
```

## 6. PL-300 ring object · `pl300-ring-3x4.png`

- **Type:** image. **Ratio:** 3:4.
- **Used for:** a physical version of the PL-300 ring chart. The website text ("PL-300", 700 / 1000) sits in the empty centre.
- **Note:** the four parts match the exam weights: three parts at 25–30%, one at 15–20%.

```
[STYLE BLOCK]

Seen from directly above: a thick heavy ring machined from matte charcoal metal, lying flat on the backdrop. The ring is split into four separate segments with thin even gaps between them. Three segments are the same length and one is noticeably shorter. One segment is enamelled vermilion red; the other three are charcoal. The centre of the ring is an empty bone-white circle with nothing on it. Precise, like a luxury watch part. Crisp top-down light, soft shadow under the ring. The ring fills about 80% of the frame width.
```

## 7. "750 hours" still life · `hours-16x9.png`

- **Type:** image. **Ratio:** 16:9.
- **Used for:** the hours section. It shows the manual Excel reporting that you replaced, now set aside.

```
[STYLE BLOCK]

A tall, neat stack of blank white printed report pages tied with a thin vermilion paper band, set aside on a charcoal desk next to a closed silver laptop. Three-quarter view from slightly above. The objects sit in the left half of the frame; the right half is empty desk and backdrop. Quiet and orderly, the feeling of finished work.
```

## 8. Closing scene · `close-16x9.png`

- **Type:** image. **Ratio:** 16:9.
- **Used for:** the background behind your email address at the end of the page.
- **Idea:** "a seat ready for the next role".

```
[STYLE BLOCK]

An empty modern desk facing the camera in a calm studio, with a charcoal office chair pulled out invitingly. A closed laptop sits on the desk, and a single vermilion desk lamp is switched on, giving a warm pool of light. Early-evening mood, slightly darker than the other images. The desk sits in the lower right of the frame; the upper-left 60% is empty dark backdrop for a large headline.
```

---

## Videos

### V1. Ticket sculpture orbit (needed) · `sculpture-orbit.mp4`

- **Type:** image-to-video (Kling 2.1 Pro or newer). **Start frame:** result 5. **Length:** 10 s (5 s also works).
- **Used for:** the main scroll animation. Scrolling down turns the camera around the sculpture; scrolling up turns it back. The 58,000 tickets → 5.93% story text sits on top.

```
The camera orbits slowly and steadily around the sculpture in one smooth continuous 180-degree arc, from the front three-quarter view to the opposite side, at the same height. The sculpture stays centred and fully in frame the whole time. The sculpture and plinth stay perfectly still. The light stays constant. One single continuous take, no cuts, no zoom, no camera shake, nothing enters or leaves the frame. Slow, cinematic, controlled.
```

Negative prompt:

```
text, letters, numbers, people, hands, extra objects, morphing, warping, melting, flicker, cuts, scene change, camera shake, zoom snap
```

### V2. Hero push-in (optional, not recommended)

- **Type:** image-to-video from result 1, 5 s: a slow push-in on you.
- **Why not recommended:** video models often change a face slightly from frame to frame, and recruiters notice when you don't look like yourself.
- **Instead:** the cover gets its motion from layers moving at different speeds, the mouse spotlight, and a slow zoom on load. None of these risk changing your face.

```
The camera pushes slowly and steadily toward the man, a smooth continuous dolly-in from waist-up to chest-up. He stays still, breathing naturally, eyes to camera. His face, glasses and suit stay exactly the same in every frame. One single continuous take, no cuts, no camera shake. Slow and controlled.
```

---

## Budget (kie.ai published rates)

The 8 images cost 28 credits each, 224 in total. One 5 s video costs 160 credits. Plan on about 400 credits in total, plus a few rerolls. Past runs were billed at about 40% of the published rates.
