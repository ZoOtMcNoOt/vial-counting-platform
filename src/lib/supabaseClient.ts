import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client for client-side usage (respects RLS)
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Client for server-side usage (bypasses RLS)
export const supabaseServer = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
