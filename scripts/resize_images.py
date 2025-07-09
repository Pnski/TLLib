from PIL import Image
import os

# Adjust this path to where your images are (e.g., 'assets/', 'images/', '.')
SOURCE_DIR = 'Image/'
MAX_SIZE = 72

def resize_image(path):
    try:
        with Image.open(path) as img:
            width, height = img.size
            if width > MAX_SIZE or height > MAX_SIZE:
                img.thumbnail((MAX_SIZE, MAX_SIZE), Image.Resampling.LANCZOS)
                img.save(path)
                print(f"Resized: {path} → {img.size}")
    except Exception as e:
        print(f"Skipped: {path} ({e})")

def scan_and_resize(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif')):
                resize_image(os.path.join(root, file))

if __name__ == "__main__":
    scan_and_resize(SOURCE_DIR)