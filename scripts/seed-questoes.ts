/**
 * Seed: Importar questões do JSON para o Supabase
 *
 * Como executar:
 *   npx tsx scripts/seed-questoes.ts
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Carrega o .env.local automaticamente
config({ path: join(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || SUPABASE_SERVICE_KEY === 'COLE_SUA_SERVICE_ROLE_KEY_AQUI') {
  console.error('\n❌ Erro: variáveis de ambiente não configuradas.');
  console.error('   Abra o .env.local e preencha SUPABASE_SERVICE_ROLE_KEY.');
  console.error('   Encontre a chave em: Supabase Dashboard → Settings → API → service_role\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ──────────────────────────────────────────────
// Mapa: subtrilha_titulo → subtrilha_id no banco
// Execute SELECT id, titulo FROM subtrilhas; no Supabase
// e cole os IDs reais abaixo:
// ──────────────────────────────────────────────
const SUBTRILHA_MAP: Record<string, string> = {
  'Números e Operações':              '17462967-5230-43e5-830a-975408d5d5c4',
  'Geometria e Formas':               '6e04e7c4-0d34-490d-b099-7ab246843385',
  'Grandezas, Medidas e Escalas':     '1362a8e5-f0bb-4b1c-91b8-df229bcef730',
  'Funções, Álgebra e Proporcionalidade': '7311750d-fabe-4f85-90e3-a782ca3e757b',
  'Estatística e Probabilidade':      '401bb7fa-73e4-44dc-bc66-895fb6b645e8',
};

interface QuestaoJSON {
  id: string;
  ano: number;
  area: string;
  subtrilha: string;
  habilidade_principal: string;
  habilidades_secundarias: string[];
  dificuldade: string;
  eixo_cognitivo: string;
  tem_imagem: boolean;
  imagem: string | null;
  enunciado: string;
  alternativas: { letra: string; texto: string }[];
  gabarito: string;
  conceitos_avaliados: string[];
  tipos_de_erro_comuns: string[];
}

async function seedQuestoes(jsonPath: string) {
  console.log(`\n📂 Lendo arquivo: ${jsonPath}`);
  const raw = readFileSync(jsonPath, 'utf-8');
  const { questoes, metadados }: { questoes: QuestaoJSON[]; metadados: any } = JSON.parse(raw);

  console.log(`📋 ${metadados.area} — ${metadados.ano} — ${questoes.length} questões`);

  let inseridas = 0;
  let erros = 0;

  for (const q of questoes) {
    const subtrilhaId = SUBTRILHA_MAP[q.subtrilha];

    if (!subtrilhaId || subtrilhaId === 'COLE_O_UUID_AQUI') {
      console.warn(`  ⚠️  Subtrilha não mapeada: "${q.subtrilha}" — questão ${q.id} pulada`);
      erros++;
      continue;
    }

    // Formata alternativas para o formato do banco { a: "...", b: "...", ... }
    const alternativas = q.alternativas.reduce((acc, alt) => {
      acc[alt.letra.toLowerCase()] = alt.texto;
      return acc;
    }, {} as Record<string, string>);

    // 1. Insere a questão principal
    const { data: questaoData, error: questaoError } = await supabase
      .from('questoes_enem')
      .upsert({
        ano: q.ano,
        enunciado: q.enunciado,
        alternativas,
        resposta_correta: q.gabarito.toLowerCase(),
        habilidade_principal_id: q.habilidade_principal,
        dificuldade: q.dificuldade,
        tipos_de_erro: q.tipos_de_erro_comuns,
        conceitos_avaliados: q.conceitos_avaliados,
      })
      .select('id')
      .single();

    if (questaoError || !questaoData) {
      console.error(`  ❌ Erro ao inserir ${q.id}:`, questaoError?.message);
      erros++;
      continue;
    }

    const questaoId = questaoData.id;

    // 2. Tags da questão (habilidades secundárias + conceitos)
    const tags = [
      q.habilidade_principal,
      ...q.habilidades_secundarias,
      ...q.conceitos_avaliados,
      q.eixo_cognitivo,
      q.dificuldade,
      String(q.ano),
    ];

    const tagsPayload = tags.map((tag) => ({ questao_id: questaoId, tag_name: tag }));

    await supabase
      .from('tags_questao')
      .upsert(tagsPayload, { onConflict: 'questao_id,tag_name' });

    // 3. Vincula questão à subtrilha
    const { error: exError } = await supabase
      .from('exercicios_subtrilha')
      .upsert(
        { subtrilha_id: subtrilhaId, questao_id: questaoId },
        { onConflict: 'subtrilha_id,questao_id' }
      );

    if (exError) {
      console.warn(`  ⚠️  Erro ao vincular ${q.id} à subtrilha:`, exError.message);
    }

    console.log(`  ✅ ${q.id} — ${q.subtrilha}`);
    inseridas++;
  }

  console.log(`\n📊 Resultado: ${inseridas} inseridas | ${erros} erros/puladas`);
}

function findJsons(dir: string): string[] {
  const entries = readdirSync(dir, { withFileTypes: true });
  const results: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findJsons(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      results.push(fullPath);
    }
  }
  return results;
}

async function main() {
  const baseDir = join(process.cwd(), 'questoes', 'enem');
  const arquivos = findJsons(baseDir);

  if (arquivos.length === 0) {
    console.error('❌ Nenhum arquivo .json encontrado em questoes/enem/');
    process.exit(1);
  }

  for (const arquivo of arquivos) {
    await seedQuestoes(arquivo);
  }

  console.log('\n✅ Seed concluído!');
}

main().catch(console.error);
