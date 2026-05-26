'use client';

import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';
import { Users, BookOpen, ClipboardList, GraduationCap, Plus, Pencil, ChevronRight, Zap } from 'lucide-react';

function ProfessorDashboardContent() {
  const { user } = useAuth();

  const turmas = [
    { id: 1, nome: '7º A', alunos: 30, disciplina: 'Português' },
    { id: 2, nome: '7º B', alunos: 28, disciplina: 'Português' },
    { id: 3, nome: '8º A', alunos: 32, disciplina: 'Português' },
  ];

  const atividadesRecentes = [
    { id: 1, titulo: 'Criar Atividade de Português', data: '2026-04-24' },
    { id: 2, titulo: 'Corrigir Prova de Redação', data: '2026-04-25' },
    { id: 3, titulo: 'Montar Prova Final', data: '2026-04-26' },
  ];

  const userName = user?.email?.split('@')[0] || 'Professor';

  return (
    <PageContainer>
      <Navigation />
      <Header
        title="Dashboard do Professor"
        description="Gerencie suas turmas e acompanhe o progresso dos alunos"
      />

      <Container className="py-8 md:py-12">

        {/* Welcome Banner */}
        <div className="rounded-2xl bg-gradient-hero p-6 shadow-glow text-white relative overflow-hidden mb-8">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg flex-shrink-0">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Bem-vindo, {userName}!</h2>
              <p className="text-white/80 text-sm mt-0.5">Gerencie suas turmas e acompanhe seus alunos</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="rounded-2xl bg-gradient-hero p-4 text-white text-center shadow-glow">
            <p className="text-3xl font-bold">3</p>
            <p className="text-white/80 text-xs mt-1">Turmas Ativas</p>
          </div>
          <div className="rounded-2xl bg-gradient-success p-4 text-white text-center shadow-lg">
            <p className="text-3xl font-bold">90</p>
            <p className="text-white/80 text-xs mt-1">Total de Alunos</p>
          </div>
          <div className="rounded-2xl bg-gradient-warm p-4 text-white text-center shadow-lg">
            <p className="text-3xl font-bold">15</p>
            <p className="text-white/80 text-xs mt-1">Atividades</p>
          </div>
        </div>

        {/* Turmas Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4" />
              Suas Turmas
            </p>
            <Button size="sm" icon={<Plus className="w-3.5 h-3.5" />}>Nova Turma</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {turmas.map((turma, i) => (
              <div key={turma.id} className="rounded-2xl border-2 border-violet-100 bg-white p-5 hover:shadow-glow hover:border-violet-300 transition-all duration-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{turma.nome}</p>
                    <p className="text-xs text-muted">{turma.disciplina}</p>
                  </div>
                </div>
                <div className="rounded-xl bg-violet-50 p-3 text-center mb-3">
                  <span className="text-2xl font-bold text-violet-600">{turma.alunos}</span>
                  <span className="text-xs text-muted ml-1">alunos</span>
                </div>
                <Button variant="outline" fullWidth size="sm" icon={<ChevronRight className="w-4 h-4" />}>
                  Gerenciar
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Atividades Recentes Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-muted uppercase tracking-wider flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Atividades Recentes
            </p>
            <Button size="sm" variant="secondary" icon={<Plus className="w-3.5 h-3.5" />}>Nova Atividade</Button>
          </div>
          <div className="space-y-3">
            {atividadesRecentes.map((atividade) => (
              <div key={atividade.id} className="rounded-2xl border-2 border-gray-100 bg-white p-4 flex items-center justify-between hover:border-violet-200 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-sky-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{atividade.titulo}</p>
                    <p className="text-xs text-muted mt-0.5">{atividade.data}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" icon={<Pencil className="w-3.5 h-3.5" />}>Editar</Button>
              </div>
            ))}
          </div>
        </div>

      </Container>
    </PageContainer>
  );
}

export default function ProfessorDashboard() {
  return (
    <ProtectedRoute>
      <ProfessorDashboardContent />
    </ProtectedRoute>
  );
}
