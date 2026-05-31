-- ============================================================
-- FIX: Inserir questões de Química que estão faltando
-- ============================================================
-- Execute no Supabase SQL Editor.
-- ============================================================

INSERT INTO public.questions (materia, nivel, pergunta, alternativa_a, alternativa_b, alternativa_c, alternativa_d, resposta_correta)
VALUES
('quimica', 'facil',   'Quantos átomos tem a molécula de água (H₂O)?',                                                       '1', '2', '3', '4',                                                              'c'),
('quimica', 'facil',   'O que é um ácido segundo Arrhenius?',                                                                 'Substância com pH > 7', 'Substância que libera H⁺ em água', 'Substância com pH = 7', 'Qualquer composto de carbono', 'b'),
('quimica', 'medio',   'Qual é o número atômico do Oxigênio?',                                                                '6', '7', '8', '9',                                                               'c'),
('quimica', 'medio',   'Em uma ligação iônica, o que acontece?',                                                              'Compartilhamento de elétrons', 'Transferência de elétrons', 'Sobreposição de orbitais', 'Indução de dipolo', 'b'),
('quimica', 'dificil', 'Qual é a fórmula da equação dos gases ideais?',                                                      'q = mcΔT', 'pH + pOH = 14', 'PV = nRT', 'm1/m2 = constante',                        'c'),
('quimica', 'dificil', 'Quantos elétrons de valência tem um átomo de carbono (número atômico 6)?',                           '2', '4', '6', '8',                                                               'b');

-- Verificar se foram inseridas
SELECT materia, COUNT(*) as total FROM public.questions GROUP BY materia ORDER BY materia;
