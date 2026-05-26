'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, AlertCircle, Lightbulb, ArrowRight } from 'lucide-react';
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
import type { StudyPlan } from '@/services/studyPlanService';

const nivelConfig = {
  baixo: { label: 'Baixo', value: 25 },
  medio: { label: 'Medio', value: 50 },
  alto:  { label: 'Alto',  value: 85 },
};

function DisciplinasContent() {
  const { user } = useAuth();
  const [disciplinas, setDisciplinas] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDisciplinas = async () => {
      if (!user?.id) { setLoading(false); return; }
      try {
        const { plano: studyPlan, error: planError } = await getStudyPlan(user.id);
        if (planError) { setError(planError.message); setDisciplinas([]); }
        else { setDisciplinas(studyPlan || []); }
        setLoading(false);
      } catch { setError('Erro ao carregar disciplinas'); setLoading(false); }
    };
    loadDisciplinas();
  }, [user]);

  const countByLevel = {
    baixo: disciplinas.filter((d) => d.nivel === 'baixo').length,
    medio: disciplinas.filter((d) => d.nivel === 'medio').length,
    alto:  disciplinas.filter((d) => d.nivel === 'alto').length,
  };

  return (
    <PageContainer>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Disciplinas</h1>
          <p className="text-muted-foreground text-sm">Acompanhe seu progresso em cada materia</p>
        </div>

        {loading && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
          </div>
        )}

        {error && (
          <Card className="border-destructive bg-destructive/10 mb-4">
            <CardContent className="flex items-start gap-4 py-4">
              <AlertCircle className="size-5 text-destructive shrink-0" />
              <div>
                <h3 className="font-semibold text-destructive">Erro ao carregar disciplinas</h3>
                <p className="text-sm text-destructive mt-1">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!loading && disciplinas.length === 0 && !error && (
          <Card className="text-center bg-primary text-primary-foreground border-0">
            <CardContent className="py-10">
              <div className="size-16 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center"><BookOpen className="size-8" /></div>
              <h2 className="text-xl font-bold mb-2">Nenhuma Disciplina</h2>
              <p className="text-primary-foreground/80 mb-6 text-sm max-w-sm mx-auto">Complete o diagnostico para visualizar suas disciplinas.</p>
              <Link href="/aluno/diagnostico">
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">Iniciar Diagnostico <ArrowRight className="ml-2 size-4" /></Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {!loading && disciplinas.length > 0 && (
          <>
            <div className="grid grid-cols-3 gap-3 mb-8">
              <Card className="bg-red-50 border-red-200 text-center"><CardContent className="py-4"><p className="text-2xl font-bold text-red-600">{countByLevel.baixo}</p><p className="text-xs text-muted-foreground mt-1">Baixo</p></CardContent></Card>
              <Card className="bg-yellow-50 border-yellow-200 text-center"><CardContent className="py-4"><p className="text-2xl font-bold text-yellow-600">{countByLevel.medio}</p><p className="text-xs text-muted-foreground mt-1">Medio</p></CardContent></Card>
              <Card className="bg-green-50 border-green-200 text-center"><CardContent className="py-4"><p className="text-2xl font-bold text-green-600">{countByLevel.alto}</p><p className="text-xs text-muted-foreground mt-1">Alto</p></CardContent></Card>
            </div>
            <div className="space-y-4 mb-8">
              {disciplinas.map((disciplina) => {
                const config = nivelConfig[disciplina.nivel];
                return (
                  <Card key={disciplina.id} className="hover:border-primary/50 transition-colors">
                    <CardContent className="py-5">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold capitalize">{disciplina.materia}</h4>
                        <Badge variant="outline">Nivel {config.label}</Badge>
                      </div>
                      <Progress value={config.value} className="mb-3 h-2" />
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="secondary">{disciplina.origem}</Badge>
                        <Badge variant="secondary" className="capitalize">{disciplina.prioridade}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <Card className="bg-primary/5 border-primary/20 mb-6">
              <CardContent className="flex items-start gap-4 py-4">
                <div className="size-10 rounded-xl bg-primary flex items-center justify-center shrink-0"><Lightbulb className="size-5 text-white" /></div>
                <div>
                  <h4 className="font-semibold mb-2">Dicas para melhorar</h4>
                  <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                    <li>Foque primeiro nas disciplinas de nivel baixo</li>
                    <li>Use as trilhas de estudo para estruturar seu aprendizado</li>
                    <li>Pratique regularmente com as atividades</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/aluno/plano"><Button variant="secondary" size="lg" className="w-full">Meu Plano</Button></Link>
              <Link href="/aluno/dashboard"><Button variant="outline" size="lg" className="w-full">Dashboard</Button></Link>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}

export default function DisciplinasPage() {
  return <DisciplinasContent />;
}
