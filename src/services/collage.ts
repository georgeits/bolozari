import { seedCollage } from "@/data/collage";
import type { CollageEntry, CollageStatus } from "@/lib/types";
import { createId } from "@/lib/utils";

const STORAGE_KEY = "bolo-zari-collage-v1";

function readStore(): CollageEntry[] {
  if (typeof window === "undefined") return [...seedCollage];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedCollage));
      return [...seedCollage];
    }
    const parsed = JSON.parse(raw) as CollageEntry[];
    if (!Array.isArray(parsed)) return [...seedCollage];
    return parsed;
  } catch {
    return [...seedCollage];
  }
}

function writeStore(items: CollageEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export interface CollageRepository {
  list(): Promise<CollageEntry[]>;
  create(input: {
    author: string;
    caption?: string;
    imageData: string;
    source: CollageEntry["source"];
  }): Promise<CollageEntry>;
  setStatus(id: string, status: CollageStatus): Promise<CollageEntry | null>;
}

class LocalCollageRepository implements CollageRepository {
  async list() {
    return readStore();
  }

  async create(input: {
    author: string;
    caption?: string;
    imageData: string;
    source: CollageEntry["source"];
  }) {
    const entry: CollageEntry = {
      id: createId("collage"),
      author: input.author.trim() || "ანონიმი",
      caption: input.caption?.trim() || undefined,
      imageData: input.imageData,
      status: "pending",
      rotation: Math.random() * 8 - 4,
      createdAt: new Date().toISOString(),
      source: input.source,
    };
    const items = [...readStore(), entry];
    writeStore(items);
    return entry;
  }

  async setStatus(id: string, status: CollageStatus) {
    const items = readStore();
    const idx = items.findIndex((i) => i.id === id);
    if (idx < 0) return null;
    items[idx] = { ...items[idx], status };
    writeStore(items);
    return items[idx];
  }
}

export const collageService: CollageRepository = new LocalCollageRepository();

/** Compress / resize an image file or data URL for localStorage safety. */
export async function compressImageData(
  source: string | Blob,
  maxEdge = 1100,
  quality = 0.82,
): Promise<string> {
  const objectUrl =
    typeof source === "string" ? source : URL.createObjectURL(source);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("image load failed"));
      el.src = objectUrl;
    });
    const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas unavailable");
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", quality);
  } finally {
    if (typeof source !== "string") URL.revokeObjectURL(objectUrl);
  }
}
