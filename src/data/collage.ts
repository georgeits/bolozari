import type { CollageEntry } from "@/lib/types";

/** Starter tiles so the wall is not empty before classmates upload. */
export const seedCollage: CollageEntry[] = [
  {
    id: "seed_1",
    author: "არქივი",
    caption: "პირველი ზარი",
    imageData: "/images/archive/moment-01.jpg",
    status: "approved",
    rotation: -2.5,
    createdAt: "2015-09-01T10:00:00+04:00",
    source: "seed",
  },
  {
    id: "seed_2",
    author: "არქივი",
    caption: "ფანჯარასთან",
    imageData: "/images/archive/moment-02.jpg",
    status: "approved",
    rotation: 1.8,
    createdAt: "2019-05-12T10:00:00+04:00",
    source: "seed",
  },
  {
    id: "seed_3",
    author: "არქივი",
    caption: "გზა მთებში",
    imageData: "/images/archive/moment-03.jpg",
    status: "approved",
    rotation: 0,
    createdAt: "2022-06-01T10:00:00+04:00",
    source: "seed",
  },
  {
    id: "seed_4",
    author: "არქივი",
    caption: "სცენის შუქი",
    imageData: "/images/archive/moment-04.jpg",
    status: "approved",
    rotation: 2.4,
    createdAt: "2024-03-15T10:00:00+04:00",
    source: "seed",
  },
  {
    id: "seed_5",
    author: "არქივი",
    caption: "ჩვეულებრივი ორშაბათი",
    imageData: "/images/archive/moment-05.jpg",
    status: "approved",
    rotation: -3,
    createdAt: "2025-01-20T10:00:00+04:00",
    source: "seed",
  },
  {
    id: "seed_6",
    author: "არქივი",
    caption: "ბოლო დღეები",
    imageData: "/images/archive/moment-06.jpg",
    status: "approved",
    rotation: 1.1,
    createdAt: "2026-05-01T10:00:00+04:00",
    source: "seed",
  },
];

/** Change this to your own secret before sharing the site widely. */
export const COLLAGE_MOD_CODE = "12b2027";

export const PHOTOBOOTH_STRIP_KEY = "bolo-zari-last-strip";
