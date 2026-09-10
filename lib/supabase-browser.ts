import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://limeqbnbpscxonpihpoq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_mUGSEY_RO8qJkyBhX90Vrw_b9V9OPbC";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

// Deliberately sessionless: public verification always runs as anon, even when
// the visitor is also signed into an owner workspace in another tab.
export const publicSupabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});
