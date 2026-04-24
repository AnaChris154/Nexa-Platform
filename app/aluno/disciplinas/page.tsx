'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, AlertCircle, Lightbulb, ArrowRight } from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { MainContent } from '@/components/MainContent';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { ProgressBar } from '@/components/ProgressBar';
import { Skeleton, SkeletonCard } from '@/components/Skeleton';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';
import { getStudyPlan } from '@/services/studyPlanService';
import type { StudyPlan } from '@/services/studyPlanService';

const nivelConfig = {
  baixo: { label: 'Baixo', value: 25, color: 'text-[hsl(var(--destructive))]' },
  medio: { label: 'Medio', value: 50, color: 'text-[hsl(var(--warning))]' },
  alto: { label: 'Alto', value: 85, color: 'text-[hsl(var(--success))]' },
};

function DisciplinasContent() {
  const { user } = useAuth();
  const [disciplinas, setDisciplinas] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDisciplinas = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const { plano: studyPlan, error: planError } = await getStudyPlan(user.id);

        if (planError) {
          setError(planError.message);
          setDisciplinas([]);
        } else {
          setDisciplinas(studyPlan || []);
        }
        setLoading(false);
      } catch {
        setError('Erro ao carregar disciplinas');
        setLoading(false);
      }
    };

    loadDisciplinas();
  }, [user]);

  const countByLevel = {
    baixo: disciplinas.filter((d) => d.nivel === 'baixo').length,
    medio: disciplinas.filter((d) => d.nivel === 'medio').length,
    alto: disciplinas.filter((d) => d.nivel === 'alto').length,
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Navigation />
      
      <MainContent>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
              Disciplinas
            </h1>
            <p className="text-[hsl(var(--muted-foreground))]">
              Acompanhe seu progresso em cada materia
            </p>
          </div>

          {loading && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <Skeleton height={80} />
                <Skeleton height={80} />
                <Skeleton height={80} />
              </div>
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}

          {error && (
            <Card className="p-4 bg-[hsl(var(--destructive-soft))] border-[hsl(var(--destructive))]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-[hsl(var(--destructive))] flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[hsl(var(--destructive))]">
                    Erro ao carregar disciplinas
                  </h3>
                  <p className="text-sm mt-1 text-[hsl(var(--destructive))]">{error}</p>
                  <Link href="/aluno/dashboard">
                    <Button size="sm" variant="secondary" className="mt-3">
                      Voltar ao Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          )}

          {!loading && disciplinas.length === 0 && !error && (
            <Card className="p-6 text-center bg-[hsl(var(--primary))] border-0">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Nenhuma Disciplina
              </h2>
              <p className="text-white/80 mb-6 text-sm max-w-sm mx-auto">
                Complete o diagnostico para visualizar suas disciplinas.
              </p>
              <Link href="/aluno/diagnostico">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-[hsl(var(--primary))]"
                  iconRight={<ArrowRight className="w-4 h-4" />}
                >
                  Iniciar Diagnostico
                </Button>
              </Link>
            </Card>
          )}

          {!loading && disciplinas.length > 0 && (
            <>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <Card className="p-4 text-center bg-[hsl(var(--destructive-soft))] border-[hsl(var(--destructive)_/_0.3)]">
                  <p className="text-2xl font-bold text-[hsl(var(--destructive))]">
                    {countByLevel.baixo}
                  </p>
                  <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] mt-1">
                    Baixo
                  </p>
                </Card>
                <Card className="p-4 text-center bg-[hsl(var(--warning-soft))] border-[hsl(var(--warning)_/_0.3)]">
                  <p className="text-2xl font-bold text-[hsl(38_92%_40%)]">
                    {countByLevel.medio}
                  </p>
                  <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] mt-1">
                    Medio
                  </p>
                </Card>
                <Card className="p-4 text-center bg-[hsl(var(--success-soft))] border-[hsl(var(--success)_/_0.3)]">
                  <p className="text-2xl font-bold text-[hsl(var(--success))]">
                    {countByLevel.alto}
                  </p>
                  <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] mt-1">
                    Alto
                  </p>
                </Card>
              </div>

              <h3 className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-4">
                Detalhes por Disciplina
              </h3>

              <div className="space-y-3 mb-6">
                {disciplinas.map((disciplina) => {
                  const config = nivelConfig[disciplina.nivel];
                  return (
                    <Card key={disciplina.id} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-[hsl(var(--foreground))] capitalize">
                          {disciplina.materia}
                        </h4>
                        <span className={`text-sm font-medium ${config.color}`}>
                          Nivel {config.label}
                        </span>
                      </div>
                      <ProgressBar
                        value={config.value}
                        variant={disciplina.nivel === 'alto' ? 'success' : disciplina.nivel === 'medio' ? 'warning' : 'primary'}
                        size="md"
                        className="mb-3"
                      />
                      <div className="flex gap-2">
                        <Badge variant="default">{disciplina.origem}</Badge>
                        <Badge variant="default" className="capitalize">
                          {disciplina.prioridade}
                        </Badge>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* Tips */}
              <Card className="p-4 bg-[hsl(var(--primary-soft))] border-[hsl(var(--primary)_/_0.2)] mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-[hsl(var(--primary))] flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[hsl(var(--foreground))] mb-2">
                      Dicas para melhorar
                    </h4>
                    <ul className="space-y-1 text-sm text-[hsl(var(--muted-foreground))]">
                      <li>Foque primeiro nas disciplinas de nivel baixo</li>
                      <li>Use as trilhas para estruturar seu aprendizado</li>
                      <li>Pratique regularmente com as atividades</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-2 gap-3">
                <Link href="/aluno/plano">
                  <Button size="lg" variant="secondary" fullWidth>
                    Meu Plano
                  </Button>
                </Link>
                <Link href="/aluno/dashboard">
                  <Button size="lg" variant="outline" fullWidth>
                    Dashboard
                  </Button>
                </Link>
              </div>
            </>
          )}
      </MainContent>
    </div>
  );
}

export default function DisciplinasPage() {
  return (
    <ProtectedRoute>
      <DisciplinasContent />
    </ProtectedRoute>
  );
}
