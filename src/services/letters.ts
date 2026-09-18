import type { ClassLetter, FutureLetter } from "@/lib/types";
import { createId } from "@/lib/utils";
import { getSupabaseClient } from "@/lib/supabase";

/**
 * Public class-letter repository abstraction.
 * UI components depend only on this interface — not on Supabase directly.
 *
 * Table: `class_letters` (id uuid, name text, message text, created_at timestamptz)
 */
export interface LetterRepository {
  list(): Promise<ClassLetter[]>;
  create(input: { name: string; message: string }): Promise<ClassLetter>;
}

type ClassLetterRow = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

function rowToLetter(row: ClassLetterRow): ClassLetter {
  return {
    id: row.id,
    name: row.name,
    message: row.message,
    createdAt: row.created_at,
  };
}

class SupabaseLetterRepository implements LetterRepository {
  async list(): Promise<ClassLetter[]> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from("class_letters")
      .select("id,name,message,created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return ((data ?? []) as ClassLetterRow[]).map(rowToLetter);
  }

  async create(input: { name: string; message: string }): Promise<ClassLetter> {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase
      .from("class_letters")
      .insert({ name: input.name, message: input.message })
      .select("id,name,message,created_at")
      .single();
    if (error) throw error;
    return rowToLetter(data as ClassLetterRow);
  }
}

class LocalLetterRepository implements LetterRepository {
  private items: ClassLetter[] = [];

  async list() {
    return [...this.items];
  }

  async create(input: { name: string; message: string }) {
    const letter: ClassLetter = {
      ...input,
      id: createId("letter"),
      createdAt: new Date().toISOString(),
    };
    this.items = [letter, ...this.items];
    return letter;
  }
}

/** Legacy alias — prefer `ClassLetter` for the public wish wall. */
export type { FutureLetter };

const localFallback = new LocalLetterRepository();
const supabaseRepo = new SupabaseLetterRepository();

function isSupabaseConfigured() {
  return (
    typeof process.env.NEXT_PUBLIC_SUPABASE_URL === "string" &&
    process.env.NEXT_PUBLIC_SUPABASE_URL.length > 0 &&
    typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY === "string" &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length > 0
  );
}

/**
 * Shared repository used by the UI.
 * Uses Supabase when env vars are present, otherwise a local in-memory
 * fallback so the UI stays functional before credentials are added.
 * Falls back gracefully at runtime if a Supabase request fails while listing.
 */
export const letterService: LetterRepository = {
  async list() {
    if (!isSupabaseConfigured()) return localFallback.list();
    try {
      return await supabaseRepo.list();
    } catch {
      return localFallback.list();
    }
  },
  async create(input) {
    if (!isSupabaseConfigured()) return localFallback.create(input);
    try {
      const created = await supabaseRepo.create(input);
      // Mirror into the local fallback so the new note stays visible
      // even if a subsequent list() hits a network error.
      await localFallback.create({ name: created.name, message: created.message });
      return created;
    } catch {
      // If Supabase insert fails (e.g. table not created yet),
      // surface the error so the UI can show a friendly message.
      // Re-attempt via Supabase once more to preserve the real error.
      return supabaseRepo.create(input);
    }
  },
};

