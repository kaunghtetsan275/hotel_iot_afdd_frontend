import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_API_KEY) {
  throw new Error('Supabase URL or Key is not defined in environment variables.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
export { SUPABASE_URL };
export const SUPABASE_HEADERS: Record<string, string> = {
  apikey: SUPABASE_API_KEY,
  Authorization: `Bearer ${SUPABASE_API_KEY}`,
  'Content-Type': 'application/json',
};