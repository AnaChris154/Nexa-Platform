'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';
import { getQuestoes, saveAnswer, calcularNivelPorMateria, limparRespostasPrevias } from '@/services/diagnosticoService';
import { gerarPlanoEstudoComIA } from '@/services/studyPlanService';
import { getStudentGoal, atualizarStatusDiagnostico } from '@/services/studentGoalsService';
import type { DiagnosticoQuestion } from '@/services/diagnosticoService';

function DiagnosticoContent() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [questions, setQuestions] = useState<DiagnosticoQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar perguntas ao montar
  useEffect(() => {
    const loadQuestionsAndVerify = async () => {
      if (!user?.id) return;

      // Verificar se aluno completou onboarding
      const { goal, error: goalError } = await getStudentGoal(user.id);

      if (goalError || !goal) {
        // Aluno não fez onboarding, redirecionar
        router.push('/aluno/onboarding');
        return;
      }

      // Carregar perguntas
      setLoading(true);
      setError(null);

      const { questoes, error: questionsError } = await getQuestoes();

      if (questionsError) {
        setError(`Erro ao carregar perguntas: ${questionsError.message}`);
        setQuestions([]);
      } else {
        setQuestions(questoes || []);
      }

      setLoading(false);
    };

    if (!authLoading && user) {
      loadQuestionsAndVerify();
    }
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <Container className="py-20 flex flex-col items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary shadow-glow mb-5 animate-float">
            <span className="text-3xl">🧠</span>
          </div>
          <p className="font-bold text-[hsl(var(--foreground))] text-lg">Carregando perguntas...</p>
          <div className="mt-4 flex justify-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-gradient-primary animate-bounce-gentle" style={{ animationDelay: `${i * 150}ms` }} />
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (!user) {
    return null; // ProtectedRoute vai redirecionar
  }

  if (error || questions.length === 0) {
    return (
      <Container className="py-12">
        <div className="flex items-start gap-4 p-6 rounded-2xl bg-[hsl(var(--destructive-soft))] border border-[hsl(var(--destructive)_/0.3)]">
          <span className="text-3xl shrink-0">❌</span>
          <div>
            <p className="font-bold text-[hsl(var(--destructive))]">Erro ao carregar diagnóstico</p>
            <p className="text-sm text-[hsl(var(--destructive))] mt-1">{error || 'Nenhuma pergunta disponível'}</p>
          </div>
        </div>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  // Questão aberta: precisa ter pelo menos 10 caracteres para habilitar "Próxima"
  const isAnswered = currentQuestion.tipo === 'aberta'
    ? (answers[currentQuestion.id] ?? '').trim().length >= 10
    : answers[currentQuestion.id] !== undefined;

  const handleNext = () => {
    if (!isAnswered) {
      setError('Por favor, selecione uma resposta');
      return;
    }
    setError(null);

    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) return;
    if (Object.keys(answers).length !== questions.length) {
      setError('Por favor, responda todas as perguntas');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Limpar respostas anteriores antes de salvar as novas
      // Garante que re-fazer o quiz não acumule respostas antigas
      const { error: clearError } = await limparRespostasPrevias(user.id);
      if (clearError) {
        console.warn('Aviso: não foi possível limpar respostas antigas:', clearError.message);
        // Não bloqueia o fluxo — continua mesmo assim
      }

      // Salvar todas as respostas
      for (const question of questions) {
        const userAnswer = answers[question.id];
        // Questões abertas: correta = null (IA avalia)
        // Questões fechadas: compara com resposta_correta
        const isCorrect = question.tipo === 'aberta'
          ? null
          : userAnswer === question.resposta_correta;

        const { error: saveError } = await saveAnswer(
          user.id,
          question.id,
          userAnswer,
          isCorrect
        );

        if (saveError) {
          setError(`Erro ao salvar respostas: ${saveError.message}`);
          setSubmitting(false);
          return;
        }
      }

      // Calcular resultado + mapa de habilidades
      const { diagnostico, porHabilidade, error: niveisError } = await calcularNivelPorMateria(user.id);

      if (niveisError) {
        setError('Erro ao processar diagnóstico');
        setSubmitting(false);
        return;
      }

      // Gerar plano com IA
      if (diagnostico && porHabilidade) {
        const { error: planError } = await gerarPlanoEstudoComIA(user.id, diagnostico, porHabilidade);

        if (planError) {
          // Não bloqueia o fluxo se a IA falhar
          console.error('Plano IA falhou, continuando:', planError.message);
        }

        const { error: statusError } = await atualizarStatusDiagnostico(
          user.id,
          'completed'
        );

        if (statusError) {
          setError('Erro ao atualizar status do diagnostico');
          setSubmitting(false);
          return;
        }
      }

      // Redirecionar para o dashboard
      setSubmitting(false);
      router.push('/aluno/dashboard');
    } catch (err) {
      setError('Erro ao salvar respostas');
      setSubmitting(false);
    }
  };

  const handleSkip = async () => {
    if (!user?.id) return;

    setIsSkipping(true);
    setError(null);

    const { success, error: skipError } = await atualizarStatusDiagnostico(
      user.id,
      'skipped'
    );

    if (skipError) {
      setError('Erro ao pular diagnóstico');
      setIsSkipping(false);
      return;
    }

    // Redirecionar para dashboard
    router.push('/aluno/dashboard');
  };

  return (
    <Container className="py-8">
      {/* Barra de progresso */}
      <div className="mb-8 animate-fade-up">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-[hsl(var(--muted-foreground))]">
            Questão {currentQuestionIndex + 1} de {questions.length}
          </span>
          <span className="text-sm font-bold text-[hsl(var(--primary))]">{progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Card da questão */}
      <div className="bg-white rounded-2xl border border-[hsl(var(--border))] shadow-card p-7 mb-6 animate-fade-up delay-75">
        {/* Cabeçalho da questão */}
        <div className="flex items-center justify-between mb-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary-soft text-[hsl(var(--primary))] text-xs font-bold rounded-full uppercase tracking-wide">
            📖 {currentQuestion.materia}
          </span>
          <span className="text-xs text-[hsl(var(--muted-foreground))] font-medium px-2.5 py-1 rounded-full bg-[hsl(var(--muted))]">
            Nível {currentQuestion.nivel}
          </span>
        </div>

        <h3 className="text-lg font-bold text-[hsl(var(--foreground))] mb-6 leading-relaxed">
          {currentQuestion.pergunta}
        </h3>

        {/* Alternativas ou campo aberto */}
        {currentQuestion.tipo === 'aberta' ? (
          <div className="mt-2">
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2">Escreva sua resposta abaixo — não existe certo ou errado aqui! 😊</p>
            <textarea
              value={answers[currentQuestion.id] ?? ''}
              onChange={(e) => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: e.target.value }))}
              placeholder="Escreva aqui à vontade..."
              rows={5}
              className="w-full rounded-2xl border-2 border-[hsl(var(--border))] bg-[hsl(var(--muted)_/0.3)] p-4 text-sm text-[hsl(var(--foreground))] resize-none focus:outline-none focus:border-[hsl(var(--primary))] transition-colors"
            />
          </div>
        ) : (
        <div className="space-y-3">
          {(['a', 'b', 'c', 'd'] as const).map((option) => {
            const optionText = currentQuestion[`alternativa_${option}` as keyof typeof currentQuestion] as string;
            if (!optionText || optionText.trim() === '') return null;
            const isSelected = answers[currentQuestion.id] === option;

            return (
              <button
                key={option}
                onClick={() => setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }))}
                className={[
                  'w-full text-left p-4 rounded-2xl border-2 transition-all duration-200',
                  'flex items-center gap-4',
                  'hover:shadow-sm',
                  isSelected
                    ? 'border-[hsl(var(--primary))] bg-primary-soft shadow-[0_2px_12px_-2px_hsl(258_90%_60%_/0.2)]'
                    : 'border-[hsl(var(--border))] hover:border-[hsl(var(--primary)_/0.4)] bg-[hsl(var(--muted)_/0.3)]',
                ].join(' ')}
              >
                <div className={[
                  'w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-all duration-200',
                  isSelected ? 'border-[hsl(var(--primary))] bg-gradient-primary' : 'border-[hsl(var(--border))]',
                ].join(' ')}>
                  {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className={['text-sm font-bold', isSelected ? 'text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))]'].join(' ')}>
                    {option.toUpperCase()}
                  </span>
                  <span className={['text-sm', isSelected ? 'text-[hsl(var(--foreground))] font-medium' : 'text-[hsl(var(--foreground))]'].join(' ')}>
                    {optionText}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        )}

        {/* Erro */}
        {error && (
          <div className="mt-5 flex items-center gap-2 p-4 rounded-2xl bg-[hsl(var(--destructive-soft))] border border-[hsl(var(--destructive)_/0.2)]">
            <span>⚠️</span>
            <p className="text-sm text-[hsl(var(--destructive))] font-medium">{error}</p>
          </div>
        )}

        {/* Navegação */}
        <div className="flex items-center justify-between mt-7 gap-3">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0 || submitting || isSkipping}
            variant="ghost"
            size="md"
          >
            ← Anterior
          </Button>

          <Button
            onClick={handleSkip}
            disabled={submitting || isSkipping}
            variant="ghost"
            size="sm"
            className="text-[hsl(var(--muted-foreground))]"
          >
            {isSkipping ? 'Pulando...' : '⏸️ Deixar para depois'}
          </Button>

          <Button
            onClick={handleNext}
            disabled={submitting || isSkipping || !isAnswered}
            variant="primary"
            size="md"
          >
            {isLastQuestion
              ? submitting
                ? <span className="flex items-center gap-2"><span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />Gerando plano...</span>
                : 'Finalizar & Gerar Plano 🚀'
              : 'Próxima →'}
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default function DiagnosticoPage() {
  return <DiagnosticoContent />;
}
