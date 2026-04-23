'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { signIn } from '@/services/authService';
import { getProfile } from '@/services/profileService';
import { useAuth } from '@/app/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirecionar se já estiver autenticado
  if (isAuthenticated) {
    router.push('/aluno/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validação básica
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      setLoading(false);
      return;
    }

    const { user, error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message || 'Erro ao fazer login');
      setLoading(false);
      return;
    }

    if (user) {
      setSuccess(true);

      // ✅ Obter perfil para saber o tipo (aluno ou professor)
      const { profile } = await getProfile(user.id);
      
      // Redirecionar baseado no tipo do perfil
      const redirectUrl = profile?.tipo === 'professor' 
        ? '/professor/dashboard' 
        : '/aluno/dashboard';

      // Redirecionar após sucesso
      setTimeout(() => {
        router.push(redirectUrl);
      }, 1000);
    }
  };

  return (
    <>
      <Navigation />

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Card>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-blue-600 mb-2">NEXA</h1>
              <p className="text-gray-600">Plataforma de Estudos</p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">
                  Login realizado com sucesso! Redirecionando...
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={loading}
              />

              {/* Password Input */}
              <Input
                type="password"
                label="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center space-y-3">
              <p className="text-sm text-gray-600">
                Voltar para{' '}
                <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
                  Início
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                Não tem conta?{' '}
                <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                  Criar conta
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}

