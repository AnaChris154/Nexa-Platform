import { NextResponse } from 'next/server';
import type { HabilidadeResultado } from '@/services/diagnosticoService';
import { chatCompletion } from '@/lib/ai/client';
import { SYSTEM_ANALISE_DIAGNOSTICO } from '@/lib/ai/persona';
import { construirPromptDiagnostico, type ContextoAluno } from '@/lib/ai/prompts/diagnostico';

export interface TrilhaDisponivel {
  id: string;
  titulo: string;
  habilidade_id: string | null;
}

export interface AnaliseDiagnosticoRequest {
  porHabilidade: HabilidadeResultado[];
  trilhasDisponiveis: TrilhaDisponivel[];
  /** Contexto pessoal do aluno (nome, objetivo) para personalizar o tom. */
  contexto?: ContextoAluno;
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
    const { porHabilidade, trilhasDisponiveis, contexto } = body;

    const prompt = construirPromptDiagnostico(porHabilidade, trilhasDisponiveis, contexto);

    const raw =
      (await chatCompletion({
        system: SYSTEM_ANALISE_DIAGNOSTICO,
        user: prompt,
        maxTokens: 800,
        temperature: 0.4, // mais baixo para garantir JSON consistente
        json: true, // JSON mode nativo do Groq — garante objeto JSON válido
      })) || '{}';

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
