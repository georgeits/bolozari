"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EditorialHeading } from "@/components/ui/Typography";
import type { GuestbookEntry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { guestbookService } from "@/services/guestbook";

export function GuestbookSection() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    void guestbookService.list().then(setEntries);
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    const entry = await guestbookService.create({
      name: name.trim(),
      message: message.trim(),
    });
    setEntries((prev) => [entry, ...prev]);
    setName("");
    setMessage("");
  };

  return (
    <article className="glass-dark rounded-[2.2rem] p-6 md:p-8">
      <EditorialHeading className="text-2xl text-ivory md:text-3xl">
        სტუმრების წიგნი
      </EditorialHeading>
      <p className="mt-2 text-sm text-white/55">
        ერთი სიტყვა, რომელიც ამ დღეს დარჩება.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-[1.1rem] border border-white/12 bg-black/25 px-4 py-3 text-sm text-ivory outline-none placeholder:text-white/30 focus:border-white/30"
          placeholder="სახელი"
          required
          aria-label="სახელი"
        />
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-[1.1rem] border border-white/12 bg-black/25 px-4 py-3 text-sm text-ivory outline-none placeholder:text-white/30 focus:border-white/30"
          placeholder="ერთი სიტყვა ამ დღისთვის..."
          required
          aria-label="მესიჯი"
          maxLength={80}
        />
        <Button type="submit" variant="glass" className="w-full">
          დატოვე სიტყვა
        </Button>
      </form>

      <ul className="mt-8 space-y-4" aria-label="სტუმრების მესიჯები">
        {entries.slice(0, 6).map((entry) => (
          <li
            key={entry.id}
            className={cn(
              "rounded-[1.3rem] border border-white/10 bg-white/[0.04] px-4 py-4",
              entry.size === "lg" && "py-5",
              entry.size === "sm" && "py-3",
            )}
            style={{ transform: `rotate(${entry.rotation ?? 0}deg)` }}
          >
            <p className="font-editorial text-base italic text-ivory/85">
              „{entry.message}“
            </p>
            <p className="mt-2 text-sm text-burgundy-dust">— {entry.name}</p>
          </li>
        ))}
      </ul>
    </article>
  );
}
