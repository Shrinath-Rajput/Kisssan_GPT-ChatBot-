import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow p-6 border border-stone-100 ${
        onClick ? 'cursor-pointer hover:border-emerald-300' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
