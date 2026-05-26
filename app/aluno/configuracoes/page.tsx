'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ClipboardCheck, Target, GraduationCap, Briefcase, BookOpen,
  Clock, RotateCcw, ArrowRight, LayoutDashboard, Lightbulb,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';
import { getStudentGoal, resetarDiagnostico } from '@/services/studentGoalsService';
import type { StudentGoal } from '@/services/studentGoalsService';

const statusConfig = {
  not_started: { icon: Clock,          label: 'Nao Iniciado', desc: 'Voce ainda nao iniciou o diagnostico',         variant: 'warning'  as const },
  skipped:     { icon: ClipboardCheck, label: 'Pulado',       desc: 'Voce pulou o diagnostico inicial',             variant: 'warning'  as const },
  completed:   { icon: ClipboardCheck, label: 'Concluido',    desc: 'Seu diagnostico foi realizado com sucesso',    variant: 'success'  as const },
};

const tips = [
  'Revise seu objetivo periodicamente',
  'Refaca o diagnostico quando sentir que progrediu',
  'Acompanhe suas disciplinas regularmente',
  'Use as trilhas de estudo como guia estruturado',
];

function ConfiguracoesContent() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [goal, setGoal] = useState<StudentGoal | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadGoal = async () => {
      if (!user?.id) { setLoading(false); return; }
      const { goal: studentGoal } = await getStudentGoal(user.id);
      setGoal(studentGoal || null);
      setLoading(false);
    };
    loadGoal();
  }, [user]);

  const handleResetDiagnostico = async () => {
    if (!user?.id) return;
    setResetting(true); setError(null);
    const { error: resetError } = await resetarDiagnostico(user.id);
    if (resetError) { setError(`Erro ao resetar: ${resetError.message}`); setResetting(false); return; }
    router.push('/aluno/diagnostico');
  };

  const diagnosticoStatus = goal?.diagnostico_status || 'not_started';
  const status = statusConfig[diagnosticoStatus as keyof typeof statusConfig] || statusConfig.not_started;
  const userName = profile?.display_name || user?.email?.split('@')[0] || 'Usuario';

  return (
    <PageContainer>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Configuracoes</h1>
          <p className="text-muted-foreground text-sm">Suas preferencias e informacoes de perfil</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
        ) : (
          <>
            {/* Profile */}
            <Card className="bg-primary text-primary-foreground border-0">
              <CardContent className="flex items-center gap-5 py-5">
                <Avatar className="size-16 shrink-0">
                  <AvatarFallback className="bg-white/20 text-white text-xl font-semibold">{userName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold truncate">{userName}</h2>
                  <p className="text-primary-foreground/80 text-sm truncate">{user?.email}</p>
                  {profile?.phone && <p className="text-primary-foreground/70 text-xs mt-0.5">{profile.phone}</p>}
                  <Badge className="mt-2 bg-white/20 text-white border-0 hover:bg-white/20">{profile?.tipo === 'aluno' ? 'Aluno' : 'Professor'}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Diagnostic Status */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                <ClipboardCheck className="size-4" /> Diagnostico de Conhecimento
              </h3>
              <Card className={status.variant === 'success' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}>
                <CardContent className="py-4">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${status.variant === 'success' ? 'bg-green-500' : 'bg-yellow-500'}`}>
                      <status.icon className="size-5 text-white" />
                    </div>
                    <div>
                      <p className={`font-semibold ${status.variant === 'success' ? 'text-green-700' : 'text-yellow-700'}`}>{status.label}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{status.desc}</p>
                    </div>
                  </div>
                  {error && <p className="text-sm text-destructive mb-3">{error}</p>}
                  {diagnosticoStatus === 'not_started' && (
                    <Link href="/aluno/diagnostico"><Button className="w-full" size="lg">Iniciar Diagnostico <ArrowRight className="ml-2 size-4" /></Button></Link>
                  )}
                  {diagnosticoStatus === 'skipped' && (
                    <Link href="/aluno/diagnostico"><Button className="w-full" size="lg">Fazer Diagnostico Agora <ArrowRight className="ml-2 size-4" /></Button></Link>
                  )}
                  {diagnosticoStatus === 'completed' && (
                    <Button variant="outline" className="w-full" size="lg" onClick={handleResetDiagnostico} disabled={resetting}>
                      <RotateCcw className="mr-2 size-4" />{resetting ? 'Refazendo...' : 'Refazer Diagnostico'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Goal Info */}
            {goal && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Target className="size-4" /> Seu Objetivo
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="flex items-center gap-3 py-4">
                      <div className="size-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                        {goal.objetivo === 'faculdade' ? <GraduationCap className="size-5 text-white" /> : goal.objetivo === 'mercado' ? <Briefcase className="size-5 text-white" /> : <BookOpen className="size-5 text-white" />}
                      </div>
                      <div>
                        <p className="text-xs text-primary font-medium">Objetivo</p>
                        <p className="font-semibold text-sm capitalize">{goal.objetivo === 'faculdade' ? 'Faculdade' : goal.objetivo === 'mercado' ? 'Mercado' : 'Escola'}</p>
                      </div>
                    </CardContent>
                  </Card>
                  {goal.forma_ingresso && (
                    <Card>
                      <CardContent className="flex items-center gap-3 py-4">
                        <div className="size-10 rounded-xl bg-blue-500 flex items-center justify-center shrink-0"><Target className="size-5 text-white" /></div>
                        <div>
                          <p className="text-xs text-muted-foreground">Caminho</p>
                          <p className="font-semibold text-sm capitalize">{goal.forma_ingresso.replace(/_/g, ' ')}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {goal.curso_desejado && (
                    <Card>
                      <CardContent className="flex items-center gap-3 py-4">
                        <div className="size-10 rounded-xl bg-green-500 flex items-center justify-center shrink-0"><BookOpen className="size-5 text-white" /></div>
                        <div>
                          <p className="text-xs text-muted-foreground">Curso Desejado</p>
                          <p className="font-semibold text-sm">{goal.curso_desejado}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {goal.tempo_meta && (
                    <Card>
                      <CardContent className="flex items-center gap-3 py-4">
                        <div className="size-10 rounded-xl bg-yellow-500 flex items-center justify-center shrink-0"><Clock className="size-5 text-white" /></div>
                        <div>
                          <p className="text-xs text-muted-foreground">Tempo Meta</p>
                          <p className="font-semibold text-sm">{goal.tempo_meta} meses</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {/* Tips */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="flex items-start gap-4 py-4">
                <div className="size-10 rounded-xl bg-blue-500 flex items-center justify-center shrink-0"><Lightbulb className="size-5 text-white" /></div>
                <div>
                  <p className="font-semibold mb-2">Dicas para Melhorar</p>
                  <ul className="space-y-1.5 text-sm text-muted-foreground">
                    {tips.map((tip) => (
                      <li key={tip} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-blue-500 shrink-0" />{tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/aluno/plano"><Button variant="outline" size="lg" className="w-full"><ArrowRight className="mr-2 size-4" />Meu Plano</Button></Link>
              <Link href="/aluno/dashboard"><Button variant="secondary" size="lg" className="w-full"><LayoutDashboard className="mr-2 size-4" />Dashboard</Button></Link>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}

export default function ConfiguracoesPage() {
  return <ConfiguracoesContent />;
}
