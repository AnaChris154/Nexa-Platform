/**
 * Testes do fluxo de geração de plano de estudo com IA
 *
 * Cenários testados:
 *  1. Sem trilhas no banco → fallback por matéria
 *  2. Com trilhas válidas no banco → IA recomenda trilhas reais
 *  3. IA alucina trilha_ids → filtra inválidos e usa fallback
 *  4. (Integração real) Chama a rota /api/ai/analisar-diagnostico
 *
 * Para rodar: pnpm test
 * Para rodar apenas integração real: pnpm test -- --testNamePattern="integração"
 */

import type { HabilidadeResultado } from '@/services/diagnosticoService';
import type { DiagnosticoNivel } from '@/services/diagnosticoService';

// ─── Dados de exemplo ────────────────────────────────────────────────────────

const DIAGNOSTICO_MOCK: DiagnosticoNivel = {
  matematica: 'baixo',
  portugues: 'medio',
  historia: 'alto',
};

const POR_HABILIDADE_MOCK: HabilidadeResultado[] = [
  { habilidade_id: 'MAT_OPE_001', area: 'Operações', materia: 'matematica', acertos: 1, total: 5, taxa_acerto: 20, respostas_abertas: [] },
  { habilidade_id: 'PORT_LIT_001', area: 'Literatura', materia: 'portugues', acertos: 3, total: 5, taxa_acerto: 60, respostas_abertas: [] },
  { habilidade_id: 'HIS_001', area: 'História Geral', materia: 'historia', acertos: 5, total: 5, taxa_acerto: 100, respostas_abertas: [] },
];

const TRILHAS_VALIDAS = [
  { id: 'trilha-uuid-001', titulo: 'Matemática Básica', habilidade_id: null },
  { id: 'trilha-uuid-002', titulo: 'Interpretação de Texto', habilidade_id: null },
];

// ─── Mock do Supabase ─────────────────────────────────────────────────────────

// Fábrica que cria um mock de supabase configurável por teste
function criarSupabaseMock({
  subtrilhas = [] as any[],
  trilhas = [] as any[],
  deleteError = null as any,
  insertError = null as any,
  insertData = [] as any[],
} = {}) {
  const insertMock = jest.fn().mockReturnValue({
    select: jest.fn().mockResolvedValue({ data: insertError ? null : insertData, error: insertError }),
  });

  const fromMock = jest.fn((table: string) => {
    if (table === 'subtrilhas') {
      return { select: jest.fn().mockResolvedValue({ data: subtrilhas, error: null }) };
    }
    if (table === 'trilhas') {
      return { select: jest.fn().mockReturnValue({ in: jest.fn().mockResolvedValue({ data: trilhas, error: null }) }) };
    }
    if (table === 'study_plans') {
      return {
        delete: jest.fn().mockReturnValue({ eq: jest.fn().mockResolvedValue({ error: deleteError }) }),
        insert: insertMock,
      };
    }
    return {};
  });

  return { from: fromMock };
}

// ─── Cenário 1: Sem trilhas no banco ─────────────────────────────────────────

