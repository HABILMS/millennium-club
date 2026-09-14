import { supabase } from './supabase'

interface SeedRow {
  id?: number
  email?: string
}

export async function seedDatabase() {
  console.log('[seed] Iniciando seed do banco de dados...')

  // --- Usuário demo (apenas se não existir) ---
  const { data: existingUser, error: userCheckError } = await supabase.auth.getUser()

  if (userCheckError) {
    console.log('[seed] Nenhum usuário logado para verificar seed - pulando verificações de usuário')
  }

  // Exemplo de como inserir dados em tabelas específicas:
  //
  // await supabase.from('nometabela').insert([
  //   { campo: 'valor' },
  // ])

  console.log('[seed] Seed concluído.')
  return
}
