'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { signOut } from '@/services/authService';
import { useState } from 'react';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    setSigningOut(true);
    const { error } = await signOut();
    if (!error) {
      router.push('/');
    }
    setSigningOut(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-xl text-blue-600">
            NEXA
          </Link>

          <div className="flex gap-4 items-center">
            {pathname !== '/' && !pathname.includes('/login') && (
              <Link
                href="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Início
              </Link>
            )}

            {!pathname.includes('/aluno') && !isAuthenticated && (
              <Link
                href="/aluno/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/aluno/dashboard') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Aluno
              </Link>
            )}

            {!pathname.includes('/professor') && !isAuthenticated && (
              <Link
                href="/professor/dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/professor/dashboard') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Professor
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-700 px-3">
                  {user?.email}
                </span>
                <button
                  onClick={handleLogout}
                  disabled={signingOut}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-gray-700 hover:text-red-600 disabled:opacity-50"
                >
                  {signingOut ? 'Saindo...' : 'Sair'}
                </button>
              </>
            ) : (
              <>
                {!pathname.includes('/login') && (
                  <Link
                    href="/login"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/login') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    Login
                  </Link>
                )}
                {!pathname.includes('/signup') && (
                  <Link
                    href="/signup"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/signup') ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    Cadastro
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
