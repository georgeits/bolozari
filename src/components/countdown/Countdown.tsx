"use client";

import { useSyncExternalStore } from "react";
import { siteConfig } from "@/data/site";
import { cn, pad2 } from "@/lib/utils";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function getParts(now: number): Parts {
  const target = new Date(siteConfig.countdownTarget).getTime();
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function subscribe(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 1000);
  return () => window.clearInterval(id);
}

function getSnapshot() {
  return Math.floor(Date.now() / 1000);
}

function getServerSnapshot() {
  return 0;
}

export function Countdown({ className = "" }: { className?: string }) {
  const tick = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const parts = tick === 0 ? null : getParts(tick * 1000);
  const done =
    parts !== null &&
    parts.days === 0 &&
    parts.hours === 0 &&
    parts.minutes === 0 &&
    parts.seconds === 0;

  const items = [
    { label: "დღე", value: parts?.days ?? 0 },
    { label: "საათი", value: parts?.hours ?? 0 },
    { label: "წუთი", value: parts?.minutes ?? 0 },
    { label: "წამი", value: parts?.seconds ?? 0 },
  ];

  return (
    <div className={cn("max-w-xl", className)}>
      <p className="mb-3 text-[0.68rem] tracking-[0.22em] text-[#f7f3eb]/72 sm:text-[0.72rem]">
        {done ? "ბოლო ზარი ახლაა" : "ბოლო ზარამდე დარჩა"}
      </p>

      <div
        className="inline-flex max-w-full flex-wrap items-stretch gap-2 rounded-[1.6rem] border border-white/18 bg-[rgba(20,12,14,0.28)] p-2 shadow-[0_18px_50px_rgba(12,8,10,0.28)] backdrop-blur-[18px] sm:gap-2.5 sm:rounded-[1.85rem] sm:p-2.5"
        role="timer"
        aria-live="polite"
        aria-label="დარჩენილი დრო ბოლო ზარამდე"
      >
        {items.map((item, i) => (
          <div key={item.label} className="flex items-stretch gap-2 sm:gap-2.5">
            {i > 0 ? (
              <span
                className="hidden items-center self-center font-editorial text-xl text-[#f7f3eb]/35 sm:flex"
                aria-hidden
              >
                :
              </span>
            ) : null}
            <div
              className={cn(
                "group relative min-w-[4.4rem] overflow-hidden rounded-[1.2rem] border border-white/14 bg-[rgba(247,243,235,0.1)] px-3 py-2.5 text-center sm:min-w-[5.1rem] sm:rounded-[1.35rem] sm:px-3.5 sm:py-3",
                i === items.length - 1 && "pulse-glow",
              )}
            >
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_55%)] opacity-70"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -inset-x-4 -top-6 h-10 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)] opacity-40"
                aria-hidden
              />
              <p className="relative font-editorial text-[1.55rem] leading-none tracking-[-0.03em] text-[#f7f3eb] tabular-nums drop-shadow-[0_2px_12px_rgba(12,8,10,0.35)] sm:text-[1.85rem] md:text-[2.05rem]">
                {parts ? pad2(item.value) : "··"}
              </p>
              <p className="relative mt-1.5 text-[0.58rem] tracking-[0.2em] text-[#f7f3eb]/68 sm:text-[0.62rem]">
                {item.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
