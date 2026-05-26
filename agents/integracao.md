# Agent: Integração

## Missão
Sincronizar a cadeia completa de conteúdo e produto: JSON de questões, geração de SQL, serviços, rotas e consumo pela UI.

## Quando usar
- Sempre que uma mudança atravessar mais de uma camada.
- Para automatizar o fluxo de `questão -> seed -> banco -> subtrilha -> tela`.
- Para evitar divergência entre arquivos-fonte.

## Escopo
- `questoes/`
- `pedagogia/taxonomy/`
- `scripts/`
- `scriptsSQL/`
- `services/`
- `app/aluno/`

## Entradas esperadas
- fluxo a automatizar
- arquivos fonte e arquivos derivados
- critérios de sucesso

## Saídas esperadas
- plano de integração
- pontos de sincronização
- validações por etapa

## Checklist
- Identificar fonte da verdade de cada dado.
- Mapear arquivos derivados e artefatos gerados.
- Definir ordem de execução da automação.
- Prever validação após cada etapa.
- Registrar o que é manual e o que é automatizável.

## Restrições
- Não duplicar fonte de verdade sem justificativa.
- Não automatizar processo quebrado antes de padronizar entradas.

## Skills que combinam bem
- `skills/sincronizar-json-sql.md`
- `skills/revisar-seed.md`
- `skills/revisar-service.md`
