import { initialGuestbook } from "@/data/interactive";
import type { GuestbookEntry } from "@/lib/types";
import { createId } from "@/lib/utils";

export interface GuestbookRepository {
  list(): Promise<GuestbookEntry[]>;
  create(
    input: Omit<GuestbookEntry, "id" | "createdAt" | "rotation" | "size">,
  ): Promise<GuestbookEntry>;
}

class LocalGuestbookRepository implements GuestbookRepository {
  private items: GuestbookEntry[] = [...initialGuestbook];

  async list() {
    return [...this.items];
  }

  async create(
    input: Omit<GuestbookEntry, "id" | "createdAt" | "rotation" | "size">,
  ) {
    const entry: GuestbookEntry = {
      ...input,
      id: createId("guest"),
      createdAt: new Date().toISOString(),
      rotation: (Math.random() * 6 - 3),
      size: (["sm", "md", "lg"] as const)[Math.floor(Math.random() * 3)],
    };
    this.items = [entry, ...this.items];
    return entry;
  }
}

export const guestbookService: GuestbookRepository =
  new LocalGuestbookRepository();
