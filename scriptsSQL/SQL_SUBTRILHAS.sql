-- Sistema de Subtrilhas, Conteúdos e Progresso do Aluno

-- 1. Subtrilhas (filhas de uma trilha, ligadas a uma habilidade pedagógica)
CREATE TABLE IF NOT EXISTS subtrilhas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trilha_id UUID NOT NULL, -- referência à tabela trilhas existente
    habilidade_id TEXT REFERENCES habilidades_pedagogicas(id),
    titulo TEXT NOT NULL,
    descricao TEXT,
    ordem INTEGER NOT NULL DEFAULT 0, -- ordem de exibição dentro da trilha
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Conteúdos de cada subtrilha (vídeos, PDFs, resumos)
CREATE TABLE IF NOT EXISTS conteudos_subtrilha (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subtrilha_id UUID REFERENCES subtrilhas(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL CHECK (tipo IN ('video', 'pdf', 'resumo', 'link')),
    titulo TEXT NOT NULL,
    url TEXT,          -- link externo (YouTube, Drive, etc.)
    descricao TEXT,
    ordem INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Exercícios da subtrilha (ligados ao banco de questões ENEM)
-- Tabela de junção: subtrilha <-> questão
CREATE TABLE IF NOT EXISTS exercicios_subtrilha (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subtrilha_id UUID REFERENCES subtrilhas(id) ON DELETE CASCADE,
    questao_id UUID REFERENCES questoes_enem(id),
    ordem INTEGER NOT NULL DEFAULT 0
);

-- 4. Progresso do aluno por subtrilha
CREATE TABLE IF NOT EXISTS progresso_subtrilha (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aluno_id UUID NOT NULL,
    subtrilha_id UUID REFERENCES subtrilhas(id) ON DELETE CASCADE,
    total_questoes INTEGER NOT NULL DEFAULT 0,
    acertos INTEGER NOT NULL DEFAULT 0,
    percentual_acerto NUMERIC(5,2) GENERATED ALWAYS AS (
        CASE WHEN total_questoes = 0 THEN 0
             ELSE ROUND((acertos::NUMERIC / total_questoes) * 100, 2)
        END
    ) STORED,
    concluida BOOLEAN GENERATED ALWAYS AS (
        CASE WHEN total_questoes > 0 AND (acertos::NUMERIC / total_questoes) >= 0.8 THEN TRUE
             ELSE FALSE
        END
    ) STORED,
    ultima_atividade TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(aluno_id, subtrilha_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_subtrilhas_trilha ON subtrilhas(trilha_id);
CREATE INDEX IF NOT EXISTS idx_progresso_aluno ON progresso_subtrilha(aluno_id);
