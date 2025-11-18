import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.trim();
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Diagnóstico
(async () => {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/`, { method: 'HEAD' });
    console.log('[SB] ping OK', SUPABASE_URL);
  } catch (e) {
    console.error('[SB] ping FAIL', SUPABASE_URL, e);
  }
})();