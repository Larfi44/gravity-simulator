#!/usr/bin/env python3
"""
generate-icons.py — Generate all platform icons from public/logo-gravity-simulator.png

Uses PIL to resize the source image to a 1024x1024 master PNG, then invokes
`cargo tauri icon` to produce all required icon formats (32x32, 128x128, etc.)
"""

import os, sys, subprocess
from PIL import Image

SOURCE = "public/logo-gravity-simulator.png"
TEMP_MASTER = "/tmp/gravity-icon-master.png"
ICONS_DIR = "src-tauri/icons"

# Ensure source exists
if not os.path.isfile(SOURCE):
    print(f"ERROR: Source icon not found: {SOURCE}", file=sys.stderr)
    sys.exit(1)

print(f"  Using source icon: {SOURCE}")

# Step 1: Open source, convert to RGBA, resize to 1024x1024 on dark background
img = Image.open(SOURCE).convert("RGBA")
img.thumbnail((1024, 1024), Image.Resampling.LANCZOS)

bg = Image.new("RGBA", (1024, 1024), (15, 23, 42, 255))
offset = ((1024 - img.width) // 2, (1024 - img.height) // 2)
bg.paste(img, offset, img)
bg.save(TEMP_MASTER)
print(f"  Master icon created: {TEMP_MASTER} (1024x1024)")

# Step 2: Remove old icons and generate new ones via cargo tauri icon
os.makedirs(ICONS_DIR, exist_ok=True)
print("  Generating all platform icons via cargo tauri icon...")
result = subprocess.run(
    ["cargo", "tauri", "icon", TEMP_MASTER, "--output", ICONS_DIR],
    capture_output=True, text=True, cwd="."
)
if result.returncode != 0:
    print(f"ERROR: cargo tauri icon failed:\n{result.stderr}", file=sys.stderr)
    sys.exit(1)
for line in result.stdout.splitlines():
    if line.strip():
        print(f"  {line}")

print("Done!")