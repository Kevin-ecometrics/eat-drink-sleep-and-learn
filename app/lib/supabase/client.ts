import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/app/lib/supabase/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cliente global para usar en cliente/servidor
export const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseKey)

// 🔥 Exportamos la función para generar nuevos clientes cuando haga falta
export function createClient() {
  return createSupabaseClient<Database>(supabaseUrl, supabaseKey)
}
