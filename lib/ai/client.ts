import Groq from 'groq-sdk';

// Necessário em redes com proxy/antivírus que interceptam SSL (self-signed cert in chain).
// Em produção (Vercel/servidor sem proxy), isso não tem efeito pois o certificado é válido.
if (process.env.NODE_ENV !== 'production') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

/**
 * Modelo único usado em toda a IA da Nexa.
 * Trocar aqui afeta todos os endpoints de IA de uma vez.
 */
export const GROQ_MODEL = 'llama-3.3-70b-versatile';

/** Lançado quando a GROQ_API_KEY não está configurada no ambiente. */
export class GroqNaoConfiguradoError extends Error {
  constructor() {
    super('GROQ_API_KEY não configurada.');
    this.name = 'GroqNaoConfiguradoError';
  }
}

export interface ChatParams {
  /** System prompt (a "voz" da IA). Ver lib/ai/persona.ts. */
  system: string;
  /** Mensagem do usuário (o prompt dinâmico construído em lib/ai/prompts). */
  user: string;
  maxTokens: number;
  temperature: number;
  /**
   * Quando true, usa o JSON mode nativo do Groq, que garante um objeto JSON
   * válido na resposta. Exige que a palavra "JSON" apareça no prompt.
   */
  json?: boolean;
}

/**
 * Faz uma chamada de chat completion no Groq com os padrões da Nexa.
 * Retorna o conteúdo textual da resposta (string vazia se não houver conteúdo);
 * cada chamador aplica seu próprio fallback.
 */
export async function chatCompletion(params: ChatParams): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new GroqNaoConfiguradoError();
  }

  const groq = new Groq({ apiKey });
  const result = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: params.system },
      { role: 'user', content: params.user },
    ],
    max_tokens: params.maxTokens,
    temperature: params.temperature,
    ...(params.json ? { response_format: { type: 'json_object' as const } } : {}),
  });

  return result.choices[0]?.message?.content ?? '';
}
