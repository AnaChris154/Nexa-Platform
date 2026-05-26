# Skill: Sincronizar JSON e SQL

## Objetivo
Evitar divergência entre arquivos de conteúdo, scripts geradores, seed SQL e banco.

## Aplicação principal no NEXA
- `questoes/enem/`
- `scripts/gerar-sql-seed.ts`
- `scriptsSQL/SQL_SEED_QUESTOES.sql`
- `pedagogia/taxonomy/`

## Procedimento
1. Definir a fonte da verdade do conteúdo.
2. Mapear quais artefatos são gerados a partir dela.
3. Conferir se todos os campos obrigatórios existem nas duas pontas.
4. Verificar normalização de ids, caminhos de imagem e vínculos com subtrilhas.
5. Validar se a geração é determinística.
6. Registrar pontos ainda manuais.

## Saída esperada
- mapa da sincronização
- inconsistências encontradas
- ações para automatização incremental
