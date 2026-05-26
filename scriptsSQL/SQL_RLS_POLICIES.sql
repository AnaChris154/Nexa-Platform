-- ============================================================
-- NEXA PLATFORM — RLS POLICIES
-- Políticas de segurança para as tabelas pedagógicas
-- Execute no Editor SQL do Supabase
-- ============================================================

-- ── Habilidades Pedagógicas ──────────────────────────────
ALTER TABLE habilidades_pedagogicas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Autenticados podem ler habilidades" ON habilidades_pedagogicas;
CREATE POLICY "Autenticados podem ler habilidades"
  ON habilidades_pedagogicas FOR SELECT TO authenticated USING (true);

-- ── Subtrilhas ───────────────────────────────────────────
ALTER TABLE subtrilhas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Autenticados podem ler subtrilhas" ON subtrilhas;
CREATE POLICY "Autenticados podem ler subtrilhas"
  ON subtrilhas FOR SELECT TO authenticated USING (true);

-- ── Conteúdos das Subtrilhas ─────────────────────────────
ALTER TABLE conteudos_subtrilha ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Autenticados podem ler conteudos" ON conteudos_subtrilha;
CREATE POLICY "Autenticados podem ler conteudos"
  ON conteudos_subtrilha FOR SELECT TO authenticated USING (true);

-- ── Questões ENEM ────────────────────────────────────────
ALTER TABLE questoes_enem ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Autenticados podem ler questoes" ON questoes_enem;
CREATE POLICY "Autenticados podem ler questoes"
  ON questoes_enem FOR SELECT TO authenticated USING (true);

-- ── Exercícios da Subtrilha ──────────────────────────────
ALTER TABLE exercicios_subtrilha ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Autenticados podem ler exercicios" ON exercicios_subtrilha;
CREATE POLICY "Autenticados podem ler exercicios"
  ON exercicios_subtrilha FOR SELECT TO authenticated USING (true);

-- ── Tags das Questões ────────────────────────────────────
ALTER TABLE tags_questao ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Autenticados podem ler tags" ON tags_questao;
CREATE POLICY "Autenticados podem ler tags"
  ON tags_questao FOR SELECT TO authenticated USING (true);

-- ── Progresso da Subtrilha ───────────────────────────────
ALTER TABLE progresso_subtrilha ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Aluno le proprio progresso" ON progresso_subtrilha;
CREATE POLICY "Aluno le proprio progresso"
  ON progresso_subtrilha FOR SELECT TO authenticated USING (aluno_id = auth.uid());

DROP POLICY IF EXISTS "Aluno insere proprio progresso" ON progresso_subtrilha;
CREATE POLICY "Aluno insere proprio progresso"
  ON progresso_subtrilha FOR INSERT TO authenticated WITH CHECK (aluno_id = auth.uid());

DROP POLICY IF EXISTS "Aluno atualiza proprio progresso" ON progresso_subtrilha;
CREATE POLICY "Aluno atualiza proprio progresso"
  ON progresso_subtrilha FOR UPDATE TO authenticated USING (aluno_id = auth.uid());

-- ── Respostas Pedagógicas do Aluno ───────────────────────
ALTER TABLE respostas_pedagogicas_aluno ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Aluno le proprias respostas" ON respostas_pedagogicas_aluno;
CREATE POLICY "Aluno le proprias respostas"
  ON respostas_pedagogicas_aluno FOR SELECT TO authenticated USING (aluno_id = auth.uid());

DROP POLICY IF EXISTS "Aluno insere proprias respostas" ON respostas_pedagogicas_aluno;
CREATE POLICY "Aluno insere proprias respostas"
  ON respostas_pedagogicas_aluno FOR INSERT TO authenticated WITH CHECK (aluno_id = auth.uid());
