import { supabase } from '@/lib/supabaseClient';
import { DiagnosticoNivel, HabilidadeResultado } from './diagnosticoService';
import type { AnaliseDiagnosticoResponse, TrilhaDisponivel } from '@/app/api/ai/analisar-diagnostico/route';

export interface StudyPlan {
  id: string;
  user_id: string;
  materia: string;
  nivel: 'baixo' | 'medio' | 'alto';
  prioridade: 'alta' | 'media' | 'baixa';
  habilidade_id: string | null;
  trilha_id: string | null;
  motivo_ia: string | null;
  ordem_recomendacao: number;
  gerado_por_ia: boolean;
  origem: string;
  created_at: string;
  updated_at: string;
}

export interface PlanoComIA {
  plano: StudyPlan[] | null;
  mensagem_motivacional: string | null;
  error: Error | null;
}

/**
 * Regra: Mapear nível do aluno para prioridade no plano
 *
 * Lógica:
 * - Nível BAIXO    → Prioridade ALTA   (precisa de muito reforço)
 * - Nível MÉDIO    → Prioridade MÉDIA  (precisa de aprimoramento)
 * - Nível ALTO     → Prioridade BAIXA  (já conhece bem)
 */
function definirPrioridade(nivel: 'baixo' | 'medio' | 'alto'): 'alta' | 'media' | 'baixa' {
  const map: { [key: string]: 'alta' | 'media' | 'baixa' } = {
    baixo: 'alta',
    medio: 'media',
    alto: 'baixa',
  };
  return map[nivel] || 'media';
}

/**
 * Normaliza o nome da matéria para o padrão do CHECK constraint no banco:
 * lowercase, sem acento, sem espaços extras.
 * Ex: "Química" → "quimica", "Matemática" → "matematica"
 */
function normalizarMateria(materia: string): string {
  return materia
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .trim();
}

/** Matérias aceitas pelo CHECK constraint da tabela study_plans */
const MATERIAS_VALIDAS = new Set([
  'matematica', 'portugues', 'fisica', 'quimica', 'biologia', 'historia', 'geografia',
]);

/**
 * Mapeia o prefixo da habilidade ENEM para a(s) matéria(s) correspondente(s).
 * Usado para casar habilidades da taxonomia (ex: CNT_H20) com matérias do diagnóstico.
 *
 * Prefixos ENEM:
 *   MAT_ → Matemática
 *   LCT_ → Linguagens (Português)
 *   CHT_ → Ciências Humanas (História / Geografia)
 *   CNT_H01–H19 → Ciências da Natureza geral / Biologia
 *   CNT_H20–H23 → Física
 *   CNT_H24–H27 → Química
 *   CNT_H28+    → Biologia
 */
function habilidadeParaMaterias(habilidadeId: string): string[] {
  if (!habilidadeId) return [];
  const id = habilidadeId.toUpperCase();

  if (id.startsWith('MAT_'))                         return ['matematica'];
  if (id.startsWith('LCT_'))                         return ['portugues'];
  if (id.startsWith('CHT_'))                         return ['historia', 'geografia'];

  // CNT: subdivide por faixa numérica
  const cntMatch = id.match(/^CNT_H(\d+)/);
  if (cntMatch) {
    const num = parseInt(cntMatch[1], 10);
    if (num >= 20 && num <= 23)                      return ['fisica'];
    if (num >= 24 && num <= 27)                      return ['quimica'];
    return ['biologia', 'fisica', 'quimica'];        // geral CNT
  }

  return [];
}

/**
 * Dado um habilidade_id e o diagnóstico do aluno, resolve a matéria mais adequada.
 * Prioriza a matéria com maior fragilidade (menor taxa de acerto) dentre as candidatas.
 */
