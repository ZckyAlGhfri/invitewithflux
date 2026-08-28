import 'server-only';

import { createClient } from '@supabase/supabase-js';

let publicClient;
let adminClient;

function requiredEnvironment(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Konfigurasi ${name} belum tersedia.`);
  return value;
}

const clientOptions = {
  auth: {
    autoRefreshToken: false,
    detectSessionInUrl: false,
    persistSession: false,
  },
};

export function getSupabasePublic() {
  if (!publicClient) {
    publicClient = createClient(
      requiredEnvironment('NEXT_PUBLIC_SUPABASE_URL'),
      requiredEnvironment('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
      clientOptions,
    );
  }
  return publicClient;
}

export function getSupabaseAdmin() {
  if (!adminClient) {
    adminClient = createClient(
      requiredEnvironment('NEXT_PUBLIC_SUPABASE_URL'),
      requiredEnvironment('SUPABASE_SERVICE_ROLE_KEY'),
      clientOptions,
    );
  }
  return adminClient;
}
