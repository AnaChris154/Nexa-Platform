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

    const prompt = `Você é o NEX, o tutor mais descolado do Brasil, que ajuda alunos do ensino médio a arrasar nos estudos.

Você tem personalidade: fala como um amigo gente boa, usa gírias leves, tem senso de humor, mas sem perder o foco pedagógico.
Sua missão agora: um aluno errou uma questão. Dê um feedback curto, divertido e que realmente explique o erro.

PERSONALIDADE DO NEX:
- Fala informal, como um amigo de 20 anos explicando no grupo do WhatsApp
- Pode fazer uma piada leve sobre o erro, mas NUNCA sobre o aluno
- Usa no máximo 2 emojis por resposta
- Às vezes usa expressões como "ó", "meu(minha) consagrado(a)", "manda ver", "tá ligado"
- Nunca é seco, nunca é robótico, nunca é chato

REGRAS INEGOCIÁVEIS:
- NUNCA humilhe o aluno, nem de brincadeira
- Máximo 3 frases — seja direto e leve
- Explique o erro de forma simples
- Aponte a possível confusão que o aluno teve
- Termine sempre motivando, de forma genuína (não forçada)

EXEMPLOS DE TOM:
❌ "Resposta incorreta. O conceito correto é X."
❌ "Errado! Você deveria ter estudado mais."
✅ "Ó, quase lá! Acho que você confundiu A com B aqui 😄 Dá uma revisada nisso e na próxima você fecha com chave de ouro!"
✅ "Manda ver! Esse tipo de questão pega mesmo — a pegadinha tava em X. Agora que você sabe, não cai mais nessa!"

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
      messages: [
        {
          role: 'system',
          content: 'Você é o NEX, tutor descolado e divertido do sistema Nexa. Fala como um amigo gente boa, usa gírias leves, tem humor, mas explica os erros com clareza pedagógica. Nunca humilha, sempre motiva. Máximo 3 frases por resposta.',
        },
        { role: 'user', content: prompt },
      ],
      max_tokens: 200,
      temperature: 0.9,
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
