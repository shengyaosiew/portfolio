# Step-by-step: make the website images in ChatGPT, and the video in Kling

## Before you start

- Use your **largest, sharpest headshot**. The `perfil.png` on the current site is only 500×500, so the AI can't see your face clearly enough.
- Do all 8 images **in one ChatGPT chat**, so they look like one photo shoot.
- Before each prompt, pick the **aspect ratio** in ChatGPT's image picker (16:9, 9:16 or 3:4). If there is no picker, the ratio is already written in the prompt.
- When an image is done, download it and rename it to the file name shown. Put all files in `scrollcraft/builds/shengyao-report/assets/gen/`.

**If your face looks wrong, reply with:**
> My face looks different from my photo. Keep my face, glasses and hair exactly the same as the photo I uploaded. Change nothing else.

---

## Image 1: hero portrait (desktop) → `hero-16x9.png`

Upload your headshot, then send:

```
Use the photo I uploaded. This is me. Create a new photo of me for my portfolio website.

Keep my face exactly the same: same face shape, same eyes, same black rectangular glasses, same short black hair swept back. Do not make me look different, older, younger or more "perfect". It must clearly be me.

Clothes: charcoal suit, light-blue shirt, dark patterned tie.

Photo style: premium studio portrait, like a magazine or company annual report cover. Shot on a professional camera with an 85mm lens. Warm off-white paper background (colour #ECE9E2). Soft light from the upper left. Soft shadow on the floor. Colours: off-white, charcoal black and a little dark red (#C93A22) only. Light film grain. Calm and confident.

Framing: wide 16:9 landscape. Show me from the waist up, body turned a little to my left, looking at the camera with a calm, slight smile. Put me in the RIGHT third of the picture. Leave the LEFT half empty (just plain background) because website text will go there. Leave space above my head. Do not crop my head or shoulders.

Do not add any text, letters, numbers, logos or watermarks.
```

## Image 2: hero portrait (phone) → `hero-9x16.png`

Send in the same chat:

```
Now make the same photo of me again, same face, same clothes, same studio style and colours, but in tall 9:16 portrait format for phones.

Show me from the chest up, facing the camera, in the centre of the picture. I should fill the bottom 60% of the picture. Keep the top 35% empty plain background because a headline will go there. Do not crop my head.

No text, letters, numbers or logos.
```

## Image 3: "data scan" version of you → `hero-scan-16x9.png`

Upload **Image 1** (the result you just made), then send:

```
Edit this exact image. Keep everything in exactly the same place: same pose, same size, same position, same framing, same camera angle. My outline must line up perfectly with the original, because the two images will be stacked on top of each other on my website.

Change only the look: turn me into a data visualisation of myself. My face, hair, glasses and suit become thousands of tiny glowing red-orange (#FF6B4E) and white dots and thin contour lines, like a 3D point-cloud scan. Change the background to very dark charcoal (#0F1217).

Keep it 16:9. No text, letters, numbers or logos.
```

How to check it: open Image 1 and Image 3 side by side. Your head and shoulders must be in the same spot. If they moved, ask again.

## Image 4: empty background (optional) → `hero-plate-16x9.png`

Upload **Image 1**, then send:

```
Edit this exact image. Remove the person completely. Fill in the empty paper background and the soft floor shadow where he was standing, so it looks like an empty studio. Do not change anything else: same light, same colour, same grain, same 16:9 size.
```

## Image 5: ticket sculpture (also the video's first frame) → `sculpture-16x9.png`

```
Create a new image in the same studio style as my photos: warm off-white paper background (#ECE9E2), soft light from the upper left, soft floor shadow, colours off-white, charcoal black and dark red (#C93A22) only, light film grain, premium and calm.

Subject: a sculpture standing on a low charcoal block in the centre of the picture. The sculpture is a 3D bar chart made from thousands of thin stacked paper cards, like a printed archive of IT support tickets. Most bars are off-white paper. One small group of bars is solid dark red.

Camera: eye level, front three-quarter view. Show the whole sculpture and block with lots of empty space around them on every side.

Wide 16:9. No people. No text, letters, numbers or logos.
```

## Image 6: PL-300 ring → `pl300-ring-3x4.png`

