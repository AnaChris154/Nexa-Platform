-- ============================================================
-- NEXA PLATFORM — SEED DE QUESTÕES ENEM
-- Gerado automaticamente por scripts/gerar-sql-seed.ts
-- Cole no Editor SQL do Supabase e execute.
-- ============================================================

-- Garante que a coluna imagem_url existe
ALTER TABLE questoes_enem ADD COLUMN IF NOT EXISTS imagem_url TEXT;

-- Limpa questões anteriores para permitir re-seed com novos campos
TRUNCATE TABLE respostas_pedagogicas_aluno RESTART IDENTITY CASCADE;
TRUNCATE TABLE progresso_subtrilha RESTART IDENTITY CASCADE;
TRUNCATE TABLE exercicios_subtrilha RESTART IDENTITY CASCADE;
TRUNCATE TABLE tags_questao RESTART IDENTITY CASCADE;
DELETE FROM questoes_enem;

-- ── Matemática e suas Tecnologias — 2020 ──────────────────────

-- MAT2020_01
WITH q AS (
  INSERT INTO questoes_enem (ano, enunciado, alternativas, resposta_correta, habilidade_principal_id, dificuldade, tipos_de_erro, conceitos_avaliados, imagem_url)
  VALUES (
    2020,
    'A fabricação da Bandeira Nacional deve obedecer ao descrito na Lei n. 5.700, de 1º de setembro de 1971, que trata dos Símbolos Nacionais. No artigo que se refere às dimensões da Bandeira, observa-se:

"Para cálculos das dimensões, será tomada por base a largura, dividindo-a em 14 (quatorze) partes iguais, sendo que cada uma das partes será considerada uma medida ou módulo (M). Os demais requisitos dimensionais seguem o critério abaixo:
I. Comprimento será de vinte módulos (20 M);
II. A distância dos vértices do losango amarelo ao quadro externo será de um módulo e sete décimos (1,7 M);
III. O raio do círculo azul no meio do losango amarelo será de três módulos e meio (3,5 M)."

A figura indica as cores da bandeira do Brasil e localiza o quadro externo a que se refere a Lei n. 5.700.

Um torcedor, preparando-se para a Copa do Mundo e dispondo de cortes de tecidos verde (180 cm × 150 cm) e amarelo (o quanto baste), deseja confeccionar a maior Bandeira Nacional possível a partir das medidas do tecido verde. Qual a medida, em centímetro, do lado do menor quadrado de tecido azul que deverá ser comprado para confecção do círculo da bandeira desejada?',
    '{"a":"27","b":"32","c":"53","d":"63","e":"90"}'::jsonb,
    'd',
    'MAT_H11',
    'dificil',
    ARRAY['Confundir largura (14M) com comprimento (20M) como base de cálculo', 'Esquecer que o lado do quadrado deve conter o diâmetro (2× raio)', 'Não identificar corretamente qual dimensão limita o tamanho da bandeira'],
    ARRAY['módulo', 'proporcionalidade', 'escala', 'raio e diâmetro'],
    '/questoes/enem/matematica/MAT2020_01.png'
  )
  RETURNING id
)
INSERT INTO exercicios_subtrilha (subtrilha_id, questao_id)
SELECT '1362a8e5-f0bb-4b1c-91b8-df229bcef730', id FROM q;

-- MAT2020_02
WITH q AS (
  INSERT INTO questoes_enem (ano, enunciado, alternativas, resposta_correta, habilidade_principal_id, dificuldade, tipos_de_erro, conceitos_avaliados, imagem_url)
  VALUES (
    2020,
    'Uma empresa de ônibus utiliza um sistema de vendas de passagens que fornece a imagem de todos os assentos do ônibus, diferenciando os assentos já vendidos, por uma cor mais escura, dos assentos ainda disponíveis. A empresa monitora, permanentemente, o número de assentos já vendidos e compara-o com o número total de assentos do ônibus para avaliar a necessidade de alocação de veículos extras.

Na imagem tem-se a informação dos assentos já vendidos e dos ainda disponíveis em um determinado instante. A razão entre o número de assentos já vendidos e o total de assentos desse ônibus, no instante considerado na imagem, é',
    '{"a":"16/42","b":"16/26","c":"26/42","d":"42/26","e":"42/16"}'::jsonb,
    'c',
    'MAT_H24',
    'facil',
    ARRAY['Inverter numerador e denominador da razão', 'Confundir ''assentos vendidos'' com ''assentos disponíveis''', 'Não somar corretamente o total de assentos'],
    ARRAY['razão', 'leitura de imagem', 'fração'],
    '/questoes/enem/matematica/MAT2020_02.png'
  )
  RETURNING id
)
INSERT INTO exercicios_subtrilha (subtrilha_id, questao_id)
SELECT '401bb7fa-73e4-44dc-bc66-895fb6b645e8', id FROM q;

