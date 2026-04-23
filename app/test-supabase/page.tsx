'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Container } from '@/components/Container';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { getTrilhas, Trilha } from '@/services/trilhasService';

export default function TestSupabasePage() {
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrilhas = async () => {
      setLoading(true);
      const { data, error: err } = await getTrilhas();

      if (err) {
        setError(err.message);
        setTrilhas([]);
      } else {
        setTrilhas(data || []);
        setError(null);
      }

      setLoading(false);
    };

    fetchTrilhas();
  }, []);

  return (
    <>
      <Navigation />

      <Container className="py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1>Teste Supabase</h1>
            <p className="text-muted mt-2">Página para testar integração com Supabase</p>
          </div>
          <Link href="/">
            <Button variant="secondary">← Voltar</Button>
          </Link>
        </div>

        {/* Status */}
        <Card className="mb-8 bg-blue-50 border-blue-200">
          <h3>Status da Conexão</h3>
          <div className="mt-4 space-y-2">
            <p className="text-sm">
              <strong>URL:</strong>{' '}
              <code className="bg-white px-2 py-1 rounded text-xs">
                {process.env.NEXT_PUBLIC_SUPABASE_URL}
              </code>
            </p>
            <p className="text-sm">
              <strong>Status:</strong> {loading ? '⏳ Carregando...' : '✅ Conectado'}
            </p>
          </div>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="mb-8 bg-red-50 border-red-200">
            <h4 className="text-red-800">❌ Erro</h4>
            <p className="text-red-700 text-sm mt-2">{error}</p>
            <p className="text-red-600 text-xs mt-4">
              ⚠️ <strong>Dica:</strong> Verifique se:
            </p>
            <ul className="text-red-600 text-xs mt-2 list-disc list-inside space-y-1">
              <li>.env.local está configurado com a ANON_KEY correta</li>
              <li>A tabela "trilhas" existe no Supabase</li>
              <li>Você tem permissão para ler a tabela</li>
            </ul>
          </Card>
        )}

        {/* Loading State */}
        {loading && !error && (
          <Card className="text-center">
            <p className="text-muted">⏳ Carregando dados...</p>
          </Card>
        )}

        {/* Success State */}
        {!loading && !error && trilhas.length > 0 && (
          <>
            <Card className="mb-8 bg-green-50 border-green-200">
              <h4 className="text-green-800">✅ Sucesso!</h4>
              <p className="text-green-700 text-sm mt-2">
                {trilhas.length} trilha(s) encontrada(s) no Supabase
              </p>
            </Card>

            <div className="space-y-4">
              <h3>Trilhas encontradas:</h3>
              {trilhas.map((trilha) => (
                <Card key={trilha.id} hoverable>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted">ID</p>
                      <p className="font-mono text-xs bg-gray-100 p-2 rounded mt-1">
                        {trilha.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted">Nome</p>
                      <h4 className="mt-1">{trilha.titulo}</h4>
                    </div>
                    <div>
                      <p className="text-sm text-muted">Descrição</p>
                      <p className="text-sm mt-1">{trilha.descricao}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted">Criado em</p>
                      <p className="text-xs mt-1">
                        {new Date(trilha.created_at).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && trilhas.length === 0 && (
          <Card className="text-center">
            <h4>Nenhuma trilha encontrada</h4>
            <p className="text-muted text-sm mt-2">
              Crie uma trilha no Supabase para ver os dados aqui
            </p>
          </Card>
        )}
      </Container>
    </>
  );
}
