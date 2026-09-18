import type { ArchiveItem } from "@/lib/types";

export const archiveItems: ArchiveItem[] = [
  {
    id: "a1",
    image: "/images/archive/moment-01.jpg",
    date: "2015",
    title: "პირველი ზარი",
    caption: "პატარა ნაბიჯები დიდი დარბაზისკენ.",
    category: "პირველი დღე",
  },
  {
    id: "a2",
    image: "/images/archive/moment-02.jpg",
    date: "2019",
    title: "ფანჯარასთან",
    caption: "მზე, რვეულები და ჩუმი საუბრები შესვენებაზე.",
    category: "კლასში",
  },
  {
    id: "a3",
    image: "/images/archive/moment-03.jpg",
    date: "2022",
    title: "გზა მთებში",
    caption: "ექსკურსია, სადაც ყველამ ერთმანეთი ახლიდან გაიცნო.",
    category: "ექსკურსიები",
  },
  {
    id: "a4",
    image: "/images/archive/moment-04.jpg",
    date: "2024",
    title: "სცენის შუქი",
    caption: "სკოლის საღამო — ხმა, რომელიც დარბაზში დარჩა.",
    category: "ღონისძიებები",
  },
  {
    id: "a5",
    image: "/images/archive/moment-05.jpg",
    date: "2025",
    title: "ჩვეულებრივი ორშაბათი",
    caption: "ის დღეები, რომლებიც მაშინ ჩვეულებრივი ჩანდა.",
    category: "ჩვეულებრივი დღეები",
  },
  {
    id: "a6",
    image: "/images/archive/moment-06.jpg",
    date: "2027",
    title: "ბოლო დღისკენ",
    caption: "ერთი ფოტო ყველაფრის წინ.",
    category: "ბოლო დღე",
  },
];

export const archiveCategories = [
  "ყველა",
  "პირველი დღე",
  "კლასში",
  "ექსკურსიები",
  "ღონისძიებები",
  "ჩვეულებრივი დღეები",
  "ბოლო დღე",
] as const;
