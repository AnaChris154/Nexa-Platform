'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, CheckCircle, Circle, ArrowRight, ChevronLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';
import { getTrilhaById } from '@/services/trilhasService';
import { getSubtrilhasDaTrilha } from '@/services/subtrilhasService';
import type { SubtrilhaComProgresso } from '@/lib/types/subtrilhas';
import type { Trilha } from '@/services/trilhasService';

function SubtrilhasContent() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  const [trilha, setTrilha] = useState<Trilha | null>(null);
  const [subtrilhas, setSubtrilhas] = useState<SubtrilhaComProgresso[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !user?.id) return;

    const load = async () => {
      const [{ data: trilhaData, error: err1 }, { data: subtrilhasData, error: err2 }] =
        await Promise.all([
          getTrilhaById(id),
          getSubtrilhasDaTrilha(id, user.id),
        ]);

      if (err1 || err2) {
        setError('Erro ao carregar a trilha. Tente novamente.');
      } else {
        setTrilha(trilhaData);
        setSubtrilhas(subtrilhasData || []);
      }
      setLoading(false);
    };

    load();
  }, [id, user?.id]);

  if (loading) {
    return (
      <PageContainer>
        <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl flex flex-col gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <div className="px-4 py-8">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      </PageContainer>
    );
  }

  const concluidas = subtrilhas.filter((s) => s.progresso?.concluida).length;

  return (
    <PageContainer>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl flex flex-col gap-6">

        {/* Voltar */}
        <Link href="/aluno/trilhas" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground w-fit">
          <ChevronLeft className="size-4" />
          Trilhas
        </Link>

        {/* Header da Trilha */}
        <div>
          <h1 className="text-2xl font-bold mb-1">{trilha?.titulo}</h1>
          <p className="text-muted-foreground text-sm">{trilha?.descricao}</p>
          {subtrilhas.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              {concluidas} de {subtrilhas.length} subtrilhas concluídas
            </p>
          )}
        </div>

        {/* Lista de Subtrilhas */}
        {subtrilhas.length === 0 ? (
          <Card className="text-center">
            <CardContent className="py-10">
              <BookOpen className="size-10 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Nenhuma subtrilha disponível ainda.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {subtrilhas.map((sub) => {
              const concluida = sub.progresso?.concluida ?? false;
              const percentual = sub.progresso?.percentual_acerto ?? 0;

              return (
                <Link key={sub.id} href={`/aluno/trilhas/${id}/${sub.id}`}>
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="flex items-center gap-4 py-5">
                      <div className="shrink-0">
                        {concluida
                          ? <CheckCircle className="size-7 text-green-500" />
                          : <Circle className="size-7 text-muted-foreground" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{sub.titulo}</h3>
                          {concluida && <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs shrink-0">Concluída</Badge>}
                        </div>
                        {sub.descricao && <p className="text-sm text-muted-foreground truncate">{sub.descricao}</p>}
                        {sub.progresso && !concluida && (
                          <p className="text-xs text-muted-foreground mt-1">{percentual.toFixed(0)}% de acerto — precisa de 80%</p>
                        )}
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground shrink-0" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </PageContainer>
  );
}

export default function TrilhaPage() {
  return (
    <ProtectedRoute>
      <SubtrilhasContent />
    </ProtectedRoute>
  );
}
