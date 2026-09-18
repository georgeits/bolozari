import type { Metadata } from "next";
import Link from "next/link";
import { LastDaySection } from "@/components/last-day/LastDaySection";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `დღის გეგმა · ${siteConfig.className}`,
  description: "ერთი დღე. ერთი კლასი. ერთი დასასრული.",
};

export default function DayPlanPage() {
  return (
    <div className="pb-8 pt-20 md:pb-12 md:pt-24">
      <div className="section-shell relative z-10 mb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs tracking-[0.16em] text-burgundy-pale transition hover:text-burgundy"
        >
          ← უკან მთავარზე
        </Link>
      </div>
      <LastDaySection />
    </div>
  );
}
