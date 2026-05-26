'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft, CheckCircle, XCircle, ChevronRight, Trophy,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';
import {
  getConteudosSubtrilha,
  getExerciciosDaSubtrilha,
  registrarRespostaExercicio,
} from '@/services/subtrilhasService';
import type { ConteudoSubtrilha } from '@/lib/types/subtrilhas';
import type { QuestaoENEM } from '@/lib/types/taxonomy';
import { TutorFeedback } from '@/components/TutorFeedback';
import { gerarFeedbackErro } from '@/services/feedbackIAService';



function ExerciciosContent() {
  const { id: trilhaId, subtrilhaId } = useParams<{ id: string; subtrilhaId: string }>();
  const { user } = useAuth();

  const [conteudos, setConteudos] = useState<ConteudoSubtrilha[]>([]);
  const [questoes, setQuestoes] = useState<QuestaoENEM[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado do quiz
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [respostaSelecionada, setRespostaSelecionada] = useState<string | null>(null);
  const [confirmada, setConfirmada] = useState(false);
  const [inicio, setInicio] = useState<Date>(new Date());
  const [acertos, setAcertos] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  // Estado do feedback IA
  const [feedbackIA, setFeedbackIA] = useState<string | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  useEffect(() => {
    if (!subtrilhaId) return;
    const load = async () => {
      const [{ data: c }, { data: q }] = await Promise.all([
        getConteudosSubtrilha(subtrilhaId),
        getExerciciosDaSubtrilha(subtrilhaId),
      ]);
      setConteudos(c || []);
      setQuestoes(q || []);
      setLoading(false);
    };
    load();
  }, [subtrilhaId]);

  const questaoAtual = questoes[indiceAtual];

  const confirmarResposta = async () => {
    if (!respostaSelecionada || !questaoAtual || !user?.id) return;
    setConfirmada(true);

    const foiCorreta = respostaSelecionada === questaoAtual.resposta_correta;
    if (foiCorreta) setAcertos((a) => a + 1);

    // Se errou, chama a IA para gerar feedback pedagógico
    if (!foiCorreta) {
      setLoadingFeedback(true);
      setFeedbackIA(null);
      try {
        const feedback = await gerarFeedbackErro({
          enunciado: questaoAtual.enunciado,
          alternativas: questaoAtual.alternativas,
          resposta_correta: questaoAtual.resposta_correta,
          resposta_marcada: respostaSelecionada,
          tipos_de_erro_comuns: questaoAtual.tipos_de_erro_comuns ?? [],
          conceitos_avaliados: questaoAtual.conceitos_avaliados ?? [],
        });
        setFeedbackIA(feedback);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Ops, não consegui gerar um feedback agora. Mas não desista!';
        setFeedbackIA(msg);
      } finally {
        setLoadingFeedback(false);
      }
    }

    const tempoSegundos = Math.round((new Date().getTime() - inicio.getTime()) / 1000);

    await registrarRespostaExercicio({
      alunoId: user.id,
      subtrilhaId,
      questaoId: questaoAtual.id,
      respostaFornecida: respostaSelecionada,
      respostaCorreta: questaoAtual.resposta_correta,
      tempoSegundos,
      habilidadeId: questaoAtual.habilidade_principal ?? '',
    });
  };

  const proximaQuestao = () => {
    if (indiceAtual + 1 >= questoes.length) {
      setFinalizado(true);
    } else {
      setIndiceAtual((i) => i + 1);
      setRespostaSelecionada(null);
      setConfirmada(false);
      setInicio(new Date());
      setFeedbackIA(null);
      setLoadingFeedback(false);
    }
  };

  const percentualFinal = questoes.length > 0 ? Math.round((acertos / questoes.length) * 100) : 0;
  const aprovado = percentualFinal >= 80;

  if (loading) {
    return (
      <PageContainer>
        <div className="px-4 py-8 max-w-2xl flex flex-col gap-4">
          <Skeleton className="h-8 w-48" />
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="px-4 sm:px-6 py-8 max-w-2xl flex flex-col gap-6">

        {/* Voltar */}
        <Link href={`/aluno/trilhas/${trilhaId}`} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground w-fit">
          <ChevronLeft className="size-4" />
          Voltar para a trilha
        </Link>

        {/* Conteúdos externos */}
        {conteudos.length > 0 && (
          <div>
            <h2 className="font-semibold mb-3">Material de Apoio</h2>
            <div className="flex flex-col gap-2">
              {conteudos.map((c) => (
                <a key={c.id} href={c.url ?? '#'} target="_blank" rel="noopener noreferrer">
                  <Card className="hover:bg-muted/50 transition-colors">
                    <CardContent className="flex items-center gap-3 py-3">
                      <div>
                        <p className="font-medium text-sm">{c.titulo}</p>
                        {c.descricao && <p className="text-xs text-muted-foreground">{c.descricao}</p>}
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground ml-auto" />
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Exercícios */}
        {questoes.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-sm text-muted-foreground">Nenhum exercício disponível ainda.</p>
            </CardContent>
          </Card>
        ) : finalizado ? (
          // Tela de resultado final
          <Card className={aprovado ? 'border-green-300 bg-green-50' : 'border-yellow-300 bg-yellow-50'}>
            <CardContent className="py-10 text-center flex flex-col items-center gap-4">
              <Trophy className={`size-14 ${aprovado ? 'text-green-500' : 'text-yellow-500'}`} />
              <div>
                <h2 className="text-xl font-bold mb-1">
                  {aprovado ? 'Subtrilha Concluída! 🎉' : 'Continue Praticando!'}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Você acertou <strong>{acertos}</strong> de <strong>{questoes.length}</strong> questões — <strong>{percentualFinal}%</strong>
                </p>
                {!aprovado && (
                  <p className="text-xs text-muted-foreground mt-1">Você precisa de 80% para concluir esta subtrilha.</p>
                )}
              </div>
              <div className="flex gap-3">
                {!aprovado && (
                  <Button onClick={() => { setIndiceAtual(0); setAcertos(0); setFinalizado(false); setRespostaSelecionada(null); setConfirmada(false); setInicio(new Date()); setFeedbackIA(null); setLoadingFeedback(false); }}>
                    Tentar Novamente
                  </Button>
                )}
                <Link href={`/aluno/trilhas/${trilhaId}`}>
                  <Button variant={aprovado ? 'default' : 'outline'}>Voltar à Trilha</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Questão atual
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Exercícios</h2>
              <Badge variant="secondary">{indiceAtual + 1} / {questoes.length}</Badge>
            </div>

            <Card>
              <CardContent className="py-6 flex flex-col gap-5">
                <p className="text-sm font-medium leading-relaxed whitespace-pre-line">{questaoAtual.enunciado}</p>

                {questaoAtual.imagem_url && (
                  <div className="relative w-full overflow-hidden rounded-lg border bg-muted/30">
                    <Image
                      src={questaoAtual.imagem_url}
                      alt="Imagem da questão"
                      width={800}
                      height={500}
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {(Object.entries(questaoAtual.alternativas) as [string, string][]).map(([letra, texto]) => {
                    const isSelecionada = respostaSelecionada === letra;
                    const isCorreta = confirmada && letra === questaoAtual.resposta_correta;
                    const isErrada = confirmada && isSelecionada && !isCorreta;

                    return (
                      <button
                        key={letra}
                        disabled={confirmada}
                        onClick={() => setRespostaSelecionada(letra)}
                        className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                          isCorreta ? 'bg-green-50 border-green-400 text-green-800' :
                          isErrada  ? 'bg-red-50 border-red-400 text-red-800' :
                          isSelecionada ? 'bg-primary/10 border-primary' :
                          'border-border hover:bg-muted/50'
                        }`}
                      >
                        <span className="font-semibold uppercase mr-2">{letra})</span>
                        {texto}
                        {isCorreta && <CheckCircle className="inline ml-2 size-4 text-green-500" />}
                        {isErrada  && <XCircle    className="inline ml-2 size-4 text-red-500" />}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback do tutor NEX — aparece apenas no erro */}
                <TutorFeedback feedback={feedbackIA} loading={loadingFeedback} />

                <div className="flex justify-end gap-3 pt-2">
                  {!confirmada ? (
                    <Button disabled={!respostaSelecionada || loadingFeedback} onClick={confirmarResposta}>
                      Confirmar
                    </Button>
                  ) : (
                    <Button onClick={proximaQuestao}>
                      {indiceAtual + 1 < questoes.length ? 'Próxima' : 'Ver Resultado'}
                      <ChevronRight className="ml-1 size-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </PageContainer>
  );
}

export default function SubtrilhaPage() {
  return (
    <ProtectedRoute>
      <ExerciciosContent />
    </ProtectedRoute>
  );
}
