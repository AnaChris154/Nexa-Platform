-- ============================================================
-- TRILHAS E SUBTRILHAS DO ENEM
-- Sistema Nexa — Foco: 2º e 3º ano do Ensino Médio
-- Baseado na Matriz de Referência Oficial do ENEM (INEP)
-- ============================================================
-- ⚠️ ATENÇÃO: Este script apaga todas as trilhas existentes.
-- Execute apenas após confirmar que os dados de teste
-- foram removidos.
-- ============================================================

-- Limpa trilhas e subtrilhas antigas (mantém estrutura)
TRUNCATE TABLE exercicios_subtrilha  RESTART IDENTITY CASCADE;
TRUNCATE TABLE conteudos_subtrilha   RESTART IDENTITY CASCADE;
TRUNCATE TABLE progresso_subtrilha   RESTART IDENTITY CASCADE;
TRUNCATE TABLE subtrilhas            RESTART IDENTITY CASCADE;
DELETE FROM public.trilhas;

-- ============================================================
-- INSERÇÃO DAS TRILHAS POR ÁREA DE CONHECIMENTO
-- ============================================================

INSERT INTO public.trilhas (id, titulo, descricao) VALUES

-- ÁREA 1: Linguagens, Códigos e suas Tecnologias
('00000000-0001-0000-0000-000000000001', 'Língua Portuguesa',         'Interpretação de texto, gramática, figuras de linguagem e variação linguística cobradas no ENEM.'),
('00000000-0001-0000-0000-000000000002', 'Literatura Brasileira',     'Principais escolas literárias, autores e obras da literatura nacional cobrados no ENEM.'),
('00000000-0001-0000-0000-000000000003', 'Língua Inglesa',            'Interpretação de textos em inglês, vocabulário contextual e estruturas gramaticais do ENEM.'),
('00000000-0001-0000-0000-000000000004', 'Redação ENEM',              'Estrutura da redação dissertativo-argumentativa, repertório sociocultural e competências avaliadas.'),
('00000000-0001-0000-0000-000000000005', 'Artes e Cultura',           'Linguagens artísticas, movimentos culturais e interpretação de imagens e obras de arte no ENEM.'),

-- ÁREA 2: Ciências Humanas e suas Tecnologias
('00000000-0002-0000-0000-000000000001', 'História',                  'Do Brasil Colônia ao século XXI: principais eventos, movimentos sociais e contextos históricos do ENEM.'),
('00000000-0002-0000-0000-000000000002', 'Geografia',                 'Geopolítica, climatologia, urbanização, globalização e questões ambientais cobradas no ENEM.'),
('00000000-0002-0000-0000-000000000003', 'Filosofia',                 'Grandes filósofos, ética, política e os temas filosóficos mais recorrentes no ENEM.'),
('00000000-0002-0000-0000-000000000004', 'Sociologia',                'Pensadores clássicos, estrutura social, movimentos sociais e cidadania no contexto do ENEM.'),

-- ÁREA 3: Ciências da Natureza e suas Tecnologias
('00000000-0003-0000-0000-000000000001', 'Biologia',                  'Genética, ecologia, evolução e citologia: os temas mais cobrados em Biologia no ENEM.'),
('00000000-0003-0000-0000-000000000002', 'Química',                   'Reações químicas, estequiometria, química orgânica e os contextos do cotidiano no ENEM.'),
('00000000-0003-0000-0000-000000000003', 'Física',                    'Mecânica, eletricidade, termodinâmica e ondulatória com foco nas questões contextualizadas do ENEM.'),

-- ÁREA 4: Matemática e suas Tecnologias
('00000000-0004-0000-0000-000000000001', 'Matemática Básica',         'Fundamentos de aritmética, frações, porcentagem e proporcionalidade — base para o ENEM.'),
('00000000-0004-0000-0000-000000000002', 'Álgebra e Funções',         'Equações, funções do 1º e 2º grau, progressões e sistemas lineares cobrados no ENEM.'),
('00000000-0004-0000-0000-000000000003', 'Geometria',                 'Geometria plana, espacial, analítica e trigonometria com foco nas provas do ENEM.'),
('00000000-0004-0000-0000-000000000004', 'Estatística e Probabilidade', 'Leitura de gráficos, medidas de tendência central e cálculo de probabilidades no ENEM.');


