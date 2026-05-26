'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Briefcase,
  BookMarked,
  FileText,
  Award,
  Target,
  Wrench,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress as ProgressBar } from '@/components/ui/progress';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';
import { createStudentGoal, getStudentGoal } from '@/services/studentGoalsService';
import { Skeleton } from '@/components/ui/skeleton';

type Objetivo = 'faculdade' | 'mercado' | 'escola';
type FormaIngresso =
  | 'enem'
  | 'prouni'
  | 'vestibular'
  | 'certificados'
  | 'cursos_profissionalizantes';

const objetivos = [
  {
    value: 'faculdade' as Objetivo,
    icon: GraduationCap,
    label: 'Entrar na Faculdade',
    desc: 'Preparacao para o ensino superior',
  },
  {
    value: 'mercado' as Objetivo,
    icon: Briefcase,
    label: 'Entrar no Mercado',
    desc: 'Preparacao para carreira profissional',
  },
  {
    value: 'escola' as Objetivo,
    icon: BookMarked,
    label: 'Melhorar na Escola',
    desc: 'Melhorar desempenho e notas',
  },
];

const formasIngresso = {
  faculdade: [
    { value: 'enem' as FormaIngresso, icon: FileText, label: 'ENEM', desc: 'Exame Nacional do Ensino Medio' },
    { value: 'prouni' as FormaIngresso, icon: Award, label: 'ProUni', desc: 'Programa Universidade para Todos' },
    { value: 'vestibular' as FormaIngresso, icon: Target, label: 'Vestibular', desc: 'Prova de entrada de universidades' },
  ],
  mercado: [
    { value: 'certificados' as FormaIngresso, icon: Award, label: 'Certificados', desc: 'Obter certificacoes profissionais' },
    { value: 'cursos_profissionalizantes' as FormaIngresso, icon: Wrench, label: 'Cursos Profissionalizantes', desc: 'Formacao tecnica e profissional' },
  ],
};

