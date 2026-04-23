'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';
import type { Trilha } from '@/services/trilhasService';
import { getTrilhas } from '@/services/trilhasService';

function AlunoDashboardContent() {
  const { user, profile, school } = useAuth();
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar trilhas ao montar o componente
  useEffect(() => {
    const buscarTrilhas = async () => {
      setLoading(true);
      setError(null);
      
      const { data, error: trilhasError } = await getTrilhas();
      
      if (trilhasError) {
        setError(`Erro ao carregar trilhas: ${trilhasError.message}`);
        setTrilhas([]);
      } else {
        setTrilhas(data || []);
      }
      
      setLoading(false);
    };

    buscarTrilhas();
  }, []);

  const disciplinas = [
    { id: 1, nome: 'Português', progresso: 75 },
    { id: 2, nome: 'Matemática', progresso: 60 },
    { id: 3, nome: 'Ciências', progresso: 85 },
    { id: 4, nome: 'História', progresso: 70 },
  ];

  const atividades = [
    { id: 1, titulo: 'Resolva os exercícios de Português', disciplina: 'Português', data: '2026-04-25' },
    { id: 2, titulo: 'Lista de Matemática - Geometria', disciplina: 'Matemática', data: '2026-04-26' },
    { id: 3, titulo: 'Resumo sobre Fotossíntese', disciplina: 'Ciências', data: '2026-04-27' },
  ];

  const userName = profile?.email?.split('@')[0] || user?.email?.split('@')[0] || 'Aluno';
  const userEmail = profile?.email || user?.email || 'email@exemplo.com';
  const schoolName = school?.nome || 'Escola não vinculada';

  return (
    <>
      <Navigation />
      <Header
        title="Dashboard do Aluno"
        description="Acompanhe seu progresso e acesse suas atividades"
      />

      <Container className="py-12">
        {/* Saudação com Dados do Usuário */}
        <div className="mb-8">
          <h2>Olá, {userName}! 👋</h2>
          <p className="text-muted text-sm">Email: {userEmail}</p>
          <p className="text-muted text-sm">Escola: {schoolName}</p>
          <p className="text-muted">Aqui você encontra suas trilhas de estudo e atividades</p>
        </div>

        {/* Trilhas de Estudo Section - COM DADOS REAIS */}
        <section className="mb-12">
          <h3 className="mb-6">📚 Trilhas de Estudo</h3>
          
          {loading && (
            <Card>
              <div className="text-center py-8">
                <p className="text-muted">Carregando trilhas...</p>
              </div>
            </Card>
          )}

          {error && (
            <Card className="border-red-200 bg-red-50">
              <div className="text-red-800">
                <p className="font-semibold">⚠️ Erro ao carregar trilhas</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            </Card>
          )}

          {!loading && !error && trilhas.length === 0 && (
            <Card>
              <div className="text-center py-8">
                <p className="text-muted">Nenhuma trilha disponível no momento</p>
              </div>
            </Card>
          )}

          {!loading && !error && trilhas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trilhas.map((trilha) => (
                <Card key={trilha.id} hoverable>
                  <h4>{trilha.titulo}</h4>
                  <p className="text-sm text-muted mt-2">{trilha.descricao || 'Sem descrição'}</p>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button variant="secondary" fullWidth>
                      Começar Trilha
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Disciplinas Section */}
        <section className="mb-12">
          <h3 className="mb-6">Suas Disciplinas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {disciplinas.map((disciplina) => (
              <Card key={disciplina.id} hoverable>
                <h4>{disciplina.nome}</h4>
                <div className="mt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted">Progresso</span>
                    <span className="text-sm font-medium">{disciplina.progresso}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${disciplina.progresso}%` }}
                    ></div>
                  </div>
                </div>
                <Button variant="secondary" fullWidth>
                  Acessar
                </Button>
              </Card>
            ))}
          </div>
        </section>

        {/* Atividades Section */}
        <section>
          <h3 className="mb-6">Atividades Pendentes</h3>
          <div className="space-y-3">
            {atividades.length > 0 ? (
              atividades.map((atividade) => (
                <Card key={atividade.id}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4>{atividade.titulo}</h4>
                      <p className="text-sm text-muted mt-1">
                        {atividade.disciplina} • {atividade.data}
                      </p>
                    </div>
                    <Button variant="primary">Resolver</Button>
                  </div>
                </Card>
              ))
            ) : (
              <Card>
                <p className="text-center text-muted">Nenhuma atividade pendente</p>
              </Card>
            )}
          </div>
        </section>
      </Container>
    </>
  );
}

export default function AlunoDashboard() {
  return (
    <ProtectedRoute>
      <AlunoDashboardContent />
    </ProtectedRoute>
  );
}
