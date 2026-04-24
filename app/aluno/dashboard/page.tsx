'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutGrid,
  Map,
  BookOpen,
  CheckSquare,
  Settings,
  RefreshCw,
  Target,
  GraduationCap,
  Briefcase,
  BookMarked,
  Zap,
  TrendingUp,
  Clock,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { MainContent } from '@/components/MainContent';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Avatar } from '@/components/Avatar';
import { SkeletonDashboard } from '@/components/Skeleton';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';
import { getStudentGoal } from '@/services/studentGoalsService';
import type { StudentGoal } from '@/services/studentGoalsService';
import Link from 'next/link';

const menuItems = [
  {
    href: '/aluno/plano',
    icon: LayoutGrid,
    title: 'Plano de Estudos',
    description: 'Seu plano personalizado',
    color: 'bg-[hsl(var(--primary))]',
    badge: 'Novo',
  },
  {
    href: '/aluno/trilhas',
    icon: Map,
    title: 'Trilhas de Estudo',
    description: 'Caminhos de aprendizado',
    color: 'bg-[hsl(var(--accent))]',
  },
  {
    href: '/aluno/disciplinas',
    icon: BookOpen,
    title: 'Disciplinas',
    description: 'Progresso em cada materia',
    color: 'bg-[hsl(var(--success))]',
  },
  {
    href: '/aluno/atividades',
    icon: CheckSquare,
    title: 'Atividades',
    description: 'Tarefas e exercicios',
    color: 'bg-[hsl(var(--warning))]',
  },
  {
    href: '/aluno/configuracoes',
    icon: Settings,
    title: 'Configuracoes',
    description: 'Gerencie sua conta',
    color: 'bg-[hsl(var(--muted-foreground))]',
  },
  {
    href: '/aluno/onboarding',
    icon: RefreshCw,
    title: 'Refazer Diagnostico',
    description: 'Atualize suas metas',
    color: 'bg-[hsl(var(--accent))]',
  },
];

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

function AlunoDashboardContent() {
  const router = useRouter();
  const { user, profile, school } = useAuth();
  const [goal, setGoal] = useState<StudentGoal | null>(null);
  const [checkingProgress, setCheckingProgress] = useState(true);

  useEffect(() => {
    const verificarProgresso = async () => {
      try {
        if (!user?.id) {
          setCheckingProgress(false);
          return;
        }

        const { goal: studentGoal, error: goalError } = await getStudentGoal(user.id);

        if (goalError) {
          setGoal(null);
          setCheckingProgress(false);
          return;
        }

        setGoal(studentGoal);
        setCheckingProgress(false);
      } catch {
        setGoal(null);
        setCheckingProgress(false);
      }
    };

    verificarProgresso();
  }, [user?.id]);

  const userName = profile?.display_name || profile?.email?.split('@')[0] || user?.email?.split('@')[0] || 'Aluno';
  const GoalIcon = goal ? goalIcons[goal.objetivo] : Target;

  if (checkingProgress) {
    return (
      <div className="min-h-screen bg-[hsl(var(--background))]">
        <Navigation />
        <MainContent>
          <SkeletonDashboard />
        </MainContent>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Navigation />

      <MainContent>
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Avatar name={userName} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
                Ola, {userName}
              </h1>
              <p className="text-[hsl(var(--muted-foreground))]">
                {school?.nome || 'Bem-vindo ao NEXA'}
              </p>
            </div>
          </div>

          {/* Goal Banner */}
          {goal && (
            <Card className="mb-6 bg-[hsl(var(--primary))] border-0 overflow-hidden">
              <div className="p-5 flex items-center gap-4">
                <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-xl bg-white/20">
                  <GoalIcon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/70 font-medium">Seu Objetivo</p>
                  <h2 className="text-xl font-bold text-white">
                    {goalLabels[goal.objetivo]}
                  </h2>
                  {goal.forma_ingresso && (
                    <p className="text-sm text-white/80 mt-0.5">
                      via {goal.forma_ingresso.toUpperCase()}
                    </p>
                  )}
                </div>
                <Badge
                  variant={goal.diagnostico_status === 'completed' ? 'success' : 'default'}
                  className="hidden sm:flex bg-white/20 text-white border-0"
                >
                  {goal.diagnostico_status === 'completed' ? 'Concluido' : 'Pendente'}
                </Badge>
              </div>
            </Card>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-[hsl(var(--warning-soft))] flex items-center justify-center">
                  <Zap className="w-5 h-5 text-[hsl(var(--warning))]" />
                </div>
                <div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Sequencia</p>
                  <p className="text-lg font-semibold text-[hsl(var(--foreground))]">5 dias</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-[hsl(var(--success-soft))] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[hsl(var(--success))]" />
                </div>
                <div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Progresso</p>
                  <p className="text-lg font-semibold text-[hsl(var(--foreground))]">32%</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-[hsl(var(--primary-soft))] flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-[hsl(var(--primary))]" />
                </div>
                <div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Concluidas</p>
                  <p className="text-lg font-semibold text-[hsl(var(--foreground))]">12</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-[hsl(var(--accent-soft))] flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[hsl(var(--accent))]" />
                </div>
                <div>
                  <p className="text-xs text-[hsl(var(--muted-foreground))]">Tempo</p>
                  <p className="text-lg font-semibold text-[hsl(var(--foreground))]">4h 30m</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Navigation */}
          <h3 className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-3">
            Navegacao Rapida
          </h3>
          <div className="space-y-2 mb-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Card className="p-4 hover:shadow-md hover:border-[hsl(var(--primary)_/_0.3)] transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 flex-shrink-0 rounded-xl ${item.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[15px] font-semibold text-[hsl(var(--foreground))]">
                            {item.title}
                          </h4>
                          {item.badge && (
                            <Badge variant="primary" size="sm">{item.badge}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                          {item.description}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 flex-shrink-0 text-[hsl(var(--muted-foreground))]" />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          {(!goal || goal.diagnostico_status === 'not_started') && (
            <Card className="p-6 text-center bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(217_91%_45%)] border-0">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Comece Seu Diagnostico
              </h3>
              <p className="text-white/80 mb-6 max-w-md mx-auto text-sm">
                Responda nosso questionario para gerar seu plano de estudos personalizado.
              </p>
              <Button
                onClick={() => router.push('/aluno/diagnostico')}
                size="lg"
                variant="secondary"
                className="bg-white text-[hsl(var(--primary))] hover:bg-white/90"
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Iniciar Diagnostico
              </Button>
            </Card>
          )}
      </MainContent>
    </div>
  );
}

export default function AlunoDashboard() {
  return (
    <ProtectedRoute>
      <AlunoDashboardContent />
    </ProtectedRoute>
  );
}
