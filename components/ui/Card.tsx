import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card = ({ children, className = '', onClick }: CardProps) => (
  <div 
    onClick={onClick}
    className={`bg-card p-6 rounded-default border-[0.5px] border-border shadow-border transition-all duration-300 ${onClick ? 'cursor-pointer hover:border-primary active:scale-[0.98]' : ''} ${className}`}
  >
    {children}
  </div>
);
