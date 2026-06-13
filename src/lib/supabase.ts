import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

console.log("URL", import.meta.env.PUBLIC_SUPABASE_URL);
console.log("ANON", import.meta.env.PUBLIC_SUPABASE_ANON_KEY);