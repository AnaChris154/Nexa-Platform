import { supabase } from '@/lib/supabaseClient';

export interface Trilha {
  id: string;
  titulo: string;
  descricao: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Busca todas as trilhas do banco de dados
 */
export async function getTrilhas(): Promise<{
  data: Trilha[] | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from('trilhas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar trilhas:', error.message);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as Trilha[], error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao buscar trilhas:', message);
    return { data: null, error: new Error(message) };
  }
}

/**
 * Busca uma trilha específica pelo ID
 */
export async function getTrilhaById(id: string): Promise<{
  data: Trilha | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from('trilhas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erro ao buscar trilha ${id}:`, error.message);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as Trilha, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error(`Erro ao buscar trilha ${id}:`, message);
    return { data: null, error: new Error(message) };
  }
}

/**
 * Cria uma nova trilha
 */
export async function createTrilha(trilha: Omit<Trilha, 'id' | 'created_at'>): Promise<{
  data: Trilha | null;
  error: Error | null;
}> {
  try {
    const { data, error } = await supabase
      .from('trilhas')
      .insert([trilha])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar trilha:', error.message);
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as Trilha, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao criar trilha:', message);
    return { data: null, error: new Error(message) };
  }
}
