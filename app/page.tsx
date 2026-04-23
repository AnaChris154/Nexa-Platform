import Link from 'next/link';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { Container } from '@/components/Container';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function Home() {
  return (
    <>
      <Navigation />
      <Header
        title="Bem-vindo ao NEXA"
        description="Plataforma de estudos para escolas públicas"
      />

      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Card Aluno */}
          <Card hoverable>
            <div className="mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </div>
            <h2>Sou Aluno</h2>
            <p className="text-muted my-4">
              Acesse seu dashboard, visualize suas disciplinas e acompanhe seu
              progresso.
            </p>
            <Link href="/aluno/dashboard">
              <Button fullWidth variant="primary">
                Ir para Dashboard →
              </Button>
            </Link>
          </Card>

          {/* Card Professor */}
          <Card hoverable>
            <div className="mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">👨‍🏫</span>
              </div>
            </div>
            <h2>Sou Professor</h2>
            <p className="text-muted my-4">
              Gerencie suas turmas, atividades e acompanhe o progresso dos
              alunos.
            </p>
            <Link href="/professor/dashboard">
              <Button fullWidth variant="primary">
                Ir para Dashboard →
              </Button>
            </Link>
          </Card>
        </div>

        {/* Info Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3>Sobre a Plataforma</h3>
          <p className="text-gray-700 my-4">
            NEXA é uma plataforma de estudos desenvolvida especificamente para
            escolas públicas, com foco em simplicidade, organização e
            acessibilidade.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>✅ Interface limpa e intuitiva</li>
            <li>✅ Otimizada para dispositivos móveis</li>
            <li>✅ Organização de conteúdo por disciplina</li>
            <li>✅ Acompanhamento de progresso individualizado</li>
          </ul>
        </Card>
      </Container>

      <footer className="bg-gray-800 text-white mt-12 py-8">
        <Container>
          <p className="text-center">
            &copy; 2026 NEXA. Desenvolvido com ❤️ para educação pública.
          </p>
        </Container>
      </footer>
    </>
  );
}
