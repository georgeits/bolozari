import { schedule } from "@/data/schedule";
import { formatEventDateKa, siteConfig } from "@/data/site";
import { EditorialHeading, Eyebrow } from "@/components/ui/Typography";

const infoCards = [
  {
    label: "თარიღი",
    value: formatEventDateKa(siteConfig.eventDate),
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    label: "დრო",
    value: siteConfig.eventTime,
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.4" />
        <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "ადგილი",
    value: siteConfig.eventLocation,
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path
          d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11Z"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <circle cx="12" cy="10" r="2.2" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    label: "მისამართი",
    value: siteConfig.eventAddress,
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path
          d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function LastDaySection() {
  return (
    <section
      id="day-plan"
      className="relative overflow-hidden py-16 md:py-24"
      aria-labelledby="day-plan-heading"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(90,40,50,0.32),transparent_50%),linear-gradient(180deg,#171113,#0f0c0d)]" />

      <div className="section-shell relative">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <Eyebrow className="text-burgundy-dust">განრიგი</Eyebrow>
          <EditorialHeading
            id="day-plan-heading"
            className="mt-3 text-[clamp(2.2rem,5vw,3.6rem)] text-ivory"
          >
            დღის გეგმა
          </EditorialHeading>
          <p className="mt-4 text-sm text-white/60">
            ერთი დღე. ერთი კლასი. ერთი დასასრული.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {infoCards.map((card) => (
            <article
              key={card.label}
              className="glass-dark rounded-[1.8rem] p-5 md:p-6"
            >
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/80">
                {card.icon}
              </div>
              <p className="text-[0.68rem] tracking-[0.18em] text-white/45">
                {card.label}
              </p>
              <p className="mt-2 text-sm leading-snug text-ivory md:text-[0.95rem]">
                {card.value}
              </p>
            </article>
          ))}
        </div>

        <ol className="relative mx-auto mt-14 max-w-3xl">
          <div
            className="absolute bottom-4 left-[0.85rem] top-4 w-px bg-gradient-to-b from-burgundy-pale via-burgundy to-transparent md:left-1/2 md:-translate-x-1/2"
            aria-hidden
          />
          {schedule.map((item, index) => (
            <li
              key={`${item.time}-${item.title}`}
              className={`relative mb-6 flex md:mb-8 ${
                index % 2 === 0 ? "md:justify-start" : "md:justify-end"
              }`}
            >
              <span
                className="absolute left-[0.55rem] top-8 h-2.5 w-2.5 rounded-full bg-burgundy-pale shadow-[0_0_16px_rgba(165,106,114,0.8)] md:left-1/2 md:-translate-x-1/2"
                aria-hidden
              />
              <article
                className={`glass-dark ml-8 w-full rounded-[1.8rem] p-5 md:ml-0 md:w-[calc(50%-1.5rem)] md:p-6 ${
                  index % 2 === 0 ? "md:mr-auto" : "md:ml-auto"
                }`}
              >
                <p className="text-sm tracking-wide text-burgundy-dust">
                  {item.time}
                </p>
                <h3 className="font-editorial mt-2 text-xl text-ivory">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-white/55">{item.description}</p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
