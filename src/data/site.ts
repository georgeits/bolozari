import type { SiteConfig } from "@/lib/types";

/**
 * Single source of truth for class/event configuration.
 * Change countdownTarget here to update the Hero countdown everywhere.
 */
export const siteConfig: SiteConfig = {
  classYear: 2027,
  className: "კლასი 2027",
  schoolName: "ივანე ჯავახიშვილის სახელობის ქ. რუსთავის №24 ქართული გიმნაზია",
  eventDate: "2027-05-20",
  eventTime: "08:30",
  eventLocation: "ივანე ჯავახიშვილის სახელობის ქ. რუსთავის №24 ქართული გიმნაზია",
  eventAddress: "რუსთავი, ვახუშტის ქუჩა 5",
  /** ISO datetime — edit this one value for the countdown */
  countdownTarget: "2027-05-28T18:00:00+04:00",
  heroImage: "/images/class/hero.jpg",
  tagline: "ერთი დღე. უსასრულო მოგონებები.",
};

export const navLinks = [
  { href: "/#hero", label: "მთავარი" },
  { href: "/#class", label: "ჩვენი კლასი" },
  { href: "/#archive", label: "არქივი" },
  { href: "/#teachers", label: "მასწავლებლები" },
  { href: "/#photobooth", label: "ფოტობუტი" },
  { href: "/#collage", label: "კოლაჟი" },
  { href: "/dghis-gegma", label: "დღის გეგმა" },
  { href: "/10-wlis-shemdeg", label: "10 წლის შემდეგ" },
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
