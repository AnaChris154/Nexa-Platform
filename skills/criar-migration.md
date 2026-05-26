# Skill: Criar migration

## Objetivo
Produzir alterações de banco seguras, legíveis e reversíveis quando possível.

## Aplicação principal no NEXA
- `scriptsSQL/*.sql`
- tabelas de trilhas, subtrilhas, taxonomia e questões

## Procedimento
1. Descrever o problema de dados que a migration resolve.
2. Listar tabelas, colunas, índices e policies afetados.
3. Preferir `IF EXISTS` e `IF NOT EXISTS` quando viável.
4. Evitar comandos destrutivos sem registrar impacto.
5. Verificar impacto em services e tipos TypeScript.
6. Definir validações após aplicar a migration.

## Saída esperada
- SQL proposta
- impacto esperado
- checklist de validação
