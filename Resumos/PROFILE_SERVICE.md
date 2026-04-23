# Profile Service - Guia de Uso

## 📚 Visão Geral

O `profileService.ts` gerencia os perfis de usuários no banco de dados (tabela `profiles`).

Cada usuário autenticado tem um perfil com:
- Email
- Tipo (aluno ou professor)
- Datas de criação/atualização

---

## 🔧 Funcões Disponíveis

### 1. `createProfile(userId, email, tipo)`

Criar um novo perfil para um usuário.

```typescript
import { createProfile } from '@/services/profileService';

const { profile, error } = await createProfile(
  '123e4567-e89b-12d3-a456-426614174000',  // userId
  'aluno@teste.com',                        // email
  'aluno'                                   // tipo
);

if (error) {
  console.error('Erro:', error.message);
} else {
  console.log('Perfil criado:', profile);
  // Output: { id, email, tipo, created_at, updated_at }
}
```

**Chamada automática em:** `authService.signUp()`

---

### 2. `getProfile(userId)`

Obter o perfil de um usuário.

```typescript
import { getProfile } from '@/services/profileService';

const { profile, error } = await getProfile('123e4567-e89b-12d3-a456-426614174000');

if (error) {
  console.error('Erro:', error.message);
} else if (profile) {
  console.log('Tipo do usuário:', profile.tipo);
  // Output: 'aluno' ou 'professor'
} else {
  console.log('Perfil não encontrado');
}
```

**Chamada automática em:** `AuthContext` ao fazer login

---

### 3. `updateProfile(userId, updates)`

Atualizar dados do perfil.

```typescript
import { updateProfile } from '@/services/profileService';

const { profile, error } = await updateProfile(
  '123e4567-e89b-12d3-a456-426614174000',
  {
    email: 'newemail@teste.com',
    // ou
    tipo: 'professor'  // mudar tipo
  }
);
```

---

### 4. `deleteProfile(userId)`

Deletar um perfil (raro usar).

```typescript
import { deleteProfile } from '@/services/profileService';

const { success, error } = await deleteProfile('123e4567-e89b-12d3-a456-426614174000');

if (success) {
  console.log('Perfil deletado');
}
```

---

## 📊 Interface `UserProfile`

```typescript
interface UserProfile {
  id: string;              // UUID do usuário
  email: string;           // Email
  tipo: 'aluno' | 'professor';  // Tipo de usuário
  created_at: string;      // ISO timestamp
  updated_at: string;      // ISO timestamp
}
```

---

## 🔄 Fluxo de Integração

### Signup Completo

```
1. User preenche form: email, senha, tipo
   ↓
2. signUp(email, password, tipo)
   ├─ Supabase.auth.signUp()
   │  └─ Cria em auth.users
   │
   └─ createProfile(userId, email, tipo)
      └─ Cria em profiles table
         └─ Perfil agora existe no banco!
```

### Login + Redirecionamento

```
1. User faz login: email, senha
   ↓
2. signIn(email, password)
   └─ Resultado: { user, error }
   
3. getProfile(user.id)
   └─ Resultado: { profile, error }
   
4. Redirecionar baseado em profile.tipo
   ├─ Se 'aluno' → /aluno/dashboard
   └─ Se 'professor' → /professor/dashboard
```

### AuthContext (Estado Global)

```typescript
const { user, profile, isAuthenticated } = useAuth();

// user: { id, email, user_metadata }
// profile: { id, email, tipo, created_at, updated_at }
// isAuthenticated: boolean

// Usar tipo para decisões
if (profile?.tipo === 'professor') {
  // Mostrar features de professor
}
```

---

## 💡 Exemplos de Uso

### Exemplo 1: Exibir Nome do Usuário com Tipo

```typescript
'use client';

import { useAuth } from '@/app/contexts/AuthContext';

export function UserInfo() {
  const { user, profile } = useAuth();

  return (
    <div>
      <p>Email: {user?.email}</p>
      <p>Tipo: {profile?.tipo === 'professor' ? 'Professor' : 'Aluno'}</p>
    </div>
  );
}
```

### Exemplo 2: Redirecionar Baseado em Tipo

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { useEffect } from 'react';

export function AutoRedirect() {
  const router = useRouter();
  const { profile, loading } = useAuth();

  useEffect(() => {
    if (!loading && profile) {
      const path = profile.tipo === 'professor' 
        ? '/professor/dashboard'
        : '/aluno/dashboard';
      router.push(path);
    }
  }, [profile, loading, router]);

  return <div>Redirecionando...</div>;
}
```

### Exemplo 3: Apenas Professores

```typescript
'use client';

import { useAuth } from '@/app/contexts/AuthContext';

export function AdminPanel() {
  const { profile } = useAuth();

  if (profile?.tipo !== 'professor') {
    return <div>Acesso apenas para professores</div>;
  }

  return <div>Painel do Professor</div>;
}
```

---

## 🔐 Segurança

### RLS Policies

```sql
-- Só o dono consegue ler
SELECT: auth.uid() = id

-- Só o dono consegue atualizar
UPDATE: auth.uid() = id

-- Sistema consegue criar novos
INSERT: CHECK (true)
```

Isso garante que:
- ✅ Usuário A não consegue ver perfil de usuário B
- ✅ Usuário A não consegue modificar perfil de B
- ✅ Sistema consegue criar perfis (signup)

---

## 🐛 Troubleshooting

| Problema | Causa | Solução |
|----------|-------|--------|
| Erro ao criar profile | Tabela não existe | Executar SQL em SETUP_DATABASE.md |
| Profile retorna null | Usuário novo | Peut ou o profile não foi criado ainda |
| Erro RLS | Política não configurada | Verificar políticas no Supabase |
| Email não no profile | Não foi passado | Certifique-se que `createProfile(userId, email, tipo)` recebe email |

---

## 📝 Type Safety

Sempre use tipos:

```typescript
// ✅ BOM
const { profile, error } = await getProfile(userId);
if (profile?.tipo === 'professor') { ... }

// ❌ EVITAR
const profile = await getProfile(userId);  // Sem tratamento de erro
if (profile.tipo === 'professor') { ... }  // Pode quebrar
```

---

## 🚀 Próximas Funcionalidades

Quando implementar:

1. **Edit Profile Page**
   ```typescript
   import { updateProfile } from '@/services/profileService';
   ```

2. **Dashboard de Professores**
   ```typescript
   if (profile?.tipo === 'professor') {
     // Mostrar features especiais
   }
   ```

3. **Turmas (quando turmas existirem)**
   ```typescript
   // Associar turmas por tipo de professor
   // Filtrar atividades por tipo de aluno
   ```

---

## 📚 Relacionado

- [SETUP_DATABASE.md](./SETUP_DATABASE.md) - Criar tabela profiles
- [AUTENTICACAO.md](./AUTENTICACAO.md) - Sistema de auth
- [GUIA_AUTH_SERVICE.md](./GUIA_AUTH_SERVICE.md) - AuthService API

---

*Profile Service - NEXA System*
