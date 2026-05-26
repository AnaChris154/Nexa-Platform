export type TipoConteudo = 'video' | 'pdf' | 'resumo' | 'link';

export interface Subtrilha {
  id: string;
  trilha_id: string;
  habilidade_id: string | null;
  titulo: string;
  descricao: string | null;
  ordem: number;
  created_at: string;
}

export interface ConteudoSubtrilha {
  id: string;
  subtrilha_id: string;
  tipo: TipoConteudo;
  titulo: string;
  url: string | null;
  descricao: string | null;
  ordem: number;
}

export interface ExercicioSubtrilha {
  id: string;
  subtrilha_id: string;
  questao_id: string;
  ordem: number;
}

export interface ProgressoSubtrilha {
  id: string;
  aluno_id: string;
  subtrilha_id: string;
  total_questoes: number;
  acertos: number;
  percentual_acerto: number;
  concluida: boolean;
  ultima_atividade: string;
}

// Tipo enriquecido para exibição — subtrilha com o progresso do aluno já embutido
export interface SubtrilhaComProgresso extends Subtrilha {
  progresso: ProgressoSubtrilha | null;
}
