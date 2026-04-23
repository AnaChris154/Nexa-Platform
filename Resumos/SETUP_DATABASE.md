# Setup Database - Profiles

## 🚀 Passo a Passo

### 1. Acessar Supabase Dashboard

1. Vá para https://app.supabase.com
2. Selecione seu projeto NEXA
3. Menu esquerdo → **SQL Editor**
4. Clique **+ New Query**

---

### 2. Colar Script SQL

Copie e cole **TODO** o código abaixo na query:

```sql
-- Criar tabela profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('aluno', 'professor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_tipo ON profiles(tipo);

-- RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários podem ler seu próprio perfil"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Sistema pode criar perfis"
  ON profiles FOR INSERT
  WITH CHECK (true);
```

---

### 3. Executar Query

Clique **Run** (ou Ctrl+Enter)

**Esperado:**
- ✅ Sem erros
- ✅ Query executada com sucesso

---

### 4. Verificar Criação

#### Opção A: Table Editor
1. Menu esquerdo → **Table Editor**
2. Procure por **profiles** na lista
3. Deve aparecer lá

#### Opção B: Query de Verificação
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'profiles';
```

**Resultado esperado:**
```
table_name
-----------
profiles
```

---

## 📊 Estrutura da Tabela

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | UUID | ID do usuário (referencia auth.users) |
| `email` | TEXT | Email do usuário |
| `tipo` | TEXT | "aluno" ou "professor" |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Última atualização |

---

## 🔐 Segurança RLS

### O que foi configurado:

✅ **Select**: Usuário só vê seu perfil  
✅ **Update**: Usuário só atualiza seu perfil  
✅ **Insert**: Sistema cria novos perfis  

Isso garante que ninguém veja ou modifique dados de outros usuários.

---

## ✅ Testes Opcionais

### Teste 1: Insertar Manualmente (Opcional)

Teste se consegue inserir um perfil:

```sql
-- Copie um UUID válido de auth.users se tiver
INSERT INTO profiles (id, email, tipo) 
VALUES ('550e8400-e29b-41d4-a716-446655440000', 'teste@email.com', 'aluno');
```

**Esperado:** Inserção com sucesso

### Teste 2: Verificar Dados

```sql
SELECT * FROM profiles;
```

**Esperado:** Ver os perfis criados

---

## 🚨 Se Algo Deu Errado

### Erro: "Table already exists"
Já existe tabela `profiles`. Pode deletar:

```sql
DROP TABLE profiles;
```

Depois execute o script novamente.

### Erro: Foreign key constraint
O `auth.users` pode não existir. Verifique:

```sql
SELECT COUNT(*) FROM auth.users;
```

Se retornar > 0, está funcionando.

### Erro de RLS
Se os perfis foram criados mas RLS não:

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- Depois copie as políticas novamente
```

---

## 🎉 Próximo Passo

Agora a tabela está pronta! 

Quando você fizer signup:
1. ✅ Usuário criado em auth.users
2. ✅ Perfil criado em profiles (automático)
3. ✅ Tipo salvo no banco de dados

Quando fazer login:
1. ✅ Sistema verifica o tipo no perfil
2. ✅ Redireciona para /aluno ou /professor baseado no tipo real

---

*Para voltar: vá para [resumos/SETUP_DATABASE.md](../resumos/SETUP_DATABASE.md)*
