'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { signUp } from '@/services/authService';
import { useAuth } from '@/app/contexts/AuthContext';

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'aluno' | 'professor'>('aluno');
  const [schoolCode, setSchoolCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirecionar se já estiver autenticado
  if (isAuthenticated) {
    router.push(userType === 'professor' ? '/professor/dashboard' : '/aluno/dashboard');
    return null;
  }

  // Validações
  const validateForm = (): string | null => {
    if (!email.trim()) {
      return 'Email é obrigatório';
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Email inválido';
    }

    if (!password) {
      return 'Senha é obrigatória';
    }

    if (password.length < 6) {
      return 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!confirmPassword) {
      return 'Confirmação de senha é obrigatória';
    }

    if (password !== confirmPassword) {
      return 'As senhas não correspondem';
    }

    if (!schoolCode.trim()) {
      return 'Código da escola é obrigatório';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validar form
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    // Fazer signup
    const { user, error: signupError } = await signUp(
      email,
      password,
      userType,
      schoolCode
    );

    if (signupError) {
      setError(signupError.message || 'Erro ao criar conta');
      setLoading(false);
      return;
    }

    if (user) {
      setSuccess(true);
      // Redirecionar para login após sucesso
      setTimeout(() => {
        router.push('/login');
      }, 1500);
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
              <p className="text-gray-600">Crie sua conta</p>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 font-medium">
                  Conta criada com sucesso! Redirecionando para login...
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
              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de Usuário
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      value="aluno"
                      checked={userType === 'aluno'}
                      onChange={(e) =>
                        setUserType(e.target.value as 'aluno' | 'professor')
                      }
                      className="w-4 h-4"
                      disabled={loading}
                    />
                    <span className="ml-2 text-sm text-gray-700">Aluno</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="userType"
                      value="professor"
                      checked={userType === 'professor'}
                      onChange={(e) =>
                        setUserType(e.target.value as 'aluno' | 'professor')
                      }
                      className="w-4 h-4"
                      disabled={loading}
                    />
                    <span className="ml-2 text-sm text-gray-700">Professor</span>
                  </label>
                </div>
              </div>

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

              <Input
                type="text"
                label="Código da Escola"
                value={schoolCode}
                onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                placeholder="Ex: NEXA-001"
                required
                disabled={loading}
                helperText="Informe o código fornecido pela escola"
              />

              {/* Password Input */}
              <Input
                type="password"
                label="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                disabled={loading}
                helperText="Mínimo 6 caracteres"
              />

              {/* Confirm Password Input */}
              <Input
                type="password"
                label="Confirmar Senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirme sua senha"
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
                {loading ? 'Criando conta...' : 'Criar Conta'}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-600">
                Já tem conta?{' '}
                <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Entrar
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </main>
    </>
  );
}
