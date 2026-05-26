-- Estrutura de Taxonomia Pedagógica para o ENEM

-- 1. Tabela de Habilidades (Nível Macro)
CREATE TABLE IF NOT EXISTS habilidades_pedagogicas (
    id TEXT PRIMARY KEY, -- ex: 'MAT_INT'
    nome TEXT NOT NULL,
    descricao TEXT,
    area_conhecimento TEXT, -- 'Matemática', 'Linguagens', etc.
    depende_de TEXT REFERENCES habilidades_pedagogicas(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Micro-Habilidades (Nível Atômico)
CREATE TABLE IF NOT EXISTS micro_habilidades (
    id TEXT PRIMARY KEY, -- ex: 'REGRA_TRES'
    habilidade_id TEXT REFERENCES habilidades_pedagogicas(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    descricao TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Questões do ENEM Classificadas
CREATE TABLE IF NOT EXISTS questoes_enem (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ano INTEGER,
    enunciado TEXT NOT NULL,
    alternativas JSONB NOT NULL, -- {a: "...", b: "...", ...}
    resposta_correta CHAR(1) NOT NULL,
    
    -- Metadados Pedagógicos
    habilidade_principal_id TEXT REFERENCES habilidades_pedagogicas(id),
    dificuldade TEXT CHECK (dificuldade IN ('muito_facil', 'facil', 'media', 'dificil', 'muito_dificil')),
    tipos_de_erro TEXT[], -- Array de strings com códigos de erro
    conceitos_avaliados TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela de Tags para busca rápida e IA
CREATE TABLE IF NOT EXISTS tags_questao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questao_id UUID REFERENCES questoes_enem(id) ON DELETE CASCADE,
    tag_name TEXT NOT NULL,
    UNIQUE(questao_id, tag_name)
);

-- 5. Histórico de Respostas do Aluno (Para o motor adaptativo)
CREATE TABLE IF NOT EXISTS respostas_pedagogicas_aluno (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aluno_id UUID NOT NULL, -- Referência ao ID do usuário do Auth
    questao_id UUID REFERENCES questoes_enem(id),
    resposta_fornecida CHAR(1),
    foi_correta BOOLEAN NOT NULL,
    tempo_segundos INTEGER,
    metadados JSONB, -- Para store de nível de confiança, etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_respostas_aluno_habilidade ON respostas_pedagogicas_aluno (aluno_id);
CREATE INDEX IF NOT EXISTS idx_questoes_habilidade ON questoes_enem (habilidade_principal_id);
