function hashString32(str) {
  let hash = 0x811c9dc5; // FNV offset basis

  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  return hash >>> 0; // force uint32
}


export function uidToColor(uid) {
  // Step 1: normalize input to 32-bit unsigned int
  let h = typeof uid === "number"
    ? uid >>> 0
    : hashString32(uid);

  // Step 2: mix (your original code)
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = h ^ (h >>> 16);

  // Step 3: RGB
  const r = (h >> 16) & 255;
  const g = (h >> 8) & 255;
  const b = h & 255;

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
