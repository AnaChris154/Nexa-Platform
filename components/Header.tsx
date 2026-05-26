'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  BookOpen,
  CheckSquare,
  LayoutDashboard,
  Map,
  Settings,
  Zap,
} from 'lucide-react';

const pageTitles: { [key: string]: string } = {
  '/aluno/dashboard': 'Dashboard',
  '/aluno/plano': 'Plano de Estudos',
  '/aluno/trilhas': 'Trilhas de Estudo',
  '/aluno/disciplinas': 'Disciplinas',
  '/aluno/atividades': 'Atividades',
  '/aluno/configuracoes': 'Configurações',
};

const pageIcons: { [key: string]: React.ReactNode } = {
  '/aluno/dashboard': <LayoutDashboard className="w-6 h-6" />,
  '/aluno/plano': <Zap className="w-6 h-6" />,
  '/aluno/trilhas': <Map className="w-6 h-6" />,
  '/aluno/disciplinas': <BookOpen className="w-6 h-6" />,
  '/aluno/atividades': <CheckSquare className="w-6 h-6" />,
  '/aluno/configuracoes': <Settings className="w-6 h-6" />,
};

export function Header() {
  const pathname = usePathname();

  const title = pageTitles[pathname] || 'Nexa';
  const icon = pageIcons[pathname] || <Zap className="w-6 h-6" />;

  return (
    <header className="flex items-center h-20 px-8 bg-transparent">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
          {icon}
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          <p className="text-xs text-muted-foreground font-medium">Área do Aluno</p>
        </div>
      </div>
    </header>
  );
}