-- MAT2020_03
WITH q AS (
  INSERT INTO questoes_enem (ano, enunciado, alternativas, resposta_correta, habilidade_principal_id, dificuldade, tipos_de_erro, conceitos_avaliados, imagem_url)
  VALUES (
    2020,
    'A caixa-d''água de um edifício terá a forma de um paralelepípedo retângulo reto com volume igual a 28 080 litros. Em uma maquete que representa o edifício, a caixa-d''água tem dimensões 2 cm × 3,51 cm × 4 cm.

Dado: 1 dm³ = 1 L.

A escala usada pelo arquiteto foi',
    '{"a":"1 : 10","b":"1 : 100","c":"1 : 1 000","d":"1 : 10 000","e":"1 : 100 000"}'::jsonb,
    'b',
    'MAT_H11',
    'media',
    ARRAY['Confundir escala linear com escala de volume (k³ vs k)', 'Erro na conversão de litros para cm³', 'Calcular escala de volume em vez de escala linear'],
    ARRAY['escala', 'volume de paralelepípedo', 'conversão de unidades', 'dm³ e litro'],
    NULL
  )
  RETURNING id
)
INSERT INTO exercicios_subtrilha (subtrilha_id, questao_id)
SELECT '1362a8e5-f0bb-4b1c-91b8-df229bcef730', id FROM q;

-- MAT2020_04
WITH q AS (
  INSERT INTO questoes_enem (ano, enunciado, alternativas, resposta_correta, habilidade_principal_id, dificuldade, tipos_de_erro, conceitos_avaliados, imagem_url)
  VALUES (
    2020,
    'Os gráficos representam a produção de peças em uma indústria e as horas trabalhadas dos funcionários no período de cinco dias. Em cada dia, o gerente de produção aplica uma metodologia diferente de trabalho. Seu objetivo é avaliar a metodologia mais eficiente para utilizá-la como modelo nos próximos períodos. Sabe-se que, neste caso, quanto maior for a razão entre o número de peças produzidas e o número de horas trabalhadas, maior será a eficiência da metodologia.

Em qual dia foi aplicada a metodologia mais eficiente?',
    '{"a":"1","b":"2","c":"3","d":"4","e":"5"}'::jsonb,
    'b',
    'MAT_H25',
    'media',
    ARRAY['Considerar apenas a produção sem dividir pelas horas', 'Ler incorretamente os valores do gráfico', 'Confundir maior produção com maior eficiência'],
    ARRAY['leitura de gráfico', 'razão', 'eficiência', 'comparação de valores'],
    '/questoes/enem/matematica/MAT2020_04.png'
  )
  RETURNING id
)
INSERT INTO exercicios_subtrilha (subtrilha_id, questao_id)
SELECT '401bb7fa-73e4-44dc-bc66-895fb6b645e8', id FROM q;

