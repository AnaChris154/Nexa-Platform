-- ============================================================
-- FIX: Adicionar FK constraint entre subtrilhas e trilhas
-- ============================================================
-- Problema: subtrilhas.trilha_id não tinha REFERENCES trilhas(id)
-- definido explicitamente, quebrando o join do PostgREST/Supabase.
--
-- Execute este script no Supabase SQL Editor.
-- ============================================================

ALTER TABLE public.subtrilhas
  ADD CONSTRAINT subtrilhas_trilha_id_fkey
  FOREIGN KEY (trilha_id)
  REFERENCES public.trilhas(id)
  ON DELETE CASCADE;
