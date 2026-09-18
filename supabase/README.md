# Supabase — public wish wall (class_letters)

The “წერილი ჩვენს კლასს” section reads/writes the `class_letters` table.

## 1. Create the table + RLS

Run `supabase/class_letters.sql` in Supabase Dashboard → SQL Editor
(or apply it as a migration). It creates:

- `class_letters(id uuid, name text, message text, created_at timestamptz)`
- RLS: anon can SELECT + INSERT only (no UPDATE/DELETE)

## 2. Env vars (frontend only needs the public anon key)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY
```

- Never put the `service_role` key in frontend code.
- Restart `npm run dev` after adding `.env.local`.

## 3. Behaviour without credentials

If the env vars are missing, the section still works with an
in-memory fallback (notes visible only in the current session) so the
UI can be previewed before Supabase is connected.
