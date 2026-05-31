'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Map as MapIcon, ArrowRight, Lightbulb, Star, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PageContainer } from '@/components/PageContainer';
import { useAuth } from '@/app/contexts/AuthContext';
import { getTrilhas } from '@/services/trilhasService';
import type { Trilha } from '@/services/trilhasService';
import { getStudyPlan } from '@/services/studyPlanService';
import type { StudyPlan } from '@/services/studyPlanService';

// Mapa de prioridade para label e cor do badge
const PRIORIDADE_CONFIG = {
  alta:  { label: 'Alta prioridade',  className: 'bg-red-100 text-red-700 border-red-200' },
  media: { label: 'Média prioridade', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  baixa: { label: 'Baixa prioridade', className: 'bg-green-100 text-green-700 border-green-200' },
} as const;

interface TrilhaComPlano extends Trilha {
  planoItem?: StudyPlan;
}

function TrilhaCard({ trilha, recomendada }: { trilha: TrilhaComPlano; recomendada: boolean }) {
  const prioridade = trilha.planoItem?.prioridade;
  const config = prioridade ? PRIORIDADE_CONFIG[prioridade] : null;

  return (
    <Card className={`h-full flex flex-col transition-colors ${recomendada ? 'border-primary/40 hover:bg-primary/5' : 'hover:bg-muted/50'}`}>
      <CardContent className="flex flex-col flex-1 py-6">
        <div className="flex items-start justify-between mb-4 gap-2">
          <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${recomendada ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
            {recomendada ? <Star className="size-6" /> : <MapIcon className="size-6" />}
          </div>
          {config && (
            <Badge variant="outline" className={`text-xs shrink-0 ${config.className}`}>
              {config.label}
            </Badge>
          )}
        </div>
        <h3 className="text-lg font-semibold mb-1">{trilha.titulo}</h3>
        {trilha.planoItem?.materia && (
          <p className="text-xs text-primary font-medium mb-2 capitalize">{trilha.planoItem.materia}</p>
        )}
        <p className="text-sm text-muted-foreground mb-4 flex-1">{trilha.descricao || 'Trilha completa e estruturada'}</p>
        <Link href={`/aluno/trilhas/${trilha.id}`}>
          <Button className={`w-full ${recomendada ? '' : 'variant-outline'}`} variant={recomendada ? 'default' : 'outline'}>
            {recomendada ? 'Estudar agora' : 'Explorar'} <ArrowRight className="ml-2 size-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function TrilhasContent() {
  const { user } = useAuth();
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [plano, setPlano] = useState<StudyPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Carrega trilhas e plano em paralelo
        const [trilhasResult, planoResult] = await Promise.all([
          getTrilhas(),
          user?.id ? getStudyPlan(user.id) : Promise.resolve({ plano: null, error: null }),
        ]);

        if (trilhasResult.error) {
          setError(trilhasResult.error.message);
        } else {
          setTrilhas(trilhasResult.data || []);
        }

        if (!planoResult.error && planoResult.plano) {
          setPlano(planoResult.plano);
        }

        setLoading(false);
      } catch {
        setError('Erro ao carregar trilhas');
        setLoading(false);
      }
    };
    loadData();
  }, [user]);

  // Mapeia trilha_id → item do plano (inclui prioridade e matéria)
  const planoMap = new Map(
    plano.filter((p) => p.trilha_id).map((p) => [p.trilha_id!, p])
  );

  // Ordena recomendadas por prioridade: alta → media → baixa
  const ordemPrioridade = { alta: 0, media: 1, baixa: 2 };
  const recomendadas: TrilhaComPlano[] = trilhas
    .filter((t) => planoMap.has(t.id))
    .map((t) => ({ ...t, planoItem: planoMap.get(t.id) }))
    .sort((a, b) => {
      const pa = a.planoItem?.prioridade ?? 'baixa';
      const pb = b.planoItem?.prioridade ?? 'baixa';
      return ordemPrioridade[pa] - ordemPrioridade[pb];
    });

  const outras: TrilhaComPlano[] = trilhas.filter((t) => !planoMap.has(t.id));

  const temPlano = plano.length > 0;

  return (
    <PageContainer>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl flex flex-col gap-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Trilhas de Estudo</h1>
          <p className="text-muted-foreground text-sm">Caminhos estruturados de aprendizado</p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-56 rounded-xl" />)}
          </div>
        )}

        {error && (
          <Card className="border-destructive bg-destructive/10">
            <CardContent className="py-4">
              <p className="text-destructive text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {!loading && !error && trilhas.length === 0 && (
          <Card className="text-center bg-primary text-primary-foreground border-0">
            <CardContent className="py-10">
              <div className="size-16 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center"><MapIcon className="size-8" /></div>
              <h2 className="text-xl font-bold mb-2">Nenhuma Trilha Disponível</h2>
              <p className="text-primary-foreground/80 mb-6 text-sm">Trilhas serão adicionadas em breve.</p>
              <Link href="/aluno/dashboard">
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">Voltar ao Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* ── Trilhas recomendadas pelo plano de estudos ── */}
        {!loading && recomendadas.length > 0 && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Star className="size-5 text-primary" />
              <h2 className="text-lg font-bold">Recomendadas para você</h2>
              <Badge className="ml-1 bg-primary/10 text-primary border-primary/20 text-xs">
                {recomendadas.length} {recomendadas.length === 1 ? 'trilha' : 'trilhas'}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground -mt-2">
              Baseado no seu diagnóstico, foque nestas trilhas primeiro.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recomendadas.map((trilha) => (
                <TrilhaCard key={trilha.id} trilha={trilha} recomendada />
              ))}
            </div>
          </section>
        )}

        {/* Banner para quem ainda não tem plano */}
        {!loading && !temPlano && trilhas.length > 0 && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="flex items-start gap-4 py-5">
              <div className="size-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
                <Lightbulb className="size-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">Faça o diagnóstico para receber recomendações</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  O quiz inicial identifica o que você mais precisa estudar e personaliza as trilhas para você.
                </p>
                <Link href="/aluno/diagnostico">
                  <Button size="sm">Fazer diagnóstico <ArrowRight className="ml-2 size-4" /></Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ── Outras trilhas ── */}
        {!loading && outras.length > 0 && (
          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="size-5 text-muted-foreground" />
              <h2 className="text-lg font-bold">
                {recomendadas.length > 0 ? 'Explorar outras trilhas' : 'Todas as trilhas'}
              </h2>
            </div>
            {recomendadas.length > 0 && (
              <p className="text-sm text-muted-foreground -mt-2">
                Trilhas fora do seu plano atual — explore quando quiser.
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {outras.map((trilha) => (
                <TrilhaCard key={trilha.id} trilha={trilha} recomendada={false} />
              ))}
            </div>
          </section>
        )}

        {/* Atalhos de navegação */}
        {!loading && trilhas.length > 0 && (
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link href="/aluno/plano"><Button variant="secondary" size="lg" className="w-full">Meu Plano</Button></Link>
            <Link href="/aluno/dashboard"><Button variant="outline" size="lg" className="w-full">Dashboard</Button></Link>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

export default function TrilhasPage() {
  return <TrilhasContent />;
}
