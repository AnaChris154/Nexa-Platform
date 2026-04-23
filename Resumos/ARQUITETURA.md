# NEXA - Decisões Arquiteturais e Setup

## 📋 Resumo da Implementação

O projeto NEXA foi scaffolded com as seguintes configurações:

### ✅ Estrutura Criada

```
nexa/
├── app/                          # App Router (Next.js 15)
│   ├── layout.tsx               # Layout global com metadata e viewport
│   ├── page.tsx                 # Página inicial (home)
│   ├── login/
│   │   └── page.tsx             # Página de login
│   ├── aluno/
│   │   └── dashboard/
│   │       └── page.tsx         # Dashboard para alunos
│   └── professor/
│       └── dashboard/
│           └── page.tsx         # Dashboard para professores
│
├── components/                   # Componentes React reutilizáveis
│   ├── Navigation.tsx           # Componente de navegação (client)
│   └── Header.tsx               # Componente de cabeçalho
│
├── lib/                         # Utilitários e constantes
│   └── constants.ts             # Constantes da aplicação
│
├── services/                    # (Futuro) Chamadas à API e lógica
│
├── styles/                      # Estilos globais
│   └── globals.css              # CSS global com Tailwind
│
├── .prettierrc                  # Configuração do Prettier
├── .prettierignore              # Arquivos ignorados pelo Prettier
├── eslint.config.mjs            # Configuração do ESLint
├── next.config.ts               # Configuração do Next.js
├── tsconfig.json                # Configuração do TypeScript
├── package.json                 # Dependências
└── README.md                    # Documentação do projeto
```

---

## 🛠️ Tecnologias e Configurações

### Next.js 15+
- **App Router**: Roteamento moderno baseado em arquivos
- **TypeScript**: Habilitado por padrão ✅
- **Turbopack**: Compilador rápido para desenvolvimento

### Estilização
- **Tailwind CSS**: Framework utility-first
- **CSS Modules**: Suportado (não usado neste MVP)

### Linting e Formatação
- **ESLint**: Análise de código estática (configurado automaticamente)
- **Prettier**: Formatação de código (.prettierrc configurado)

---

## 📁 Explicação de Cada Pasta

### `/app`
Contém todas as rotas e layouts do Next.js usando App Router. Cada pasta dentro de `app` representa uma rota.

**Estrutura de rotas:**
- `/` → `app/page.tsx`
- `/login` → `app/login/page.tsx`
- `/aluno/dashboard` → `app/aluno/dashboard/page.tsx`
- `/professor/dashboard` → `app/professor/dashboard/page.tsx`

O `layout.tsx` é aplicado a todas as páginas e configura:
- Metadados (title, description)
- Viewport para mobile-first
- Fontes do Google (Geist)
- Idioma em português-BR

### `/components`
Componentes React reutilizáveis que podem ser importados em qualquer página.

**Componentes criados:**
- `Navigation.tsx`: Barra de navegação principal (usa `'use client'`)
- `Header.tsx`: Componente de cabeçalho com gradiente

**Padrão:** Componentes são importados com alias `@/` (ex: `@/components/Navigation`)

### `/lib`
Lógica compartilhada, constantes e tipos TypeScript.

**Arquivos:**
- `constants.ts`: Rotas, tipos de usuário, nomes da app

**Futuro:** Adicionar helpers para validação, formatação, etc.

### `/services`
Lógica de negócio e chamadas à API/Supabase.

**Arquivos:**
- `trilhasService.ts` - Funções para gerenciar trilhas
- *(Futuro: `usuariosService.ts`, `turmasService.ts`, etc)*

**Padrão:** Todas as funções retornam `{ data, error }`:
```typescript
export async function getTrilhas() {
  const { data, error } = await supabase.from('trilhas').select('*');
  return { data, error };
}
```

### `/styles`
Estilos globais da aplicação.

**globals.css:**
- Reset CSS (margin, padding, box-sizing)
- Estilos base (body, html)
- Utility classes baseadas em Tailwind (btn-primary, btn-secondary, card)

**Por quê CSS puro em vez de @apply?**
- `@apply` no CSS global pode causar conflitos com build
- CSS puro é mais compatível e previsível

---

## 🎯 Decisões Arquiteturais

### 1. **App Router vs Pages Router**
✅ **Escolhido: App Router**
- Mais moderno e recomendado pelo Next.js
- Melhor suporte para Server Components
- Layout nesting natural

### 2. **TypeScript desde o início**
✅ Habilitado por padrão
- Melhor DX (developer experience)
- Previne bugs em tempo de desenvolvimento
- Documentação automática via tipos

### 3. **Componentes do lado do cliente vs servidor**
- `Navigation.tsx`: `'use client'` (precisa de hooks e event listeners)
- `Header.tsx`: Server Component (sem 'use client')
- `page.tsx`: Server Component por padrão

### 4. **Tailwind CSS + CSS Global**
✅ Hybrid approach
- Tailwind para componentes (utility-first)
- CSS global para estilos base e classes reutilizáveis

