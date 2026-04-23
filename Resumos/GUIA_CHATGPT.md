# Guia para ChatGPT - Como Trabalhar com NEXA

Use este documento como contexto ao pedir ajuda ao ChatGPT.

---

## 📋 Informações Críticas do Projeto

### Tecnologia
- **Framework:** Next.js 15+ (App Router)
- **Linguagem:** TypeScript
- **Styling:** Tailwind CSS 4.x
- **Backend:** Supabase (Auth + Database)
- **Build:** Turbopack

### Estrutura de Pastas
```
nexa/
├── app/
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ProtectedRoute.tsx
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── aluno/dashboard/page.tsx
│   └── professor/dashboard/page.tsx
├── components/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Card.tsx
│   ├── Container.tsx
│   ├── Navigation.tsx
│   └── Header.tsx
├── services/
│   ├── authService.ts
│   └── trilhasService.ts
├── lib/
│   ├── supabaseClient.ts
│   └── constants.ts
└── resumos/ (documentação)
```

---

## 🔑 Padrões Implementados

### 1. Component Pattern
```typescript
// Always 'use client' for components with state
'use client';

import { useState, useEffect } from 'react';

// Reuse components: Button, Input, Card, Container
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
```

### 2. Service Layer Pattern
```typescript
// services/authService.ts returns { data, error } or { user, error }
export async function signIn(email, password) {
  return { user: AuthUser | null, error: Error | null };
}

// Usage in component
const { user, error } = await signIn(email, password);
```

### 3. Context for Global State
```typescript
// Use AuthContext for user state
import { useAuth } from '@/app/contexts/AuthContext';

export function MyComponent() {
  const { user, isAuthenticated, loading } = useAuth();
}
```

### 4. Route Protection
```typescript
// Wrap protected pages
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <Content />
    </ProtectedRoute>
  );
}
```

---

## 🎨 Component API

### Button
```typescript
<Button 
  variant="primary" | "secondary" | "outline"
  fullWidth={true}
  disabled={loading}
  onClick={handler}
>
  Texto
</Button>
```

### Input
```typescript
<Input
  type="text" | "email" | "password"
  label="Label"
  value={state}
  onChange={handler}
  placeholder="..."
  disabled={loading}
  error={errorMessage}
  helperText="Help text"
/>
```

### Card
```typescript
<Card hoverable={true}>
  Conteúdo
</Card>
```

### Container
```typescript
<Container className="py-12">
  Content centered com max-w-6xl
</Container>
```

---

## 🔐 Auth Service API

### Functions
```typescript
// Sign in
const { user, error } = await signIn(email, password);

// Sign up
const { user, error } = await signUp(email, password);

// Sign out
const { success, error } = await signOut();

// Get current user
const user = await getCurrentUser();

// Get session
const session = await getSession();

// Listen for auth changes
const subscription = onAuthStateChange((user) => {
  // user changed
});
subscription?.unsubscribe();
```

### Types
```typescript
interface AuthUser {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
}
```

---

## 🚀 Como Adicionar Novas Features

### Adição 1: Nova Página Protegida

```typescript
// app/novapage/page.tsx
'use client';

import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';
import { useAuth } from '@/app/contexts/AuthContext';

function NovaPageContent() {
  const { user } = useAuth();
  
  return <div>Página protegida de {user?.email}</div>;
}

export default function NovaPage() {
  return <ProtectedRoute><NovaPageContent /></ProtectedRoute>;
}
```

### Adição 2: Novo Service

```typescript
// services/novoService.ts
import { supabase } from '@/lib/supabaseClient';

export async function getData() {
  try {
    const { data, error } = await supabase
      .from('tabela')
      .select('*');
    
    if (error) {
      console.error('Erro:', error.message);
      return { data: null, error: new Error(error.message) };
    }
    
    return { data, error: null };
  } catch (err) {
    console.error('Erro:', err);
    return { data: null, error: new Error('Erro desconhecido') };
  }
}
```

### Adição 3: Novo Componente

```typescript
// components/MeuComponente.tsx
'use client'; // Se tiver estado

interface Props {
  title: string;
  onClick?: () => void;
}

export function MeuComponente({ title, onClick }: Props) {
  return (
    <div onClick={onClick} className="p-4">
      {title}
    </div>
  );
}
```

---

