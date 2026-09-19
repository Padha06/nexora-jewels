// Shared math + real-product cutouts for per-product AR try-on.
// Face anchors: MediaPipe FaceLandmarker (478 pts). Hand anchors: HandLandmarker (21 pts).
import { get, set } from 'idb-keyval';

export interface Pt {
  x: number;
  y: number;
}

export const FACE = { LEFT_EAR: 234, RIGHT_EAR: 454, CHIN: 152 };
export const HAND = { WRIST: 0, INDEX_MCP: 5, RING_MCP: 13, RING_PIP: 14, PINKY_MCP: 17 };

export function dist(a: Pt, b: Pt): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
export function mid(a: Pt, b: Pt): Pt {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}
export function segAngle(a: Pt, b: Pt): number {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

// Jitter smoothing — one instance per tracker session.
export class Smoother {
  private map = new Map<string, Pt>();
  constructor(private alpha = 0.35) {}
  ema(key: string, p: Pt): Pt {
    const prev = this.map.get(key);
    const n = prev
      ? { x: prev.x + this.alpha * (p.x - prev.x), y: prev.y + this.alpha * (p.y - prev.y) }
      : p;
    this.map.set(key, n);
    return n;
  }
  reset() {
    this.map.clear();
  }
}

// ---- Real product cutouts ----
// Raw photo loads instantly so the camera goes live immediately; the AI
// cutout then upgrades the overlay in the background. Every AI step has a
// timeout — the mirror NEVER waits on a stuck download.
const cutoutCache = new Map<string, Promise<CanvasImageSource | null>>();

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | undefined> {
  return Promise.race([p, new Promise<undefined>((res) => setTimeout(() => res(undefined), ms))]);
}

function loadRaw(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Instant, no-AI photo — render this first so try-on is never blocked.
export async function getRawImage(src: string): Promise<HTMLImageElement | null> {
  try {
    return await withTimeout(loadRaw(src), 15000).then((r) => r ?? null);
  } catch {
    return null;
  }
}

export function getProductCutout(src: string): Promise<CanvasImageSource | null> {
  if (!cutoutCache.has(src)) {
    cutoutCache.set(
      src,
      (async () => {
        try {
          // Check IndexedDB cache first for instant loading on return visits
          const cachedBlob = await withTimeout(get(`cutout_${src}`), 5000);
          if (cachedBlob) {
            return await createImageBitmap(cachedBlob);
          }

          // AI background removal — each step time-boxed so a slow network
          // falls back to the raw photo instead of hanging the mirror.
          const cdn = 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/+esm';
          const mod = (await withTimeout(import(/* webpackIgnore: true */ cdn), 20000)) as
            | { removeBackground: (src: string) => Promise<Blob> }
            | undefined;
          if (!mod) return await loadRaw(src);
          const blob = (await withTimeout(mod.removeBackground(src), 45000)) as Blob | undefined;
          if (!blob) return await loadRaw(src);

          // Save to IndexedDB for next time
          try {
            await set(`cutout_${src}`, blob);
          } catch {
            /* storage full/blocked — non-fatal */
          }

          return await createImageBitmap(blob);
        } catch {
          try {
            const img = await loadRaw(src);
            return await createImageBitmap(img);
          } catch {
            return null;
          }
        }
      })()
    );
  }
  return cutoutCache.get(src)!;
}

export function sourceSize(s: CanvasImageSource): { w: number; h: number } {
  const r = s as { width?: number; height?: number; naturalWidth?: number; naturalHeight?: number };
  return { w: r.width ?? r.naturalWidth ?? 100, h: r.height ?? r.naturalHeight ?? 100 };
}

// Draw a source fitted (contain) into a box centered at (x,y), rotated.
export function drawFitted(
  ctx: CanvasRenderingContext2D,
  src: CanvasImageSource,
  x: number,
  y: number,
  boxW: number,
  boxH: number,
  rotation = 0,
  mirror = false
) {
  const { w, h } = sourceSize(src);
  const k = Math.min(boxW / w, boxH / h);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  if (mirror) ctx.scale(-1, 1);
  ctx.drawImage(src, (-w * k) / 2, (-h * k) / 2, w * k, h * k);
  ctx.restore();
}
