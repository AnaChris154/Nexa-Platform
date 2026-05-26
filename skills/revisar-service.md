# Skill: Revisar service

## Objetivo
Conferir se um service está com responsabilidades corretas, tratamento de erro consistente e contrato estável para UI e banco.

## Aplicação principal no NEXA
- `services/*.ts`
- integração com `lib/supabaseClient.ts`

## Procedimento
1. Identificar o contrato de entrada e saída.
2. Conferir se a regra de negócio está no lugar certo.
3. Validar tratamento de erro e mensagens.
4. Verificar duplicidade com outros services.
5. Confirmar aderência aos tipos usados pela UI.
6. Sugerir simplificações sem quebrar consumo existente.

## Saída esperada
- pontos fortes e fracos do service
- ajustes sugeridos
- riscos de alteração
