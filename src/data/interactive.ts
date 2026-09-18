import type { GuestbookEntry, ShirtMessage } from "@/lib/types";

export const initialGuestbook: GuestbookEntry[] = [
  {
    id: "g1",
    name: "ნინო ბ.",
    message: "მადლობა, რომ ვიყავით ერთად.",
    createdAt: "2026-09-01T10:00:00+04:00",
    rotation: -2,
    size: "md",
  },
  {
    id: "g2",
    name: "გიორგი კ.",
    message: "ეს დღე სამუდამოდ დარჩება.",
    createdAt: "2026-09-02T12:00:00+04:00",
    rotation: 1.5,
    size: "sm",
  },
  {
    id: "g3",
    name: "მარო",
    message: "ჩუმი მომენტებიც ხმაურიანია გულში.",
    createdAt: "2026-09-03T09:00:00+04:00",
    rotation: -1,
    size: "lg",
  },
];

export const initialShirtMessages: ShirtMessage[] = [
  {
    id: "sh1",
    author: "ანა",
    text: "არ დაგვავიწყდეთ",
    x: 18,
    y: 28,
    rotation: -8,
    size: 1.1,
    createdAt: "2026-08-20T10:00:00+04:00",
  },
  {
    id: "sh2",
    author: "ლუკა",
    text: "კლასი 2027 ♡",
    x: 58,
    y: 22,
    rotation: 6,
    size: 0.95,
    createdAt: "2026-08-21T10:00:00+04:00",
  },
  {
    id: "sh3",
    author: "სოფო",
    text: "ერთი ზარი — მთელი ცხოვრება",
    x: 35,
    y: 55,
    rotation: -3,
    size: 1,
    createdAt: "2026-08-22T10:00:00+04:00",
  },
  {
    id: "sh4",
    author: "დათო",
    text: "აქ ვიყავით",
    x: 62,
    y: 68,
    rotation: 4,
    size: 1.15,
    createdAt: "2026-08-23T10:00:00+04:00",
  },
];
