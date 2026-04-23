import { supabase } from '@/lib/supabaseClient';

export interface School {
  id: string;
  nome: string;
  codigo: string;
  created_at: string;
}

/**
 * Buscar escola pelo código
 */
export async function getSchoolByCode(
  codigo: string
): Promise<{ school: School | null; error: Error | null }> {
  try {
    if (!codigo?.trim()) {
      return { school: null, error: new Error('Código da escola é obrigatório') };
    }

    const normalizedCode = codigo.trim().toUpperCase();

    const { data, error } = await supabase
      .from('schools')
      .select('id, nome, codigo, created_at')
      .eq('codigo', normalizedCode)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { school: null, error: null };
      }

      console.error('Erro ao buscar escola por código:', error.message);
      return { school: null, error: new Error(error.message) };
    }

    if (!data) {
      return { school: null, error: null };
    }

    return {
      school: {
        id: data.id,
        nome: data.nome,
        codigo: data.codigo,
        created_at: data.created_at,
      },
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao buscar escola por código:', message);
    return { school: null, error: new Error(message) };
  }
}

/**
 * Buscar escola por ID
 */
export async function getSchoolById(
  id: string
): Promise<{ school: School | null; error: Error | null }> {
  try {
    if (!id?.trim()) {
      return { school: null, error: new Error('ID da escola é obrigatório') };
    }

    const { data, error } = await supabase
      .from('schools')
      .select('id, nome, codigo, created_at')
      .eq('id', id.trim())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return { school: null, error: null };
      }

      console.error('Erro ao buscar escola por id:', error.message);
      return { school: null, error: new Error(error.message) };
    }

    if (!data) {
      return { school: null, error: null };
    }

    return {
      school: {
        id: data.id,
        nome: data.nome,
        codigo: data.codigo,
        created_at: data.created_at,
      },
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao buscar escola por id:', message);
    return { school: null, error: new Error(message) };
  }
}