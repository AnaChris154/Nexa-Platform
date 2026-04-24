'use client';

import { ReactNode } from 'react';
import { useSidebar } from '@/app/contexts/SidebarContext';

interface MainContentProps {
  children: ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'full';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full',
};

export function MainContent({ children, className = '', maxWidth = '4xl' }: MainContentProps) {
  const { sidebarWidth } = useSidebar();

  return (
    <>
      <style jsx global>{`
        @media (min-width: 1024px) {
          .main-content-area {
            margin-left: ${sidebarWidth}px;
          }
        }
      `}</style>
      <main className={`main-content-area pt-14 pb-20 lg:pb-8 transition-all duration-300 ease-out ${className}`}>
        <div className={`${maxWidthClasses[maxWidth]} mx-auto px-4 py-6 lg:px-6`}>
          {children}
        </div>
      </main>
    </>
  );
}
