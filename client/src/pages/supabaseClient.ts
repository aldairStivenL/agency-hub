import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dukyprswpvnkylnxdfpt.supabase.co';
const supabaseAnonKey = 'sb_publishable_8E6e1-WSh0ULC483AipJyg_JvGCsohZ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);