describe('gerarPlanoEstudoComIA', () => {
  beforeEach(() => jest.resetModules());

  test('Cenário 1 — sem trilhas no banco: usa fallback por matéria', async () => {
    const insertData = Object.keys(DIAGNOSTICO_MOCK).map((m, i) => ({
      id: `plan-${i}`, user_id: 'user-123', materia: m,
      nivel: DIAGNOSTICO_MOCK[m as keyof typeof DIAGNOSTICO_MOCK],
      prioridade: 'media', habilidade_id: null, trilha_id: null,
      motivo_ia: 'Boa sorte!', ordem_recomendacao: i + 1,
      gerado_por_ia: true, origem: 'diagnostico_ia_sem_trilhas',
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }));

    // Mock do módulo supabaseClient
    jest.mock('@/lib/supabaseClient', () => ({
      supabase: criarSupabaseMock({ subtrilhas: [], trilhas: [], insertData }),
    }));

    // Mock do fetch (endpoint IA)
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        habilidades_prioritarias: ['MAT_OPE_001'],
        trilhas_recomendadas: [],
        mensagem_motivacional: 'Você consegue, bora estudar! 🚀',
      }),
    }) as any;

    const { gerarPlanoEstudoComIA } = await import('@/services/studyPlanService');
    const result = await gerarPlanoEstudoComIA('user-123', DIAGNOSTICO_MOCK, POR_HABILIDADE_MOCK);

    expect(result.error).toBeNull();
    expect(result.mensagem_motivacional).toBe('Você consegue, bora estudar! 🚀');
    expect(result.plano).toHaveLength(3); // uma entrada por matéria
    expect(result.plano?.every(p => p.trilha_id === null)).toBe(true);
    expect(result.plano?.every(p => p.origem === 'diagnostico_ia_sem_trilhas')).toBe(true);

    console.log('✅ Cenário 1 passou — plano gerado por fallback:');
    result.plano?.forEach(p => console.log(`   ${p.materia} → ${p.nivel} | prioridade: ${p.prioridade}`));
  });

  // ─── Cenário 2: Com trilhas válidas ────────────────────────────────────────

  test('Cenário 2 — com trilhas válidas: IA recomenda trilhas reais', async () => {
    const subtrilhas = TRILHAS_VALIDAS.map(t => ({ trilha_id: t.id, habilidade_id: null }));

    const insertData = TRILHAS_VALIDAS.map((t, i) => ({
      id: `plan-${i}`, user_id: 'user-123', materia: 'matematica',
      nivel: 'baixo', prioridade: 'alta',
      habilidade_id: null, trilha_id: t.id,
      motivo_ia: 'Vamos nessa!', ordem_recomendacao: i + 1,
      gerado_por_ia: true, origem: 'diagnostico_ia',
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }));

    jest.mock('@/lib/supabaseClient', () => ({
      supabase: criarSupabaseMock({ subtrilhas, trilhas: TRILHAS_VALIDAS, insertData }),
    }));

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        habilidades_prioritarias: ['MAT_OPE_001'],
        trilhas_recomendadas: [
          { trilha_id: 'trilha-uuid-001', habilidade_id: 'MAT_OPE_001', motivo: 'Matemática precisa de atenção!', prioridade: 1 },
          { trilha_id: 'trilha-uuid-002', habilidade_id: 'PORT_LIT_001', motivo: 'Leitura nunca é demais!', prioridade: 2 },
        ],
        mensagem_motivacional: 'Continue firme, você tá indo bem! 💪',
      }),
    }) as any;

    const { gerarPlanoEstudoComIA } = await import('@/services/studyPlanService');
    const result = await gerarPlanoEstudoComIA('user-123', DIAGNOSTICO_MOCK, POR_HABILIDADE_MOCK);

    expect(result.error).toBeNull();
    expect(result.plano).toHaveLength(2);
    expect(result.plano?.every(p => p.origem === 'diagnostico_ia')).toBe(true);
    expect(result.plano?.map(p => p.trilha_id)).toEqual(['trilha-uuid-001', 'trilha-uuid-002']);

    console.log('✅ Cenário 2 passou — trilhas recomendadas pela IA:');
    result.plano?.forEach(p => console.log(`   trilha: ${p.trilha_id} | motivo: ${p.motivo_ia}`));
  });

  // ─── Cenário 3: IA alucina trilha_ids ──────────────────────────────────────

  test('Cenário 3 — IA alucina trilha_ids: filtra e usa fallback', async () => {
    const subtrilhas = TRILHAS_VALIDAS.map(t => ({ trilha_id: t.id, habilidade_id: null }));

    const fallbackData = Object.keys(DIAGNOSTICO_MOCK).map((m, i) => ({
      id: `plan-${i}`, user_id: 'user-123', materia: m,
      nivel: DIAGNOSTICO_MOCK[m as keyof typeof DIAGNOSTICO_MOCK],
      prioridade: 'media', habilidade_id: null, trilha_id: null,
      motivo_ia: null, ordem_recomendacao: i + 1,
      gerado_por_ia: true, origem: 'diagnostico_ia_fallback',
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }));

    jest.mock('@/lib/supabaseClient', () => ({
      supabase: criarSupabaseMock({ subtrilhas, trilhas: TRILHAS_VALIDAS, insertData: fallbackData }),
    }));

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        habilidades_prioritarias: ['MAT_OPE_001'],
        trilhas_recomendadas: [
          // IDs inventados pela IA — não existem no banco
          { trilha_id: 'MAT_PROP_1', habilidade_id: 'MAT_PROP', motivo: 'Vamos entender prop!', prioridade: 1 },
          { trilha_id: 'CH_HIS_1',   habilidade_id: 'CH_HIS',   motivo: 'História é divertida!', prioridade: 2 },
        ],
        mensagem_motivacional: 'Você tá mandando bem! 🎯',
      }),
    }) as any;

    const { gerarPlanoEstudoComIA } = await import('@/services/studyPlanService');
    const result = await gerarPlanoEstudoComIA('user-123', DIAGNOSTICO_MOCK, POR_HABILIDADE_MOCK);

    expect(result.error).toBeNull();
    // IDs inválidos foram filtrados → caiu no fallback por matéria
    expect(result.plano?.every(p => p.trilha_id === null)).toBe(true);
    expect(result.plano).toHaveLength(3);

    console.log('✅ Cenário 3 passou — IDs alucinados filtrados, fallback aplicado');
  });
});

// ─── Cenário 4: Integração real com o endpoint ────────────────────────────────

describe('Integração real com /api/ai/analisar-diagnostico', () => {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  test('integração — chama endpoint real e retorna JSON válido', async () => {
    // Pula se servidor não estiver rodando
    let serverOn = false;
    try {
      const ping = await fetch(`${SITE_URL}/api/ai/analisar-diagnostico`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ porHabilidade: [], trilhasDisponiveis: [] }) });
      serverOn = ping.status !== undefined;
    } catch {
      serverOn = false;
    }

    if (!serverOn) {
      console.warn(`⚠️  Servidor não encontrado em ${SITE_URL}. Suba o dev server para este teste.`);
      return;
    }

    const res = await fetch(`${SITE_URL}/api/ai/analisar-diagnostico`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        porHabilidade: POR_HABILIDADE_MOCK,
        trilhasDisponiveis: TRILHAS_VALIDAS,
      }),
    });

    expect(res.ok).toBe(true);

    const json = await res.json();

    expect(json).toHaveProperty('trilhas_recomendadas');
    expect(json).toHaveProperty('mensagem_motivacional');
    expect(json).toHaveProperty('habilidades_prioritarias');
    expect(typeof json.mensagem_motivacional).toBe('string');
    expect(Array.isArray(json.trilhas_recomendadas)).toBe(true);

    console.log('\n🤖 Resposta real da IA:');
    console.log('   Mensagem:', json.mensagem_motivacional);
    console.log('   Habilidades prioritárias:', json.habilidades_prioritarias);
    console.log('   Trilhas recomendadas:');
    json.trilhas_recomendadas.forEach((t: any) => {
      console.log(`     - ${t.trilha_id} | prioridade ${t.prioridade}: ${t.motivo}`);
    });
  }, 30000); // timeout de 30s para a chamada real da IA
});
