import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// By default, supabase-js stores the session in localStorage, which
// survives closing the browser entirely - so if you never explicitly log
// out, you're auto-logged-in forever on every future visit. Using
// sessionStorage instead keeps you logged in while the tab/browser is
// open (so normal navigation still works), but clears the session as
// soon as the browser is closed, so the next visit requires a fresh login.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  },
});