-- MAT2020_05
WITH q AS (
  INSERT INTO questoes_enem (ano, enunciado, alternativas, resposta_correta, habilidade_principal_id, dificuldade, tipos_de_erro, conceitos_avaliados, imagem_url)
  VALUES (
    2020,
    'Um hotel de 3 andares está sendo construído. Cada andar terá 100 quartos. Os quartos serão numerados de 100 a 399 e cada um terá seu número afixado à porta. Cada número será composto por peças individuais, cada uma simbolizando um único algarismo.

Qual a quantidade mínima de peças, simbolizando o algarismo 2, necessárias para identificar o número de todos os quartos?',
    '{"a":"160","b":"157","c":"130","d":"120","e":"60"}'::jsonb,
    'a',
    'MAT_H19',
    'media',
    ARRAY['Não considerar o algarismo 2 nas centenas (200-299: 100 ocorrências na centena + dezenas e unidades)', 'Contar apenas dezenas ou apenas unidades', 'Esquecer de somar as ocorrências em diferentes posições'],
    ARRAY['contagem', 'algarismos', 'análise de casos', 'organização sistemática'],
    NULL
  )
  RETURNING id
)
INSERT INTO exercicios_subtrilha (subtrilha_id, questao_id)
SELECT '7311750d-fabe-4f85-90e3-a782ca3e757b', id FROM q;

-- MAT2020_06
WITH q AS (
  INSERT INTO questoes_enem (ano, enunciado, alternativas, resposta_correta, habilidade_principal_id, dificuldade, tipos_de_erro, conceitos_avaliados, imagem_url)
  VALUES (
    2020,
    'O Estatuto do Idoso, no Brasil, prevê certos direitos às pessoas com idade avançada, concedendo a estas, entre outros benefícios, a restituição de imposto de renda antes dos demais contribuintes. A tabela informa os nomes e as idades de 12 idosos que aguardam suas restituições de imposto de renda. Considere que, entre os idosos, a restituição seja concedida em ordem decrescente de idade e que, em subgrupos de pessoas com a mesma idade, a ordem seja decidida por sorteio.

Nessas condições, a probabilidade de João ser a sétima pessoa do grupo a receber sua restituição é igual a',
    '{"a":"1/12","b":"7/12","c":"1/8","d":"5/6","e":"1/4"}'::jsonb,
    'e',
    'MAT_H28',
    'dificil',
    ARRAY['Não identificar quantas pessoas estão no mesmo grupo de idade que João', 'Confundir probabilidade de ser o 7º com probabilidade de estar entre os 7 primeiros', 'Calcular 1/12 sem considerar o agrupamento por idade'],
    ARRAY['probabilidade', 'espaço amostral', 'ordenação', 'subgrupos igualitários'],
    '/questoes/enem/matematica/MAT2020_06.png'
  )
  RETURNING id
)
INSERT INTO exercicios_subtrilha (subtrilha_id, questao_id)
SELECT '401bb7fa-73e4-44dc-bc66-895fb6b645e8', id FROM q;

-- MAT2020_07
WITH q AS (
  INSERT INTO questoes_enem (ano, enunciado, alternativas, resposta_correta, habilidade_principal_id, dificuldade, tipos_de_erro, conceitos_avaliados, imagem_url)
  VALUES (
    2020,
    'Uma torneira está gotejando água em um balde com capacidade de 18 litros. No instante atual, o balde se encontra com ocupação de 50% de sua capacidade. A cada segundo caem 5 gotas de água da torneira, e uma gota é formada, em média, por 5 × 10⁻² mL de água.

Quanto tempo, em hora, será necessário para encher completamente o balde, partindo do instante atual?',
    '{"a":"2 × 10¹","b":"1 × 10¹","c":"2 × 10⁻²","d":"1 × 10⁻²","e":"1 × 10⁻³"}'::jsonb,
    'b',
    'MAT_H03',
    'media',
    ARRAY['Não converter mL para L corretamente', 'Esquecer de converter segundos para horas', 'Calcular para encher o balde inteiro sem descontar os 50% já preenchidos'],
    ARRAY['notação científica', 'taxa de variação', 'conversão de unidades', 'porcentagem'],
    NULL
  )
  RETURNING id
)
INSERT INTO exercicios_subtrilha (subtrilha_id, questao_id)
SELECT '17462967-5230-43e5-830a-975408d5d5c4', id FROM q;

