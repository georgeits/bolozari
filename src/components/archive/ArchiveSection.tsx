"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { archiveCategories, archiveItems } from "@/data/archive";
import { Lightbox } from "@/components/ui/Lightbox";
import { EditorialHeading, Eyebrow } from "@/components/ui/Typography";
import type { ArchiveItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ArchiveSection() {
  const [filter, setFilter] = useState<(typeof archiveCategories)[number]>(
    "ყველა",
  );
  const [active, setActive] = useState<ArchiveItem | null>(null);

  const items = useMemo(() => {
    if (filter === "ყველა") return archiveItems;
    return archiveItems.filter((item) => item.category === filter);
  }, [filter]);

  return (
    <section
      id="archive"
      className="section-shell py-14 md:py-20"
      aria-labelledby="archive-heading"
    >
      <div className="mb-8 md:mb-12">
        <Eyebrow>არქივი</Eyebrow>
        <EditorialHeading
          id="archive-heading"
          className="mt-3 text-[clamp(2rem,5vw,3.4rem)]"
        >
          მომენტები, რომლებიც დარჩა
        </EditorialHeading>
      </div>

      <div
        className="mb-8 flex gap-2 overflow-x-auto pb-2"
        role="tablist"
        aria-label="არქივის კატეგორიები"
      >
        {archiveCategories.map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={filter === category}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-xs tracking-wide transition",
              filter === category
                ? "bg-burgundy text-ivory"
                : "border border-charcoal/10 bg-white/50 text-charcoal-soft hover:border-burgundy/30",
            )}
            onClick={() => setFilter(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-5">
        {items.map((item, index) => {
          // "გზა მთებში" and other wide group shots need a true landscape frame
          const wide = item.id === "a3" || index % 3 === 0;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item)}
              data-no-reveal={item.id === "a3" ? undefined : undefined}
              className={cn(
                "group relative col-span-12 overflow-hidden rounded-[2rem] text-left focus-visible:outline-offset-4",
                wide ? "md:col-span-7" : "sm:col-span-6 md:col-span-5",
              )}
            >
              <div
                className={cn(
                  "relative w-full",
                  wide ? "aspect-[14/9]" : "aspect-[3/2]",
                )}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className={cn(
                    "object-cover object-center transition duration-700 group-hover:scale-[1.03]",
                    item.id === "a3" && "object-[center_40%]",
                  )}
                  sizes="(max-width:768px) 100vw, 58vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                  <p className="text-[0.68rem] tracking-[0.18em] text-white/70">
                    {item.date} · {item.category}
                  </p>
                  <h3 className="font-editorial mt-2 text-2xl text-white md:text-3xl">
                    {item.title}
                  </h3>
                  <p className="mt-2 max-w-md text-sm text-white/75">
                    {item.caption}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Lightbox
        open={Boolean(active)}
        onClose={() => setActive(null)}
        title={active?.title ?? ""}
        caption={active?.caption}
        date={active ? `${active.date} · ${active.category}` : undefined}
        image={active?.image}
      />
    </section>
  );
}
