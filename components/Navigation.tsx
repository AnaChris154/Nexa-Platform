'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  BookOpen,
  CheckSquare,
  Settings,
  Zap,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/app/contexts/AuthContext';
import { signOut } from '@/services/authService';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useState } from 'react';

const alunoLinks = [
  { href: '/aluno/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/aluno/plano', label: 'Plano de Estudos', Icon: Zap },
  { href: '/aluno/trilhas', label: 'Trilhas', Icon: Map },
  { href: '/aluno/disciplinas', label: 'Disciplinas', Icon: BookOpen },
  { href: '/aluno/atividades', label: 'Atividades', Icon: CheckSquare },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const isActive = (path: string) => pathname === path;
  const userName = profile?.display_name || user?.email?.split('@')[0] || 'Aluno';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <>
      {/* Barra Lateral - Desktop */}
      <aside
        className={cn(
          'hidden md:flex relative flex-col h-full bg-transparent transition-all duration-300 ease-in-out',
          isCollapsed ? 'w-20' : 'w-72'
        )}
      >
        <div
          className={cn(
            'flex items-center h-20 px-8',
            isCollapsed ? 'justify-center' : 'justify-between'
          )}
        >
          {!isCollapsed && (
            <Link href="/aluno/dashboard" className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
                <Zap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold tracking-tight">Nexa</span>
            </Link>
          )}
          {isCollapsed && (
             <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
                <Zap className="w-6 h-6 text-primary-foreground" />
             </div>
          )}
        </div>

        <nav className="flex-1 px-4 py-6 space-y-4">
          <div className="space-y-1">
            {alunoLinks.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 group',
                  isActive(href)
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                    : 'text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-sm',
                  isCollapsed && 'justify-center px-0'
                )}
              >
                <Icon className={cn("w-6 h-6 shrink-0", isActive(href) ? "" : "group-hover:scale-110 transition-transform")} />
                {!isCollapsed && <span className="text-base">{label}</span>}
              </Link>
            ))}
          </div>
        </nav>

        <div className="px-6 py-6 mt-auto space-y-4">
          <div
            className={cn(
              'flex items-center gap-3 p-2 rounded-2xl bg-white/50 border border-white',
              isCollapsed && 'justify-center border-0 bg-transparent'
            )}
          >
            <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">{userInitial}</AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">{userName}</p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Aluno(a)</p>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <Link
              href="/aluno/configuracoes"
              className={cn(
                'flex items-center w-full gap-4 px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200',
                isActive('/aluno/configuracoes')
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:bg-white hover:text-foreground hover:shadow-sm',
                isCollapsed && 'justify-center px-0'
              )}
            >
              <Settings className="w-6 h-6 shrink-0" />
              {!isCollapsed && <span className="text-base">Configurações</span>}
            </Link>

            <Button
              variant="ghost"
              size={isCollapsed ? 'icon' : 'default'}
              className="w-full justify-start gap-4 px-4 py-6 hover:bg-destructive/10 hover:text-destructive rounded-2xl transition-all duration-200 group"
              onClick={handleLogout}
            >
              <LogOut className="w-6 h-6 shrink-0 group-hover:translate-x-1 transition-transform" />
              {!isCollapsed && <span className="text-base font-medium">Sair da conta</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Barra Inferior - Mobile */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-background/95 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-around px-4 z-50 shadow-2xl shadow-black/10">
        {alunoLinks.slice(0, 4).map(({ href, label, Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center justify-center flex-1 py-1 gap-1 transition-all duration-200',
                active ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-colors",
                active ? "bg-primary/10" : ""
              )}>
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[9px] font-bold uppercase tracking-tight">{label.split(' ')[0]}</span>
            </Link>
          );
        })}
        <Link
          href="/aluno/configuracoes"
          className={cn(
            'flex flex-col items-center justify-center flex-1 py-1 gap-1 transition-all duration-200',
            isActive('/aluno/configuracoes') ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-colors",
            isActive('/aluno/configuracoes') ? "bg-primary/10" : ""
          )}>
            <Settings className="w-6 h-6" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-tight">Conta</span>
        </Link>
      </nav>
    </>
  );
}