-- MAT2020_08
WITH q AS (
  INSERT INTO questoes_enem (ano, enunciado, alternativas, resposta_correta, habilidade_principal_id, dificuldade, tipos_de_erro, conceitos_avaliados, imagem_url)
  VALUES (
    2020,
    'Um clube deseja produzir miniaturas em escala do troféu que ganhou no último campeonato. O troféu está representado na Figura 1 e é composto por uma base em formato de paralelepípedo reto-retângulo de madeira, sobre a qual estão fixadas três hastes verticais que sustentam uma esfera de 30 cm de diâmetro, que fica centralizada sobre a base de madeira. O troféu tem 100 cm de altura, incluída sua base.

A miniatura desse troféu deverá ser instalada no interior de uma caixa de vidro, em formato de paralelepípedo reto-retângulo, cujas dimensões internas de sua base estão indicadas na Figura 2, de modo que a base do troféu seja colada na base da caixa e distante das paredes laterais da caixa de vidro em pelo menos 1 cm. Deve ainda haver uma distância de exatos 2 cm entre o topo da esfera e a tampa dessa caixa de vidro. Nessas condições deseja-se fazer a maior miniatura possível.

A medida da altura, em centímetro, dessa caixa de vidro deverá ser igual a',
    '{"a":"12","b":"14","c":"16","d":"18","e":"20"}'::jsonb,
    'a',
    'MAT_H12',
    'dificil',
    ARRAY['Não considerar a restrição dos 1 cm das paredes para calcular a escala', 'Calcular a escala pela altura sem verificar se a base cabe na caixa', 'Esquecer de somar os 2 cm entre a esfera e a tampa na altura final'],
    ARRAY['escala', 'proporção', 'geometria espacial', 'restrições de medida'],
    '/questoes/enem/matematica/MAT2020_08.png'
  )
  RETURNING id
)
INSERT INTO exercicios_subtrilha (subtrilha_id, questao_id)
SELECT '1362a8e5-f0bb-4b1c-91b8-df229bcef730', id FROM q;

-- MAT2020_09
WITH q AS (
  INSERT INTO questoes_enem (ano, enunciado, alternativas, resposta_correta, habilidade_principal_id, dificuldade, tipos_de_erro, conceitos_avaliados, imagem_url)
  VALUES (
    2020,
    'Muitos modelos atuais de veículos possuem computador de bordo. Os computadores informam em uma tela diversas variações de grandezas associadas ao desempenho do carro, dentre elas o consumo médio de combustível. Um veículo, de um determinado modelo, pode vir munido de um dos dois tipos de computadores de bordo:
• Tipo A: informa a quantidade X de litro de combustível gasto para percorrer 100 quilômetros;
• Tipo B: informa a quantidade de quilômetro que o veículo é capaz de percorrer com um litro de combustível.

Um veículo utiliza o computador do Tipo A, e ao final de uma viagem o condutor viu apresentada na tela a informação "X/100". Caso o seu veículo utilizasse o computador do Tipo B, o valor informado na tela seria obtido pela operação',
    '{"a":"X · 100","b":"X / 100","c":"100 / X","d":"1 / X","e":"1 · X"}'::jsonb,
    'c',
    'MAT_H15',
    'media',
    ARRAY['Multiplicar em vez de dividir ao inverter a relação', 'Não perceber que as grandezas são inversamente proporcionais', 'Confundir X litros/100km com km/litro'],
    ARRAY['grandezas inversamente proporcionais', 'interpretação de variáveis', 'relação entre grandezas'],
    NULL
  )
  RETURNING id
)
INSERT INTO exercicios_subtrilha (subtrilha_id, questao_id)
SELECT '7311750d-fabe-4f85-90e3-a782ca3e757b', id FROM q;

