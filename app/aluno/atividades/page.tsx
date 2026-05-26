'use client';

import Link from 'next/link';
import { Inbox, Sparkles, Target, Dumbbell, Trophy, Lightbulb, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageContainer } from '@/components/PageContainer';
import { ProtectedRoute } from '@/app/contexts/ProtectedRoute';

const infoCards = [
  { icon: Sparkles, title: 'Desbloqueamento Progressivo', desc: 'As atividades sao desbloqueadas conforme voce progride', color: 'bg-primary' },
  { icon: Target,   title: 'Alinhado com Seu Plano',      desc: 'Cada atividade esta alinhada com seu plano personalizado', color: 'bg-green-500' },
  { icon: Dumbbell, title: 'Pratica Regular',              desc: 'Pratique para consolidar o conhecimento', color: 'bg-yellow-500' },
  { icon: Trophy,   title: 'Ganhe Reconhecimento',         desc: 'Complete atividades para ganhar pontos', color: 'bg-blue-500' },
];

const nextSteps = [
  'Complete seu diagnostico (se ainda nao fez)',
  'Revise seu plano de estudos personalizado',
  'Estude as disciplinas indicadas no plano',
  'Volte aqui para praticar com as atividades',
];

function AtividadesContent() {
  return (
    <PageContainer>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Atividades</h1>
          <p className="text-muted-foreground text-sm">Tarefas e exercicios para praticar</p>
        </div>

        <Card className="text-center bg-primary text-primary-foreground border-0">
          <CardContent className="py-10">
            <div className="size-16 mx-auto mb-4 rounded-2xl bg-white/20 flex items-center justify-center"><Inbox className="size-8" /></div>
            <h2 className="text-xl font-bold mb-2">Nenhuma Atividade Pendente</h2>
            <p className="text-primary-foreground/80 mb-6 text-sm max-w-md mx-auto">Continue estudando para desbloquear novas tarefas e exercicios!</p>
            <Link href="/aluno/dashboard">
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90"><ArrowLeft className="mr-2 size-4" /> Voltar ao Dashboard</Button>
            </Link>
          </CardContent>
        </Card>

        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Como funcionam as atividades</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {infoCards.map((item) => (
              <Card key={item.title}>
                <CardContent className="flex items-start gap-4 py-4">
                  <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <item.icon className="size-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-0.5">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="flex items-start gap-4 py-4">
            <div className="size-10 rounded-xl bg-primary flex items-center justify-center shrink-0"><Lightbulb className="size-5 text-white" /></div>
            <div>
              <h4 className="font-semibold mb-2">Proximos Passos</h4>
              <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
                {nextSteps.map((step) => <li key={step}>{step}</li>)}
              </ol>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Link href="/aluno/plano"><Button variant="secondary" size="lg" className="w-full">Meu Plano</Button></Link>
          <Link href="/aluno/dashboard"><Button variant="outline" size="lg" className="w-full">Dashboard</Button></Link>
        </div>
      </div>
    </PageContainer>
  );
}

export default function AtividadesPage() {
  return <AtividadesContent />;
}
