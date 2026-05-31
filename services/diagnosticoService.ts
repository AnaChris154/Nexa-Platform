import { supabase } from '@/lib/supabaseClient';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface DiagnosticoNivel {
  [materia: string]: 'baixo' | 'medio' | 'alto';
}

export interface DiagnosticoQuestion {
  id: string;
  materia: string;
  area: string;
  habilidade_id: string | null;
  nivel: string;
  tipo: 'fechada' | 'aberta';
  pergunta: string;
  alternativa_a: string | null;
  alternativa_b: string | null;
  alternativa_c: string | null;
  alternativa_d: string | null;
  resposta_correta: string | null;
}

/** Resultado por habilidade — enviado à IA para análise */
export interface HabilidadeResultado {
  habilidade_id: string;
  area: string;
  materia: string;
  acertos: number;
  total: number;
  taxa_acerto: number;
  respostas_abertas: string[];
}

export interface DiagnosticoDetalhado {
  materia: string;
  total_perguntas: number;
  perguntas_corretas: number;
  taxa_acerto: number;
  nivel: 'baixo' | 'medio' | 'alto';
}

/**
 * Salva uma resposta individual do diagnóstico.
 * Para questões abertas, correta = null (IA avalia depois).
 */
export async function saveAnswer(
  userId: string,
  questionId: string,
  resposta: string,
  correta: boolean | null
): Promise<{ success: boolean; error: Error | null }> {
  try {
    if (!userId || !questionId || !resposta) {
      return { success: false, error: new Error('userId, questionId e resposta são obrigatórios') };
    }

    const { error } = await supabase.from('answers').insert([
      { user_id: userId, question_id: questionId, resposta, correta },
    ]);

    if (error) {
      console.error('Erro ao salvar resposta:', error.message);
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao salvar resposta:', message);
    return { success: false, error: new Error(message) };
  }
}

/**
 * Calcula o resultado do diagnóstico agrupado por matéria e por habilidade.
 * Retorna porHabilidade para enviar à IA.
 */
export async function calcularNivelPorMateria(
  userId: string
): Promise<{
  diagnostico: DiagnosticoNivel | null;
  detalhes: DiagnosticoDetalhado[] | null;
  porHabilidade: HabilidadeResultado[] | null;
  error: Error | null;
}> {
  try {
    if (!userId) {
      return { diagnostico: null, detalhes: null, porHabilidade: null, error: new Error('userId é obrigatório') };
    }

    // 1. Buscar respostas com dados da questão
    const { data: answersData, error: answersError } = await supabase
      .from('answers')
      .select(`
        id,
        correta,
        resposta,
        question_id,
        questions!inner(materia, area, habilidade_id, tipo)
      `)
      .eq('user_id', userId);

    if (answersError) {
      console.error('Erro ao buscar respostas:', answersError.message);
      return { diagnostico: null, detalhes: null, porHabilidade: null, error: new Error(answersError.message) };
    }

    if (!answersData || answersData.length === 0) {
      return {
        diagnostico: null,
        detalhes: null,
        porHabilidade: null,
        error: new Error('Nenhuma resposta encontrada para calcular diagnóstico'),
      };
    }

    // 2. Agrupar por matéria e por habilidade
    const materiaStats: Record<string, { total: number; corretas: number }> = {};
    const habilidadeStats: Record<string, {
      habilidade_id: string; area: string; materia: string;
      total: number; corretas: number; respostas_abertas: string[];
    }> = {};

    for (const answer of answersData as any[]) {
      const { materia: materiaRaw, area, habilidade_id, tipo } = answer.questions;

      // Normaliza matéria: lowercase sem acento (ex: "Química" → "quimica")
      const materia = materiaRaw
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

      // Por matéria
      if (!materiaStats[materia]) materiaStats[materia] = { total: 0, corretas: 0 };
      materiaStats[materia].total += 1;
      if (answer.correta === true) materiaStats[materia].corretas += 1;

      // Por habilidade
      const key = habilidade_id || materia;
      if (!habilidadeStats[key]) {
        habilidadeStats[key] = { habilidade_id: key, area: area || materia, materia, total: 0, corretas: 0, respostas_abertas: [] };
      }
      if (tipo === 'aberta') {
        habilidadeStats[key].respostas_abertas.push(answer.resposta);
      } else {
        habilidadeStats[key].total += 1;
        if (answer.correta === true) habilidadeStats[key].corretas += 1;
      }
    }

    // 3. Calcular taxa e nível por matéria
    const diagnostico: DiagnosticoNivel = {};
    const detalhes: DiagnosticoDetalhado[] = [];

    for (const materia in materiaStats) {
      const { total, corretas } = materiaStats[materia];
      const taxa = (corretas / total) * 100;
      const nivel: 'baixo' | 'medio' | 'alto' = taxa < 40 ? 'baixo' : taxa <= 70 ? 'medio' : 'alto';
      diagnostico[materia] = nivel;
      detalhes.push({ materia, total_perguntas: total, perguntas_corretas: corretas, taxa_acerto: Math.round(taxa * 100) / 100, nivel });
    }

    // 4. Mapa por habilidade para a IA
    const porHabilidade: HabilidadeResultado[] = Object.values(habilidadeStats).map((h) => ({
      habilidade_id: h.habilidade_id,
      area: h.area,
      materia: h.materia,
      acertos: h.corretas,
      total: h.total,
      taxa_acerto: h.total > 0 ? Math.round((h.corretas / h.total) * 100) : 0,
      respostas_abertas: h.respostas_abertas,
    }));

    return { diagnostico, detalhes, porHabilidade, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao calcular nível:', message);
    return { diagnostico: null, detalhes: null, porHabilidade: null, error: new Error(message) };
  }
}

/**
 * Busca todas as questões disponíveis para diagnóstico
 */
export async function getQuestoes(
  materia?: string,
  nivel?: string
): Promise<{ questoes: DiagnosticoQuestion[] | null; error: Error | null }> {
  try {
    let query = supabase.from('questions').select('*').order('area').order('materia');

    if (materia) query = query.eq('materia', materia);
    if (nivel) query = query.eq('nivel', nivel);

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar questões:', error.message);
      return { questoes: null, error: new Error(error.message) };
    }

    return { questoes: (data as DiagnosticoQuestion[]) || [], error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao buscar questões:', message);
    return { questoes: null, error: new Error(message) };
  }
}

/**
 * Limpar respostas anteriores de um usuário (se for refazer diagnóstico)
 */
export async function limparRespostasPrevias(userId: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    if (!userId) {
      return { success: false, error: new Error('userId é obrigatório') };
    }

    const { error } = await supabase.from('answers').delete().eq('user_id', userId);

    if (error) {
      console.error('Erro ao limpar respostas:', error.message);
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao limpar respostas:', message);
    return { success: false, error: new Error(message) };
  }
}

