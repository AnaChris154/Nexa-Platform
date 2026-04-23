import { supabase } from '@/lib/supabaseClient';
import { createProfile } from './profileService';
import { getSchoolByCode } from './schoolService';

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
}

interface AuthResponse {
  user: AuthUser | null;
  error: Error | null;
}

/**
 * Fazer login com email e senha
 */
export async function signIn(
  email: string,
  password: string
): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Erro ao fazer login:', error.message);
      return { user: null, error: new Error(error.message) };
    }

    if (!data.user) {
      return { user: null, error: new Error('Usuário não encontrado') };
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email || '',
        user_metadata: data.user.user_metadata,
      },
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao fazer login:', message);
    return { user: null, error: new Error(message) };
  }
}

/**
 * Criar nova conta com email e senha
 * @param email Email do usuário
 * @param password Senha
 * @param tipo 'aluno' ou 'professor'
 */
export async function signUp(
  email: string,
  password: string,
  tipo: 'aluno' | 'professor' = 'aluno',
  schoolCode: string
): Promise<AuthResponse> {
  try {
    // Validar tipo
    if (tipo !== 'aluno' && tipo !== 'professor') {
      console.error('Tipo inválido:', tipo);
      return { user: null, error: new Error('tipo deve ser "aluno" ou "professor"') };
    }

    if (!schoolCode?.trim()) {
      return { user: null, error: new Error('Código da escola é obrigatório') };
    }

    const { school, error: schoolError } = await getSchoolByCode(schoolCode);

    if (schoolError) {
      return { user: null, error: schoolError };
    }

    if (!school) {
      return { user: null, error: new Error('Código da escola inválido') };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });

    if (error) {
      console.error('Erro ao criar conta:', error.message);
      return { user: null, error: new Error(error.message) };
    }

    if (!data.user) {
      return { user: null, error: new Error('Erro ao criar conta') };
    }

    // ✅ Criar perfil automaticamente após criar user
    const { profile, error: profileError } = await createProfile(
      data.user.id,
      email,
      tipo,
      school.id
    );

    if (profileError) {
      console.error('Erro ao criar perfil:', profileError.message);
      // Não retornar erro aqui, pois usuário foi criado no Auth
      // Profile pode ser criado depois se necessário
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email || '',
        user_metadata: data.user.user_metadata,
      },
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao criar conta:', message);
    return { user: null, error: new Error(message) };
  }
}

/**
 * Fazer logout
 */
export async function signOut(): Promise<{
  success: boolean;
  error: Error | null;
}> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Erro ao fazer logout:', error.message);
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao fazer logout:', message);
    return { success: false, error: new Error(message) };
  }
}

/**
 * Obter usuário atualmente logado
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email || '',
      user_metadata: user.user_metadata,
    };
  } catch (err) {
    console.error('Erro ao obter usuário atual:', err);
    return null;
  }
}

/**
 * Obter a sessão atual
 */
export async function getSession() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    return session;
  } catch (err) {
    console.error('Erro ao obter sessão:', err);
    return null;
  }
}

/**
 * Escutar mudanças de autenticação
 */
export function onAuthStateChange(
  callback: (user: AuthUser | null) => void
) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      callback({
        id: session.user.id,
        email: session.user.email || '',
        user_metadata: session.user.user_metadata,
      });
    } else {
      callback(null);
    }
  });

  return subscription;
}
