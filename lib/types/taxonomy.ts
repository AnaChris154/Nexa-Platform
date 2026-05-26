export type Dificuldade = 'muito_facil' | 'facil' | 'media' | 'dificil' | 'muito_dificil';

export interface Habilidade {
  id: string; // ex: MAT_INT
  nome: string;
  descricao: string;
  depende_de: string | null; // ID de outra habilidade
  micro_habilidades: string[]; // List de IDs
}

export interface MicroHabilidade {
  id: string;
  habilidade_id: string;
  nome: string;
  descricao: string;
}

export interface QuestaoENEM {
  id: string;
  ano: number;
  caderno: string;
  numero: number;
  enunciado: string;
  alternativas: {
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
  };
  resposta_correta: 'a' | 'b' | 'c' | 'd' | 'e';
  
  // Taxonomia Pedagógica
  habilidade_principal: string; // ID de Habilidade
  habilidades_secundarias: string[]; // IDs de Habilidades ou Micro
  dificuldade: Dificuldade;
  tipos_de_erro_comuns: string[]; // ex: ["erro_calculo", "falta_interpretacao"]
  dependencias_conceituais: string[]; // O que o aluno deveria saber antes
  conceitos_avaliados: string[]; // ex: ["razao", "proporcao"]
  imagem_url?: string | null; // URL pública da imagem da questão (se houver)
}

export interface RespostaAluno {
  id: string;
  aluno_id: string;
  questao_id: string;
  resposta_fornecida: string;
  foi_correta: boolean;
  tempo_em_segundos: number;
  data_hora: string;
  
  // Metadados para o Adaptativo
  habilidade_avaliada: string;
  nivel_certeza_aluno?: number; // 1-5 (opcional para IA futura)
}
