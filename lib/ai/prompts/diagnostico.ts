import type { HabilidadeResultado } from '@/services/diagnosticoService';
import type { TrilhaDisponivel } from '@/app/api/ai/analisar-diagnostico/route';

/** Objetivo do aluno, derivado de student_goals, usado para personalizar o tom. */
export interface ObjetivoAluno {
  meta: 'faculdade' | 'mercado' | 'escola';
  curso?: string | null;
  universidade?: string | null;
}

/** Contexto pessoal do aluno enviado à IA para deixar a mensagem personalizada. */
export interface ContextoAluno {
  nome?: string | null;
  objetivo?: ObjetivoAluno | null;
}

/** Descreve o objetivo do aluno em linguagem natural para o prompt. */
function descreverObjetivo(obj: ObjetivoAluno): string {
  if (obj.meta === 'faculdade') {
    if (obj.curso && obj.universidade) return `entrar em ${obj.curso} na ${obj.universidade}`;
    if (obj.curso) return `cursar ${obj.curso} na faculdade`;
    if (obj.universidade) return `entrar na ${obj.universidade}`;
    return 'entrar na faculdade';
  }
  if (obj.meta === 'mercado') return 'se preparar para o mercado de trabalho';
  return 'ir bem na escola';
}

/** Monta o bloco de contexto do aluno (vazio se não houver dados). */
function montarBlocoContexto(contexto?: ContextoAluno): string {
  const linhas: string[] = [];

  const nome = contexto?.nome?.trim();
  if (nome) linhas.push(`Nome do aluno: ${nome}.`);

  if (contexto?.objetivo) linhas.push(`Objetivo do aluno: ${descreverObjetivo(contexto.objetivo)}.`);

  return linhas.length > 0 ? `CONTEXTO DO ALUNO:\n${linhas.join('\n')}\n\n` : '';
}

/**
 * Monta o prompt (mensagem do usuário) da análise de diagnóstico.
 *
 * A persona (voz do NEX) vem do system prompt — aqui ficam só a tarefa, o
 * contexto do aluno e o formato de saída. O formato do JSON é idêntico ao
 * esperado por studyPlanService (não alterar as chaves).
 */
export function construirPromptDiagnostico(
  porHabilidade: HabilidadeResultado[],
  trilhasDisponiveis: TrilhaDisponivel[],
  contexto?: ContextoAluno
): string {
  // Monta resumo das habilidades para o prompt
  const resumoHabilidades = porHabilidade
    .map((h) => {
      const linhasAbertas =
        h.respostas_abertas.length > 0
          ? `\n   Respostas abertas: "${h.respostas_abertas.join('" | "')}"`
          : '';
      const desempenho =
        h.total > 0
          ? `${h.acertos}/${h.total} acertos (${h.taxa_acerto}%)`
          : 'questão aberta — sem nota automática';
      return `- ${h.habilidade_id} | ${h.area} | Desempenho: ${desempenho}${linhasAbertas}`;
    })
    .join('\n');

  const resumoTrilhas = trilhasDisponiveis
    .map(
      (t) => `- ID: ${t.id} | "${t.titulo}" | habilidade: ${t.habilidade_id || 'geral'}`
    )
    .join('\n');

  const blocoContexto = montarBlocoContexto(contexto);
  const semTrilhas = trilhasDisponiveis.length === 0;

  return semTrilhas
    ? `${blocoContexto}Analisei o quiz de diagnóstico de um aluno para o ENEM e vou escrever uma mensagem motivacional personalizada.

DESEMPENHO DO ALUNO POR HABILIDADE:
${resumoHabilidades}

TAREFA:
1. Identifique as habilidades com maior fragilidade.
2. Escreva uma mensagem motivacional (máximo 2 frases): chame o aluno pelo nome quando houver, conecte com o objetivo dele quando fizer sentido, e mantenha o tom NEX (informal, animado, sem julgamento).
3. Liste as habilidades prioritárias pelos IDs fornecidos acima.

RESPONDA APENAS com JSON válido neste formato exato, sem texto fora do JSON:
{
  "habilidades_prioritarias": ["ID_EXATO_1", "ID_EXATO_2"],
  "trilhas_recomendadas": [],
  "mensagem_motivacional": "frase aqui"
}`
    : `${blocoContexto}Analisei o quiz de mapeamento de um aluno para o ENEM e preciso recomendar as trilhas de estudo em ordem de prioridade.

DESEMPENHO DO ALUNO POR HABILIDADE:
${resumoHabilidades}

TRILHAS DISPONÍVEIS NO SISTEMA (USE APENAS OS IDs EXATOS LISTADOS ABAIXO — NÃO INVENTE IDs):
${resumoTrilhas}

ATENÇÃO CRÍTICA: Os valores de "trilha_id" no JSON de resposta devem ser EXATAMENTE iguais aos IDs da coluna "ID" listados acima. Nunca crie, modifique ou abrevie um ID.

TAREFA:
1. Identifique quais habilidades têm maior fragilidade (menor taxa de acerto ou respostas abertas que revelam confusão conceitual).
2. Recomende as trilhas em ordem de prioridade (1 = mais urgente), usando APENAS os IDs exatos fornecidos.
3. Para cada trilha, escreva um motivo curto e motivador de 1 frase (máximo 15 palavras), no tom NEX: informal, animado, sem julgamento.
4. Escreva uma mensagem motivacional geral (máximo 2 frases): chame o aluno pelo nome quando houver, conecte com o objetivo dele quando fizer sentido, e mantenha o tom NEX.

RESPONDA APENAS com JSON válido neste formato exato, sem texto fora do JSON:
{
  "habilidades_prioritarias": ["ID_EXATO_1", "ID_EXATO_2"],
  "trilhas_recomendadas": [
    { "trilha_id": "ID_EXATO_DO_SISTEMA", "habilidade_id": "ID_HABILIDADE", "motivo": "frase curta aqui", "prioridade": 1 }
  ],
  "mensagem_motivacional": "frase aqui"
}`;
}
