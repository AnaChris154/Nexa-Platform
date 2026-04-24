'use client';

import { ReactNode } from 'react';
import { useSidebar } from '@/app/contexts/SidebarContext';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps) {
  const { sidebarWidth } = useSidebar();
  
  return (
    <>
      <style jsx global>{`
        @media (min-width: 1024px) {
          .container-with-sidebar {
            padding-left: ${sidebarWidth + 16}px;
          }
        }
      `}</style>
      <div className={`container-with-sidebar max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-out ${className}`}>
        {children}
      </div>
    </>
  );
}