### 5. **Mobile-First Design**
- Viewport configurado para: width=device-width, initial-scale=1
- Breakpoints Tailwind: mobile → tablet (md) → desktop
- Exemplo: `grid grid-cols-1 md:grid-cols-2` (1 coluna mobile, 2 desktop)

## 🔌 Integração Supabase

### Cliente Centralizado
**Arquivo:** `lib/supabaseClient.ts`
- Cria cliente única vez
- Configuração centralizada
- Validação de variáveis de ambiente

### Services Pattern
**Arquivos:** `services/*.ts`
- Separa UI da lógica
- Retorna `{ data, error }`
- Trata erros consistentemente

### Exemplo de Uso

```typescript
// 1. Serviço (services/trilhasService.ts)
export async function getTrilhas() {
  const { data, error } = await supabase
    .from('trilhas')
    .select('*');
  return { data, error };
}

// 2. Componente (app/page.tsx)
'use client';
import { getTrilhas } from '@/services/trilhasService';

export default function Page() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    getTrilhas().then(({ data, error }) => {
      if (!error) setData(data);
    });
  }, []);
  
  return <div>{data.map(...)}</div>;
}
```

---

## 🐝 Variáveis de Ambiente

**Arquivo:** `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://uorjblwyykqwkniqrwor.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA_CHAVE_AQUI
```

**Nota:** Use `NEXT_PUBLIC_` apenas para dados públicos. Chaves sensíveis ficam no servidor.

---

## 🚀 Como Rodar o Projeto

### Desenvolvimento
```bash
npm run dev
# Acesse: http://localhost:3000
```

### Build para Produção
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

### Formatação com Prettier
```bash
npx prettier --write .
```

---

## 📱 Páginas Implementadas

### 1. **Home (/)**
- Bem-vindo ao NEXA
- Dois cards: "Sou Aluno" e "Sou Professor"
- Navegação para dashboards
- Informações sobre a plataforma

### 2. **Login (/login)**
- Seleção de tipo de usuário (Aluno/Professor)
- Formulário simples (email + senha)
- Input controlados com `useState`
- Link de volta para home

### 3. **Aluno Dashboard (/aluno/dashboard)**
- Saudação personalizada
- Grid de disciplinas com progresso
- Lista de atividades pendentes
- Cards com informações visuais

### 4. **Professor Dashboard (/professor/dashboard)**
- Visão das turmas
- Botão para criar nova turma
- Atividades recentes
- Estatísticas (turmas, alunos, atividades)

---

## 🎨 Design System

### Cores
- **Primária:** Blue (#2563eb)
- **Secundária:** Gray (#6B7280, #1f2937)
- **Sucesso:** Green (#16A34A)
- **Aviso:** Purple (#A855F7)
- **Background:** Light Gray (#f9fafb)
- **White:** #ffffff
- **Dark Text:** #111827

### Tipografia
- **Font Family:** Geist (Google Fonts)
- **Headings:** bold, contraste alto
- **Body:** regular, 14-16px
- **Sem serif, clean e moderno**

### Componentes UI
- `.btn-primary` - Blue button com hover
- `.btn-secondary` - Gray button com hover
- `.card` - Container branco com shadow e border

---

## 📝 Boas Práticas Implementadas

✅ **Componentes Pequenos e Reutilizáveis**
- Navigation, Header já são separados
- Fácil de testar e modificar

✅ **Separação de Concerns**
- UI em `/components`
- Lógica em `/lib` e futuro `/services`
- Estilos centralizados em `/styles`

✅ **TypeScript Todo**
- Componentes tipados
- Props interfaces claras

✅ **Mobile-First**
- Responsivo desde o design
- Tailwind breakpoints bem utilizados

✅ **Código Limpo**
- Sem complexidade desnecessária
- Nomes descritivos
- Formatação Prettier automática

✅ **App Router Moderno**
- Server Components por padrão
- Layout nesting eficiente
- Otimizado para performance

---

## 🔄 Próximas Etapas

1. **Autenticação**
   - Implementar Supabase Auth
   - Middleware para proteger rotas
   - State global com Context ou Zustand

2. **Tabelas Supabase**
   - Criar tabelas (usuários, turmas, atividades)
   - Implementar RLS (Row Level Security)
   - Validações em triggers

3. **Services Adicionais**
   - `usuariosService.ts` - Gerenciar usuários
   - `turmasService.ts` - Gerenciar turmas
   - `atividadesService.ts` - Gerenciar atividades

4. **Real-time (Futuro)**
   - Supabase Realtime subscriptions
   - Sincronização em tempo real
   - Notificações

5. **Testes**
   - Unit tests para services
   - Integration tests com Supabase
   - E2E tests das páginas

6. **Performance & SEO**
   - Image optimization
   - Lazy loading
   - Meta tags dinâmicas

---

## 📚 Referências

- [Next.js 15 Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Prettier Docs](https://prettier.io/docs)

---

**Desenvolvido com ❤️ para o projeto NEXA**
