import type { RsvpEntry } from "@/lib/types";
import { createId } from "@/lib/utils";

export interface RsvpRepository {
  list(): Promise<RsvpEntry[]>;
  create(input: Omit<RsvpEntry, "id" | "createdAt">): Promise<RsvpEntry>;
}

class LocalRsvpRepository implements RsvpRepository {
  private items: RsvpEntry[] = [];

  async list() {
    return [...this.items];
  }

  async create(input: Omit<RsvpEntry, "id" | "createdAt">) {
    const entry: RsvpEntry = {
      ...input,
      id: createId("rsvp"),
      createdAt: new Date().toISOString(),
    };
    this.items = [entry, ...this.items];
    return entry;
  }
}

export const rsvpService: RsvpRepository = new LocalRsvpRepository();
