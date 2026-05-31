-- ============================================================
-- FIX: Adicionar policy DELETE no study_plans + normalizar matérias
-- ============================================================
-- Problema 1: RLS não tinha policy DELETE → delete silenciosamente
--             bloqueado → duplicação a cada re-feitura do quiz.
-- Problema 2: Questões com materia = 'Química' (acento/maiúscula)
--             violavam o CHECK constraint → linha não inserida →
--             química sumia do plano.
--
-- Execute este script no Supabase SQL Editor.
-- ============================================================

-- 1. Adicionar policy DELETE para study_plans
CREATE POLICY "Usuários podem deletar seu próprio plano"
  ON public.study_plans FOR DELETE
  USING (auth.uid() = user_id);

-- 2. Corrigir INSERT policy para respeitar user_id (segurança)
DROP POLICY IF EXISTS "Sistema pode criar/atualizar plano" ON public.study_plans;

CREATE POLICY "Usuários podem criar seu plano"
  ON public.study_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Normalizar matérias já existentes na tabela questions
--    (converte para o padrão do CHECK constraint: lowercase sem acento)
UPDATE public.questions
SET materia = CASE
  WHEN materia ILIKE 'matem_tica' OR materia = 'Matematica' OR materia = 'matemática' THEN 'matematica'
  WHEN materia ILIKE 'portugu_s'  OR materia = 'Portugues'  OR materia = 'português'  THEN 'portugues'
  WHEN materia ILIKE 'f_sica'     OR materia = 'Fisica'     OR materia = 'física'     THEN 'fisica'
  WHEN materia ILIKE 'qu_mica'    OR materia = 'Quimica'    OR materia = 'química'    THEN 'quimica'
  WHEN materia ILIKE 'biologia'   OR materia = 'Biologia'                             THEN 'biologia'
  WHEN materia ILIKE 'hist_ria'   OR materia = 'Historia'   OR materia = 'história'   THEN 'historia'
  WHEN materia ILIKE 'geografia'  OR materia = 'Geografia'                            THEN 'geografia'
  ELSE LOWER(materia)
END
WHERE materia NOT IN ('matematica','portugues','fisica','quimica','biologia','historia','geografia');

-- 4. Verificar resultado — deve listar 0 linhas se tudo normalizado
SELECT DISTINCT materia FROM public.questions ORDER BY materia;