-- ============================================================
-- SUBTRILHAS POR TRILHA
-- ============================================================

INSERT INTO subtrilhas (trilha_id, titulo, descricao, ordem) VALUES

-- ► LÍNGUA PORTUGUESA
('00000000-0001-0000-0000-000000000001', 'Interpretação de Texto',        'Inferência, coerência e identificação de ideias centrais em textos variados.',    1),
('00000000-0001-0000-0000-000000000001', 'Tipologia e Gêneros Textuais',   'Narrativo, dissertativo, injuntivo, descritivo e os principais gêneros do ENEM.', 2),
('00000000-0001-0000-0000-000000000001', 'Gramática Contextualizada',      'Concordância, regência, crase e pontuação dentro do contexto das questões.',      3),
('00000000-0001-0000-0000-000000000001', 'Figuras de Linguagem',           'Metáfora, metonímia, ironia, antítese e sua aplicação em textos literários.',     4),
('00000000-0001-0000-0000-000000000001', 'Variação e Norma Linguística',   'Registros formais e informais, dialetos e preconceito linguístico.',              5),

-- ► LITERATURA BRASILEIRA
('00000000-0001-0000-0000-000000000002', 'Quinhentismo e Barroco',         'Carta de Caminha, Pe. Vieira, Gregório de Matos e o período colonial.',           1),
('00000000-0001-0000-0000-000000000002', 'Arcadismo e Romantismo',         'Tomás Antônio Gonzaga, José de Alencar e a construção da identidade nacional.',   2),
('00000000-0001-0000-0000-000000000002', 'Realismo e Naturalismo',         'Machado de Assis, Aluísio Azevedo e a crítica social do século XIX.',             3),
('00000000-0001-0000-0000-000000000002', 'Parnasianismo e Simbolismo',     'Olavo Bilac, Cruz e Sousa e a linguagem estética do fim do século XIX.',          4),
('00000000-0001-0000-0000-000000000002', 'Modernismo Brasileiro',          'Semana de 22, Drummond, Clarice Lispector e o Modernismo nas provas do ENEM.',    5),

-- ► LÍNGUA INGLESA
('00000000-0001-0000-0000-000000000003', 'Interpretação de Textos em Inglês',  'Skimming, scanning e inferência de significados pelo contexto.',               1),
('00000000-0001-0000-0000-000000000003', 'Vocabulário e Falsos Cognatos',       'Palavras frequentes no ENEM, falsos amigos e vocabulário temático.',           2),
('00000000-0001-0000-0000-000000000003', 'Tempos Verbais e Estruturas',         'Present, past, future e as estruturas gramaticais cobradas no ENEM.',          3),

-- ► REDAÇÃO ENEM
('00000000-0001-0000-0000-000000000004', 'Estrutura da Redação',           'Introdução, desenvolvimento e conclusão na dissertação argumentativa do ENEM.',   1),
('00000000-0001-0000-0000-000000000004', 'Competências Avaliadas',         'As 5 competências da redação: domínio da norma, coesão, argumentação e proposta.', 2),
('00000000-0001-0000-0000-000000000004', 'Repertório Sociocultural',       'Como usar dados, citações e fatos históricos como argumentos na redação.',        3),
('00000000-0001-0000-0000-000000000004', 'Proposta de Intervenção',        'Como construir uma proposta detalhada, respeitando os direitos humanos.',         4),
('00000000-0001-0000-0000-000000000004', 'Coesão e Conectivos',            'Articuladores textuais, referenciação e progressão temática.',                    5),

