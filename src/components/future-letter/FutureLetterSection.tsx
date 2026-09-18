"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EditorialHeading, Eyebrow } from "@/components/ui/Typography";
import type { ClassLetter } from "@/lib/types";
import { letterService } from "@/services/letters";

const NAME_MAX = 60;
const MESSAGE_MAX = 600;

type Status =
  | { kind: "idle" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function FutureLetterSection() {
  const [letters, setLetters] = useState<ClassLetter[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    let cancelled = false;
    letterService
      .list()
      .then((items) => {
        if (!cancelled) setLetters(items);
      })
      .catch(() => {
        // Keep wall visible on list errors.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      const items = await letterService.list();
      setLetters(items);
    } catch {
      // Keep existing wall visible on list errors.
    } finally {
      setLoading(false);
    }
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim().slice(0, NAME_MAX);
    const cleanMessage = message.trim().slice(0, MESSAGE_MAX);
    if (!cleanName || !cleanMessage || submitting) return;

    setSubmitting(true);
    setStatus({ kind: "idle" });
    try {
      const letter = await letterService.create({
        name: cleanName,
        message: cleanMessage,
      });
      setLetters((prev) =>
        prev.some((item) => item.id === letter.id) ? prev : [letter, ...prev],
      );
      setName("");
      setMessage("");
      setStatus({ kind: "success" });
      await refresh();
    } catch {
      setStatus({
        kind: "error",
        message: "ვერ დაიმახსოვრა წერილი. სცადე კიდევ ერთხელ.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="letter"
      className="relative overflow-hidden py-16 md:py-24"
      aria-labelledby="letter-heading"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(90,40,50,0.35),transparent_55%),linear-gradient(180deg,#1a1214,#100c0d)]" />
      <div className="section-shell relative">
        <div className="mb-12 text-center">
          <Eyebrow className="text-burgundy-dust">კლასი 2027</Eyebrow>
          <EditorialHeading
            id="letter-heading"
            className="mt-3 text-[clamp(2rem,5vw,3.4rem)] text-ivory"
          >
            წერილი ჩვენს კლასს
          </EditorialHeading>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/60">
            დაუტოვე კლასი 2027-ს შენი სურვილი, მოგონება ან რამდენიმე თბილი
            სიტყვა.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass-dark rounded-[2.2rem] p-6 md:p-9">
            <form onSubmit={onSubmit} className="space-y-5">
              <h3 className="font-editorial text-2xl text-ivory">
                დატოვე წერილი
              </h3>
              <label className="block text-xs tracking-[0.16em] text-white/50">
                სახელი
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value.slice(0, NAME_MAX));
                    if (status.kind !== "idle") setStatus({ kind: "idle" });
                  }}
                  className="mt-2 w-full rounded-[1.1rem] border border-white/12 bg-black/25 px-4 py-3 text-sm text-ivory outline-none placeholder:text-white/30 focus:border-white/30"
                  placeholder="ჩაწერე შენი სახელი"
                  required
                  maxLength={NAME_MAX}
                  autoComplete="name"
                  disabled={submitting}
                />
              </label>
              <label className="block text-xs tracking-[0.16em] text-white/50">
                შენი სურვილი
                <textarea
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value.slice(0, MESSAGE_MAX));
                    if (status.kind !== "idle") setStatus({ kind: "idle" });
                  }}
                  rows={5}
                  className="mt-2 w-full resize-none rounded-[1.2rem] border border-white/12 bg-black/25 px-4 py-3 text-sm text-ivory outline-none placeholder:text-white/30 focus:border-white/30"
                  placeholder="დაწერე რამდენიმე თბილი სიტყვა ჩვენი კლასისთვის..."
                  required
                  maxLength={MESSAGE_MAX}
                  disabled={submitting}
                />
              </label>
              <p className="text-right text-[0.7rem] tracking-wide text-white/35">
                <span aria-live="polite">
                  {message.trim().length}/{MESSAGE_MAX}
                </span>
              </p>
              <Button
                type="submit"
                variant="dark"
                className="w-full"
                disabled={submitting || !name.trim() || !message.trim()}
              >
                {submitting ? "იგზავნება..." : "დატოვე წერილი"}
              </Button>
              <div aria-live="polite">
                {status.kind === "success" && (
                  <p className="font-editorial rounded-[1.1rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm italic text-ivory/90">
                    შენი წერილი კლასს უკვე დარჩა. ❤️
                  </p>
                )}
                {status.kind === "error" && (
                  <p className="rounded-[1.1rem] border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm text-ivory/80">
                    {status.message}
                  </p>
                )}
              </div>
            </form>
          </div>

          <aside
            className="rounded-[2.2rem] border border-white/10 bg-white/[0.03] p-6 md:p-9"
            aria-label="კლასის სურვილების კედელი"
          >
            <h3 className="font-editorial text-2xl text-ivory">
              სურვილების კედელი
            </h3>
            <p className="mt-2 text-xs tracking-[0.14em] text-white/40">
              {letters.length > 0
                ? `${letters.length} თბილი სიტყვა`
                : "თბილი სიტყვები აქ გამოჩნდება"}
            </p>
            {loading ? (
              <p className="mt-6 font-editorial text-base italic text-white/45">
                იტვირთება...
              </p>
            ) : letters.length === 0 ? (
              <p className="mt-6 font-editorial text-base italic text-white/45">
                ჯერ არავის დაუტოვებია სურვილი. იყავი პირველი.
              </p>
            ) : (
              <ul className="mt-6 space-y-4">
                {letters.map((letter, index) => (
                  <li
                    key={letter.id}
                    className="reveal rounded-[1.3rem] border border-white/10 bg-black/20 px-5 py-4"
                    style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
                  >
                    <p className="font-editorial text-[1.05rem] italic leading-relaxed text-ivory/90">
                      „{letter.message}“
                    </p>
                    <p className="mt-3 flex items-baseline justify-between gap-3">
                      <span className="text-sm text-burgundy-dust">
                        — {letter.name}
                      </span>
                      <time
                        className="shrink-0 text-[0.7rem] tracking-wide text-white/35"
                        dateTime={letter.createdAt}
                      >
                        {formatDate(letter.createdAt)}
                      </time>
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat("ka-GE", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}
