import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Public client — anon key, for future use with RLS-protected anon reads.
export const supabase = createClient(url, anonKey);

// Admin client — service role, bypasses RLS. Server-side only.
// Never import this in client components or expose to the browser.
export const supabaseAdmin = createClient(url, serviceRoleKey, {
  auth: { persistSession: false },
});
