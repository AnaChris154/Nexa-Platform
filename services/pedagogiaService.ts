import { supabase } from '@/lib/supabaseClient';
import { Habilidade, QuestaoENEM, RespostaAluno } from '@/lib/types/taxonomy';

/**
 * Serviço para lidar com a taxonomia pedagógica e o sistema adaptativo.
 */
export const pedagogiaService = {
  /**
   * Busca todas as habilidades cadastradas
   */
  async getHabilidades(): Promise<Habilidade[]> {
    const { data, error } = await supabase
      .from('habilidades_pedagogicas')
      .select('*');

    if (error) throw error;
    return data || [];
  },

  /**
   * Busca questões por habilidade específica
   */
  async getQuestoesPorHabilidade(habilidadeId: string): Promise<QuestaoENEM[]> {
    const { data, error } = await supabase
      .from('questoes_enem')
      .select('*')
      .eq('habilidade_principal_id', habilidadeId);

    if (error) throw error;
    return data || [];
  },

  /**
   * Registra uma resposta do aluno para alimentar o motor de IA/Adaptativo
   */
  async registrarResposta(resposta: Omit<RespostaAluno, 'id' | 'data_hora'>) {
    const { data, error } = await supabase
      .from('respostas_pedagogicas_aluno')
      .insert([
        {
          aluno_id: resposta.aluno_id,
          questao_id: resposta.questao_id,
          resposta_fornecida: resposta.resposta_fornecida,
          foi_correta: resposta.foi_correta,
          tempo_segundos: resposta.tempo_em_segundos,
          metadados: {
             habilidade_avaliada: resposta.habilidade_avaliada
          }
        }
      ]);

    if (error) throw error;
    return data;
  },

  /**
   * Busca o progresso do aluno em uma habilidade específica
   * Base para identificar lacunas cognitivas futuramente
   */
  async getProgressoHabilidade(alunoId: string, habilidadeId: string) {
    const { data, error } = await supabase
      .from('respostas_pedagogicas_aluno')
      .select('foi_correta, questao_id')
      .eq('aluno_id', alunoId)
      .filter('metadados->>habilidade_avaliada', 'eq', habilidadeId);

    if (error) throw error;
    
    const total = data?.length || 0;
    const acertos = data?.filter(r => r.foi_correta).length || 0;
    const taxaAcerto = total > 0 ? (acertos / total) * 100 : 0;

    return {
      total,
      acertos,
      taxaAcerto
    };
  }
};
