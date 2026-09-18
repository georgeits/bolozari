"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EditorialHeading, Eyebrow } from "@/components/ui/Typography";
import { PHOTOBOOTH_STRIP_KEY } from "@/data/collage";
import { cn } from "@/lib/utils";

const SLOT_COUNT = 3;
const STRIP_LABELS = ["2027 წელი", "ბოლო ზარი", "12ბ კლასი"] as const;

type Mode = "choose" | "camera" | "upload" | "develop" | "done";

type FilterId = "none" | "film" | "bw" | "sepia" | "blush" | "cool";

type StickerId =
  | "heart"
  | "star"
  | "bell"
  | "year"
  | "class"
  | "bolo"
  | "spark"
  | "crown";

type PlacedSticker = {
  id: string;
  stickerId: StickerId;
  /** 0–1 relative to strip width/height */
  x: number;
  y: number;
  scale: number;
  rotation: number;
};

const FILTERS: { id: FilterId; label: string; css: string }[] = [
  { id: "none", label: "ნორმალი", css: "none" },
  { id: "film", label: "ფირი", css: "contrast(1.08) saturate(0.85) sepia(0.18)" },
  { id: "bw", label: "შავ-თეთრი", css: "grayscale(1) contrast(1.12)" },
  { id: "sepia", label: "სეპია", css: "sepia(0.75) contrast(1.05)" },
  { id: "blush", label: "ბურგუნდი", css: "contrast(1.05) saturate(1.15) hue-rotate(-8deg)" },
  { id: "cool", label: "ცივი", css: "saturate(0.7) brightness(1.05) hue-rotate(12deg)" },
];

const STICKERS: { id: StickerId; label: string; glyph: string }[] = [
  { id: "heart", label: "გული", glyph: "♡" },
  { id: "star", label: "ვარსკვლავი", glyph: "★" },
  { id: "bell", label: "ზარი", glyph: "🔔" },
  { id: "spark", label: "ნაპერწკალი", glyph: "✦" },
  { id: "crown", label: "გვირგვინი", glyph: "♛" },
  { id: "year", label: "2027", glyph: "2027" },
  { id: "class", label: "12ბ", glyph: "12ბ" },
  { id: "bolo", label: "ბოლო ზარი", glyph: "ბოლო ზარი" },
];

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image load failed"));
    img.src = src;
  });
}

function applyFilterToImage(
  img: HTMLImageElement,
  filterId: FilterId,
  destW: number,
  destH: number,
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = destW;
  canvas.height = destH;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const scale = Math.max(destW / img.width, destH / img.height);
  const sw = destW / scale;
  const sh = destH / scale;
  const sx = (img.width - sw) / 2;
  const sy = (img.height - sh) / 2;

  const filterCss = FILTERS.find((f) => f.id === filterId)?.css ?? "none";
  ctx.filter = filterCss === "none" ? "none" : filterCss;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, destW, destH);
  ctx.filter = "none";

  // Extra washes that CSS filter alone cannot express well
  if (filterId === "film" || filterId === "blush") {
    ctx.fillStyle = "rgba(122, 58, 66, 0.14)";
    ctx.fillRect(0, 0, destW, destH);
  }
  if (filterId === "cool") {
    ctx.fillStyle = "rgba(70, 110, 140, 0.12)";
    ctx.fillRect(0, 0, destW, destH);
  }
  if (filterId === "sepia") {
    ctx.fillStyle = "rgba(160, 110, 60, 0.1)";
    ctx.fillRect(0, 0, destW, destH);
  }

  return canvas;
}

function drawSticker(
  ctx: CanvasRenderingContext2D,
  sticker: PlacedSticker,
  stripW: number,
  stripH: number,
) {
  const meta = STICKERS.find((s) => s.id === sticker.stickerId);
  if (!meta) return;
  const x = sticker.x * stripW;
  const y = sticker.y * stripH;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((sticker.rotation * Math.PI) / 180);
  ctx.scale(sticker.scale, sticker.scale);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const isText = sticker.stickerId === "year" || sticker.stickerId === "class" || sticker.stickerId === "bolo";
  if (isText) {
    ctx.font =
      sticker.stickerId === "bolo"
        ? "600 28px 'Noto Serif Georgian', Georgia, serif"
        : "700 34px 'Noto Sans Georgian', system-ui, sans-serif";
    ctx.fillStyle = "rgba(243, 239, 230, 0.95)";
    ctx.strokeStyle = "rgba(20, 17, 15, 0.55)";
    ctx.lineWidth = 4;
    ctx.strokeText(meta.glyph, 0, 0);
    ctx.fillText(meta.glyph, 0, 0);
  } else {
    ctx.font = "48px 'Apple Color Emoji', 'Segoe UI Emoji', sans-serif";
    ctx.fillText(meta.glyph, 0, 0);
  }
  ctx.restore();
}

