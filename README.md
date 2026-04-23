# NEXA - Plataforma de Estudos

MVP de uma plataforma de estudos para escolas públicas, desenvolvida com foco em simplicidade, organização e mobile-first.

## 🎯 Objetivo

Criar uma plataforma educacional moderna e acessível para escolas públicas, permitindo que alunos acompanhem seu progresso e professores gerenciem suas turmas de forma simples e intuitiva.

## 📁 Estrutura do Projeto

```
nexa/
├── app/                    # App Router do Next.js
│   ├── layout.tsx         # Layout global
│   ├── page.tsx           # Página inicial
│   ├── login/             # Rota de login
│   ├── aluno/
│   │   └── dashboard/     # Dashboard do aluno
│   └── professor/
│       └── dashboard/     # Dashboard do professor
├── components/            # Componentes reutilizáveis
│   ├── Navigation.tsx     # Navegação principal
│   └── Header.tsx         # Componente de cabeçalho
├── lib/                   # Utilitários e constantes
│   └── constants.ts       # Constantes da app
├── services/              # Serviços e lógica de negócio (futuro)
├── styles/                # Estilos globais
│   └── globals.css        # CSS global com Tailwind
└── package.json           # Dependências do projeto
```

## 🛠️ Tecnologias

- **Next.js 15+** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **ESLint** - Análise de código
- **Prettier** - Formatação de código

## 🚀 Como Começar

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

### Build para Produção

```bash
npm run build
npm start
```

### Linting e Formatação

```bash
# Verificar erros de lint
npm run lint

# Formatar código com Prettier
npx prettier --write .
```

## 📱 Características

- ✅ Interface limpa e intuitiva
- ✅ Otimizada para dispositivos móveis (mobile-first)
- ✅ Organização de conteúdo por disciplina
- ✅ Dashboard para alunos e professores
- ✅ Navegação consistente entre páginas
- ✅ Componentes reutilizáveis

## 🎨 Design System

### Cores
- Primária: Blue (#2563EB)
- Secundária: Gray (#6B7280)
- Sucesso: Green (#16A34A)
- Aviso: Purple (#A855F7)

### Tipografia
- Título Principal: Geist (34px, bold)
- Subtítulos: 20px, bold
- Corpo: 14px, regular

## 📝 Pasta `components`

Componentes React reutilizáveis que podem ser importados em qualquer página:
- `Navigation` - Barra de navegação principal
- `Header` - Componente de cabeçalho com título e descrição
- *(Futuros componentes serão adicionados)*

## 📚 Pasta `lib`

Utilitários, constantes e helpers:
- `constants.ts` - Constantes da aplicação (rotas, tipos de usuário)
- *(Futuros: helpers, tipos TypeScript)*

## 🔧 Pasta `services`

Lógica de negócio e chamadas à API:
- *(A ser preenchida com autenticação, chamadas a backend)*

## 🎯 Próximos Passos

- [ ] Integrar com backend para autenticação
- [ ] Implementar sistema de reais disciplinas e atividades
- [ ] Adicionar gráficos de progresso
- [ ] Implementar notificações
- [ ] Adicionar sistema de comentários e feedback
- [ ] Otimizar performance e SEO

## 📄 Licença

Este projeto é desenvolvido para fins educacionais.

---

**Desenvolvido com ❤️ para educação pública**
