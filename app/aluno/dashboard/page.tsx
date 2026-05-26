'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Target,
  GraduationCap,
  Briefcase,
  BookMarked,
  TrendingUp,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/app/contexts/AuthContext';
import { getStudentGoal } from '@/services/studentGoalsService';
import { cn } from '@/lib/utils';
import type { StudentGoal } from '@/services/studentGoalsService';

const goalIcons = {
  faculdade: GraduationCap,
  mercado: Briefcase,
  escola: BookMarked,
};

const goalLabels = {
  faculdade: 'Faculdade',
  mercado: 'Mercado de Trabalho',
  escola: 'Melhorar na Escola',
};

export default function AlunoDashboard() {
  const { user, profile, school } = useAuth();
  const [goal, setGoal] = useState<StudentGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGoal() {
      if (user?.id) {
        try {
          const studentGoal = await getStudentGoal(user.id);
          setGoal(studentGoal);
        } catch (error) {
          console.error('Erro ao buscar meta do aluno:', error);
        } finally {
          setIsLoading(false);
        }
      }
    }
    fetchGoal();
  }, [user]);

  const WelcomeMessage = () => (
    <Card className="mb-8 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              Olá, {profile?.display_name || 'Aluno'}!
            </h2>
            <p className="mt-1 text-primary-foreground/80">
              Pronto para mais um dia de estudos?
            </p>
          </div>
          <Sparkles className="w-12 h-12 text-primary-foreground/50" />
        </div>
      </CardContent>
    </Card>
  );

  const GoalCard = () => {
    if (isLoading) {
      return <Skeleton className="h-24" />;
    }

    if (!goal) {
      return (
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <Target className="w-10 h-10 mb-4 text-muted-foreground" />
            <h3 className="font-semibold">Defina sua meta!</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Personalize sua jornada de aprendizado.
            </p>
            <Button asChild>
              <Link href="/aluno/onboarding">Definir Meta</Link>
            </Button>
          </CardContent>
        </Card>
      );
    }

    const GoalIcon = goal.goal ? goalIcons[goal.goal as keyof typeof goalIcons] : null;
    const goalLabel = goal.goal ? goalLabels[goal.goal as keyof typeof goalLabels] : 'Meta não definida';

    // Se o ícone não for encontrado, podemos usar um ícone padrão ou não renderizar o card.
    // Aqui, vamos usar o ícone de Target como fallback.
    const DisplayIcon = GoalIcon || Target;

    return (
      <Card className="hover:border-primary/80 transition-colors">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <DisplayIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Seu objetivo</p>
              <h3 className="text-lg font-semibold">
                {goalLabel}
              </h3>
            </div>
            <Button variant="ghost" size="icon" className="ml-auto" asChild>
              <Link href="/aluno/onboarding">
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const RecentActivityCard = () => (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">Atividade Recente</h3>
        <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
          <Clock className="w-6 h-6 text-muted-foreground" />
          <div>
            <p className="font-medium">Introdução à Álgebra</p>
            <p className="text-sm text-muted-foreground">
              Você parou na aula 5.
            </p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto">
            Continuar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ProgressSummaryCard = () => (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4">Resumo do Progresso</h3>
        <div className="space-y-4">
          <div className="flex items-center">
            <p className="flex-1">Matemática</p>
            <div className="w-32 h-2 bg-muted rounded-full">
              <div
                className="h-2 bg-green-500 rounded-full"
                style={{ width: '75%' }}
              />
            </div>
            <span className="ml-3 text-sm font-medium">75%</span>
          </div>
          <div className="flex items-center">
            <p className="flex-1">Português</p>
            <div className="w-32 h-2 bg-muted rounded-full">
              <div
                className="h-2 bg-yellow-500 rounded-full"
                style={{ width: '40%' }}
              />
            </div>
            <span className="ml-3 text-sm font-medium">40%</span>
          </div>
        </div>
        <Button variant="link" className="p-0 mt-4" asChild>
          <Link href="/aluno/disciplinas">
            Ver todos <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col gap-6">
      <WelcomeMessage />

      <div className="grid gap-6 md:grid-cols-2">
        <GoalCard />
        <RecentActivityCard />
      </div>

      <ProgressSummaryCard />
    </div>
  );
}