async function composeFilmStrip(
  photos: string[],
  filterId: FilterId,
  stickers: PlacedSticker[],
): Promise<string> {
  const width = 720;
  const sidePad = 56;
  const topPad = 110;
  const bottomPad = 120;
  const gap = 28;
  const frameW = width - sidePad * 2;
  const frameH = Math.round(frameW * 1.15);
  const height = topPad + SLOT_COUNT * frameH + (SLOT_COUNT - 1) * gap + bottomPad;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas unavailable");

  ctx.fillStyle = "#14110f";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "rgba(90, 60, 45, 0.18)";
  ctx.fillRect(0, 0, width, height);

  const holeR = 10;
  const holeXs = [22, width - 22];
  for (let y = 36; y < height - 24; y += 42) {
    for (const x of holeXs) {
      ctx.beginPath();
      ctx.fillStyle = "#f3efe6";
      ctx.arc(x, y, holeR, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "#14110f";
      ctx.arc(x, y, holeR - 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.fillStyle = "#f3efe6";
  ctx.font = "600 42px 'Noto Serif Georgian', Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("ბოლო ზარი", width / 2, 52);
  ctx.font = "500 18px 'Noto Sans Georgian', system-ui, sans-serif";
  ctx.fillStyle = "rgba(243, 239, 230, 0.72)";
  ctx.fillText("2027 წელი  ·  12ბ კლასი", width / 2, 82);

  const images = await Promise.all(photos.map(loadImage));

  images.forEach((img, i) => {
    const x = sidePad;
    const y = topPad + i * (frameH + gap);

    ctx.fillStyle = "#f7f3eb";
    ctx.fillRect(x - 8, y - 8, frameW + 16, frameH + 16);

    const filtered = applyFilterToImage(img, filterId, frameW, frameH);
    ctx.drawImage(filtered, x, y);

    ctx.fillStyle = "rgba(243, 239, 230, 0.9)";
    ctx.font = "500 16px 'Noto Sans Georgian', system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText(STRIP_LABELS[i] ?? "", x, y + frameH + 20);
  });

  stickers.forEach((sticker) => drawSticker(ctx, sticker, width, height));

  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(243, 239, 230, 0.55)";
  ctx.font = "400 14px 'Noto Sans Georgian', system-ui, sans-serif";
  ctx.fillText("ციფრული ფოტობუტი · კლასი 2027", width / 2, height - 36);

  return canvas.toDataURL("image/jpeg", 0.92);
}

export function PhotoboothSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const stripStageRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<Mode>("choose");
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null]);
  const [stripUrl, setStripUrl] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [revealed, setRevealed] = useState(0);
  const [filterId, setFilterId] = useState<FilterId>("film");
  const [stickers, setStickers] = useState<PlacedSticker[]>([]);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);

  const filled = slots.filter(Boolean).length;
  const nextIndex = slots.findIndex((s) => !s);
  const previewFilter = FILTERS.find((f) => f.id === filterId)?.css ?? "none";

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  // Re-develop when filter/stickers change after a strip already exists
  useEffect(() => {
    if (mode !== "done" || filled < SLOT_COUNT) return;
    let cancelled = false;
    const photos = slots.filter((s): s is string => Boolean(s));
    void composeFilmStrip(photos, filterId, stickers).then((url) => {
      if (!cancelled) {
        setStripUrl(url);
        try {
          sessionStorage.setItem(PHOTOBOOTH_STRIP_KEY, url);
        } catch {
          // ignore
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, [filterId, stickers, mode, filled, slots]);

  const startCamera = async () => {
    setCameraError(null);
    setMode("camera");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setCameraError("კამერაზე წვდომა ვერ მოხერხდა. სცადე ატვირთვა.");
      setMode("choose");
    }
  };

  const captureFrame = () => {
    const video = videoRef.current;
    if (!video || nextIndex < 0) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 960;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);
    const data = canvas.toDataURL("image/jpeg", 0.9);
    setSlots((prev) => {
      const next = [...prev];
      next[nextIndex] = data;
      return next;
    });
  };

  const onUploadFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const remaining = SLOT_COUNT - filled;
    Array.from(files)
      .slice(0, remaining)
      .forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = typeof reader.result === "string" ? reader.result : null;
          if (!result) return;
          setSlots((prev) => {
            const next = [...prev];
            const idx = next.findIndex((s) => !s);
            if (idx >= 0) next[idx] = result;
            return next;
          });
        };
        reader.readAsDataURL(file);
      });
    setMode("upload");
  };

  const clearSlot = (index: number) => {
    setSlots((prev) => {
      const next = [...prev];
      next[index] = null;
      return next;
    });
    setStripUrl(null);
    setRevealed(0);
    if (mode === "done" || mode === "develop") setMode("choose");
  };

  const resetAll = () => {
    stopCamera();
    setSlots([null, null, null]);
    setStripUrl(null);
    setRevealed(0);
    setStickers([]);
    setSelectedStickerId(null);
    setMode("choose");
    setCameraError(null);
  };

  const addSticker = (stickerId: StickerId) => {
    const count = stickers.filter((s) => s.stickerId === stickerId).length;
    const placed: PlacedSticker = {
      id: `${stickerId}-${Date.now()}`,
      stickerId,
      x: 0.28 + (count % 3) * 0.18,
      y: 0.28 + Math.floor(count / 3) * 0.16 + Math.random() * 0.04,
      scale: stickerId === "bolo" ? 0.85 : 1,
      rotation: -12 + Math.random() * 24,
    };
    setStickers((prev) => [...prev, placed]);
    setSelectedStickerId(placed.id);
  };

  const onStripPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!selectedStickerId || !stripStageRef.current) return;
    const rect = stripStageRef.current.getBoundingClientRect();
    const x = Math.min(0.92, Math.max(0.08, (e.clientX - rect.left) / rect.width));
    const y = Math.min(0.92, Math.max(0.08, (e.clientY - rect.top) / rect.height));
    setStickers((prev) =>
      prev.map((s) => (s.id === selectedStickerId ? { ...s, x, y } : s)),
    );
  };

  const develop = async () => {
    if (filled < SLOT_COUNT) return;
    const photos = slots.filter((s): s is string => Boolean(s));
    setBusy(true);
    setMode("develop");
    setRevealed(0);
    stopCamera();
    try {
      const url = await composeFilmStrip(photos, filterId, stickers);
      setStripUrl(url);
      try {
        sessionStorage.setItem(PHOTOBOOTH_STRIP_KEY, url);
      } catch {
        // ignore quota / private mode
      }
      for (let i = 1; i <= SLOT_COUNT; i++) {
        await new Promise((r) => window.setTimeout(r, 420));
        setRevealed(i);
      }
      setMode("done");
    } catch {
      setMode("choose");
    } finally {
      setBusy(false);
    }
  };

  const downloadStrip = () => {
    if (!stripUrl) return;
    const a = document.createElement("a");
    a.href = stripUrl;
    a.download = "bolo-zari-2027-photobooth.jpg";
    a.click();
  };

  return (
    <section
      id="photobooth"
      className="section-shell py-14 md:py-20"
      aria-labelledby="photobooth-heading"
    >
      <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>ფოტობუტი</Eyebrow>
          <EditorialHeading
            id="photobooth-heading"
            className="mt-3 text-[clamp(2rem,5vw,3.3rem)]"
          >
            სამი კადრი — ერთი ფირი
          </EditorialHeading>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal-soft">
            გადაიღე ან ატვირთე სამი ფოტო, აირჩიე ფილტრი და დაამატე სტიკერები.
            ფირი გამოვა წარწერებით: 2027 წელი, ბოლო ზარი, 12ბ კლასი.
          </p>
        </div>
        <p className="text-xs tracking-[0.18em] text-burgundy-pale">
          {filled}/{SLOT_COUNT} კადრი
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[2.2rem] border border-charcoal/8 bg-ivory-soft p-4 md:p-6">
          {mode === "camera" ? (
            <div className="relative overflow-hidden rounded-[1.6rem] bg-charcoal">
              <video
                ref={videoRef}
                playsInline
                muted
                className="aspect-[4/3] w-full scale-x-[-1] object-cover"
                style={{ filter: previewFilter === "none" ? undefined : previewFilter }}
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-4">
                <Button variant="dark" onClick={resetAll}>
                  გაუქმება
                </Button>
                <Button onClick={captureFrame} disabled={nextIndex < 0} className="min-w-[8rem]">
                  {nextIndex < 0 ? "სავსეა" : `გადაღება ${nextIndex + 1}`}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[16rem] flex-col items-center justify-center gap-4 rounded-[1.6rem] border border-dashed border-charcoal/15 bg-white/45 px-6 py-10 text-center md:min-h-[18rem]">
              <p className="font-editorial text-2xl text-charcoal">
                აირჩიე როგორ შეავსო ფირი
              </p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
                <Button onClick={() => void startCamera()}>კამერა</Button>
                <Button variant="ghost" onClick={() => fileRef.current?.click()}>
                  ატვირთვა
                </Button>
              </div>
              {cameraError ? <p className="text-sm text-burgundy">{cameraError}</p> : null}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => {
                  onUploadFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>
          )}

          <ul className="mt-5 grid grid-cols-3 gap-3">
            {slots.map((slot, i) => (
              <li
                key={i}
                className="relative aspect-[3/4] overflow-hidden rounded-[1.2rem] border border-charcoal/10 bg-white/60"
              >
                {slot ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={slot}
                      alt={`კადრი ${i + 1}`}
                      className="h-full w-full object-cover"
                      style={{ filter: previewFilter === "none" ? undefined : previewFilter }}
                    />
                    <button
                      type="button"
                      onClick={() => clearSlot(i)}
                      className="absolute right-2 top-2 rounded-full bg-charcoal/70 px-2 py-1 text-[0.65rem] tracking-wide text-ivory"
                    >
                      წაშლა
                    </button>
                  </>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-1 px-2 text-center">
                    <span className="font-editorial text-xl text-burgundy-pale">{i + 1}</span>
                    <span className="text-[0.65rem] tracking-[0.14em] text-charcoal-soft">
                      {STRIP_LABELS[i]}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="mt-6">
            <p className="text-xs tracking-[0.18em] text-burgundy-pale">ფილტრები</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterId(f.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-[0.75rem] tracking-wide transition",
                    filterId === f.id
                      ? "border-burgundy bg-burgundy text-ivory"
                      : "border-charcoal/12 bg-white/55 text-charcoal-soft hover:border-burgundy/35",
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xs tracking-[0.18em] text-burgundy-pale">სტიკერები</p>
            <p className="mt-1 text-[0.7rem] text-charcoal-soft">
              დააჭირე სტიკერს დასამატებლად. მარჯვნივ დააკლიკე ზოლს გადასაადგილებლად.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {STICKERS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => addSticker(s.id)}
                  className="rounded-[1rem] border border-charcoal/12 bg-white/60 px-3 py-2 text-sm text-charcoal transition hover:border-burgundy/40"
                  title={s.label}
                >
                  {s.glyph}
                </button>
              ))}
            </div>
            {stickers.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  className="!px-3 !py-2 text-xs"
                  onClick={() => {
                    setStickers([]);
                    setSelectedStickerId(null);
                  }}
                >
                  სტიკერების წაშლა
                </Button>
                {selectedStickerId ? (
                  <Button
                    variant="ghost"
                    className="!px-3 !py-2 text-xs"
                    onClick={() => {
                      setStickers((prev) => prev.filter((s) => s.id !== selectedStickerId));
                      setSelectedStickerId(null);
                    }}
                  >
                    არჩეულის წაშლა
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={() => void develop()} disabled={filled < SLOT_COUNT || busy}>
              {busy ? "ვანვითარებთ…" : "ფირის განვითარება"}
            </Button>
            <Button variant="ghost" onClick={resetAll}>
              თავიდან
            </Button>
            {mode === "upload" && filled < SLOT_COUNT ? (
              <Button variant="ghost" onClick={() => fileRef.current?.click()}>
                კიდევ ატვირთე
              </Button>
            ) : null}
          </div>
        </div>

        <aside className="flex flex-col rounded-[2.2rem] border border-charcoal/8 bg-[#14110f] p-5 text-ivory md:p-7">
          <p className="text-[0.7rem] tracking-[0.22em] text-burgundy-dust">FILM STRIP</p>
          <p className="font-editorial mt-2 text-2xl">შენი ზოლი</p>
          <p className="mt-2 text-sm text-white/60">
            აირჩიე სტიკერი, შემდეგ დააკლიკე ზოლს — გადაადგილდება.
          </p>

          <div className="mt-6 flex flex-1 justify-center">
            {stripUrl ? (
              <div
                ref={stripStageRef}
                className="relative w-full max-w-[20rem] cursor-crosshair"
                onPointerDown={onStripPointer}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={stripUrl}
                  alt="განვითარებული ფირის ზოლი"
                  className="pointer-events-none w-full rounded-[1.2rem] shadow-[0_20px_50px_rgba(0,0,0,0.45)] transition duration-700"
                  style={{
                    clipPath:
                      revealed >= SLOT_COUNT
                        ? "inset(0 0 0 0)"
                        : `inset(0 0 ${Math.max(0, 100 - revealed * 33)}% 0)`,
                  }}
                  draggable={false}
                />
              </div>
            ) : (
              <div className="flex w-full max-w-[14rem] flex-col gap-3 opacity-70">
                {STRIP_LABELS.map((label, i) => (
                  <div
                    key={label}
                    className="rounded-[0.9rem] border border-dashed border-white/20 px-3 py-8 text-center"
                  >
                    <p className="text-[0.65rem] tracking-[0.16em] text-white/45">კადრი {i + 1}</p>
                    <p className="mt-2 font-editorial text-lg text-white/80">{label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {mode === "done" && stripUrl ? (
            <Button className="mt-6 w-full" onClick={downloadStrip}>
              ჩამოტვირთე ფირი
            </Button>
          ) : null}
        </aside>
      </div>
    </section>
  );
}