```
Create a new image in the same studio style (warm off-white background #ECE9E2, charcoal black, one dark red #C93A22, soft light, light grain).

Seen from directly above: a thick heavy ring made of matte charcoal metal, lying flat. The ring is cut into 4 separate pieces with small even gaps between them. 3 pieces are the same length. 1 piece is clearly shorter. One piece is glossy dark red; the other three are charcoal. The middle of the ring is empty off-white background with nothing in it. Looks precise and expensive, like a luxury watch part. Soft shadow under the ring. The ring fills about 80% of the picture width.

Tall 3:4 format. No text, letters, numbers or logos.
```

## Image 7: "750 hours saved" → `hours-16x9.png`

```
Create a new image in the same studio style (warm off-white background #ECE9E2, charcoal black, one dark red #C93A22, soft light, light grain).

A tall, neat stack of blank white printed report pages, tied with a thin dark red paper band, placed to one side on a charcoal desk next to a closed silver laptop. The feeling: old manual work that is now finished and put away. Camera slightly above, three-quarter view. Put the objects in the LEFT half. Keep the RIGHT half empty.

Wide 16:9. No people. No text, letters, numbers or logos. The pages must be blank.
```

## Image 8: closing scene → `close-16x9.png`

```
Create a new image in the same studio style, but a bit darker, like early evening.

An empty modern desk facing the camera, with a charcoal office chair pulled out as if inviting someone to sit. A closed laptop is on the desk. One dark red desk lamp is switched on, making a warm circle of light. The feeling: "a seat ready for the next person". Put the desk in the BOTTOM RIGHT. Keep the TOP LEFT 60% as empty dark background because a big headline will go there.

Wide 16:9. No people. No text, letters, numbers or logos.
```

---

# Video: use Kling, not ChatGPT

ChatGPT images can't make this kind of scroll video. OpenAI's Sora may or may not be on your plan, so check before relying on it. Kling is the most reliable tool for a smooth camera orbit. Use it at **klingai.com**, or through **Higgsfield**.

## Video 1: orbit around the ticket sculpture → `sculpture-orbit.mp4`

1. Open Kling → **Image to Video**.
2. Upload **Image 5** (`sculpture-16x9.png`) as the **start frame**. Leave the end frame empty.
3. Settings: **16:9**, **10 seconds** (5 seconds is fine if 10 isn't available), **Professional / High quality** mode, **sound off**.
4. Paste this into **Prompt**:

```
The camera slowly and smoothly circles around the sculpture in one continuous half circle, moving from the front-left view to the opposite side, staying at the same height the whole time. The sculpture stays in the centre and fully in view at all times. The sculpture and the block do not move or change at all. The lighting stays the same. One single continuous shot, no cuts, no zoom, no shaking. Nothing enters or leaves the picture. Slow, smooth, cinematic.
```

5. Paste this into **Negative prompt**:

```
text, letters, numbers, people, hands, extra objects, morphing, melting, shape changing, flickering, cuts, scene change, camera shake, sudden zoom, fast movement
```

6. Make **2 or 3 versions** and keep the best one. Check that:
   - the sculpture keeps the same shape from start to end,
   - the camera never stops or reverses,
   - no extra objects appear.

**Optional:** to fix the ending view as well, first ask ChatGPT for this, then upload it in Kling as the **end frame**:

```
Same sculpture, same studio, same light, but seen from the opposite side (the back-right view).
```

## Video 2 (not recommended): slow push-in on your portrait

AI video often changes a face slightly frame by frame, and recruiters notice when you don't look like yourself. Without this video, the website still moves you in layers and follows the mouse, so your real face stays unchanged. If you still want to try it:

- Kling → Image to Video, start frame **Image 1**, 5 seconds.
- Prompt:

```
The camera moves very slowly and smoothly toward the man, from waist-up to chest-up. He stays still and only breathes naturally, looking at the camera. His face, glasses, hair and suit stay exactly the same in every frame. One continuous shot, no cuts, no shaking.
```

- Negative prompt: `face change, different person, morphing, blinking a lot, talking, smiling wider, text, cuts`

---

## When you're done

Put these files in `scrollcraft/builds/shengyao-report/assets/gen/`:

```
hero-16x9.png
hero-9x16.png
hero-scan-16x9.png
hero-plate-16x9.png    (optional)
sculpture-16x9.png
pl300-ring-3x4.png
hours-16x9.png
close-16x9.png
sculpture-orbit.mp4
```

Then tell me, and I'll check every file, prepare the video for scrolling, and build the site.
