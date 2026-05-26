'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Map, ArrowRight, Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { getTrilhas } from '@/services/trilhasService';
import type { Trilha } from '@/services/trilhasService';

function TrilhasContent() {
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrilhas = async () => {
      try {
        const { data: trilhasData, error: trilhasError } = await getTrilhas();
        if (trilhasError) { setError(trilhasError.message); }
        else { setTrilhas(trilhasData || []); }
        setLoading(false);
      } catch { setError('Erro ao carregar trilhas'); setLoading(false); }
    };
    loadTrilhas();
  }, []);

  return (
    <PageContainer>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Trilhas de Estudo</h1>
          <p className="text-muted-foreground text-sm">Caminhos estruturados de aprendizado</p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
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
              <div className="size-16 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center"><Map className="size-8" /></div>
              <h2 className="text-xl font-bold mb-2">Nenhuma Trilha Disponivel</h2>
              <p className="text-primary-foreground/80 mb-6 text-sm">Trilhas serao adicionadas em breve.</p>
              <Link href="/aluno/dashboard">
                <Button variant="secondary" className="bg-white text-primary hover:bg-white/90">Voltar ao Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {!loading && trilhas.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {trilhas.map((trilha) => (
                <Card key={trilha.id} className="h-full flex flex-col hover:bg-muted/50 transition-colors">
                  <CardContent className="flex flex-col flex-1 py-6">
                    <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Map className="size-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{trilha.titulo}</h3>
                    <p className="text-sm text-muted-foreground mb-4 flex-1">{trilha.descricao || 'Trilha completa e estruturada'}</p>
                    <Link href={`/aluno/trilhas/${trilha.id}`}>
                      <Button className="w-full">Explorar <ArrowRight className="ml-2 size-4" /></Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="bg-primary/5 border-primary/20 mb-6">
              <CardContent className="flex items-start gap-4 py-4">
                <div className="size-10 rounded-xl bg-primary flex items-center justify-center shrink-0"><Lightbulb className="size-5 text-white" /></div>
                <div>
                  <h4 className="font-semibold mb-1">Combine com seu plano</h4>
                  <p className="text-sm text-muted-foreground">Use trilhas junto com seu plano personalizado para maximizar o aprendizado!</p>
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

export default function TrilhasPage() {
  return <TrilhasContent />;
}
