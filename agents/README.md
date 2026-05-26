# Agents do projeto NEXA

Esta pasta organiza papéis de trabalho para uso manual no chat ou em um orquestrador futuro.

## Como usar

1. Escolha um agent.
2. Diga no chat qual arquivo deve guiar a execução.
3. Informe o objetivo e os arquivos alvo.
4. Opcionalmente combine um ou mais arquivos de `skills/`.

Exemplo:

- "Siga `agents/supabase.md` e `skills/revisar-seed.md` para revisar o seed de questões."
- "Siga `agents/front.md` e `skills/implementar-tela.md` para criar a página de atividades."

## Agents disponíveis

- `arquitetura.md`: define impacto, contratos e estratégia.
- `front.md`: implementa páginas, componentes e UX.
- `supabase.md`: trabalha schema, SQL, RLS e consistência de dados.
- `pedagogia.md`: valida habilidades, erros e coerência pedagógica.
- `integracao.md`: sincroniza JSON, scripts, seed SQL e serviços.

## Regra prática

Estes arquivos não executam sozinhos. Eles funcionam como instruções reutilizáveis para orientar a execução do trabalho.
