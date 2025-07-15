import { createClient } from "@supabase/supabase-js";
import { Database } from "./Database";

// Valores hardcoded para eliminar problemas de variáveis de ambiente

// Exportar uma instância padrão do Supabase
export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project-id.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"
);
// Criar cliente Supabase tipado
export const createSupabaseClient = (url: string, anonKey: string) => {
  return createClient<Database>(url, anonKey);
};

// Exportar tipos e services para uso na aplicação
export * from "./types";
export * from "./Database";
export * from "./services";
