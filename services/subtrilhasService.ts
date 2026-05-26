import { supabase } from '@/lib/supabaseClient';
import type {
  Subtrilha,
  ConteudoSubtrilha,
  ProgressoSubtrilha,
  SubtrilhaComProgresso,
} from '@/lib/types/subtrilhas';
import type { QuestaoENEM } from '@/lib/types/taxonomy';

/**
 * Retorna todas as subtrilhas de uma trilha, com o progresso do aluno embutido
 */
export async function getSubtrilhasDaTrilha(
  trilhaId: string,
  alunoId: string
): Promise<{ data: SubtrilhaComProgresso[] | null; error: Error | null }> {
  try {
    const { data: subtrilhas, error } = await supabase
      .from('subtrilhas')
      .select('*')
      .eq('trilha_id', trilhaId)
      .order('ordem');

    if (error) throw new Error(error.message);

    const { data: progressos } = await supabase
      .from('progresso_subtrilha')
      .select('*')
      .eq('aluno_id', alunoId)
      .in('subtrilha_id', (subtrilhas || []).map((s) => s.id));

    const progressoMap = new Map<string, ProgressoSubtrilha>(
      (progressos || []).map((p) => [p.subtrilha_id, p])
    );

    const resultado: SubtrilhaComProgresso[] = (subtrilhas || []).map((s) => ({
      ...s,
      progresso: progressoMap.get(s.id) ?? null,
    }));

    return { data: resultado, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return { data: null, error: new Error(message) };
  }
}

/**
 * Retorna os conteúdos (vídeos, PDFs, resumos) de uma subtrilha
 */
export async function getConteudosSubtrilha(
  subtrilhaId: string
): Promise<{ data: ConteudoSubtrilha[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('conteudos_subtrilha')
      .select('*')
      .eq('subtrilha_id', subtrilhaId)
      .order('ordem');

    if (error) throw new Error(error.message);
    return { data, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return { data: null, error: new Error(message) };
  }
}

/**
 * Retorna as questões de exercício de uma subtrilha
 */
export async function getExerciciosDaSubtrilha(
  subtrilhaId: string
): Promise<{ data: QuestaoENEM[] | null; error: Error | null }> {
  try {
    const { data, error } = await supabase
      .from('exercicios_subtrilha')
      .select('questao_id, ordem, questoes_enem(*)')
      .eq('subtrilha_id', subtrilhaId)
      .order('ordem');

    if (error) throw new Error(error.message);

    const questoes = (data || []).map((row: any) => row.questoes_enem) as QuestaoENEM[];
    return { data: questoes, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return { data: null, error: new Error(message) };
  }
}

/**
 * Registra a resposta do aluno e atualiza o progresso na subtrilha (80% = concluída)
 */
export async function registrarRespostaExercicio({
  alunoId,
  subtrilhaId,
  questaoId,
  respostaFornecida,
  respostaCorreta,
  tempoSegundos,
  habilidadeId,
}: {
  alunoId: string;
  subtrilhaId: string;
  questaoId: string;
  respostaFornecida: string;
  respostaCorreta: string;
  tempoSegundos: number;
  habilidadeId: string;
}): Promise<{ error: Error | null }> {
  try {
    const foiCorreta = respostaFornecida === respostaCorreta;

    // Salva histórico pedagógico
    const { error: errResposta } = await supabase
      .from('respostas_pedagogicas_aluno')
      .insert([{
        aluno_id: alunoId,
        questao_id: questaoId,
        resposta_fornecida: respostaFornecida,
        foi_correta: foiCorreta,
        tempo_segundos: tempoSegundos,
        metadados: { habilidade_avaliada: habilidadeId, subtrilha_id: subtrilhaId },
      }]);

    if (errResposta) throw new Error(errResposta.message);

    // Conta a questão das desta subtrilha que já foram respondidas
    const { data: totalData } = await supabase
      .from('exercicios_subtrilha')
      .select('questao_id', { count: 'exact' })
      .eq('subtrilha_id', subtrilhaId);

    const totalQuestoes = totalData?.length ?? 0;

    // Conta quantas o aluno já acertou nesta subtrilha
    const { data: acertosData } = await supabase
      .from('respostas_pedagogicas_aluno')
      .select('id', { count: 'exact' })
      .eq('aluno_id', alunoId)
      .eq('foi_correta', true)
      .filter('metadados->>subtrilha_id', 'eq', subtrilhaId);

    const totalAcertos = acertosData?.length ?? 0;

    // Upsert do progresso (cria ou atualiza)
    const { error: errProgresso } = await supabase
      .from('progresso_subtrilha')
      .upsert({
        aluno_id: alunoId,
        subtrilha_id: subtrilhaId,
        total_questoes: totalQuestoes,
        acertos: totalAcertos,
        ultima_atividade: new Date().toISOString(),
      }, { onConflict: 'aluno_id,subtrilha_id' });

    if (errProgresso) throw new Error(errProgresso.message);

    return { error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    return { error: new Error(message) };
  }
}
