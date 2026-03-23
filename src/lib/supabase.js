// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Kunci rahasia server

// Klien standar (Publik / Anon)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Klien master (Admin) untuk menembus RLS database
// Kita gunakan pengecekan agar tidak error jika dijalankan di sisi client (browser)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : null;