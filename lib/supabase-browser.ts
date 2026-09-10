import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://limeqbnbpscxonpihpoq.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_mUGSEY_RO8qJkyBhX90Vrw_b9V9OPbC";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
