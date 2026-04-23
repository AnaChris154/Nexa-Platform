-- ============================================================
-- MULTI-TENANT: SCHOOLS + RELAÇÃO COM PROFILES
-- ============================================================

-- 1) Criar tabela de escolas
CREATE TABLE IF NOT EXISTS public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  codigo TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_schools_codigo ON public.schools(codigo);

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'schools'
      AND policyname = 'Schools podem ser lidas no cadastro'
  ) THEN
    CREATE POLICY "Schools podem ser lidas no cadastro"
      ON public.schools
      FOR SELECT
      USING (true);
  END IF;
END $$;

-- 2) Adicionar school_id em profiles (se ainda não existir)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS school_id UUID;

-- 3) Garantir FK de profiles.school_id -> schools.id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints
    WHERE constraint_name = 'profiles_school_id_fkey'
      AND table_schema = 'public'
      AND table_name = 'profiles'
  ) THEN
    ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_school_id_fkey
    FOREIGN KEY (school_id)
    REFERENCES public.schools(id)
    ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_school_id ON public.profiles(school_id);

-- 4) Seed para testes
INSERT INTO public.schools (nome, codigo)
VALUES ('Escola NEXA Teste', 'NEXA-001')
ON CONFLICT (codigo) DO NOTHING;

-- 5) Verificação
-- SELECT id, nome, codigo FROM public.schools ORDER BY created_at DESC;
-- SELECT id, email, tipo, school_id FROM public.profiles;
