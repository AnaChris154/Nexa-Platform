'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { useSidebar } from '@/app/contexts/SidebarContext';
import { signOut } from '@/services/authService';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  BookOpen,
  CheckSquare,
  Settings,
  Zap,
  LogOut,
  LogIn,
  UserPlus,
  ChevronLeft,
} from 'lucide-react';
import { Avatar } from './Avatar';

const alunoLinks = [
  { href: '/aluno/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { href: '/aluno/plano', label: 'Plano', Icon: Zap },
  { href: '/aluno/trilhas', label: 'Trilhas', Icon: Map },
  { href: '/aluno/disciplinas', label: 'Disciplinas', Icon: BookOpen },
  { href: '/aluno/atividades', label: 'Atividades', Icon: CheckSquare },
  { href: '/aluno/configuracoes', label: 'Config.', Icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, profile } = useAuth();
  const { isCollapsed, toggleSidebar, sidebarWidth } = useSidebar();
  const [signingOut, setSigningOut] = useState(false);

  const isAluno = pathname.startsWith('/aluno');

  const handleLogout = async () => {
    setSigningOut(true);
    const { error } = await signOut();
    if (!error) router.push('/');
    setSigningOut(false);
  };

  const isActive = (path: string) => pathname === path;

  const userName = profile?.display_name || user?.email?.split('@')[0] || 'Usuario';

  return (
    <>
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-[hsl(var(--border))]">
        <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[hsl(var(--primary))] flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-[hsl(var(--primary))]">
              NEXA
            </span>
          </Link>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                {!pathname.includes('/login') && (
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))] transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">Entrar</span>
                  </Link>
                )}
                {!pathname.includes('/signup') && (
                  <Link
                    href="/signup"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-white bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary-hover))] transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="hidden sm:inline">Cadastrar</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[hsl(var(--muted))]">
                  <Avatar name={userName} size="sm" />
                  <span className="text-sm font-medium text-[hsl(var(--foreground))] max-w-[120px] truncate">
                    {userName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  disabled={signingOut}
                  className="flex items-center justify-center w-9 h-9 rounded-lg text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive-soft))] transition-colors disabled:opacity-50"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar - Desktop Only */}
      {isAluno && (
        <motion.aside
          initial={false}
          animate={{ width: sidebarWidth }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="hidden lg:flex fixed left-0 top-14 bottom-0 z-40 flex-col border-r border-[hsl(var(--border))] bg-white overflow-hidden"
        >
          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="absolute -right-3 top-6 z-50 w-6 h-6 rounded-full bg-white border border-[hsl(var(--border))] shadow-sm flex items-center justify-center hover:bg-[hsl(var(--muted))] transition-colors"
            title={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
            </motion.div>
          </button>

          <nav className="flex-1 p-3 space-y-1">
            {alunoLinks.map(({ href, label, Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-[hsl(var(--primary-soft))] text-[hsl(var(--primary))]'
                      : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'
                  }`}
                  title={isCollapsed ? label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-3 border-t border-[hsl(var(--border))]">
            <div className="flex items-center gap-3">
              <Avatar name={userName} size="md" />
              <AnimatePresence mode="wait">
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 min-w-0 overflow-hidden"
                  >
                    <p className="text-sm font-medium text-[hsl(var(--foreground))] truncate">
                      {userName}
                    </p>
                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                      Aluno
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.aside>
      )}

      {/* Bottom Navigation - Mobile/Tablet Only */}
      {isAluno && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-white border-t border-[hsl(var(--border))] safe-area-pb">
          <div className="h-full flex items-center justify-around px-2">
            {alunoLinks.slice(0, 5).map(({ href, label, Icon }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center justify-center gap-1 min-w-[56px] py-2"
                >
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-xl transition-colors ${
                      active
                        ? 'bg-[hsl(var(--primary-soft))]'
                        : 'bg-transparent'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        active
                          ? 'text-[hsl(var(--primary))]'
                          : 'text-[hsl(var(--muted-foreground))]'
                      }`}
                      strokeWidth={active ? 2.5 : 2}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-medium ${
                      active
                        ? 'text-[hsl(var(--primary))]'
                        : 'text-[hsl(var(--muted-foreground))]'
                    }`}
                  >
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
