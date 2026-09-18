import { siteConfig } from "@/data/site";

export function FinalScene() {
  return (
    <section
      id="final"
      className="section-shell py-20 md:py-28"
      aria-labelledby="final-heading"
    >
      <div className="relative overflow-hidden rounded-[2.5rem] bg-[linear-gradient(180deg,#1a1214,#0f0c0d)] px-6 py-24 text-center md:px-12 md:py-32">
        <div
          className="glow-burgundy absolute left-1/2 top-10 h-40 w-40 -translate-x-1/2 opacity-50 blur-2xl"
          aria-hidden
        />
        <p
          id="final-heading"
          className="font-editorial relative text-[clamp(1.8rem,4.5vw,3rem)] leading-snug text-ivory"
        >
          და ბოლოს,
          <br />
          ზარი დარეკავს.
        </p>
        <p className="font-editorial relative mt-10 text-xl text-burgundy-dust md:text-2xl">
          {siteConfig.className}
        </p>
        <p className="relative mt-3 text-sm tracking-[0.18em] text-white/55">
          ჩვენ აქ ვიყავით.
        </p>
        <div className="relative mt-12">
          <a
            href="#hero"
            className="glass inline-flex items-center justify-center rounded-[1.15rem] px-6 py-3 text-sm tracking-wide text-white transition hover:bg-white/20"
          >
            თავიდან დაწყება
          </a>
        </div>
      </div>
    </section>
  );
}
