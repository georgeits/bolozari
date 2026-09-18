import type { ScheduleItem } from "@/lib/types";
import { siteConfig } from "@/data/site";

/** Schedule for the last day — times relative to siteConfig.eventDate */
export const schedule: ScheduleItem[] = [
  {
    time: "09:00",
    title: "შეკრება",
    description: "შეხვედრა ეზოში. ერთი სუნთქვა ყველასთვის.",
  },
  {
    time: "10:00",
    title: "ბოლო ზარი",
    description: "ცერემონია დარბაზში — წლების გახსენება ერთ ხმაში.",
  },
  {
    time: "12:00",
    title: "ფოტოები",
    description: "კლასის ფოტო და პატარა კადრები, რომლებიც დარჩება.",
  },
  {
    time: siteConfig.eventTime,
    title: "ერთად ბოლო დღე",
    description: "სტუმრების მიღება და დასალევი ატმოსფერო.",
  },
];
