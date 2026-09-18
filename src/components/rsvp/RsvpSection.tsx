"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EditorialHeading } from "@/components/ui/Typography";
import { cn } from "@/lib/utils";
import { rsvpService } from "@/services/rsvp";

export function RsvpSection() {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<boolean | null>(true);
  const [done, setDone] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || attending === null) return;
    await rsvpService.create({ name: name.trim(), attending });
    setDone(true);
  };

  return (
    <article className="glass-dark rounded-[2.2rem] p-6 md:p-8">
      <EditorialHeading className="text-2xl text-ivory md:text-3xl">
        დასტური
      </EditorialHeading>

      {done ? (
        <p className="font-editorial mt-8 text-lg text-ivory/80">
          მადლობა — შენი ადგილი შენთვის შევინახეთ.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <label className="block text-xs tracking-[0.16em] text-white/50">
            სახელი და გვარი
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-[1.1rem] border border-white/12 bg-black/25 px-4 py-3 text-sm text-ivory outline-none placeholder:text-white/30 focus:border-white/30"
              placeholder=" სახელი"
              required
            />
          </label>

          <fieldset>
            <legend className="text-xs tracking-[0.16em] text-white/50">
              მოდიხარ?
            </legend>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setAttending(true)}
                className={cn(
                  "rounded-[1.2rem] border px-3 py-4 text-left text-sm transition",
                  attending === true
                    ? "border-white/25 bg-white/12 text-ivory"
                    : "border-white/10 bg-black/20 text-white/70",
                )}
              >
                ✓ დიახ, იქ ვიქნები
              </button>
              <button
                type="button"
                onClick={() => setAttending(false)}
                className={cn(
                  "rounded-[1.2rem] border px-3 py-4 text-left text-sm transition",
                  attending === false
                    ? "border-white/25 bg-white/12 text-ivory"
                    : "border-white/10 bg-black/20 text-white/70",
                )}
              >
                ✕ სამწუხაროდ, ვერ მოვალ
              </button>
            </div>
          </fieldset>

          <Button type="submit" variant="dark" className="w-full">
            დასტურის გაგზავნა
          </Button>
        </form>
      )}
    </article>
  );
}
