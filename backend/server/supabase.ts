import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://oopbgphcuiameoywhbwd.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_h1cgNIIc63K8WLtCB8gY5Q_-QjgmyiK";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
