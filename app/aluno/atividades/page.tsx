'use client';

import Link from 'next/link';
import {
  Inbox,
  Sparkles,
  Target,
  Dumbbell,
  Trophy,
  Lightbulb,
  ArrowLeft,
} from 'lucide-react';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';

const infoCards = [
  {
    icon: Sparkles,
    title: 'Desbloqueamento Progressivo',
    desc: 'As atividades sao desbloqueadas conforme voce progride',
    color: 'bg-[hsl(var(--primary))]',
    bgColor: 'bg-[hsl(var(--primary-soft))]',
    borderColor: 'border-[hsl(var(--primary)_/_0.2)]',
  },
  {
    icon: Target,
    title: 'Alinhado com Seu Plano',
    desc: 'Cada atividade esta alinhada com seu plano personalizado',
    color: 'bg-[hsl(var(--success))]',
    bgColor: 'bg-[hsl(var(--success-soft))]',
    borderColor: 'border-[hsl(var(--success)_/_0.2)]',
  },
  {
    icon: Dumbbell,
    title: 'Pratica Regular',
    desc: 'Pratique para consolidar o conhecimento',
    color: 'bg-[hsl(var(--warning))]',
    bgColor: 'bg-[hsl(var(--warning-soft))]',
    borderColor: 'border-[hsl(var(--warning)_/_0.2)]',
  },
  {
    icon: Trophy,
    title: 'Ganhe Reconhecimento',
    desc: 'Complete atividades para ganhar pontos',
    color: 'bg-[hsl(var(--accent))]',
    bgColor: 'bg-[hsl(var(--accent-soft))]',
    borderColor: 'border-[hsl(var(--accent)_/_0.2)]',
  },
];

const nextSteps = [
  'Complete seu diagnostico (se ainda nao fez)',
  'Revise seu plano de estudos personalizado',
  'Estude as disciplinas indicadas no plano',
  'Volte aqui para praticar com as atividades',
];

function AtividadesContent() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Navigation />

      <main className="pt-14 pb-20 lg:pb-8 lg:pl-60">
        <div className="max-w-4xl mx-auto px-4 py-6">
          
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[hsl(var(--foreground))]">
              Atividades
            </h1>
            <p className="text-[hsl(var(--muted-foreground))]">
              Tarefas e exercicios para praticar
            </p>
          </div>

          {/* Empty State */}
          <Card className="p-6 text-center bg-[hsl(var(--primary))] border-0 mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center">
              <Inbox className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Nenhuma Atividade Pendente
            </h2>
            <p className="text-white/80 mb-6 text-sm max-w-md mx-auto">
              Continue estudando para desbloquear novas tarefas!
            </p>
            <Link href="/aluno/dashboard">
              <Button
                variant="secondary"
                className="bg-white text-[hsl(var(--primary))]"
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Voltar ao Dashboard
              </Button>
            </Link>
          </Card>

          {/* Info Cards */}
          <h3 className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider mb-4">
            Como funcionam as atividades
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {infoCards.map((item) => (
              <Card
                key={item.title}
                className={`p-4 ${item.bgColor} ${item.borderColor}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 flex-shrink-0 rounded-xl ${item.color} flex items-center justify-center`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[hsl(var(--foreground))] mb-0.5">
                      {item.title}
                    </h4>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Next Steps */}
          <Card className="p-4 bg-[hsl(var(--primary-soft))] border-[hsl(var(--primary)_/_0.2)] mb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-[hsl(var(--primary))] flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-[hsl(var(--foreground))] mb-2">
                  Proximos Passos
                </h4>
                <ol className="text-sm text-[hsl(var(--muted-foreground))] space-y-1.5 list-decimal list-inside">
                  {nextSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Link href="/aluno/plano">
              <Button size="lg" variant="secondary" fullWidth>
                Meu Plano
              </Button>
            </Link>
            <Link href="/aluno/dashboard">
              <Button size="lg" variant="outline" fullWidth>
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AtividadesPage() {
  return (
    <ProtectedRoute>
      <AtividadesContent />
    </ProtectedRoute>
  );
}
