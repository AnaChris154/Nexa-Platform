# Skill: Revisar seed

## Objetivo
Revisar seeds SQL e artefatos gerados para garantir consistência estrutural, referencial e semântica.

## Aplicação principal no NEXA
- `scriptsSQL/SQL_SEED_QUESTOES.sql`
- `scripts/gerar-sql-seed.ts`
- `scripts/seed-questoes.ts`

## Procedimento
1. Confirmar o arquivo-fonte da verdade.
2. Verificar dependências destrutivas como `TRUNCATE`, `DELETE` e `CASCADE`.
3. Conferir colunas obrigatórias e compatibilidade com schema atual.
4. Revisar chaves de vínculo, como `subtrilha_id` e `questao_id`.
5. Conferir consistência entre `resposta_correta`, alternativas, habilidade e dificuldade.
6. Identificar dados faltantes, nulos aceitáveis e caminhos de imagem.
7. Sugerir validações pós-seed.

## Saída esperada
- problemas encontrados
- riscos de execução
- melhorias sugeridas
- validações para rodar depois
