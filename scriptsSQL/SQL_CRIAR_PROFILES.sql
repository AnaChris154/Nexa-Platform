-- ============================================================
-- SCRIPT SQL PARA CRIAR TABELA PROFILES
-- ============================================================
-- Execute este script no Supabase Dashboard:
-- SQL Editor → New Query → Cole este código → Run

-- 1. Criar tabela "profiles"
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('aluno', 'professor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar índice em email (para buscas rápidas)
CREATE INDEX idx_profiles_email ON profiles(email);

-- 3. Criar índice em tipo (para filtros)
CREATE INDEX idx_profiles_tipo ON profiles(tipo);

-- 4. Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 5. Criar políticas RLS
-- Usuários podem ler seu próprio perfil
CREATE POLICY "Usuários podem ler seu próprio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Usuários podem atualizar seu próprio perfil
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Sistema pode inserir novos perfis (via service)
CREATE POLICY "Sistema pode criar perfis"
  ON profiles FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- EXPLICAÇÃO DAS COLUNAS
-- ============================================================
-- id: UUID que referencia auth.users.id (ON DELETE CASCADE = deleta profile se user deletar)
-- email: Email do usuário (replicado para facilitar buscas)
-- tipo: "aluno" ou "professor" (constraint garante apenas esses valores)
-- created_at: Quando o perfil foi criado
-- updated_at: Quando foi atualizado pela última vez

-- ============================================================
-- COMO USAR NO SUPABASE
-- ============================================================
-- 1. Vá para SQL Editor (menu esquerdo)
-- 2. Clique "+ New Query"
-- 3. Cole TODO este script
-- 4. Clique "Run"
-- 5. Verificar se criou (vá em Table Editor e procure "profiles")

-- ============================================================
-- VERIFICAR SE FOI CRIADO
-- ============================================================
-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' AND table_name = 'profiles';
-- (deve retornar uma linha)

-- ============================================================
-- TESTE - Inserir um perfil (opcional)
-- ============================================================
-- INSERT INTO profiles (id, email, tipo) 
-- VALUES ('550e8400-e29b-41d4-a716-446655440000', 'teste@email.com', 'aluno');

-- ============================================================
-- LIMPAR DADOS (se precisar resetar)
-- ============================================================
-- DELETE FROM profiles;
-- DROP TABLE profiles;