-- ► HISTÓRIA
('00000000-0002-0000-0000-000000000001', 'Brasil Colônia',                 'Invasão portuguesa, escravidão, ciclos econômicos e resistência indígena e africana.', 1),
('00000000-0002-0000-0000-000000000001', 'Brasil Império e República Velha', 'Independência, abolição, proclamação da república e coronelismo.',              2),
('00000000-0002-0000-0000-000000000001', 'Era Vargas e República de 1945', 'Getúlio Vargas, Estado Novo, industrialização e democracia populista.',           3),
('00000000-0002-0000-0000-000000000001', 'Ditadura Militar e Redemocratização', 'Golpe de 64, AI-5, resistência, anistia e a Constituição de 1988.',          4),
('00000000-0002-0000-0000-000000000001', 'História Contemporânea Mundial', 'Guerras Mundiais, Guerra Fria, descolonização e globalização.',                   5),

-- ► GEOGRAFIA
('00000000-0002-0000-0000-000000000002', 'Cartografia e Geopolítica',      'Leitura de mapas, fronteiras, conflitos territoriais e organizações internacionais.', 1),
('00000000-0002-0000-0000-000000000002', 'Climatologia e Biomas',          'Tipos climáticos, biomas brasileiros e mudanças climáticas.',                    2),
('00000000-0002-0000-0000-000000000002', 'Urbanização e Êxodo Rural',      'Processo de urbanização no Brasil e no mundo, metrópoles e problemas urbanos.',  3),
('00000000-0002-0000-0000-000000000002', 'Questões Ambientais',            'Desmatamento, recursos hídricos, sustentabilidade e acordos ambientais.',         4),
('00000000-0002-0000-0000-000000000002', 'Globalização e Economia Mundial','Blocos econômicos, divisão internacional do trabalho e geopolítica econômica.',  5),

-- ► FILOSOFIA
('00000000-0002-0000-0000-000000000003', 'Filosofia Antiga',               'Sócrates, Platão e Aristóteles: bases do pensamento ocidental.',                  1),
('00000000-0002-0000-0000-000000000003', 'Filosofia Moderna',              'Descartes, Locke, Rousseau, Kant e o contratualismo.',                           2),
('00000000-0002-0000-0000-000000000003', 'Ética e Política',               'Conceitos de ética, moral, cidadania e justiça no contexto do ENEM.',            3),
('00000000-0002-0000-0000-000000000003', 'Filosofia Contemporânea',        'Marx, Nietzsche, Sartre e os temas da modernidade.',                             4),

-- ► SOCIOLOGIA
('00000000-0002-0000-0000-000000000004', 'Clássicos da Sociologia',        'Durkheim, Max Weber e Karl Marx: os três pilares da sociologia.',                 1),
('00000000-0002-0000-0000-000000000004', 'Movimentos Sociais',             'Feminismo, movimento negro, LGBTQIA+ e direitos civis no Brasil.',               2),
('00000000-0002-0000-0000-000000000004', 'Cultura e Identidade',           'Etnocentrismo, relativismo cultural, indústria cultural e diversidade.',          3),
('00000000-0002-0000-0000-000000000004', 'Trabalho e Capitalismo',         'Divisão do trabalho, alienação, desemprego e relações trabalhistas.',             4),

-- ► BIOLOGIA
('00000000-0003-0000-0000-000000000001', 'Citologia',                      'Estrutura celular, organelas e divisão celular (mitose e meiose).',               1),
('00000000-0003-0000-0000-000000000001', 'Genética',                       'Leis de Mendel, DNA, RNA, síntese proteica e biotecnologia.',                    2),
('00000000-0003-0000-0000-000000000001', 'Evolução',                       'Teorias evolutivas, seleção natural e especiação.',                              3),
('00000000-0003-0000-0000-000000000001', 'Ecologia',                       'Cadeia alimentar, ciclos biogeoquímicos, relações ecológicas e biomas.',          4),
('00000000-0003-0000-0000-000000000001', 'Fisiologia Humana',              'Sistemas digestório, respiratório, circulatório e nervoso no contexto do ENEM.', 5),

