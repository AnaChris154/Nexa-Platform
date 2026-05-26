'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap, Target, Map, BarChart3, CheckCircle, AlertCircle, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { signIn } from '@/services/authService';
import { useAuth } from '@/app/contexts/AuthContext';

const features = [
  { icon: Target, label: 'Diagnostico', sub: 'Personalizado' },
  { icon: Map, label: 'Trilhas', sub: 'Guiadas' },
  { icon: BarChart3, label: 'Analise', sub: 'Em tempo real' },
];

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, profile } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'aluno' | 'professor'>('aluno');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isAuthenticated && profile) {
      const redirectUrl =
        profile.tipo === 'professor' ? '/professor/dashboard' : '/aluno/dashboard';
      router.push(redirectUrl);
    }
  }, [isAuthenticated, profile, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
    }
  };

  return (
    <main className="min-h-screen flex bg-[hsl(var(--background))]">
      {/* Left Panel - Desktop only */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12 overflow-hidden bg-[hsl(var(--primary))]">
        {/* Background decoration */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 20%, white 0%, transparent 50%), radial-gradient(circle at 70% 80%, white 0%, transparent 50%)',
          }}
        />

        <div className="relative text-white text-center z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur mb-8"
          >
            <Zap className="w-10 h-10" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight mb-4"
          >
            Bem-vindo de volta!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/80 text-lg leading-relaxed"
          >
            Continue sua jornada de aprendizado. Seu progresso esta esperando.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 grid grid-cols-3 gap-4"
          >
            {features.map((f) => (
              <div
                key={f.label}
                className="p-4 rounded-xl bg-white/10 backdrop-blur border border-white/20"
              >
                <f.icon className="w-6 h-6 mx-auto mb-2" />
                <div className="text-sm font-semibold">{f.label}</div>
                <div className="text-xs text-white/70">{f.sub}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:hidden text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[hsl(var(--primary))] shadow-lg mb-4">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[hsl(var(--primary))]">NEXA</h1>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">
              Entrar na conta
            </h2>
            <p className="mt-1 text-[hsl(var(--muted-foreground))]">
              Nao tem conta?{' '}
              <Link
                href="/signup"
                className="font-semibold text-[hsl(var(--primary))] hover:underline"
              >
                Criar agora
              </Link>
            </p>
          </motion.div>

          {/* Role Selector */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="mb-6"
          >
            <p className="text-sm font-medium text-[hsl(var(--foreground))] mb-3">Acessar como:</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('aluno')}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                  userType === 'aluno'
                    ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary-soft))]'
                    : 'border-[hsl(var(--border))] bg-transparent hover:border-[hsl(var(--primary)_/_0.4)]'
                }`}
              >
                <BookOpen className={`w-5 h-5 ${userType === 'aluno' ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`} />
                <span className={`text-sm font-semibold ${userType === 'aluno' ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--foreground))]'}`}>Aluno</span>
              </button>
              <button
                type="button"
                onClick={() => setUserType('professor')}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                  userType === 'professor'
                    ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary-soft))]'
                    : 'border-[hsl(var(--border))] bg-transparent hover:border-[hsl(var(--primary)_/_0.4)]'
                }`}
              >
                <GraduationCap className={`w-5 h-5 ${userType === 'professor' ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'}`} />
                <span className={`text-sm font-semibold ${userType === 'professor' ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--foreground))]'}`}>Professor</span>
              </button>
            </div>
          </motion.div>

          {/* Alerts */}
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="mb-6 bg-[hsl(var(--success-soft))] border-[hsl(var(--success))]">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[hsl(var(--success))] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[hsl(var(--success))]">
                      Login realizado!
                    </p>
                    <p className="text-sm text-[hsl(var(--success))]">
                      Redirecionando voce agora...
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="mb-6 bg-[hsl(var(--destructive-soft))] border-[hsl(var(--destructive))]">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[hsl(var(--destructive))] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[hsl(var(--destructive))]">
                      Erro ao fazer login
                    </p>
                    <p className="text-sm text-[hsl(var(--destructive))]">{error}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              disabled={loading}
            />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={loading}
              className="mt-2"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </motion.form>
        </div>
      </div>
    </main>
  );
}
