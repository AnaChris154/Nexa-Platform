import { supabase } from '@/lib/supabaseClient';

/**
 * Interface do Perfil de Usuário
 */
export interface UserProfile {
  id: string;
  email: string;
  tipo: 'aluno' | 'professor';
  school_id: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Criar um novo perfil de usuário
 * @param userId ID do usuário (UUID do auth.users)
 * @param email Email do usuário
 * @param tipo 'aluno' ou 'professor'
 * @returns Promise com { profile, error }
 */
export async function createProfile(
  userId: string,
  email: string,
  tipo: 'aluno' | 'professor',
  schoolId: string
): Promise<{ profile: UserProfile | null; error: Error | null }> {
  try {
    // Validações básicas
    if (!userId || !email || !tipo || !schoolId) {
      return {
        profile: null,
        error: new Error('userId, email, tipo e schoolId são obrigatórios'),
      };
    }

    if (tipo !== 'aluno' && tipo !== 'professor') {
      return {
        profile: null,
        error: new Error('tipo deve ser "aluno" ou "professor"'),
      };
    }

    // Inserir perfil no Supabase
    const { data, error } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          email,
          tipo,
          school_id: schoolId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar perfil:', error.message);
      return { profile: null, error: new Error(error.message) };
    }

    if (!data) {
      return { profile: null, error: new Error('Erro ao criar perfil') };
    }

    return {
      profile: {
        id: data.id,
        email: data.email,
        tipo: data.tipo,
        school_id: data.school_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao criar perfil:', message);
    return { profile: null, error: new Error(message) };
  }
}

/**
 * Obter perfil de um usuário
 * @param userId ID do usuário
 * @returns Promise com { profile, error }
 */
export async function getProfile(
  userId: string
): Promise<{ profile: UserProfile | null; error: Error | null }> {
  try {
    if (!userId) {
      return {
        profile: null,
        error: new Error('userId é obrigatório'),
      };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // Se não encontrar, não é erro fatal (pode ser novo usuário)
      if (error.code === 'PGRST116') {
        return { profile: null, error: null };
      }
      console.error('Erro ao buscar perfil:', error.message);
      return { profile: null, error: new Error(error.message) };
    }

    if (!data) {
      return { profile: null, error: null };
    }

    return {
      profile: {
        id: data.id,
        email: data.email,
        tipo: data.tipo,
        school_id: data.school_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao buscar perfil:', message);
    return { profile: null, error: new Error(message) };
  }
}

/**
 * Atualizar perfil de um usuário
 * @param userId ID do usuário
 * @param updates Dados a atualizar (partial)
 * @returns Promise com { profile, error }
 */
export async function updateProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>
): Promise<{ profile: UserProfile | null; error: Error | null }> {
  try {
    if (!userId) {
      return {
        profile: null,
        error: new Error('userId é obrigatório'),
      };
    }

    // Validar tipo se estiver sendo atualizado
    if (updates.tipo && updates.tipo !== 'aluno' && updates.tipo !== 'professor') {
      return {
        profile: null,
        error: new Error('tipo deve ser "aluno" ou "professor"'),
      };
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar perfil:', error.message);
      return { profile: null, error: new Error(error.message) };
    }

    if (!data) {
      return { profile: null, error: new Error('Erro ao atualizar perfil') };
    }

    return {
      profile: {
        id: data.id,
        email: data.email,
        tipo: data.tipo,
        school_id: data.school_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao atualizar perfil:', message);
    return { profile: null, error: new Error(message) };
  }
}

/**
 * Deletar perfil de um usuário
 * (Nota: Normalmente mantém-se o perfil, só desativa)
 * @param userId ID do usuário
 * @returns Promise com { success, error }
 */
export async function deleteProfile(
  userId: string
): Promise<{ success: boolean; error: Error | null }> {
  try {
    if (!userId) {
      return {
        success: false,
        error: new Error('userId é obrigatório'),
      };
    }

    const { error } = await supabase.from('profiles').delete().eq('id', userId);

    if (error) {
      console.error('Erro ao deletar perfil:', error.message);
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao deletar perfil:', message);
    return { success: false, error: new Error(message) };
  }
}
