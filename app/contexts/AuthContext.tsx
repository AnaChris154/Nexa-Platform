'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { AuthUser, getCurrentUser, onAuthStateChange } from '@/services/authService';
import { UserProfile, getProfile } from '@/services/profileService';
import { School, getSchoolById } from '@/services/schoolService';

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  school: School | null;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar usuário atual ao montar
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // Se tem usuário, carregar seu perfil
      if (currentUser) {
        const { profile: userProfile } = await getProfile(currentUser.id);
        setProfile(userProfile);

        if (userProfile?.school_id) {
          const { school: userSchool } = await getSchoolById(userProfile.school_id);
          setSchool(userSchool);
        } else {
          setSchool(null);
        }
      }

      setLoading(false);
    };

    checkUser();

    // Escutar mudanças de autenticação
    const subscription = onAuthStateChange(async (authUser) => {
      setUser(authUser);

      // Se tem usuário, carregar seu perfil
      if (authUser) {
        const { profile: userProfile } = await getProfile(authUser.id);
        setProfile(userProfile);

        if (userProfile?.school_id) {
          const { school: userSchool } = await getSchoolById(userProfile.school_id);
          setSchool(userSchool);
        } else {
          setSchool(null);
        }
      } else {
        setProfile(null);
        setSchool(null);
      }

      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        school,
        loading,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