-- MAT2020_10
WITH q AS (
  INSERT INTO questoes_enem (ano, enunciado, alternativas, resposta_correta, habilidade_principal_id, dificuldade, tipos_de_erro, conceitos_avaliados, imagem_url)
  VALUES (
    2020,
    'Uma das Sete Maravilhas do Mundo Moderno é o Templo de Kukulkán, localizado na cidade de Chichén Itzá, no México. Geometricamente, esse templo pode ser representado por um tronco reto de pirâmide de base quadrada.

As quantidades de cada tipo de figura plana que formam esse tronco de pirâmide são',
    '{"a":"2 quadrados e 4 retângulos.","b":"1 retângulo e 4 triângulos isósceles.","c":"2 quadrados e 4 trapézios isósceles.","d":"1 quadrado, 3 retângulos e 2 trapézios retângulos.","e":"2 retângulos, 2 quadrados e 2 trapézios retângulos."}'::jsonb,
    'c',
    'MAT_H07',
    'facil',
    ARRAY['Confundir tronco de pirâmide com pirâmide completa (que teria triângulos)', 'Não identificar que as faces laterais de um tronco de pirâmide são trapézios', 'Confundir base quadrada com base retangular'],
    ARRAY['tronco de pirâmide', 'figuras planas', 'geometria espacial', 'faces de sólidos'],
    NULL
  )
  RETURNING id
)
INSERT INTO exercicios_subtrilha (subtrilha_id, questao_id)
SELECT '6e04e7c4-0d34-490d-b099-7ab246843385', id FROM q;

-- MAT2020_11
WITH q AS (
  INSERT INTO questoes_enem (ano, enunciado, alternativas, resposta_correta, habilidade_principal_id, dificuldade, tipos_de_erro, conceitos_avaliados, imagem_url)
  VALUES (
    2020,
    'Para chegar à universidade, um estudante utiliza um metrô e, depois, tem duas opções:
• seguir num ônibus, percorrendo 2,0 km;
• alugar uma bicicleta, ao lado da estação do metrô, seguindo 3,0 km pela ciclovia.

O quadro fornece as velocidades médias do ônibus e da bicicleta, em km/h, no trajeto metrô−universidade.

A fim de poupar tempo no deslocamento para a universidade, em quais dias o aluno deve seguir pela ciclovia?',
    '{"a":"Às segundas, quintas e sextas-feiras.","b":"Às terças e quintas-feiras e aos sábados.","c":"Às segundas, quartas e sextas-feiras.","d":"Às terças, quartas e sextas-feiras.","e":"Às terças e quartas-feiras e aos sábados."}'::jsonb,
    'd',
    'MAT_H16',
    'media',
    ARRAY['Comparar diretamente as velocidades sem considerar as distâncias diferentes', 'Inverter a relação tempo = distância/velocidade', 'Ler incorretamente os valores da tabela'],
    ARRAY['velocidade, espaço e tempo', 'comparação de razões', 'leitura de tabela'],
    '/questoes/enem/matematica/MAT2020_11.png'
  )
  RETURNING id
)
INSERT INTO exercicios_subtrilha (subtrilha_id, questao_id)
SELECT '1362a8e5-f0bb-4b1c-91b8-df229bcef730', id FROM q;

-- MAT2020_12
WITH q AS (
  INSERT INTO questoes_enem (ano, enunciado, alternativas, resposta_correta, habilidade_principal_id, dificuldade, tipos_de_erro, conceitos_avaliados, imagem_url)
  VALUES (
    2020,
    'O artista gráfico holandês Maurits Cornelius Escher criou belíssimas obras nas quais as imagens se repetiam, com diferentes tamanhos, induzindo ao raciocínio de repetição infinita das imagens. Inspirado por ele, um artista fez um rascunho de uma obra na qual propunha a ideia de construção de uma sequência de infinitos quadrados, cada vez menores, uns sob os outros, conforme indicado na figura.

O quadrado PRST, com lado de medida 1, é o ponto de partida. O segundo quadrado é construído sob ele tomando-se o ponto médio da base do quadrado anterior e criando-se um novo quadrado, cujo lado corresponde à metade dessa base. Essa sequência de construção se repete recursivamente.

Qual é a medida do lado do centésimo quadrado construído de acordo com esse padrão?',
    '{"a":"(1/2)^100","b":"(1/2)^99","c":"(1/2)^97","d":"(1/2)^98","e":"(1/2)^99"}'::jsonb,
    'd',
    'MAT_H19',
    'dificil',
    ARRAY['Confundir o índice: o 1º quadrado tem lado 1 = (1/2)^0, então o n-ésimo tem (1/2)^(n-1)', 'Usar (1/2)^100 em vez de (1/2)^99 por contar o quadrado inicial errado', 'Não identificar a razão da progressão geométrica'],
    ARRAY['progressão geométrica', 'padrão sequencial', 'potenciação', 'razão geométrica'],
    '/questoes/enem/matematica/MAT2020_12.png'
  )
  RETURNING id
)
INSERT INTO exercicios_subtrilha (subtrilha_id, questao_id)
SELECT '7311750d-fabe-4f85-90e3-a782ca3e757b', id FROM q;