function OnboardingContent() {
  const router = useRouter();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [objetivo, setObjetivo] = useState<Objetivo | null>(null);
  const [formaIngresso, setFormaIngresso] = useState<FormaIngresso | null>(null);
  const [cursoDesejado, setCursoDesejado] = useState('');
  const [universidade, setUniversidade] = useState('');
  const [tempoMeta, setTempoMeta] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verificarObjetivo = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const { goal } = await getStudentGoal(user.id);

      if (goal) {
        router.push('/aluno/diagnostico');
      }

      setLoading(false);
    };

    verificarObjetivo();
  }, [user, router]);

  const handleObjetivoSelect = (selected: Objetivo) => {
    setObjetivo(selected);
    setFormaIngresso(null);
    setError(null);

    if (selected === 'escola') {
      setCurrentStep(3);
    } else {
      setCurrentStep(2);
    }
  };

  const handleFormaIngressoSelect = (forma: FormaIngresso) => {
    setFormaIngresso(forma);
    setError(null);
    setCurrentStep(3);
  };

  const handleGoBack = () => {
    if (currentStep > 1) {
      setError(null);

      if (currentStep === 3 && objetivo === 'escola') {
        setCurrentStep(1);
        setObjetivo(null);
      } else if (currentStep === 3) {
        setCurrentStep(2);
      } else if (currentStep === 2) {
        setCurrentStep(1);
        setObjetivo(null);
        setFormaIngresso(null);
      }
    }
  };

  const handleSave = async () => {
    if (!user?.id || !objetivo) {
      setError('Dados incompletos');
      return;
    }

    if ((objetivo === 'faculdade' || objetivo === 'mercado') && !formaIngresso) {
      setError('Selecione uma opcao de caminho');
      return;
    }

    setSaving(true);
    setError(null);

    const { error: goalError } = await createStudentGoal(
      user.id,
      objetivo,
      cursoDesejado || undefined,
      universidade || undefined,
      formaIngresso || undefined,
      tempoMeta ? parseInt(tempoMeta) : undefined
    );

    if (goalError) {
      setError(`Erro ao salvar: ${goalError.message}`);
      setSaving(false);
      return;
    }

    setSaving(false);
    router.push('/aluno/diagnostico');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-3.5rem)]">
        <div className="text-center space-y-4">
          <Skeleton variant="circular" width={64} height={64} className="mx-auto" />
          <Skeleton width={150} height={20} className="mx-auto" />
        </div>
      </div>
    );
  }

  const progressValue = currentStep === 1 ? 33 : currentStep === 2 ? 66 : 100;

  return (
    <Container className="py-8 max-w-2xl">
      {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[hsl(var(--muted-foreground))]">
              Passo {currentStep} de 3
            </span>
            <span className="text-sm font-semibold text-[hsl(var(--primary))]">
              {progressValue}%
            </span>
          </div>
          <ProgressBar value={progressValue} variant="primary" size="md" />
        </motion.div>

        <AnimatePresence mode="wait">
          {/* STEP 1 */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[hsl(var(--foreground))]">
                  Qual e seu objetivo?
                </h3>
                <p className="text-[hsl(var(--muted-foreground))] mt-1">
                  Escolha o proposito principal dos seus estudos
                </p>
              </div>

              <div className="space-y-3">
                {objetivos.map((op) => {
                  const isSelected = objetivo === op.value;
                  return (
                    <Card
                      key={op.value}
                      hoverable
                      onClick={() => handleObjetivoSelect(op.value)}
                      className={[
                        'border-2 transition-all cursor-pointer',
                        isSelected
                          ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary-soft))]'
                          : 'border-[hsl(var(--border))] hover:border-[hsl(var(--muted-foreground))]',
                      ].join(' ')}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={[
                              'w-12 h-12 rounded-xl flex items-center justify-center',
                              isSelected
                                ? 'bg-[hsl(var(--primary))] text-white'
                                : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
                            ].join(' ')}
                          >
                            <op.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-[hsl(var(--foreground))]">
                              {op.label}
                            </h4>
                            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
                              {op.desc}
                            </p>
                          </div>
                        </div>
                        <div
                          className={[
                            'w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-all',
                            isSelected
                              ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]'
                              : 'border-[hsl(var(--border))]',
                          ].join(' ')}
                        >
                          {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && objetivo && objetivo !== 'escola' && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[hsl(var(--foreground))]">
                  {objetivo === 'faculdade'
                    ? 'Como pretende ingressar na faculdade?'
                    : 'Como pretende se inserir no mercado?'}
                </h3>
                <p className="text-[hsl(var(--muted-foreground))] mt-1">
                  Isso vai guiar seu plano de estudos
                </p>
              </div>

              <div className="space-y-3">
                {formasIngresso[objetivo].map((op) => {
                  const isSelected = formaIngresso === op.value;
                  return (
                    <Card
                      key={op.value}
                      hoverable
                      onClick={() => handleFormaIngressoSelect(op.value)}
                      className={[
                        'border-2 transition-all cursor-pointer',
                        isSelected
                          ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary-soft))]'
                          : 'border-[hsl(var(--border))] hover:border-[hsl(var(--muted-foreground))]',
                      ].join(' ')}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div
                            className={[
                              'w-12 h-12 rounded-xl flex items-center justify-center',
                              isSelected
                                ? 'bg-[hsl(var(--primary))] text-white'
                                : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]',
                            ].join(' ')}
                          >
                            <op.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-[hsl(var(--foreground))]">
                              {op.label}
                            </h4>
                            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">
                              {op.desc}
                            </p>
                          </div>
                        </div>
                        <div
                          className={[
                            'w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-all',
                            isSelected
                              ? 'border-[hsl(var(--primary))] bg-[hsl(var(--primary))]'
                              : 'border-[hsl(var(--border))]',
                          ].join(' ')}
                        >
                          {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="flex justify-start mt-6">
                <Button
                  onClick={handleGoBack}
                  variant="ghost"
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Voltar
                </Button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <h3 className="text-xl font-bold text-[hsl(var(--foreground))]">
                  Detalhes adicionais
                </h3>
                <p className="text-[hsl(var(--muted-foreground))] mt-1">
                  Personalize ainda mais seu plano de estudos
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Curso ou Area de Interesse"
                  type="text"
                  value={cursoDesejado}
                  onChange={(e) => setCursoDesejado(e.target.value)}
                  placeholder="Ex: Engenharia de Software, Direito..."
                />
                {objetivo === 'faculdade' && (
                  <Input
                    label="Universidade (opcional)"
                    type="text"
                    value={universidade}
                    onChange={(e) => setUniversidade(e.target.value)}
                    placeholder="Ex: USP, UNICAMP, UFRJ..."
                  />
                )}
                <Input
                  label="Tempo para seu objetivo (meses)"
                  type="number"
                  value={tempoMeta}
                  onChange={(e) => setTempoMeta(e.target.value)}
                  placeholder="Ex: 6, 12, 24..."
                  helperText="Tempo estimado ate atingir seu objetivo"
                />
              </div>

              {error && (
                <Card className="mt-4 bg-[hsl(var(--destructive-soft))] border-[hsl(var(--destructive))]">
                  <p className="text-sm text-[hsl(var(--destructive))]">{error}</p>
                </Card>
              )}

              <div className="flex items-center justify-between mt-6 gap-3">
                <Button
                  onClick={handleGoBack}
                  variant="ghost"
                  icon={<ArrowLeft className="w-4 h-4" />}
                >
                  Voltar
                </Button>
                <Button
                  onClick={handleSave}
                  isLoading={saving}
                  size="lg"
                  iconRight={!saving ? <ArrowRight className="w-4 h-4" /> : undefined}
                >
                  {saving ? 'Salvando...' : 'Continuar para Diagnostico'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    );
  }

  export default function OnboardingPage() {
    return <OnboardingContent />;
  }
