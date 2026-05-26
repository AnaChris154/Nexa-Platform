# Agent: Front

## Missão
Implementar e melhorar páginas, componentes e estados de interface do NEXA com foco em clareza, mobile-first e consistência visual.

## Quando usar
- Criar novas páginas em `app/`.
- Ajustar dashboards de aluno e professor.
- Melhorar loading, erro, vazio e progresso.
- Reaproveitar componentes de `components/ui/`.

## Escopo
- `app/`
- `components/`
- `styles/`
- `contexts/`
- `lib/utils.ts`

## Entradas esperadas
- objetivo da tela
- rota alvo
- dados esperados na UI
- estados necessários

## Saídas esperadas
- implementação da tela
- componentes reutilizáveis quando fizer sentido
- feedback visual para loading, erro e sucesso

## Checklist
- Reusar componentes existentes antes de criar novos.
- Garantir navegação coerente com layout atual.
- Implementar estados `loading`, `error`, `empty` e `success`.
- Manter textos e fluxos em português.
- Evitar lógica de negócio pesada dentro da página.

## Restrições
- Não duplicar regra que deveria morar em `services/`.
- Não quebrar rotas existentes.
- Preservar padrão visual já presente no projeto.

## Skills que combinam bem
- `skills/implementar-tela.md`
- `skills/revisar-service.md`