-- MAT2020_13
WITH q AS (
  INSERT INTO questoes_enem (ano, enunciado, alternativas, resposta_correta, habilidade_principal_id, dificuldade, tipos_de_erro, conceitos_avaliados, imagem_url)
  VALUES (
    2020,
    'Amigo secreto é uma brincadeira tradicional nas festas de fim de ano. Um grupo de amigos se reúne e cada um deles sorteia o nome da pessoa que irá presentear. No dia da troca de presentes, uma primeira pessoa presenteia seu amigo secreto. Em seguida, o presenteado revela seu amigo secreto e o presenteia. A brincadeira continua até que todos sejam presenteados, mesmo no caso em que o ciclo se fecha. Dez funcionários de uma empresa, entre eles um casal, participarão de um amigo secreto. A primeira pessoa a revelar será definida por sorteio.

Qual é a probabilidade de que a primeira pessoa a revelar o seu amigo secreto e a última presenteada sejam as duas pessoas do casal?',
    '{"a":"1/5","b":"1/45","c":"1/50","d":"1/90","e":"1/100"}'::jsonb,
    'c',
    'MAT_H29',
    'dificil',
    ARRAY['Não considerar as duas possibilidades do casal (ele primeiro ou ela primeiro)', 'Calcular apenas 1/10 × 1/9 sem considerar a estrutura da brincadeira', 'Confundir o evento ''última presenteada'' com ''último a revelar'''],
    ARRAY['probabilidade', 'análise combinatória', 'espaço amostral', 'eventos compostos'],
    NULL
  )
  RETURNING id
)
INSERT INTO exercicios_subtrilha (subtrilha_id, questao_id)
SELECT '401bb7fa-73e4-44dc-bc66-895fb6b645e8', id FROM q;

-- MAT2020_14
WITH q AS (
  INSERT INTO questoes_enem (ano, enunciado, alternativas, resposta_correta, habilidade_principal_id, dificuldade, tipos_de_erro, conceitos_avaliados, imagem_url)
  VALUES (
    2020,
    'Um motociclista planeja realizar uma viagem cujo destino fica a 500 km de sua casa. Sua moto consome 5 litros de gasolina para cada 100 km rodados, e o tanque da moto tem capacidade para 22 litros. Pelo mapa, observou que no trajeto da viagem o último posto disponível para reabastecimento, chamado Estrela, fica a 80 km do seu destino. Ele pretende partir com o tanque da moto cheio e planeja fazer somente duas paradas para reabastecimento, uma na ida e outra na volta, ambas no posto Estrela. No reabastecimento para a viagem de ida, deve considerar também combustível suficiente para se deslocar por 200 km no seu destino.

A quantidade mínima de combustível, em litro, que esse motociclista deve reabastecer no posto Estrela na viagem de ida, que seja suficiente para fazer o segundo reabastecimento, é',
    '{"a":"13","b":"14","c":"17","d":"18","e":"21"}'::jsonb,
    'a',
    'MAT_H03',
    'media',
    ARRAY['Calcular o consumo total da viagem sem descontar o combustível que sobra ao chegar em Estrela', 'Não considerar que o tanque tem capacidade máxima de 22L', 'Somar os 200 km de deslocamento no destino antes de calcular o que sobra no tanque'],
    ARRAY['consumo e distância', 'regra de três', 'planejamento com restrições', 'otimização'],
    NULL
  )
  RETURNING id
)
INSERT INTO exercicios_subtrilha (subtrilha_id, questao_id)
SELECT '17462967-5230-43e5-830a-975408d5d5c4', id FROM q;
