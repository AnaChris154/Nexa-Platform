-- =============================================================
-- MIGRAÇÃO: Quiz de Mapeamento Acadêmico + Plano IA
-- Executar no Supabase SQL Editor
-- =============================================================

-- 1. Adicionar colunas na tabela questions (quiz de diagnóstico)
ALTER TABLE questions
  ADD COLUMN IF NOT EXISTS habilidade_id TEXT,
  ADD COLUMN IF NOT EXISTS area TEXT,
  ADD COLUMN IF NOT EXISTS tipo TEXT DEFAULT 'fechada' CHECK (tipo IN ('fechada', 'aberta'));

-- 2. Atualizar tabela study_plans para suportar plano gerado por IA
ALTER TABLE study_plans
  ADD COLUMN IF NOT EXISTS habilidade_id TEXT,
  ADD COLUMN IF NOT EXISTS trilha_id UUID REFERENCES trilhas(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS motivo_ia TEXT,
  ADD COLUMN IF NOT EXISTS ordem_recomendacao INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS gerado_por_ia BOOLEAN DEFAULT FALSE;

-- 3. Remover constraints que bloqueiam questões abertas
-- resposta_correta e alternativas precisam aceitar string vazia para questões dissertativas
ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_resposta_correta_check;
ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_alternativa_a_check;
ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_alternativa_b_check;
ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_alternativa_c_check;
ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_alternativa_d_check;

-- Recriar apenas resposta_correta aceitando a/b/c/d OU string vazia (questão aberta)
ALTER TABLE questions
  ADD CONSTRAINT questions_resposta_correta_check
  CHECK (resposta_correta IN ('a', 'b', 'c', 'd', ''));

-- 4. Permitir NULL em answers.correta (questões abertas não têm acerto automático)
ALTER TABLE answers ALTER COLUMN correta DROP NOT NULL;

-- =============================================================
-- 3. Seed: 15 questões de mapeamento acadêmico para testes
--    Mix de questões fechadas e abertas
--    Cobrindo as 4 áreas do ENEM + habilidades da taxonomia
-- =============================================================

TRUNCATE TABLE questions RESTART IDENTITY CASCADE;

INSERT INTO questions (materia, area, habilidade_id, nivel, tipo, pergunta, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta) VALUES

-- MATEMÁTICA — MAT_OPE (Operações Básicas)
(
  'matematica', 'Ciências da Natureza e Matemática', 'MAT_OPE', 'facil', 'fechada',
  'Uma turma tem 32 alunos. Se 8 faltaram hoje, qual é a fração dos alunos presentes?',
  '1/4', '3/4', '1/3', '2/3',
  'b'
),

-- MATEMÁTICA — MAT_PROP (Proporcionalidade)
(
  'matematica', 'Ciências da Natureza e Matemática', 'MAT_PROP', 'facil', 'fechada',
  'Se 5 canetas custam R$ 12,50, quanto custam 8 canetas?',
  'R$ 18,00', 'R$ 20,00', 'R$ 22,50', 'R$ 25,00',
  'b'
),

-- MATEMÁTICA — MAT_GRA (Leitura Gráfica)
(
  'matematica', 'Ciências da Natureza e Matemática', 'MAT_GRA', 'facil', 'fechada',
  'Um gráfico de barras mostra que em janeiro choveu 80mm, em fevereiro 120mm e em março 60mm. Qual foi o mês mais chuvoso?',
  'Janeiro', 'Fevereiro', 'Março', 'Todos iguais',
  'b'
),

-- MATEMÁTICA — MAT_ALG (Álgebra Básica)
(
  'matematica', 'Ciências da Natureza e Matemática', 'MAT_ALG', 'medio', 'fechada',
  'Se 3x + 6 = 18, qual é o valor de x?',
  'x = 2', 'x = 3', 'x = 4', 'x = 6',
  'c'
),

-- MATEMÁTICA — MAT_INT (Interpretação Matemática) — ABERTA
(
  'matematica', 'Ciências da Natureza e Matemática', 'MAT_INT', 'medio', 'aberta',
  'Você está comprando um celular que custa R$ 1.200 à vista ou em 10 parcelas de R$ 150. Em quanto o parcelado é mais caro? Explique como chegou nisso.',
  '', '', '', '',
  ''
),

-- MATEMÁTICA — MAT_FRA (Frações)
(
  'matematica', 'Ciências da Natureza e Matemática', 'MAT_FRA', 'facil', 'fechada',
  'Quanto é 1/2 + 1/4?',
  '2/6', '2/4', '3/4', '1/3',
  'c'
),

-- PORTUGUÊS — Interpretação de Texto
(
  'portugues', 'Linguagens, Códigos e suas Tecnologias', 'LIN_INT', 'facil', 'fechada',
  'Leia: "O menino correu muito mas ainda chegou atrasado." A palavra "mas" indica:',
  'Adição', 'Oposição', 'Conclusão', 'Causa',
  'b'
),

-- PORTUGUÊS — Produção Textual — ABERTA
(
  'portugues', 'Linguagens, Códigos e suas Tecnologias', 'LIN_PRO', 'facil', 'aberta',
  'Em 2 ou 3 frases, explique o que acontece na sua cidade que você acha que deveria ser diferente. Não precisa ser formal.',
  '', '', '', '',
  ''
),

-- PORTUGUÊS — Gramática
(
  'portugues', 'Linguagens, Códigos e suas Tecnologias', 'LIN_GRA', 'facil', 'fechada',
  '"Eles foram ao mercado." — O sujeito dessa frase é:',
  'Foram', 'Ao mercado', 'Eles', 'Mercado',
  'c'
),

-- BIOLOGIA — Fotossíntese
(
  'biologia', 'Ciências da Natureza e suas Tecnologias', 'CN_BIO', 'facil', 'fechada',
  'Qual das opções abaixo é responsável pela fotossíntese nas plantas?',
  'Mitocôndria', 'Cloroplasto', 'Núcleo', 'Ribossomo',
  'b'
),

-- FÍSICA — Velocidade Média
(
  'fisica', 'Ciências da Natureza e suas Tecnologias', 'CN_FIS', 'facil', 'fechada',
  'Um carro percorre 120 km em 2 horas. Qual é sua velocidade média?',
  '40 km/h', '60 km/h', '80 km/h', '100 km/h',
  'b'
),

-- BIOLOGIA — ABERTA (cotidiano)
(
  'biologia', 'Ciências da Natureza e suas Tecnologias', 'CN_COT', 'medio', 'aberta',
  'Por que você acha que a água ferve quando colocamos no fogo? Explique do seu jeito, sem se preocupar em usar termos científicos.',
  '', '', '', '',
  ''
),

-- HISTÓRIA — Proclamação da República
(
  'historia', 'Ciências Humanas e suas Tecnologias', 'CH_HIS', 'facil', 'fechada',
  'A Proclamação da República do Brasil aconteceu em:',
  '1822', '1888', '1889', '1891',
  'c'
),

-- GEOGRAFIA — Desmatamento
(
  'geografia', 'Ciências Humanas e suas Tecnologias', 'CH_GEO', 'facil', 'fechada',
  'Qual é a principal causa do desmatamento na Amazônia brasileira?',
  'Terremotos', 'Expansão agropecuária', 'Vulcões', 'Chuva ácida',
  'b'
),

-- HISTÓRIA — ABERTA (cidadania)
(
  'historia', 'Ciências Humanas e suas Tecnologias', 'CH_CID', 'facil', 'aberta',
  'O que você acha que é ser um bom cidadão? Dê um exemplo prático do dia a dia.',
  '', '', '', '',
  ''
);
