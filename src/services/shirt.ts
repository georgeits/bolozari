import { initialShirtMessages } from "@/data/interactive";
import type { ShirtMessage } from "@/lib/types";
import { createId } from "@/lib/utils";

export interface ShirtRepository {
  list(): Promise<ShirtMessage[]>;
  create(
    input: Pick<ShirtMessage, "author" | "text">,
  ): Promise<ShirtMessage>;
}

class LocalShirtRepository implements ShirtRepository {
  private items: ShirtMessage[] = [...initialShirtMessages];

  async list() {
    return [...this.items];
  }

  async create(input: Pick<ShirtMessage, "author" | "text">) {
    const message: ShirtMessage = {
      ...input,
      id: createId("shirt"),
      x: 12 + Math.random() * 65,
      y: 15 + Math.random() * 60,
      rotation: Math.random() * 16 - 8,
      size: 0.85 + Math.random() * 0.4,
      createdAt: new Date().toISOString(),
    };
    this.items = [...this.items, message];
    return message;
  }
}

export const shirtService: ShirtRepository = new LocalShirtRepository();
