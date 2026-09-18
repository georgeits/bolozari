import type { SiteConfig } from "@/lib/types";

/**
 * Single source of truth for class/event configuration.
 * Change countdownTarget here to update the Hero countdown everywhere.
 */
export const siteConfig: SiteConfig = {
  classYear: 2027,
  className: "კლასი 2027",
  schoolName: "საქართველოს საჯარო სკოლა №1",
  eventDate: "2027-05-28",
  eventTime: "18:00",
  eventLocation: "საქართველოს საჯარო სკოლა №1",
  eventAddress: "თბილისი, ჭავჭავაძის ქ. 1",
  /** ISO datetime — edit this one value for the countdown */
  countdownTarget: "2027-05-28T18:00:00+04:00",
  heroImage: "/images/class/hero.jpg",
  tagline: "ერთი ბოლო დღე. მთელი ცხოვრების მოგონებები.",
};

export const navLinks = [
  { href: "#hero", label: "მთავარი" },
  { href: "#class", label: "ჩვენი კლასი" },
  { href: "#archive", label: "არქივი" },
  { href: "#teachers", label: "მასწავლებლები" },
  { href: "#play", label: "თამაში" },
  { href: "#last-day", label: "ბოლო დღე" },
] as const;

export function formatEventDateKa(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  const months = [
    "იანვარი",
    "თებერვალი",
    "მარტი",
    "აპრილი",
    "მაისი",
    "ივნისი",
    "ივლისი",
    "აგვისტო",
    "სექტემბერი",
    "ოქტომბერი",
    "ნოემბერი",
    "დეკემბერი",
  ];
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
}
