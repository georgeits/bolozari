"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EditorialHeading, Eyebrow } from "@/components/ui/Typography";
import type { ShirtMessage } from "@/lib/types";
import { shirtService } from "@/services/shirt";

export function WhiteShirtSection() {
  const [messages, setMessages] = useState<ShirtMessage[]>([]);
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done">("idle");

  useEffect(() => {
    void shirtService.list().then(setMessages);
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;
    setStatus("saving");
    const created = await shirtService.create({
      author: author.trim(),
      text: text.trim(),
    });
    setMessages((prev) => [...prev, created]);
    setAuthor("");
    setText("");
    setStatus("done");
    window.setTimeout(() => setStatus("idle"), 1600);
  };

  return (
    <section
      id="shirt"
      className="section-shell py-14 md:py-20"
      aria-labelledby="shirt-heading"
    >
      <div className="mb-10 md:mb-12">
        <Eyebrow>ციფრული თეთრი პერანგი</Eyebrow>
        <EditorialHeading
          id="shirt-heading"
          className="mt-3 text-[clamp(2rem,5vw,3.3rem)]"
        >
          დატოვე ხელწერა
        </EditorialHeading>
        <p className="mt-4 max-w-xl text-sm text-charcoal-soft">
          მესიჯები პერანგზე — სხვადასხვა ადგილას, მცირე დახრით, როგორც
          ნამდვილ ხელწერას.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-[28rem] overflow-hidden rounded-[2.3rem] border border-charcoal/8 bg-ivory-soft md:min-h-[36rem]">
          <Image
            src="/images/shirt/shirt-canvas.jpg"
            alt=""
            fill
            className="object-cover opacity-80"
            sizes="(max-width:1024px) 100vw, 60vw"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.35),transparent_70%)]" />

          <ul className="absolute inset-0" aria-label="პერანგის მესიჯები">
            {messages.map((msg) => (
              <li
                key={msg.id}
                className="group absolute max-w-[10rem] cursor-default sm:max-w-[12rem]"
                style={{
                  left: `${msg.x}%`,
                  top: `${msg.y}%`,
                  transform: `rotate(${msg.rotation}deg) scale(${msg.size})`,
                }}
              >
                <p className="font-editorial text-[1.05rem] leading-snug text-burgundy-deep/85">
                  {msg.text}
                </p>
                <span className="mt-1 block text-[0.65rem] tracking-wide text-burgundy-pale opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                  — {msg.author}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <form
          onSubmit={onSubmit}
          className="flex flex-col justify-center rounded-[2rem] border border-charcoal/8 bg-white/55 p-6 md:p-8"
        >
          <label className="text-xs tracking-[0.16em] text-charcoal-soft">
            სახელი
            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mt-2 w-full rounded-[1.1rem] border border-charcoal/10 bg-ivory px-4 py-3 text-sm text-charcoal outline-none focus:border-burgundy/40"
              placeholder="სახელი"
              required
              maxLength={40}
            />
          </label>
          <label className="mt-4 text-xs tracking-[0.16em] text-charcoal-soft">
            მესიჯი
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-2 w-full rounded-[1.1rem] border border-charcoal/10 bg-ivory px-4 py-3 text-sm text-charcoal outline-none focus:border-burgundy/40"
              placeholder="მოკლე ხელწერა..."
              required
              maxLength={60}
            />
          </label>
          <Button type="submit" className="mt-6 w-full" disabled={status === "saving"}>
            {status === "done" ? "დაემატა" : "დატოვე მესიჯი"}
          </Button>
        </form>
      </div>
    </section>
  );
}