## 🎯 Requests para ChatGPT

### Bom:
✅ "Baseado em [RESUMO_SIGNUP.md], quero adicionar password recovery..."
✅ "Como adicionar uma nova página protegida mantendo a arquitetura?"
✅ "Seguindo o padrão de authService, crie trilhasService para..."

### Evitar:
❌ "Muda para NextAuth" (não, usar Supabase)
❌ "Adiciona Prisma" (não, usar Supabase diretamente)
❌ "Novo componente sem 'use client'" (precisa se tiver estado)

---

## 📝 Antes de Pedir Ajuda

Compartilhe:
1. **Objetivo:** O que você quer fazer
2. **Arquivo:** Qual arquivo está editando
3. **Erro:** Se houver, qual é
4. **Contexto:** Que padrão deve seguir

### Template de Request
```
Objetivo: [O que quer fazer]

Arquivo: [Path do arquivo]

Erro: [Se houver]

Contexto: Vou usar o padrão X (ser específico)

Quer que eu [descrever tarefa específica]
```

---

## 🔗 Documentos por Caso de Uso

| Necessidade | Doc |
|-------------|-----|
| Entender projeto | [ARQUITETURA.md](./ARQUITETURA.md) |
| Adicionar feature | [GUIA_AUTH_SERVICE.md](./GUIA_AUTH_SERVICE.md) |
| Debugar erro | [TESTES_AUTENTICACAO.md](./TESTES_AUTENTICACAO.md) |
| Testar fluxo | [TESTE_COMPLETO.md](./TESTE_COMPLETO.md) |
| Configurar Supabase | [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) |
| Próximos passos | [PROXIMO_PASSO.md](./PROXIMO_PASSO.md) |

---

## 💡 Comandos Úteis

```bash
# Iniciar dev
npm run dev

# Build
npm run build

# Lint
npm run lint
npm run lint:fix

# Format
npm run format

# Type check
npm run type-check
```

---

## 🔐 Variáveis Necessárias

`.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxx...
```

---

## ❌ NÃO FAZER (Breaking Changes)

- ❌ Remover AuthContext
- ❌ Mudar service return pattern { data, error }
- ❌ Adicionar bibliotecas sem perguntar
- ❌ Mudar estrutura de pastas
- ❌ Remover 'use client' de componentes com estado
- ❌ Hardcodar credenciais Supabase

---

## ✅ FAZER (Best Practices)

- ✅ Seguir padrão { data, error } em serviços
- ✅ Usar 'use client' em components com estado
- ✅ Imports absolutos (@/)
- ✅ TypeScript com tipos explícitos
- ✅ Tailwind para styling
- ✅ Components reutilizáveis
- ✅ Validação client + server
- ✅ Error handling consistente

---

## 🎓 Exemplo Completo

**Request ao ChatGPT:**
```
Objetivo: Adicionar uma página "Meu Perfil" que mostra dados do usuário autenticado

Arquivo: Será novo arquivo app/profile/page.tsx

Contexto: 
- Page deve ser protegida (redireciona se não logado)
- Usar useAuth() para pegar dados
- Exibir: Email, ID do usuário
- Botão "Editar" (somente layout por enquanto)
- Usar componentes: Card, Container, Button
- Styling com Tailwind

Quer que eu: Crie página completa com TypeScript, seguindo o padrão existente
```

**Response esperado:** ChatGPT criará página com todos os padrões

---

## 📊 Estrutura de Decisão

```
┌─ Feature Nova
├─ [ ] É sobre auth?
│  ├─ Sim → Editar authService.ts
│  └─ Não → Criar novoService.ts
├─ [ ] Precisa de UI?
│  ├─ Página completa → app/nova/page.tsx
│  ├─ Componente → components/Novo.tsx
│  └─ Ambos → Crie ambos
├─ [ ] Protegida?
│  ├─ Sim → Envolver com <ProtectedRoute>
│  └─ Não → Sem wrapper
└─ [ ] Testes
   ├─ Criar teste em resumos/
   └─ Documentar comportamento
```

---

## 🎯 Next Steps para ChatGPT

Após implementação:
1. Pedir que revise código
2. Pedir que crie testes
3. Pedir que crie documentação
4. Pedir que verifique build: `npm run build`

---

*Guia para integração com ChatGPT - NEXA Project*
