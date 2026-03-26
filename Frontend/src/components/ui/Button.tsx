import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...props }) => {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center rounded-md bg-primary text-white px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-gold transition-colors disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};
