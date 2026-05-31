import { NextResponse } from 'next/server';
import { chatCompletion } from '@/lib/ai/client';
import { SYSTEM_FEEDBACK_ERRO } from '@/lib/ai/persona';
import { construirPromptFeedbackErro } from '@/lib/ai/prompts/feedbackErro';

export interface FeedbackErroRequest {
  enunciado: string;
  alternativas: {
    a: string;
    b: string;
    c: string;
    d: string;
    e?: string;
  };
  resposta_correta: string;
  resposta_marcada: string;
  tipos_de_erro_comuns?: string[];
  conceitos_avaliados?: string[];
}

export interface FeedbackErroResponse {
  feedback: string;
}

export async function POST(request: Request) {
  try {
    const body: FeedbackErroRequest = await request.json();

    const prompt = construirPromptFeedbackErro(body);

    const feedback =
      (await chatCompletion({
        system: SYSTEM_FEEDBACK_ERRO,
        user: prompt,
        maxTokens: 200,
        temperature: 0.9,
      })) || 'Não consegui gerar um feedback agora, mas continue tentando!';

    return NextResponse.json({ feedback } satisfies FeedbackErroResponse);
  } catch (error: unknown) {
    console.error('[feedback-erro]', error);
    const message = error instanceof Error ? error.message : 'Erro desconhecido';

    // Mensagens amigáveis por tipo de erro
    let userMessage = 'Não consegui gerar um feedback agora, mas continue tentando!';
    if (message.includes('quota') || message.includes('429') || message.includes('rate limit')) {
      userMessage = 'Limite de uso da IA atingido momentaneamente. Tente novamente em instantes!';
    } else if (message.includes('fetch failed') || message.includes('certificate')) {
      userMessage = 'Erro de conexão com a IA. Verifique a rede ou o certificado SSL.';
    } else if (message.includes('401') || message.includes('403') || message.includes('API_KEY')) {
      userMessage = 'Chave da API inválida ou sem permissão.';
    }

    return NextResponse.json({ error: message, userMessage }, { status: 500 });
  }
}
