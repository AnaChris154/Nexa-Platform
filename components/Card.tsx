import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function Card({ children, className = '', hoverable = false }: CardProps) {
  const baseStyles = 'bg-white rounded-lg border border-gray-200 shadow-sm p-6';
  const hoverStyles = hoverable ? 'hover:shadow-md transition-shadow duration-200' : '';

  return (
    <div className={`${baseStyles} ${hoverStyles} ${className}`}>
      {children}
    </div>
  );
}
