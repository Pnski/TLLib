from PIL import Image
import os

SOURCE_DIR = 'Image'
MAX_SIZE = 72

for root, _, files in os.walk(SOURCE_DIR):
    for file in files:
        if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif')):
            path = os.path.join(root, file)
            try:
                with Image.open(path) as img:
                    x, y = img.size
                    if x > MAX_SIZE or y > MAX_SIZE:
                        img.thumbnail((MAX_SIZE, MAX_SIZE), Image.Resampling.LANCZOS)
                        img.save(path)
            except Exception as e:
                print(f"Skipped: {path} ({e})")