function resolverMateriaByHabilidade(
  habilidadeId: string,
  porHabilidade: import('./diagnosticoService').HabilidadeResultado[],
  diagnostico: import('./diagnosticoService').DiagnosticoNivel
): string | null {
  const candidatas = habilidadeParaMaterias(habilidadeId);
  if (candidatas.length === 0) return null;

  // Filtra candidatas que estão no diagnóstico do aluno
  const disponiveis = candidatas.filter((m) => normalizarMateria(m) in diagnostico ||
    Object.keys(diagnostico).some((k) => normalizarMateria(k) === normalizarMateria(m)));

  if (disponiveis.length === 0) return null;

  // Escolhe a com menor taxa de acerto dentre as disponíveis
  const melhor = disponiveis
    .map((m) => {
      const hab = porHabilidade.find((h) => normalizarMateria(h.materia) === normalizarMateria(m));
      return { materia: normalizarMateria(m), taxa: hab?.taxa_acerto ?? 50 };
    })
    .sort((a, b) => a.taxa - b.taxa)[0];

  return melhor?.materia ?? null;
}

function materiaValida(materia: string): boolean {
  return MATERIAS_VALIDAS.has(normalizarMateria(materia));
}

/**
 * Gerar plano de estudo baseado no diagnóstico
 *
 * Processo:
 * 1. Limpar plano anterior (se existir)
 * 2. Aplicar regras de prioridade
 * 3. Salvar novo plano
 */
