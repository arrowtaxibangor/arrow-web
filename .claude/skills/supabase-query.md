# Skill: New Supabase query function

Use this template when adding a new query function to a lib file. Copy and adapt.

Matches the style of `src/lib/supabase/cms.ts` and `src/lib/supabase/blog.ts`.

## Template — single record fetch

```ts
// In src/lib/supabase/yourLib.ts
import { supabaseAdmin } from './client';

export type YourRecord = {
  id: string;
  // ... fields matching the table columns
  created_at: string;
  updated_at: string;
};

export async function getYourRecordById(id: string): Promise<YourRecord | null> {
  const { data, error } = await supabaseAdmin.from('your_table').select('*').eq('id', id).single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }
  return data;
}
```

## Template — list

```ts
export async function listYourRecords(opts?: {
  publishedOnly?: boolean;
  limit?: number;
}): Promise<YourRecord[]> {
  let query = supabaseAdmin
    .from('your_table')
    .select('*')
    .order('created_at', { ascending: false });

  if (opts?.publishedOnly) query = query.eq('published', true);
  if (opts?.limit) query = query.limit(opts.limit);

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
```

## Template — create

```ts
export type YourRecordInput = Omit<YourRecord, 'id' | 'created_at' | 'updated_at'>;

export async function createYourRecord(input: YourRecordInput): Promise<YourRecord> {
  const { data, error } = await supabaseAdmin.from('your_table').insert(input).select().single();

  if (error) throw error;
  return data;
}
```

## Template — update

```ts
export async function updateYourRecord(
  id: string,
  input: Partial<YourRecordInput>
): Promise<YourRecord> {
  const { data, error } = await supabaseAdmin
    .from('your_table')
    .update(input)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

## Rules to remember

- Always use `supabaseAdmin` — never the anon `supabase` client for writes
- `PGRST116` = row not found — return `null`, do not throw
- All other errors should be thrown and caught in the route handler
- Input types use `Omit<..., 'id' | 'created_at' | 'updated_at'>` — never let callers set generated fields
- This file is server-only — never import it from client components
