import struct, zlib, os

def create_rgba_png(path, w, h):
    def chunk(ctype, data):
        c = ctype + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xffffffff)
    sig = b'\x89PNG\r\n\x1a\n'
    # Color type 6 = RGBA
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 6, 0, 0, 0))
    raw = b''
    for y in range(h):
        raw += b'\x00'  # filter byte
        for x in range(w):
            # Simple gradient blue icon with full opacity
            r = int(51 + (x / w) * 100) % 256
            g = int(102 + (y / h) * 100) % 256
            b_val = int(200 + ((x + y) / (w + h)) * 55) % 256
            raw += bytes([r, g, b_val, 255])  # RGBA with alpha=255
    idat = chunk(b'IDAT', zlib.compress(raw))
    iend = chunk(b'IEND', b'')
    with open(path, 'wb') as f:
        f.write(sig + ihdr + idat + iend)
    print(f"  Created RGBA icon: {path} ({w}x{h})")

icons_dir = "src-tauri/icons"
os.makedirs(icons_dir, exist_ok=True)

create_rgba_png(f"{icons_dir}/32x32.png", 32, 32)
create_rgba_png(f"{icons_dir}/128x128.png", 128, 128)
create_rgba_png(f"{icons_dir}/128x128@2x.png", 256, 256)

# For .icns and .ico just copy the PNG as placeholder
import shutil
shutil.copy(f"{icons_dir}/128x128.png", f"{icons_dir}/icon.icns")
shutil.copy(f"{icons_dir}/32x32.png", f"{icons_dir}/icon.ico")
print("  Created icon.icns (placeholder)")
print("  Created icon.ico (placeholder)")
print("Done!")