-- ► QUÍMICA
('00000000-0003-0000-0000-000000000002', 'Estrutura Atômica e Tabela Periódica', 'Modelos atômicos, propriedades periódicas e ligações químicas.',           1),
('00000000-0003-0000-0000-000000000002', 'Reações Químicas e Estequiometria', 'Balanceamento, cálculo estequiométrico e rendimento de reações.',             2),
('00000000-0003-0000-0000-000000000002', 'Soluções e Concentração',        'Preparo de soluções, molaridade, diluição e mistura.',                          3),
('00000000-0003-0000-0000-000000000002', 'Química Orgânica',               'Funções orgânicas, nomenclatura e reações do cotidiano.',                       4),
('00000000-0003-0000-0000-000000000002', 'Eletroquímica e Radioatividade', 'Pilhas, eletrólise e decaimento radioativo.',                                    5),

-- ► FÍSICA
('00000000-0003-0000-0000-000000000003', 'Cinemática',                     'Movimento uniforme, uniformemente variado, queda livre e lançamento.',            1),
('00000000-0003-0000-0000-000000000003', 'Dinâmica e Leis de Newton',      'Força, massa, aceleração e as três leis de Newton.',                            2),
('00000000-0003-0000-0000-000000000003', 'Energia e Termodinâmica',        'Trabalho, potência, conservação de energia e leis da termodinâmica.',            3),
('00000000-0003-0000-0000-000000000003', 'Ondas e Óptica',                 'Reflexão, refração, difração, som e espectro eletromagnético.',                  4),
('00000000-0003-0000-0000-000000000003', 'Eletricidade e Magnetismo',      'Circuitos elétricos, resistência, potência e campo magnético.',                  5),

-- ► MATEMÁTICA BÁSICA
('00000000-0004-0000-0000-000000000001', 'Números e Operações',            'Conjuntos numéricos, MMC, MDC, potenciação e radiciação.',                      1),
('00000000-0004-0000-0000-000000000001', 'Frações e Decimais',             'Operações com frações, números decimais e conversão entre formas.',              2),
('00000000-0004-0000-0000-000000000001', 'Porcentagem e Juros',            'Cálculo de porcentagem, juros simples e compostos aplicados ao cotidiano.',      3),
('00000000-0004-0000-0000-000000000001', 'Razão e Proporção',              'Regra de três simples e composta, grandezas proporcionais.',                    4),

-- ► ÁLGEBRA E FUNÇÕES
('00000000-0004-0000-0000-000000000002', 'Equações do 1º e 2º Grau',       'Resolução de equações e problemas contextualizados do ENEM.',                   1),
('00000000-0004-0000-0000-000000000002', 'Funções',                        'Função do 1º grau, 2º grau, modular, exponencial e logarítmica.',               2),
('00000000-0004-0000-0000-000000000002', 'Progressões',                    'Progressão aritmética e geométrica: fórmulas e aplicações.',                    3),
('00000000-0004-0000-0000-000000000002', 'Sistemas Lineares',              'Resolução de sistemas por substituição, adição e método gráfico.',              4),

-- ► GEOMETRIA
('00000000-0004-0000-0000-000000000003', 'Geometria Plana',                'Áreas e perímetros de triângulos, quadriláteros e circunferências.',             1),
('00000000-0004-0000-0000-000000000003', 'Geometria Espacial',             'Volume e área de prismas, cilindros, pirâmides, cones e esferas.',              2),
('00000000-0004-0000-0000-000000000003', 'Geometria Analítica',            'Ponto, reta e circunferência no plano cartesiano.',                             3),
('00000000-0004-0000-0000-000000000003', 'Trigonometria',                  'Seno, cosseno, tangente e relações trigonométricas no triângulo retângulo.',     4),

-- ► ESTATÍSTICA E PROBABILIDADE
('00000000-0004-0000-0000-000000000004', 'Leitura de Gráficos e Tabelas',  'Interpretação de dados em gráficos de barras, pizza, linhas e tabelas.',        1),
('00000000-0004-0000-0000-000000000004', 'Medidas de Tendência Central',   'Média, mediana e moda em situações problema do ENEM.',                         2),
('00000000-0004-0000-0000-000000000004', 'Probabilidade',                  'Espaço amostral, eventos e cálculo de probabilidade simples e condicional.',    3),
('00000000-0004-0000-0000-000000000004', 'Análise Combinatória',           'Fatorial, arranjo, permutação e combinação.',                                   4);
