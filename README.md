# 📚 Plataforma de Estudos para Escolas Públicas

Aplicação web desenvolvida para apoiar o aprendizado de alunos da rede pública, oferecendo trilhas de estudo, exercícios e acompanhamento de desempenho em um ambiente acessível e intuitivo.

---

## 🚀 Objetivo

Criar uma plataforma simples, acessível e eficiente que permita:

* Alunos estudarem de forma estruturada
* Professores acompanharem o progresso
* Escolas terem visibilidade do desempenho geral

---

## 🧠 Funcionalidades (MVP)

### 👨‍🎓 Aluno

* Login/autenticação
* Acesso a trilhas de estudo
* Resolução de exercícios
* Visualização de progresso

### 🏫 Escola / Professor

* Dashboard com lista de alunos
* Acompanhamento de desempenho
* Visualização de progresso por aluno

---

## 🏗️ Tecnologias

* Frontend + Backend: Next.js
* Banco de dados: PostgreSQL
* Autenticação e backend auxiliar: Supabase
* Deploy: Vercel
* Versionamento: Git + GitHub

---

## 📁 Estrutura do Projeto

```bash
/app            # Rotas e páginas da aplicação
/components     # Componentes reutilizáveis (UI)
/services       # Regras de negócio e chamadas de API
/lib            # Configurações (auth, db, etc.)
/styles         # Estilos globais
/public         # Arquivos estáticos
```

---

## ⚙️ Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/plataforma-estudos.git
```

### 2. Acesse a pasta

```bash
cd plataforma-estudos
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
DATABASE_URL=
NEXT_PUBLIC_API_URL=
SUPABASE_URL=
SUPABASE_KEY=
```

### 5. Execute o projeto

```bash
npm run dev
```

A aplicação estará disponível em:

```
http://localhost:3000
```

---

## 🌿 Fluxo de Git

Branches principais:

* `main` → produção
* `dev` → desenvolvimento

Padrão de branches:

```
feature/nome-da-feature
```

Exemplo:

```
feature/login
feature/exercicios
```

---

## 🧾 Padrão de Commits

```
feat: nova funcionalidade
fix: correção de bug
refactor: melhoria de código
```

---

## 👥 Organização da Equipe

Sugestão inicial:

* Dev 1 → Autenticação + banco de dados
* Dev 2 → Interface do aluno
* Dev 3 → Dashboard da escola

---

## 📌 Roadmap (MVP)

* [ ] Autenticação
* [ ] Cadastro de alunos
* [ ] Trilhas de estudo
* [ ] Exercícios
* [ ] Sistema de progresso
* [ ] Dashboard escolar

---

## ⚠️ Boas práticas

* Não commitar diretamente na `main`
* Sempre atualizar a branch `dev` antes de começar
* Criar PRs pequenos e frequentes
* Não subir arquivos `.env`

---

## 💡 Visão futura

* Transformar em aplicativo mobile
* Implementar funcionamento offline (PWA)
* Sistema de recomendações personalizadas
* Gamificação do aprendizado

---

## 📄 Licença

Este projeto está em fase de desenvolvimento e ainda não possui uma licença definida.
