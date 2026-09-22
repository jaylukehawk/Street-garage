import type { PlateBox } from "./types";

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not read photo"));
    img.src = src;
  });
}

async function blobFrom(source: Blob | string) {
  if (typeof source !== "string") return source;
  const res = await fetch(source);
  return res.blob();
}

export async function resizeToJpeg(
  source: Blob | string,
  maxEdge = 1280,
  quality = 0.82,
): Promise<string> {
  const blob = await blobFrom(source);
  let bitmap: ImageBitmap | HTMLImageElement;
  if (typeof createImageBitmap === "function") {
    bitmap = await createImageBitmap(blob, { imageOrientation: "from-image" } as ImageBitmapOptions);
  } else {
    bitmap = await loadImage(URL.createObjectURL(blob));
  }
  const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
  const w = Math.max(1, Math.round(bitmap.width * scale));
  const h = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, w, h);
  if ("close" in bitmap && typeof bitmap.close === "function") bitmap.close();
  return canvas.toDataURL("image/jpeg", quality);
}

function isYellowPlate(r: number, g: number, b: number) {
  return r > 145 && g > 105 && b < 145 && r - b > 45 && g - b > 20;
}

function isWhitePlate(r: number, g: number, b: number) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max > 155 && max - min < 48 && (r + g + b) / 3 > 158;
}

type PixelBox = { x: number; y: number; w: number; h: number };

const FALLBACK_ZONES: PlateBox[] = [];
  

function detectPlateBoxes(ctx: CanvasRenderingContext2D, width: number, height: number): PixelBox[] {
  const sampleW = 160;
  const sampleH = Math.max(1, Math.round((height / width) * sampleW));
  const tmp = document.createElement("canvas");
  tmp.width = sampleW;
  tmp.height = sampleH;
  const tctx = tmp.getContext("2d");
  if (!tctx) return [];
  tctx.drawImage(ctx.canvas, 0, 0, sampleW, sampleH);
  const { data } = tctx.getImageData(0, 0, sampleW, sampleH);
  const mask = new Uint8Array(sampleW * sampleH);
  for (let i = 0; i < mask.length; i++) {
    const o = i * 4;
    const y = Math.floor(i / sampleW);
    if (y < sampleH * 0.12) continue;
    const r = data[o] ?? 0;
    const g = data[o + 1] ?? 0;
    const b = data[o + 2] ?? 0;
    mask[i] = isYellowPlate(r, g, b) || isWhitePlate(r, g, b) ? 1 : 0;
  }

  const visited = new Uint8Array(mask.length);
  const boxes: PixelBox[] = [];
  const sx = width / sampleW;
  const sy = height / sampleH;

  for (let i = 0; i < mask.length; i++) {
    if (!mask[i] || visited[i]) continue;
    const stack = [i];
    visited[i] = 1;
    let minX = sampleW;
    let minY = sampleH;
    let maxX = 0;
    let maxY = 0;
    let count = 0;
    while (stack.length) {
      const idx = stack.pop()!;
      const x = idx % sampleW;
      const y = Math.floor(idx / sampleW);
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      count += 1;
      const neigh = [idx - 1, idx + 1, idx - sampleW, idx + sampleW];
      for (const n of neigh) {
        if (n < 0 || n >= mask.length || visited[n] || !mask[n]) continue;
        visited[n] = 1;
        stack.push(n);
      }
    }
    const bw = maxX - minX + 1;
    const bh = maxY - minY + 1;
    const aspect = bw / Math.max(1, bh);
    if (count < 12 || bh < 2 || bw < 8) continue;
    if (aspect < 1.6 || aspect > 12) continue;
    boxes.push({
      x: (minX - 2) * sx,
      y: (minY - 2) * sy,
      w: (bw + 4) * sx,
      h: (bh + 4) * sy,
    });
  }
  return boxes;
}

function pixelateRegion(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  block = 12,
) {
  const left = Math.max(0, Math.floor(x));
  const top = Math.max(0, Math.floor(y));
  const width = Math.min(ctx.canvas.width - left, Math.ceil(w));
  const height = Math.min(ctx.canvas.height - top, Math.ceil(h));
  if (width < 4 || height < 4) return;
  const slice = document.createElement("canvas");
  const sw = Math.max(1, Math.round(width / block));
  const sh = Math.max(1, Math.round(height / block));
  slice.width = sw;
  slice.height = sh;
  const sctx = slice.getContext("2d");
  if (!sctx) return;
  sctx.imageSmoothingEnabled = false;
  sctx.drawImage(ctx.canvas, left, top, width, height, 0, 0, sw, sh);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(slice, 0, 0, sw, sh, left, top, width, height);
  ctx.imageSmoothingEnabled = true;
}

function obliterateRegion(ctx: CanvasRenderingContext2D, box: PixelBox) {
  const block = Math.max(18, Math.round(Math.min(box.w, box.h) / 2.2));
  pixelateRegion(ctx, box.x - 8, box.y - 8, box.w + 16, box.h + 16, block);
  ctx.fillStyle = "rgba(11, 31, 58, 0.62)";
  const r = Math.min(8, box.w / 6, box.h / 3);
  if (typeof ctx.roundRect === "function") {
    ctx.beginPath();
    ctx.roundRect(box.x, box.y, box.w, box.h, r);
    ctx.fill();
  } else {
    ctx.fillRect(box.x, box.y, box.w, box.h);
  }
}

export async function blurPlates(dataUrl: string, extra: PlateBox[] = []) {
  const img = await loadImage(dataUrl);
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0);
  const detected = detectPlateBoxes(ctx, img.width, img.height);
  const extras = [...FALLBACK_ZONES, ...extra].map((box) => ({
    x: (box.x - 0.05) * img.width,
    y: (box.y - 0.05) * img.height,
    w: (box.w + 0.1) * img.width,
    h: (box.h + 0.1) * img.height,
  }));
  for (const box of [...detected, ...extras]) {
    obliterateRegion(ctx, box);
  }
  return canvas.toDataURL("image/jpeg", 0.82);
}

export async function prepareScanPhoto(source: Blob | string, extra: PlateBox[] = []) {
  const working = await resizeToJpeg(source, 1280, 0.84);
  const blurred = await blurPlates(working, extra);
  const stored = await resizeToJpeg(blurred, 720, 0.72);
  return { identify: working, stored };
}
