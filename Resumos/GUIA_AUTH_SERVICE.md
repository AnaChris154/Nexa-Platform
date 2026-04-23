# Como Usar o AuthService

## Overview
O `authService.ts` fornece uma camada de abstração sobre o Supabase Auth, permitindo operações de autenticação de forma simples e consistente.

## Localização
```
src/services/authService.ts
```

## Imports
```typescript
import {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  getSession,
  onAuthStateChange,
  AuthUser,
} from '@/services/authService';
```

## Funções

### 1. `signIn(email: string, password: string)`

Fazer login com email e senha.

**Assinatura:**
```typescript
signIn(email, password): Promise<{ user: AuthUser | null, error: Error | null }>
```

**Exemplo:**
```typescript
const { user, error } = await signIn('user@example.com', 'password123');

if (error) {
  console.error('Login falhou:', error.message);
  return;
}

console.log('Usuário logado:', user);
// Output: { id: '...', email: 'user@example.com', user_metadata: {...} }
```

**Possíveis Erros:**
- "Invalid login credentials" - Email ou senha incorretos
- "Email not confirmed" - Email não verificado (se habilitado)
- Network errors

---

### 2. `signUp(email: string, password: string)`

Criar uma nova conta.

**Assinatura:**
```typescript
signUp(email, password): Promise<{ user: AuthUser | null, error: Error | null }>
```

**Exemplo:**
```typescript
const { user, error } = await signUp('newuser@example.com', 'password123');

if (error) {
  console.error('Registro falhou:', error.message);
  return;
}

console.log('Conta criada:', user);
```

**Possíveis Erros:**
- "User already registered" - Email já existe
- "Password should be 6+ characters"
- Network errors

**Nota:** Alguns casos podem exigir confirmação de email. Você verá um objeto `session` com `user` mesmo se não confirmado.

---

### 3. `signOut()`

Fazer logout do usuário atual.

**Assinatura:**
```typescript
signOut(): Promise<{ success: boolean, error: Error | null }>
```

**Exemplo:**
```typescript
const { success, error } = await signOut();

if (error) {
  console.error('Erro ao fazer logout:', error.message);
  return;
}

console.log('Desconectado com sucesso');
```

**Resultado:**
- Limpa session salva localmente
- Token JWT é invalidado
- Usuário precisa fazer login novamente

---

### 4. `getCurrentUser()`

Obter objeto do usuário logado atualmente.

**Assinatura:**
```typescript
getCurrentUser(): Promise<AuthUser | null>
```

**Exemplo:**
```typescript
const user = await getCurrentUser();

if (!user) {
  console.log('Nenhum usuário logado');
  return;
}

console.log('Usuário:', user.email);
// Output: user@example.com
```

**Uso Comum:**
```typescript
useEffect(() => {
  const checkAuth = async () => {
    const user = await getCurrentUser();
    if (user) {
      // Usuário logado
      setIsLoggedIn(true);
    } else {
      // Não logado
      setIsLoggedIn(false);
    }
  };

  checkAuth();
}, []);
```

---

### 5. `getSession()`

Obter a sessão Supabase atual (inclui tokens).

**Assinatura:**
```typescript
getSession(): Promise<Session | null>
```

**Exemplo:**
```typescript
const session = await getSession();

if (session) {
  const token = session.access_token;
  // Use token para fazer requisições autenticadas ao servidor
}
```

**Estrutura de `Session`:**
```typescript
{
  access_token: string;    // JWT token
  token_type: string;      // "bearer"
  expires_in: number;      // segundos até expiração
  refresh_token: string;   // Token para renovar
  user: AuthUser;          // Dados do usuário
}
```

---

### 6. `onAuthStateChange(callback: (user: AuthUser | null) => void)`

Escutar mudanças de autenticação em tempo real.

**Assinatura:**
```typescript
onAuthStateChange(callback): Subscription
```

**Exemplo:**
```typescript
const subscription = onAuthStateChange((user) => {
  if (user) {
    console.log('Usuário logado:', user.email);
  } else {
    console.log('Usuário desconectado');
  }
});

// Parar de escutar
subscription?.unsubscribe();
```

**Uso Comum (com cleanup):**
```typescript
useEffect(() => {
  const subscription = onAuthStateChange((user) => {
    setCurrentUser(user);
    setIsLoading(false);
  });

  return () => subscription?.unsubscribe();
}, []);
```

---

## Tipos

### `AuthUser`
```typescript
interface AuthUser {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
}
```

---

## Padrão de Uso em Componentes

### React Hook Pattern
```typescript
'use client';

import { useState, useEffect } from 'react';
import { getCurrentUser, AuthUser } from '@/services/authService';

export function MyComponent() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (!user) return <div>Não logado</div>;

  return <div>Bem-vindo, {user.email}</div>;
}
```

### Com useAuth Hook (Recomendado)
```typescript
'use client';

import { useAuth } from '@/app/contexts/AuthContext';

export function MyComponent() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <div>Carregando...</div>;
  if (!isAuthenticated) return <div>Não logado</div>;

  return <div>Bem-vindo, {user?.email}</div>;
}
```

---

## Exemplo Completo: Página de Login

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from '@/services/authService';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { user, error: authError } = await signIn(email, password);

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (user) {
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        disabled={loading}
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Senha"
        disabled={loading}
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Login'}
      </button>
    </form>
  );
}
```

---

## Best Practices

### ✅ DO
```typescript
// 1. Sempre tratar erros
const { user, error } = await signIn(email, password);
if (error) {
  // Mostrar mensagem amigável ao usuário
  setErrorMessage(error.message);
}

// 2. Usar useAuth para estado global
const { user, isAuthenticated } = useAuth();

// 3. Desabilitar inputs durante operação
<input disabled={loading} />

// 4. Validar campos antes de chamar service
if (!email || !password) {
  setError('Preencha todos os campos');
  return;
}

// 5. Limpar subscription no cleanup
useEffect(() => {
  const sub = onAuthStateChange(...);
  return () => sub?.unsubscribe();
}, []);
```

### ❌ DON'T
```typescript
// 1. Ignorar erros
await signIn(email, password); // Sem tratar erro

// 2. Chamar múltiplas vezes sem debounce
<button onClick={() => signIn(email, password)}>Login</button>
// Se clicar rápido, múltiplas requisições

// 3. Armazenar token manualmente
localStorage.setItem('token', session.access_token);
// Supabase já faz isso

// 4. Chamar authService direto em Server Components
// Usar 'use client' sempre
'use client'; // Necessário

// 5. Não limpar subscriptions
useEffect(() => {
  onAuthStateChange(...);
  // Falta retorno com unsubscribe
}, []);
```

---

## Debugging

### Console Helpers
```typescript
// Ver usuário atual
const user = await getCurrentUser();
console.log('Current user:', user);

// Ver toda sessão
const session = await getSession();
console.log('Current session:', session);

// Ver localStorage (token)
console.log('Token:', localStorage.getItem('sb-...'));
```

### DevTools
- **Application → Storage → localStorage** - Procure por `sb-` prefix
- **Network → XHR** - Veja requisições ao `supabase.com`
- **Console** - Erro de autenticação aparecerá aqui

---

## Próximas Integrações

Quando implementar novos recursos:

```typescript
// Sign in com Google (futura)
signInWithGoogle()

// Verificação de email
verifyEmail(token)

// Reset de senha
resetPassword(email)

// Atualizar perfil
updateProfile(data)

// Verificação de 2FA
enableMFA()
```
