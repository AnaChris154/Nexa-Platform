-- ============================================================
-- FIX: Preencher habilidade_id e area nas questões de Química
-- ============================================================
-- Habilidades de Química (da taxonomia ENEM):
--   CNT_H24 — Códigos e nomenclatura química (estrutura atômica, fórmulas)
--   CNT_H25 — Caracterização de materiais e substâncias (ligações, propriedades)
--   CNT_H26 — Recursos energéticos e impactos químicos
--   CNT_H27 — Intervenção ambiental com conhecimentos químicos
--
-- Execute no Supabase SQL Editor.
-- ============================================================

-- Atualiza cada questão pelo seu ID exato (exportado da tabela)
UPDATE public.questions SET
  area        = 'Ciências da Natureza e suas Tecnologias',
  habilidade_id = 'CNT_H25'
WHERE id = 'cd73d1bf-c30c-4ca6-bbfd-6d6a166ea55b'; -- Quantos átomos tem a molécula de água (H₂O)?

UPDATE public.questions SET
  area        = 'Ciências da Natureza e suas Tecnologias',
  habilidade_id = 'CNT_H24'
WHERE id = '5c85458e-5ef6-4b17-b565-3404c41795c0'; -- O que é um ácido segundo Arrhenius?

UPDATE public.questions SET
  area        = 'Ciências da Natureza e suas Tecnologias',
  habilidade_id = 'CNT_H25'
WHERE id = 'f7188e12-8aa2-4e10-b422-50ffeab827de'; -- Qual é o número atômico do Oxigênio?

UPDATE public.questions SET
  area        = 'Ciências da Natureza e suas Tecnologias',
  habilidade_id = 'CNT_H25'
WHERE id = '1fa51c93-fa28-4fcb-b73f-931fa03e776a'; -- Em uma ligação iônica, o que acontece?

UPDATE public.questions SET
  area        = 'Ciências da Natureza e suas Tecnologias',
  habilidade_id = 'CNT_H24'
WHERE id = 'e3f9e171-dfe1-4b6e-a1ac-e585f8a3031b'; -- Qual é a fórmula da equação dos gases ideais?

UPDATE public.questions SET
  area        = 'Ciências da Natureza e suas Tecnologias',
  habilidade_id = 'CNT_H24'
WHERE id = '977c2d0e-61ca-47ad-99ca-58d7bfbde565'; -- Quantos elétrons de valência tem um átomo de carbono?

-- Verificar resultado — todas as 6 questões de química devem ter area e habilidade_id preenchidos
SELECT id, nivel, pergunta, area, habilidade_id
FROM public.questions
WHERE materia = 'quimica'
ORDER BY nivel;
