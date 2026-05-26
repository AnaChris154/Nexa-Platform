/**
 * Gera `scriptsSQL/SQL_SEED_QUESTOES.sql` a partir dos JSONs de questões.
 * Execute: npx tsx scripts/gerar-sql-seed.ts
 * Depois cole o SQL gerado no Editor SQL do Supabase.
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const SUBTRILHA_MAP: Record<string, string> = {
  'Números e Operações':                  '17462967-5230-43e5-830a-975408d5d5c4',
  'Geometria e Formas':                   '6e04e7c4-0d34-490d-b099-7ab246843385',
  'Grandezas, Medidas e Escalas':         '1362a8e5-f0bb-4b1c-91b8-df229bcef730',
  'Funções, Álgebra e Proporcionalidade': '7311750d-fabe-4f85-90e3-a782ca3e757b',
  'Estatística e Probabilidade':          '401bb7fa-73e4-44dc-bc66-895fb6b645e8',
};

const esc = (s: string) => s.replace(/'/g, "''");

function findJsons(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const results: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findJsons(fullPath));
    else if (entry.isFile() && entry.name.endsWith('.json')) results.push(fullPath);
  }
  return results;
}

interface QuestaoJSON {
  id: string;
  ano: number;
  subtrilha: string;
  habilidade_principal: string;
  habilidades_secundarias: string[];
  dificuldade: string;
  eixo_cognitivo: string;
  enunciado: string;
  alternativas: { letra: string; texto: string }[];
  gabarito: string;
  conceitos_avaliados: string[];
  tipos_de_erro_comuns: string[];
}

const baseDir = join(process.cwd(), 'questoes', 'enem');
const arquivos = findJsons(baseDir);

let sql = `-- ============================================================
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

`;

for (const arquivo of arquivos) {
  const raw = readFileSync(arquivo, 'utf-8');
  const { questoes, metadados } = JSON.parse(raw) as { questoes: QuestaoJSON[]; metadados: { area: string; ano: number } };

  sql += `-- ── ${metadados.area} — ${metadados.ano} ──────────────────────\n`;

  for (const q of questoes) {
    const subtrilhaId = SUBTRILHA_MAP[q.subtrilha];
    if (!subtrilhaId) {
      console.warn(`⚠️  Subtrilha não mapeada: "${q.subtrilha}" — ${q.id} pulada`);
      continue;
    }

    const alts = q.alternativas.reduce((a: Record<string, string>, x) => {
      a[x.letra.toLowerCase()] = x.texto;
      return a;
    }, {});

    const DIFICULDADE_MAP: Record<string, string> = {
      facil:   'facil',
      medio:   'media',
      médio:   'media',
      media:   'media',
      dificil: 'dificil',
      difícil: 'dificil',
    };

    const altsJson    = esc(JSON.stringify(alts));
    // Converte caminho relativo → URL pública do Next.js
    const imagemUrl = q.imagem
      ? `/questoes/enem/matematica/${(q.imagem as string).split('/').pop()}`
      : null;
    const imagemSql = imagemUrl ? `'${imagemUrl}'` : 'NULL';
    // text[] usa ARRAY['...','...'] no SQL
    const toArray = (arr: string[]) =>
      'ARRAY[' + arr.map((s) => `'${esc(s)}'`).join(', ') + ']';
    const conceitos   = toArray(q.conceitos_avaliados);
    const erros       = toArray(q.tipos_de_erro_comuns);
    const enunciado   = esc(q.enunciado);

    // Deterministic UUID baseado no ID da questão para idempotência
    sql += `
-- ${q.id}
WITH q AS (
  INSERT INTO questoes_enem (ano, enunciado, alternativas, resposta_correta, habilidade_principal_id, dificuldade, tipos_de_erro, conceitos_avaliados, imagem_url)
  VALUES (
    ${q.ano},
    '${enunciado}',
    '${altsJson}'::jsonb,
    '${q.gabarito.toLowerCase()}',
    '${q.habilidade_principal}',
    '${DIFICULDADE_MAP[q.dificuldade] ?? q.dificuldade}',
    ${erros},
    ${conceitos},
    ${imagemSql}
  )
  RETURNING id
)
INSERT INTO exercicios_subtrilha (subtrilha_id, questao_id)
SELECT '${subtrilhaId}', id FROM q;
`;
  }
}

const outPath = join(process.cwd(), 'scriptsSQL', 'SQL_SEED_QUESTOES.sql');
writeFileSync(outPath, sql, 'utf-8');
console.log(`✅ Gerado: scriptsSQL/SQL_SEED_QUESTOES.sql`);
console.log(`   Cole o conteúdo no Editor SQL do Supabase e execute.`);
