import type { Metadata } from "next";
import Link from "next/link";
import { TenYearsSection } from "@/components/ten-years/TenYearsSection";
import { siteConfig } from "@/data/site";

export const metadata: Metadata = {
  title: `10 წლის შემდეგ · ${siteConfig.className}`,
  description:
    "წარმოსახვითი მომავალი — სადაც კლასი ისევ ერთმანეთს ეძებს, სხვა ქალაქებში და სხვა ოცნებებში.",
};

export default function TenYearsPage() {
  return (
    <div className="pb-16 pt-24 md:pb-24 md:pt-28">
      <div className="section-shell mb-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs tracking-[0.16em] text-burgundy-pale transition hover:text-burgundy"
        >
          ← უკან მთავარზე
        </Link>
      </div>
      <TenYearsSection />
    </div>
  );
}
