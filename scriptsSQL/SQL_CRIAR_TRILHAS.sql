-- ============================================
-- SQL: Criar Tabela TRILHAS
-- ============================================
-- Date: 2026-04-23
-- Objetivo: Armazenar trilhas de estudo
--
-- ============================================

-- Dropar tabela se existir (para resetar schema)
DROP TABLE IF EXISTS public.trilhas CASCADE;

-- Criar tabela trilhas
CREATE TABLE public.trilhas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Indexes para Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_trilhas_created_at 
    ON public.trilhas(created_at DESC);

-- ============================================
-- Habilitar RLS (Row Level Security)
-- ============================================

ALTER TABLE public.trilhas ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS Policies
-- ============================================

-- Qualquer usuário autenticado pode ler trilhas
CREATE POLICY "Todos podem ler trilhas"
    ON public.trilhas
    FOR SELECT
    TO authenticated
    USING (true);

-- Apenas admin pode criar/atualizar/deletar trilhas
-- (por enquanto, não inserir a policy de admin)
-- Isso será implementado depois com role de admin

-- ============================================
-- Inserir Trilhas de Exemplo
-- ============================================

INSERT INTO public.trilhas (titulo, descricao) VALUES
(
    'Fundamentos de JavaScript',
    'Aprenda os conceitos básicos de JavaScript: variáveis, funções, callbacks, promises e async/await. Perfeito para iniciantes.'
),
(
    'React do Zero',
    'Domine React desde o início. Components, hooks, state management e integração com APIs. Crie aplicações web modernas.'
),
(
    'Node.js e Backend',
    'Desenvolva servidores robustos com Node.js. Express, bancos de dados, autenticação e deploy em produção.'
),
(
    'TypeScript Avançado',
    'Eleve seu TypeScript para o próximo nível. Generics, decorators, tipos complexos e padrões avançados.'
),
(
    'Banco de Dados com PostgreSQL',
    'Aprenda SQL, design de schema, queries otimizadas, indexes e integração com aplicações Node/Python.'
),
(
    'Responsividade e Design Web',
    'Crie interfaces bonitas e responsivas. CSS Grid, Flexbox, Tailwind e design responsivo para todos os dispositivos.'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- Verificar Inserção
-- ============================================

-- Depois de executar este script, rode:
-- SELECT * FROM public.trilhas;
-- Deve retornar 6 trilhas de exemplo

-- ============================================
-- Troubleshooting
-- ============================================

-- Se der erro "table already exists":
-- DROP TABLE IF EXISTS public.trilhas CASCADE;
-- Depois execute novamente

-- Se RLS não funcionar:
-- REVOKE ALL ON public.trilhas FROM PUBLIC;
-- GRANT SELECT ON public.trilhas TO authenticated;

-- ============================================
-- Fim do Script
-- ============================================
