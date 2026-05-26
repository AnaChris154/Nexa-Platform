'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutGrid, AlertCircle, Target, GraduationCap, Briefcase, BookMarked, Lightbulb, ArrowRight, Inbox } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';
import { getStudyPlan } from '@/services/studyPlanService';
import { getStudentGoal } from '@/services/studentGoalsService';
import type { StudyPlan } from '@/services/studyPlanService';
import type { StudentGoal } from '@/services/studentGoalsService';

const goalIcons = { faculdade: GraduationCap, mercado: Briefcase, escola: BookMarked };
const goalLabels = { faculdade: 'Faculdade', mercado: 'Mercado de Trabalho', escola: 'Melhorar na Escola' };
const prioridadeConfig = {
  alta:  { label: 'Alta Prioridade',  bg: 'bg-red-50',    border: 'border-red-200'    },
  media: { label: 'Media Prioridade', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  baixa: { label: 'Baixa Prioridade', bg: 'bg-green-50',  border: 'border-green-200'  },
};
const nivelConfig = { baixo: { value: 25 }, medio: { value: 50 }, alto: { value: 85 } };

function PlanoContent() {
  const { user } = useAuth();
  const [plano, setPlano] = useState<StudyPlan[]>([]);
  const [goal, setGoal] = useState<StudentGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPlano = async () => {
      if (!user?.id) { setLoading(false); return; }
      try {
        const { goal: studentGoal } = await getStudentGoal(user.id);
        setGoal(studentGoal || null);
        if (!studentGoal || studentGoal.diagnostico_status !== 'completed') {
          setPlano([]); setLoading(false); return;
        }
        const { plano: studyPlan, error: planError } = await getStudyPlan(user.id);
        if (planError) { setError(planError.message); setPlano([]); }
        else { setPlano(studyPlan || []); }
        setLoading(false);
      } catch { setError('Erro ao carregar plano'); setLoading(false); }
    };
    loadPlano();
  }, [user]);

  const GoalIcon = goal ? goalIcons[goal.objetivo] : Target;

  return (
    <PageContainer>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Plano de Estudos</h1>
          <p className="text-muted-foreground text-sm">Seu mapa personalizado de aprendizado</p>
        </div>
        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-xl" />)}
          </div>
        )}
        {error && (
          <Card className="border-destructive bg-destructive/10 mb-4">
            <CardContent className="flex items-start gap-4 py-4">
              <AlertCircle className="size-5 text-destructive shrink-0" />
              <div>
                <h3 className="font-semibold text-destructive">Erro ao carregar plano</h3>
                <p className="text-sm text-destructive mt-1">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}
        {!loading && !goal?.id && (
          <Card className="text-center bg-primary text-primary-foreground border-0">
            <CardContent className="py-10">
              <div className="size-16 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center"><LayoutGrid className="size-8" /></div>
              <h2 className="text-xl font-bold mb-2">Plano Nao Disponivel</h2>
              <p className="text-primary-foreground/80 mb-6 text-sm max-w-sm mx-auto">Complete o diagnostico para gerar seu plano.</p>
              <Link href="/aluno/diagnostico">
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">Iniciar Diagnostico <ArrowRight className="ml-2 size-4" /></Button>
              </Link>
            </CardContent>
          </Card>
        )}
        {!loading && goal?.diagnostico_status === 'completed' && plano.length > 0 && (
          <>
            <Card className="mb-8 bg-primary text-primary-foreground border-0">
              <CardContent className="flex items-center gap-5 py-5">
                <div className="size-14 shrink-0 flex items-center justify-center rounded-xl bg-white/20"><GoalIcon className="size-7" /></div>
                <div>
                  <p className="text-primary-foreground/70 text-xs uppercase tracking-wide">Seu Objetivo</p>
                  <h2 className="text-xl font-bold">{goalLabels[goal.objetivo]}</h2>
                </div>
              </CardContent>
            </Card>
            <div className="space-y-3 mb-8">
              {plano.map((materia) => {
                const prioConfig = prioridadeConfig[materia.prioridade];
                const nivConfig = nivelConfig[materia.nivel];
                return (
                  <Card key={materia.id} className={cn('border', prioConfig.border, prioConfig.bg)}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold capitalize">{materia.materia}</h4>
                        <Badge variant="outline">{prioConfig.label}</Badge>
                      </div>
                      <Progress value={nivConfig.value} className="mb-2 h-2" />
                      <p className="text-xs text-muted-foreground">Nivel: <span className="font-medium capitalize">{materia.nivel}</span></p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/aluno/trilhas"><Button variant="secondary" size="lg" className="w-full">Trilhas</Button></Link>
              <Link href="/aluno/dashboard"><Button variant="outline" size="lg" className="w-full">Dashboard</Button></Link>
            </div>
          </>
        )}
        {!loading && goal?.diagnostico_status === 'completed' && plano.length === 0 && (
          <div className="text-center py-16">
            <Inbox className="size-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold text-lg mb-2">Plano Vazio</h3>
            <Link href="/aluno/dashboard"><Button variant="outline">Voltar</Button></Link>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

export default function PlanoPage() {
  return <PlanoContent />;
}
