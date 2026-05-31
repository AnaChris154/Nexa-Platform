import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import type { HabilidadeResultado } from '@/services/diagnosticoService';

if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

export interface TrilhaDisponivel {
  id: string;
  titulo: string;
  habilidade_id: string | null;
}

export interface AnaliseDiagnosticoRequest {
  porHabilidade: HabilidadeResultado[];
  trilhasDisponiveis: TrilhaDisponivel[];
}

export interface TrilhaRecomendada {
  trilha_id: string;
  habilidade_id: string;
  motivo: string;
  prioridade: number;
}

export interface AnaliseDiagnosticoResponse {
  trilhas_recomendadas: TrilhaRecomendada[];
  mensagem_motivacional: string;
  habilidades_prioritarias: string[];
}

export async function POST(request: Request) {
  try {
    const body: AnaliseDiagnosticoRequest = await request.json();
    const { porHabilidade, trilhasDisponiveis } = body;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY não configurada.' }, { status: 500 });
    }

    // Monta resumo das habilidades para o prompt
    const resumoHabilidades = porHabilidade.map((h) => {
      const linhasAbertas = h.respostas_abertas.length > 0
        ? `\n   Respostas abertas: "${h.respostas_abertas.join('" | "')}"`
        : '';
      const desempenho = h.total > 0
        ? `${h.acertos}/${h.total} acertos (${h.taxa_acerto}%)`
        : 'questão aberta — sem nota automática';
      return `- ${h.habilidade_id} | ${h.area} | Desempenho: ${desempenho}${linhasAbertas}`;
    }).join('\n');

    const resumoTrilhas = trilhasDisponiveis.map((t) =>
      `- ID: ${t.id} | "${t.titulo}" | habilidade: ${t.habilidade_id || 'geral'}`
    ).join('\n');

    const semTrilhas = trilhasDisponiveis.length === 0;

    const prompt = semTrilhas
      ? `Você é um tutor de educação chamado NEX, especialista em ENEM.
Analisou o desempenho de um aluno e vai escrever uma mensagem motivacional personalizada.

DESEMPENHO DO ALUNO POR HABILIDADE:
${resumoHabilidades}

TAREFA:
1. Identifique as habilidades com maior fragilidade.
2. Escreva uma mensagem motivacional personalizada para o aluno (máximo 2 frases, estilo NEX: informal, animado, sem julgamento).
3. Liste as habilidades prioritárias pelos IDs fornecidos acima.

RESPONDA APENAS com JSON válido neste formato exato, sem texto fora do JSON:
{
  "habilidades_prioritarias": ["ID_EXATO_1", "ID_EXATO_2"],
  "trilhas_recomendadas": [],
  "mensagem_motivacional": "frase aqui"
}`
      : `Você é um especialista em educação preparatória para o ENEM.
Analisou o quiz de mapeamento de um aluno e precisa recomendar as trilhas de estudo em ordem de prioridade.

DESEMPENHO DO ALUNO POR HABILIDADE:
${resumoHabilidades}

TRILHAS DISPONÍVEIS NO SISTEMA (USE APENAS OS IDs EXATOS LISTADOS ABAIXO — NÃO INVENTE IDs):
${resumoTrilhas}

ATENÇÃO CRÍTICA: Os valores de "trilha_id" no JSON de resposta devem ser EXATAMENTE iguais aos IDs da coluna "ID" listados acima. Nunca crie, modifique ou abrevie um ID.

TAREFA:
1. Identifique quais habilidades têm maior fragilidade (menor taxa de acerto ou respostas abertas que revelam confusão conceitual).
2. Recomende as trilhas em ordem de prioridade (1 = mais urgente), usando APENAS os IDs exatos fornecidos.
3. Para cada trilha, escreva um motivo curto e motivador de 1 frase (máximo 15 palavras), no estilo do tutor NEX: informal, animado, sem julgamento.
4. Escreva uma mensagem motivacional geral para o aluno (máximo 2 frases, estilo NEX).

RESPONDA APENAS com JSON válido neste formato exato, sem texto fora do JSON:
{
  "habilidades_prioritarias": ["ID_EXATO_1", "ID_EXATO_2"],
  "trilhas_recomendadas": [
    { "trilha_id": "ID_EXATO_DO_SISTEMA", "habilidade_id": "ID_HABILIDADE", "motivo": "frase curta aqui", "prioridade": 1 }
  ],
  "mensagem_motivacional": "frase aqui"
}`;

    const groq = new Groq({ apiKey });
    const result = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em educação preparatória para o ENEM. Sempre responde em JSON válido, sem nenhum texto fora do JSON.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 800,
      temperature: 0.4, // mais baixo para garantir JSON consistente
    });

    const raw = result.choices[0]?.message?.content ?? '{}';

    // Extrai o JSON mesmo se a IA colocar texto ao redor
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('[analisar-diagnostico] IA não retornou JSON válido:', raw);
      return NextResponse.json({ error: 'IA não retornou formato esperado.' }, { status: 500 });
    }

    const analise: AnaliseDiagnosticoResponse = JSON.parse(jsonMatch[0]);

    return NextResponse.json(analise);
  } catch (error: unknown) {
    console.error('[analisar-diagnostico]', error);
    const message = error instanceof Error ? error.message : 'Erro desconhecido';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
