import Image from "next/image";
import { Countdown } from "@/components/countdown/Countdown";
import { HeroMasthead } from "@/components/navigation/Navigation";
import { siteConfig } from "@/data/site";

export function Hero() {
  return (
    <section
      id="hero"
      className="section-shell-wide relative"
      aria-label="ბოლო ზარი — მთავარი"
    >
      <HeroMasthead />

      <div className="relative isolate overflow-hidden rounded-[2.2rem] md:rounded-[2.5rem]">
        <div className="relative aspect-[4/5] min-h-[68vh] w-full sm:aspect-[16/11] sm:min-h-[76vh]">
          <Image
            src={siteConfig.heroImage}
            alt="12ბ კლასი 2027 — ჯგუფური ფოტო"
            fill
            priority
            className="scale-[1.04] object-cover object-[center_22%]"
            sizes="100vw"
          />

          <div
            className="absolute inset-0 bg-[color-mix(in_srgb,var(--burgundy)_16%,transparent)] mix-blend-multiply"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[linear-gradient(to_top_right,rgba(243,239,230,0.16),transparent_42%,rgba(243,239,230,0.06))]"
            aria-hidden
          />
          <div
            className="glow-burgundy absolute -right-10 -top-16 h-[48%] w-[48%] opacity-55 blur-2xl"
            aria-hidden
          />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(20,12,14,0.2)_100%)]"
            aria-hidden
          />
          {/* Readability wash only along the bottom edge — keeps faces clear */}
          <div
            className="absolute inset-x-0 bottom-0 h-[42%] bg-[linear-gradient(to_top,rgba(12,8,10,0.62)_0%,rgba(12,8,10,0.22)_45%,transparent_100%)]"
            aria-hidden
          />

          <div className="absolute inset-x-0 bottom-0 p-6 pb-7 sm:p-10 sm:pb-10 md:p-14">
            <div className="max-w-2xl reveal text-[#f7f3eb]">
              <p className="font-ui mb-2 text-[0.68rem] tracking-[0.2em] text-[#f7f3eb]/85 sm:mb-3 sm:text-[0.78rem]">
                კლასი {siteConfig.classYear} · ციფრული წლის წიგნი
              </p>
              <h1 className="font-editorial text-[clamp(2.6rem,8vw,6.2rem)] leading-[0.95] text-[#f7f3eb] drop-shadow-[0_2px_24px_rgba(20,10,12,0.35)]">
                ბოლო ზარი
              </h1>
              <p className="font-editorial mt-2 text-lg text-[#f7f3eb]/92 sm:mt-3 sm:text-2xl md:text-3xl">
                {siteConfig.className}
              </p>
              <p className="font-ui mt-3 max-w-md text-sm leading-relaxed text-[#f7f3eb]/78 sm:mt-4 sm:text-base">
                {siteConfig.tagline}
              </p>
              <Countdown className="mt-6 motion-safe sm:mt-8" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
