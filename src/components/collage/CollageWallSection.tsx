"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { COLLAGE_MOD_CODE, PHOTOBOOTH_STRIP_KEY } from "@/data/collage";
import type { CollageEntry } from "@/lib/types";
import { collageService, compressImageData } from "@/services/collage";
import { Button } from "@/components/ui/Button";
import { EditorialHeading, Eyebrow } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";

export function CollageWallSection() {
  const fileRef = useRef<HTMLInputElement>(null);
  const previewSourceRef = useRef<CollageEntry["source"]>("upload");

  const [entries, setEntries] = useState<CollageEntry[]>([]);
  const [author, setAuthor] = useState("");
  const [caption, setCaption] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const [modOpen, setModOpen] = useState(false);
  const [modUnlocked, setModUnlocked] = useState(false);
  const [modCode, setModCode] = useState("");
  const [boothStrip, setBoothStrip] = useState<string | null>(null);

  const refresh = async () => {
    setEntries(await collageService.list());
  };

  useEffect(() => {
    void refresh();
    try {
      setBoothStrip(sessionStorage.getItem(PHOTOBOOTH_STRIP_KEY));
    } catch {
      setBoothStrip(null);
    }
  }, []);

  const approved = useMemo(
    () => entries.filter((e) => e.status === "approved"),
    [entries],
  );
  const pending = useMemo(
    () => entries.filter((e) => e.status === "pending"),
    [entries],
  );

  const onPickFile = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setError(null);
    try {
      const data = await compressImageData(file);
      setPreview(data);
    } catch {
      setError("ფოტო ვერ დამუშავდა. სცადე სხვა ფაილი.");
    }
  };

  const usePhotoboothStrip = async () => {
    if (!boothStrip) return;
    setError(null);
    try {
      const data = await compressImageData(boothStrip, 1000, 0.85);
      setPreview(data);
    } catch {
      setError("ფირის ზოლი ვერ დაემატა.");
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!preview) {
      setError("ჯერ აირჩიე ან ატვირთე ფოტო.");
      return;
    }
    setStatus("saving");
    setError(null);
    await collageService.create({
      author,
      caption,
      imageData: preview,
      source: previewSourceRef.current,
    });
    setAuthor("");
    setCaption("");
    setPreview(null);
    previewSourceRef.current = "upload";
    setStatus("sent");
    await refresh();
    window.setTimeout(() => setStatus("idle"), 2200);
  };

  const unlockMod = (e: FormEvent) => {
    e.preventDefault();
    if (modCode.trim() === COLLAGE_MOD_CODE) {
      setModUnlocked(true);
      setError(null);
      setModCode("");
    } else {
      setError("მოდერაციის კოდი არასწორია.");
    }
  };

  const setEntryStatus = async (id: string, next: CollageEntry["status"]) => {
    await collageService.setStatus(id, next);
    await refresh();
  };

  return (
    <section
      id="collage"
      className="section-shell py-14 md:py-20"
      aria-labelledby="collage-heading"
    >
      <div className="mb-10 flex flex-col gap-4 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>საერთო კოლაჟი</Eyebrow>
          <EditorialHeading
            id="collage-heading"
            className="mt-3 text-[clamp(2rem,5vw,3.3rem)]"
          >
            კედელი, რომელსაც ერთად ვავსებთ
          </EditorialHeading>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal-soft">
            ატვირთე ფოტო ან ფოტობუტის ფირი. ახალი სურათები ჯერ მოდერაციაშია —
            დამტკიცების შემდეგ გამოჩნდება კედელზე.
          </p>
        </div>
        <p className="text-xs tracking-[0.18em] text-burgundy-pale">
          {approved.length} ფოტო კედელზე
        </p>
      </div>

      <div className="mb-8 columns-2 gap-3 sm:columns-3 md:columns-4 md:gap-4">
        {approved.map((item, index) => (
          <figure
            key={item.id}
            className={cn(
              "mb-3 break-inside-avoid overflow-hidden rounded-[1.4rem] border border-charcoal/8 bg-white/70 shadow-[0_10px_30px_rgba(40,20,24,0.06)] md:mb-4",
              index % 5 === 0 && "rounded-[1.8rem]",
            )}
            style={{ transform: `rotate(${item.rotation}deg)` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageData}
              alt={item.caption || item.author}
              className="w-full object-cover"
            />
            <figcaption className="px-3 py-2.5">
              <p className="font-editorial text-sm text-charcoal">
                {item.caption || "მოგონება"}
              </p>
              <p className="mt-0.5 text-[0.68rem] tracking-wide text-burgundy-pale">
                {item.author}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <form
          onSubmit={(e) => void onSubmit(e)}
          className="rounded-[2rem] border border-charcoal/8 bg-ivory-soft p-5 md:p-7"
        >
          <p className="text-xs tracking-[0.18em] text-burgundy-pale">დაამატე შენი</p>
          <p className="font-editorial mt-2 text-2xl text-charcoal">ფოტო კედელზე</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="text-xs tracking-[0.14em] text-charcoal-soft">
              სახელი
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                className="mt-2 w-full rounded-[1.1rem] border border-charcoal/10 bg-white/70 px-4 py-3 text-sm text-charcoal outline-none focus:border-burgundy/40"
                placeholder="სახელი"
              />
            </label>
            <label className="text-xs tracking-[0.14em] text-charcoal-soft">
              წარწერა (არასავალდებულო)
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="mt-2 w-full rounded-[1.1rem] border border-charcoal/10 bg-white/70 px-4 py-3 text-sm text-charcoal outline-none focus:border-burgundy/40"
                placeholder="მაგ. ბოლო შესვენება"
              />
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" variant="ghost" onClick={() => fileRef.current?.click()}>
              ატვირთე ფოტო
            </Button>
            {boothStrip ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  previewSourceRef.current = "photobooth";
                  void usePhotoboothStrip();
                }}
              >
                ფოტობუტის ფირი
              </Button>
            ) : null}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                previewSourceRef.current = "upload";
                void onPickFile(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {preview ? (
            <div className="mt-4 overflow-hidden rounded-[1.4rem] border border-charcoal/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="გადასახედი" className="max-h-64 w-full object-cover" />
            </div>
          ) : null}

          {error ? <p className="mt-3 text-sm text-burgundy">{error}</p> : null}
          {status === "sent" ? (
            <p className="mt-3 text-sm text-charcoal-soft">
              გაიგზავნა მოდერაციაში. დამტკიცების შემდეგ გამოჩნდება კედელზე.
            </p>
          ) : null}

          <Button type="submit" className="mt-5" disabled={status === "saving" || !preview}>
            {status === "saving" ? "იგზავნება…" : "გაგზავნა მოდერაციაში"}
          </Button>
        </form>

        <aside className="rounded-[2rem] border border-charcoal/8 bg-white/55 p-5 md:p-7">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs tracking-[0.18em] text-burgundy-pale">მოდერაცია</p>
              <p className="font-editorial mt-1 text-xl text-charcoal">
                მოლოდინში: {pending.length}
              </p>
            </div>
            <Button
              variant="ghost"
              className="!px-3 !py-2 text-xs"
              onClick={() => setModOpen((v) => !v)}
            >
              {modOpen ? "დახურვა" : "გახსნა"}
            </Button>
          </div>

          {modOpen ? (
            <div className="mt-4">
              {!modUnlocked ? (
                <form onSubmit={unlockMod} className="flex flex-wrap gap-2">
                  <input
                    value={modCode}
                    onChange={(e) => setModCode(e.target.value)}
                    type="password"
                    placeholder="მოდერაციის კოდი"
                    className="min-w-[10rem] flex-1 rounded-[1rem] border border-charcoal/10 bg-ivory px-3 py-2 text-sm outline-none focus:border-burgundy/40"
                  />
                  <Button type="submit" className="!py-2 text-sm">
                    შესვლა
                  </Button>
                </form>
              ) : pending.length === 0 ? (
                <p className="mt-2 text-sm text-charcoal-soft">ახალი ფოტოები არ არის.</p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {pending.map((item) => (
                    <li
                      key={item.id}
                      className="overflow-hidden rounded-[1.2rem] border border-charcoal/10 bg-ivory-soft"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.imageData} alt="" className="h-32 w-full object-cover" />
                      <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                        <div>
                          <p className="text-sm text-charcoal">{item.author}</p>
                          <p className="text-[0.7rem] text-charcoal-soft">
                            {item.caption || item.source}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            className="!px-3 !py-1.5 text-xs"
                            onClick={() => void setEntryStatus(item.id, "approved")}
                          >
                            დამტკიცება
                          </Button>
                          <Button
                            variant="ghost"
                            className="!px-3 !py-1.5 text-xs"
                            onClick={() => void setEntryStatus(item.id, "rejected")}
                          >
                            უარყოფა
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="mt-3 text-sm text-charcoal-soft">
              მოდერატორისთვის: გახსენი პანელი და შეიყვანე კოდი. ნაგულისხმევი კოდია{" "}
              <code className="rounded bg-ivory px-1">12b2027</code> — შეცვალე{" "}
              <code className="rounded bg-ivory px-1">src/data/collage.ts</code>-ში სანამ
              საიტს გაუზიარებ.
            </p>
          )}
        </aside>
      </div>
    </section>
  );
}
