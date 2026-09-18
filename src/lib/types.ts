export type Student = {
  id: string;
  name: string;
  photo: string;
  role?: string;
  nickname?: string;
  description: string;
  favoriteMemory: string;
  futureDream: string;
};

export type Teacher = {
  id: string;
  name: string;
  photo: string;
  subject: string;
  message: string;
};

export type ArchiveCategory =
  | "პირველი დღე"
  | "კლასში"
  | "ექსკურსიები"
  | "ღონისძიებები"
  | "ჩვეულებრივი დღეები"
  | "ბოლო დღე";

export type ArchiveItem = {
  id: string;
  image: string;
  date: string;
  title: string;
  caption: string;
  category: ArchiveCategory;
};

export type ScheduleItem = {
  time: string;
  title: string;
  description: string;
};

export type FutureProfile = {
  id: string;
  name: string;
  profession: string;
  city: string;
  quote: string;
  photo: string;
};

export type PlayQuote = {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
};

export type ShirtMessage = {
  id: string;
  author: string;
  text: string;
  x: number;
  y: number;
  rotation: number;
  size: number;
  createdAt: string;
};

export type FutureLetter = {
  id: string;
  name: string;
  openDate: string;
  text: string;
  createdAt: string;
};

export type RsvpEntry = {
  id: string;
  name: string;
  attending: boolean;
  createdAt: string;
};

export type GuestbookEntry = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
  rotation?: number;
  size?: "sm" | "md" | "lg";
};

export type SiteConfig = {
  classYear: number;
  className: string;
  schoolName: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventAddress: string;
  countdownTarget: string;
  heroImage: string;
  tagline: string;
};
