import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Ajuda a diagnosticar deploys sem as variáveis de ambiente configuradas.
  console.error(
    'Supabase: defina REACT_APP_SUPABASE_URL e REACT_APP_SUPABASE_ANON_KEY (.env.local ou nas variáveis da Vercel).'
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
