import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// In dev environments without env vars (e.g. local preview), createClient
// throws "supabaseUrl is required." which breaks the entire React tree.
// Fall back to a harmless stub URL so the rest of the app can render —
// auth calls will fail gracefully but pages that don't need auth still work.
const FALLBACK_URL = 'https://fallback.invalid';
const FALLBACK_KEY = 'public-anon-fallback';

if (!supabaseUrl || !supabaseAnonKey) {
    // eslint-disable-next-line no-console
    console.warn(
        '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing — using inert fallback client. Auth features will not work until env vars are set.'
    );
}

export const supabase = createClient(
    supabaseUrl || FALLBACK_URL,
    supabaseAnonKey || FALLBACK_KEY
);
