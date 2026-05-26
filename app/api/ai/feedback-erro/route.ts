import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// Necessário em redes com proxy/antivírus que interceptam SSL (self-signed cert in chain).
// Em produção (Vercel/servidor sem proxy), isso não tem efeito pois o certificado é válido.
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

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

    const {
      enunciado,
      alternativas,
      resposta_correta,
      resposta_marcada,
      tipos_de_erro_comuns = [],
      conceitos_avaliados = [],
    } = body;

    // Monta texto das alternativas
    const textoAlternativas = Object.entries(alternativas)
      .map(([letra, texto]) => `${letra.toUpperCase()}) ${texto}`)
      .join('\n');

    const alternativaCorreta = `${resposta_correta.toUpperCase()}) ${alternativas[resposta_correta as keyof typeof alternativas]}`;
    const alternativaMarcada = `${resposta_marcada.toUpperCase()}) ${alternativas[resposta_marcada as keyof typeof alternativas]}`;

    const errosPedagogicos = tipos_de_erro_comuns.length > 0
      ? `\nErros pedagógicos comuns nessa questão: ${tipos_de_erro_comuns.join(', ')}.`
      : '';

    const conceitosRelacionados = conceitos_avaliados.length > 0
      ? `\nConceitos avaliados: ${conceitos_avaliados.join(', ')}.`
      : '';

    const prompt = `Você é um tutor educacional amigável e encorajador chamado NEX, que ajuda alunos do ensino médio brasileiro.

Um aluno errou uma questão. Sua tarefa é dar um feedback curto, gentil e pedagógico.

REGRAS IMPORTANTES:
- NUNCA humilhe ou desmotive o aluno.
- Seja breve (máximo 3 frases).
- Explique de forma simples por que a resposta dele está errada.
- Sugira qual confusão ele pode ter tido.
- Termine sempre de forma motivadora.
- Use linguagem informal e acolhedora, como um amigo que explica.
- Use apenas 1 emoji no máximo.

QUESTÃO:
${enunciado}

ALTERNATIVAS:
${textoAlternativas}
${errosPedagogicos}${conceitosRelacionados}

O aluno marcou: ${alternativaMarcada}
A resposta correta é: ${alternativaCorreta}

Gere agora o feedback para o aluno:`;

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY não configurada.' },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });
    const result = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });

    const feedback = result.choices[0]?.message?.content ?? 'Não consegui gerar um feedback agora, mas continue tentando!';

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
