# Tile screenshots into one contact sheet for quick review.
# Usage: python scripts/sheet.py <out.png> <cols> <scale> <files...>
import sys
from PIL import Image

out, cols, scale, files = sys.argv[1], int(sys.argv[2]), float(sys.argv[3]), sys.argv[4:]
ims = [Image.open(f).convert("RGB") for f in files]
w, h = ims[0].size
W, H = int(w * scale), int(h * scale)
rows = (len(ims) + cols - 1) // cols
sheet = Image.new("RGB", (W * cols, H * rows), "white")
for i, im in enumerate(ims):
    sheet.paste(im.resize((W, H)), ((i % cols) * W, (i // cols) * H))
sheet.save(out)
print(out, sheet.size)
