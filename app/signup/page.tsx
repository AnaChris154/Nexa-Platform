'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Zap,
  Rocket,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  GraduationCap,
  Users,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { signUp } from '@/services/authService';
import { useAuth } from '@/app/contexts/AuthContext';

const features = [
  'Diagnostico de nivel',
  'Trilhas personalizadas',
  'Plano inteligente',
  'Acompanhamento de progresso',
];

export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'aluno' | 'professor'>('aluno');
  const [schoolCode, setSchoolCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (isAuthenticated) {
    router.push(userType === 'professor' ? '/professor/dashboard' : '/aluno/dashboard');
    return null;
  }

  const validateForm = (): string | null => {
    if (!fullName.trim() || fullName.trim().length < 3) {
      return 'Nome deve ter pelo menos 3 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      return 'Email invalido';
    }

    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phone.trim() || !phoneRegex.test(phone.replace(/\s/g, ''))) {
      return 'Telefone invalido (minimo 10 digitos)';
    }

    if (!password || password.length < 6) {
      return 'Senha deve ter pelo menos 6 caracteres';
    }

    if (password !== confirmPassword) {
      return 'As senhas nao correspondem';
    }

    if (!schoolCode.trim()) {
      return 'Codigo da escola e obrigatorio';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    const { user, error: signupError } = await signUp(
      email,
      password,
      userType,
      schoolCode,
      fullName,
      phone
    );

    if (signupError) {
      setError(signupError.message || 'Erro ao criar conta');
      setLoading(false);
      return;
    }

    if (user) {
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }
  };

  return (
    <main className="min-h-screen flex bg-[hsl(var(--background))]">
      {/* Left Panel - Desktop */}
      <div className="hidden lg:flex lg:w-5/12 relative items-center justify-center p-12 overflow-hidden bg-[hsl(var(--primary))]">
        <div
          aria-hidden
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 30% 20%, white 0%, transparent 50%), radial-gradient(circle at 70% 80%, white 0%, transparent 50%)',
          }}
        />

        <div className="relative text-white text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur mb-8"
          >
            <Rocket className="w-10 h-10" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight mb-4"
          >
            Comece sua jornada
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/80 text-lg leading-relaxed max-w-xs mx-auto"
          >
            Crie sua conta e tenha acesso a um plano de estudos completamente personalizado.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col gap-3"
          >
            {features.map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm text-white/90">
                <span className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </span>
                {f}
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-7/12 flex items-center justify-center px-6 py-10 overflow-y-auto">
        <div className="w-full max-w-[440px]">
          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:hidden text-center mb-8"
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
            className="mb-6"
          >
            <h2 className="text-2xl font-bold text-[hsl(var(--foreground))]">
              Criar conta
            </h2>
            <p className="mt-1 text-[hsl(var(--muted-foreground))]">
              Ja tem conta?{' '}
              <Link
                href="/login"
                className="font-semibold text-[hsl(var(--primary))] hover:underline"
              >
                Entrar
              </Link>
            </p>
          </motion.div>

          {/* Alerts */}
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="mb-5 bg-[hsl(var(--success-soft))] border-[hsl(var(--success))]">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[hsl(var(--success))] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[hsl(var(--success))]">
                      Conta criada!
                    </p>
                    <p className="text-sm text-[hsl(var(--success))]">
                      Redirecionando para login...
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
              <Card className="mb-5 bg-[hsl(var(--destructive-soft))] border-[hsl(var(--destructive))]">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[hsl(var(--destructive))] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-[hsl(var(--destructive))]">
                      Erro
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
            className="space-y-4"
          >
            {/* User Type */}
            <div>
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
                Voce e...
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { type: 'aluno' as const, icon: GraduationCap, label: 'Aluno' },
                  { type: 'professor' as const, icon: Users, label: 'Professor' },
                ].map(({ type, icon: Icon, label }) => (
                  <label
                    key={type}
                    className={[
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200',
                      userType === type
                        ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary-soft))]'
                        : 'border-[hsl(var(--border))] hover:border-[hsl(var(--muted-foreground))]',
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      name="userType"
                      value={type}
                      checked={userType === type}
                      onChange={(e) => setUserType(e.target.value as 'aluno' | 'professor')}
                      className="hidden"
                      disabled={loading}
                    />
                    <Icon
                      className={[
                        'w-6 h-6',
                        userType === type
                          ? 'text-[hsl(var(--primary))]'
                          : 'text-[hsl(var(--muted-foreground))]',
                      ].join(' ')}
                    />
                    <span
                      className={[
                        'text-sm font-semibold',
                        userType === type
                          ? 'text-[hsl(var(--primary))]'
                          : 'text-[hsl(var(--foreground))]',
                      ].join(' ')}
                    >
                      {label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <Input
              label="Nome Completo"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Seu nome completo"
              required
              disabled={loading}
            />

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
              label="Telefone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(11) 99999-9999"
              required
              disabled={loading}
              helperText="Minimo 10 digitos"
            />

            <Input
              label="Codigo da Escola"
              type="text"
              value={schoolCode}
              onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
              placeholder="Ex: NEXA-001"
              required
              disabled={loading}
              helperText="Fornecido pela sua escola"
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Senha"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 chars"
                required
                disabled={loading}
              />
              <Input
                label="Confirmar"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita"
                required
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={loading}
              className="mt-2"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Button>
          </motion.form>

          {/* Terms */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-6 text-center text-xs text-[hsl(var(--muted-foreground))]"
          >
            Ao criar uma conta, voce concorda com os{' '}
            <span className="underline cursor-pointer hover:text-[hsl(var(--primary))] transition-colors">
              termos de servico
            </span>
          </motion.p>

          {/* Back link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-4 text-center"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para o inicio
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
