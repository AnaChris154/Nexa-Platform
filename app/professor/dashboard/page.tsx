'use client';

import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';

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
    <>
      <Navigation />
      <Header
        title="Dashboard do Professor"
        description="Gerencie suas turmas e acompanhe o progresso dos alunos"
      />

      <Container className="py-12">
        {/* Saudação */}
        <div className="mb-8">
          <h2>Bem-vindo de volta, {userName}! 👨‍🏫</h2>
          <p className="text-muted">Gerencie suas turmas e acompanhe o progresso dos seus alunos</p>
        </div>

        {/* Turmas Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3>Suas Turmas</h3>
            <Button variant="primary">+ Nova Turma</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {turmas.map((turma) => (
              <Card key={turma.id} hoverable>
                <h4>{turma.nome}</h4>
                <p className="text-sm text-muted mt-1 mb-4">{turma.disciplina}</p>
                <div className="mb-6 p-4 bg-blue-50 rounded-lg text-center">
                  <p>
                    <span className="text-2xl font-bold text-blue-600">
                      {turma.alunos}
                    </span>
                    <span className="text-sm text-muted ml-2">alunos</span>
                  </p>
                </div>
                <Button variant="secondary" fullWidth>
                  Gerenciar
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Atividades Recentes Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3>Atividades Recentes</h3>
            <Button variant="primary">+ Nova Atividade</Button>
          </div>
          <div className="space-y-3">
            {atividadesRecentes.map((atividade) => (
              <Card key={atividade.id}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4>{atividade.titulo}</h4>
                    <p className="text-sm text-muted mt-1">{atividade.data}</p>
                  </div>
                  <Button variant="secondary">Editar</Button>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section>
          <h3 className="mb-6">Estatísticas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">3</p>
                <p className="text-muted mt-2">Turmas Ativas</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">90</p>
                <p className="text-muted mt-2">Total de Alunos</p>
              </div>
            </Card>
            <Card>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">15</p>
                <p className="text-muted mt-2">Atividades Criadas</p>
              </div>
            </Card>
          </div>
        </section>
      </Container>
    </>
  );
}

export default function ProfessorDashboard() {
  return (
    <ProtectedRoute>
      <ProfessorDashboardContent />
    </ProtectedRoute>
  );
}
