# Skill: Validar taxonomia

## Objetivo
Conferir aderência entre questão, habilidade principal, micro-habilidades, conceitos avaliados e erros comuns.

## Aplicação principal no NEXA
- `pedagogia/taxonomy/habilidades.json`
- `pedagogia/taxonomy/micro_habilidades.json`
- `lib/types/taxonomy.ts`
- `questoes/enem/`

## Procedimento
1. Ler o enunciado e o tipo de raciocínio exigido.
2. Comparar com a habilidade principal atribuída.
3. Verificar se há micro-habilidade mais específica.
4. Revisar se os `conceitos_avaliados` são objetivos e reaproveitáveis.
5. Revisar se `tipos_de_erro` representam erros diagnósticos úteis.
6. Apontar divergências e sugerir correções.

## Saída esperada
- classificação validada ou corrigida
- justificativa curta
- observações pedagógicas acionáveis
