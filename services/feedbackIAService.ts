import type { FeedbackErroRequest, FeedbackErroResponse } from '@/app/api/ai/feedback-erro/route';

/**
 * Chama o endpoint de IA para gerar feedback pedagógico quando o aluno erra.
 */
export async function gerarFeedbackErro(
  dados: FeedbackErroRequest
): Promise<string> {
  const response = await fetch('/api/ai/feedback-erro', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.userMessage || err.error || 'Erro ao gerar feedback da IA.');
  }

  const json: FeedbackErroResponse = await response.json();
  return json.feedback;
}