export async function gerarPlanoEstudo(
  userId: string,
  diagnostico: DiagnosticoNivel
): Promise<{ plano: StudyPlan[] | null; error: Error | null }> {
  try {
    if (!userId || !diagnostico) {
      return { plano: null, error: new Error('userId e diagnostico são obrigatórios') };
    }

    // 1. Limpar plano anterior
    await supabase.from('study_plans').delete().eq('user_id', userId);

    // 2. Preparar dados do novo plano
    const novoPlano = Object.entries(diagnostico)
      .filter(([materia]) => {
        const valida = materiaValida(materia);
        if (!valida) console.warn(`[gerarPlanoEstudo] Matéria ignorada (fora do CHECK): "${materia}"`);
        return valida;
      })
      .map(([materia, nivel]) => ({
        user_id: userId,
        materia: normalizarMateria(materia),
        nivel,
        prioridade: definirPrioridade(nivel),
        origem: 'diagnostico',
      }));

    // 3. Inserir novo plano
    const { data, error } = await supabase
      .from('study_plans')
      .insert(novoPlano)
      .select();

    if (error) {
      console.error('Erro ao gerar plano:', error.message);
      return { plano: null, error: new Error(error.message) };
    }

    if (!data || data.length === 0) {
      return { plano: null, error: new Error('Erro ao gerar plano de estudos') };
    }

    const plano = data.map((item: any) => ({
      id: item.id,
      user_id: item.user_id,
      materia: item.materia,
      nivel: item.nivel,
      prioridade: item.prioridade,
      habilidade_id: item.habilidade_id ?? null,
      trilha_id: item.trilha_id ?? null,
      motivo_ia: item.motivo_ia ?? null,
      ordem_recomendacao: item.ordem_recomendacao ?? 0,
      gerado_por_ia: item.gerado_por_ia ?? false,
      origem: item.origem,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    return { plano, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao gerar plano:', message);
    return { plano: null, error: new Error(message) };
  }
}

/**
 * Gerar plano de estudo usando IA — versão inteligente.
 * 1. Busca trilhas disponíveis
 * 2. Envia mapa de habilidades para o endpoint de análise
 * 3. Salva plano com trilhas recomendadas e motivos
 */
export async function gerarPlanoEstudoComIA(
  userId: string,
  diagnostico: DiagnosticoNivel,
  porHabilidade: HabilidadeResultado[]
): Promise<PlanoComIA> {
  try {
    if (!userId || !diagnostico || !porHabilidade) {
      return { plano: null, mensagem_motivacional: null, error: new Error('Parâmetros obrigatórios faltando') };
    }

    // 1. Buscar trilhas disponíveis via duas queries separadas
    // (evita join PostgREST que exige FK constraint explícita no banco)
    const { data: subtrilhasData } = await supabase
      .from('subtrilhas')
      .select('trilha_id, habilidade_id');

    const trilhasIds = [...new Set((subtrilhasData || []).map((s: any) => s.trilha_id).filter(Boolean))];

    const trilhasMap = new Map<string, TrilhaDisponivel>();

    if (trilhasIds.length > 0) {
      const { data: trilhasData } = await supabase
        .from('trilhas')
        .select('id, titulo')
        .in('id', trilhasIds);

      const tituloMap = new Map<string, string>(
        (trilhasData || []).map((t: any) => [t.id, t.titulo])
      );

      for (const s of (subtrilhasData || []) as any[]) {
        if (s.trilha_id && !trilhasMap.has(s.trilha_id)) {
          trilhasMap.set(s.trilha_id, {
            id: s.trilha_id,
            titulo: tituloMap.get(s.trilha_id) ?? 'Trilha',
            habilidade_id: s.habilidade_id,
          });
        }
      }
    }
    const trilhasDisponiveis: TrilhaDisponivel[] = Array.from(trilhasMap.values());

    // 2. Chamar endpoint de análise da IA
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/ai/analisar-diagnostico`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ porHabilidade, trilhasDisponiveis }),
    });

    if (!response.ok) {
      throw new Error('Falha ao chamar a IA para análise do diagnóstico');
    }

    const analise: AnaliseDiagnosticoResponse = await response.json();

    // 3. Limpar plano anterior
    await supabase.from('study_plans').delete().eq('user_id', userId);

    // Se não há trilhas no banco, ir direto ao fallback com a mensagem motivacional da IA
    if (trilhasDisponiveis.length === 0) {
      console.warn('Nenhuma trilha disponível no banco. Usando fallback por matéria.');
      const fallbackSemTrilhas = Object.entries(diagnostico)
        .filter(([materia]) => {
          const valida = materiaValida(materia);
          if (!valida) console.warn(`[fallback] Matéria ignorada (fora do CHECK): "${materia}"`);
          return valida;
        })
        .map(([materia, nivel], idx) => ({
          user_id: userId,
          materia: normalizarMateria(materia),
          nivel,
          prioridade: definirPrioridade(nivel),
          habilidade_id: null,
          trilha_id: null,
          motivo_ia: analise.mensagem_motivacional ?? null,
          ordem_recomendacao: idx + 1,
          gerado_por_ia: true,
          origem: 'diagnostico_ia_sem_trilhas',
        }));
      const { data: fallbackData, error: fallbackError } = await supabase.from('study_plans').insert(fallbackSemTrilhas).select();
      if (fallbackError) throw new Error(fallbackError.message);
      return {
        plano: fallbackData as StudyPlan[],
        mensagem_motivacional: analise.mensagem_motivacional,
        error: null,
      };
    }

    // 4. Salvar plano com trilhas e motivos da IA
    // IMPORTANTE: A IA pode alucinar trilha_ids que não existem no banco.
    // Filtramos apenas recomendações cujo trilha_id existe no trilhasMap (vindo do banco).
    // O habilidade_id também é resolvido a partir do trilhasMap para garantir UUID válido.
    const recomendacoesValidas = analise.trilhas_recomendadas.filter(
      (rec) => trilhasMap.has(rec.trilha_id)
    );

    let novoPlano;

    if (recomendacoesValidas.length > 0) {
      // Monta um mapa materia → melhor trilha recomendada pela IA
      // Garante que cada matéria apareça UMA SÓ VEZ no plano
      const planoPorMateria = new Map<string, {
        materia: string; nivel: 'baixo'|'medio'|'alto'; prioridade: 'alta'|'media'|'baixa';
        habilidade_id: string|null; trilha_id: string|null; motivo_ia: string|null;
        ordem_recomendacao: number;
      }>();

      for (const rec of recomendacoesValidas) {
        const trilhaInfo = trilhasMap.get(rec.trilha_id)!;
        const habilidadeUUID = trilhaInfo.habilidade_id ?? null;

        // Tenta casar habilidade pelo id ou pelo título da trilha
        const habilidade =
          porHabilidade.find((h) => h.habilidade_id === rec.habilidade_id) ??
          porHabilidade.find((h) => normalizarMateria(h.materia) === normalizarMateria(trilhaInfo.titulo));

        // Se não casou diretamente, tenta resolver pelo prefixo da habilidade ENEM
        // Ex: "CNT_H20" → fisica, "MAT_H01" → matematica, "CHT_H01" → historia/geografia
        let materia = habilidade
          ? normalizarMateria(habilidade.materia)
          : resolverMateriaByHabilidade(rec.habilidade_id, porHabilidade, diagnostico);

        // Se ainda não encontrou matéria válida, ignora esta recomendação
        if (!materia || !MATERIAS_VALIDAS.has(materia)) {
          console.warn(`[IA] Sem matéria para trilha "${rec.trilha_id}" (habilidade: "${rec.habilidade_id}") — ignorado`);
          continue;
        }

        // Mantém apenas a recomendação de maior prioridade por matéria
        if (!planoPorMateria.has(materia)) {
          const taxaAcerto = habilidade?.taxa_acerto ?? 0;
          const nivel: 'baixo'|'medio'|'alto' = taxaAcerto < 40 ? 'baixo' : taxaAcerto <= 70 ? 'medio' : 'alto';
          planoPorMateria.set(materia, {
            materia, nivel,
            prioridade: definirPrioridade(nivel),
            habilidade_id: habilidadeUUID,
            trilha_id: rec.trilha_id,
            motivo_ia: rec.motivo,
            ordem_recomendacao: rec.prioridade,
          });
        }
      }

      // Garante que TODAS as matérias do diagnóstico estejam no plano,
      // mesmo que a IA não tenha recomendado trilha para elas
      let ordem = planoPorMateria.size + 1;
      for (const [mat, nivel] of Object.entries(diagnostico)) {
        const materia = normalizarMateria(mat);
        if (!MATERIAS_VALIDAS.has(materia)) continue;
        if (!planoPorMateria.has(materia)) {
          planoPorMateria.set(materia, {
            materia, nivel,
            prioridade: definirPrioridade(nivel),
            habilidade_id: null,
            trilha_id: null,
            motivo_ia: analise.mensagem_motivacional ?? null,
            ordem_recomendacao: ordem++,
          });
        }
      }

      novoPlano = Array.from(planoPorMateria.values()).map((item) => ({
        user_id: userId,
        ...item,
        gerado_por_ia: true,
        origem: 'diagnostico_ia',
      }));

      if (novoPlano.length === 0) {
        console.warn('[IA] Plano ficou vazio após filtros. Usando fallback por matéria.');
        novoPlano = Object.entries(diagnostico)
          .filter(([mat]) => MATERIAS_VALIDAS.has(normalizarMateria(mat)))
          .map(([mat, nivel], idx) => ({
            user_id: userId,
            materia: normalizarMateria(mat),
            nivel,
            prioridade: definirPrioridade(nivel),
            habilidade_id: null,
            trilha_id: null,
            motivo_ia: analise.mensagem_motivacional ?? null,
            ordem_recomendacao: idx + 1,
            gerado_por_ia: true,
            origem: 'diagnostico_ia_fallback',
          }));
      }
    } else {
      // Fallback: sem trilha vinculada, usa apenas o diagnóstico por matéria
      console.warn('IA retornou trilhas inválidas. Usando fallback por matéria sem trilha.');
      console.warn('Trilhas retornadas pela IA:', JSON.stringify(analise.trilhas_recomendadas, null, 2));
      console.warn('Trilhas válidas no banco (trilhasMap keys):', JSON.stringify(Array.from(trilhasMap.keys()), null, 2));
      novoPlano = Object.entries(diagnostico)
        .filter(([materia]) => {
          const valida = materiaValida(materia);
          if (!valida) console.warn(`[fallback] Matéria ignorada (fora do CHECK): "${materia}"`);
          return valida;
        })
        .map(([materia, nivel], idx) => ({
          user_id: userId,
          materia: normalizarMateria(materia),
          nivel,
          prioridade: definirPrioridade(nivel),
          habilidade_id: null,
          trilha_id: null,
          motivo_ia: analise.mensagem_motivacional ?? null,
          ordem_recomendacao: idx + 1,
          gerado_por_ia: true,
          origem: 'diagnostico_ia_fallback',
        }));
    }

    const { data, error } = await supabase.from('study_plans').insert(novoPlano).select();

    if (error) throw new Error(error.message);

    return {
      plano: data as StudyPlan[],
      mensagem_motivacional: analise.mensagem_motivacional,
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao gerar plano com IA:', message);
    return { plano: null, mensagem_motivacional: null, error: new Error(message) };
  }
}

/**
 * Buscar plano de estudo do aluno
 */
export async function getStudyPlan(userId: string): Promise<{ plano: StudyPlan[] | null; error: Error | null }> {
  try {
    if (!userId) {
      return { plano: null, error: new Error('userId é obrigatório') };
    }

    const { data, error } = await supabase
      .from('study_plans')
      .select('*')
      .eq('user_id', userId)
      .order('prioridade', { ascending: false });

    if (error) {
      // Se não encontrar é OK (aluno ainda não fez diagnóstico)
      if (error.code === 'PGRST116') {
        return { plano: null, error: null };
      }
      console.error('Erro ao buscar plano:', error.message);
      return { plano: null, error: new Error(error.message) };
    }

    if (!data || data.length === 0) {
      return { plano: null, error: null };
    }

    const plano = data.map((item: any) => ({
      id: item.id,
      user_id: item.user_id,
      materia: item.materia,
      nivel: item.nivel,
      prioridade: item.prioridade,
      habilidade_id: item.habilidade_id ?? null,
      trilha_id: item.trilha_id ?? null,
      motivo_ia: item.motivo_ia ?? null,
      ordem_recomendacao: item.ordem_recomendacao ?? 0,
      gerado_por_ia: item.gerado_por_ia ?? false,
      origem: item.origem,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    return { plano, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao buscar plano:', message);
    return { plano: null, error: new Error(message) };
  }
}

/**
 * Remover seu próprio plano de estudo
 */
export async function removerPlanoEstudo(userId: string): Promise<{ success: boolean; error: Error | null }> {
  try {
    if (!userId) {
      return { success: false, error: new Error('userId é obrigatório') };
    }

    const { error } = await supabase.from('study_plans').delete().eq('user_id', userId);

    if (error) {
      console.error('Erro ao remover plano:', error.message);
      return { success: false, error: new Error(error.message) };
    }

    return { success: true, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao remover plano:', message);
    return { success: false, error: new Error(message) };
  }
}

/**
 * Obter resumo do plano agrupado por prioridade
 */
export async function getStudyPlanSummary(
  userId: string
): Promise<{
  resumo: { alta: string[]; media: string[]; baixa: string[] } | null;
  error: Error | null;
}> {
  try {
    const { plano, error } = await getStudyPlan(userId);

    if (error) {
      return { resumo: null, error };
    }

    if (!plano) {
      return { resumo: null, error: null };
    }

    const resumo = {
      alta: plano.filter((p) => p.prioridade === 'alta').map((p) => p.materia),
      media: plano.filter((p) => p.prioridade === 'media').map((p) => p.materia),
      baixa: plano.filter((p) => p.prioridade === 'baixa').map((p) => p.materia),
    };

    return { resumo, error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido';
    console.error('Erro ao gerar resumo:', message);
    return { resumo: null, error: new Error(message) };
  }
}
