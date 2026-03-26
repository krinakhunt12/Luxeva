import React from 'react';

export const Card: React.FC<{ className?: string, children?: React.ReactNode }> = ({ className = '', children }) => {
  return (
    <div className={`bg-white border border-accent p-6 rounded-md shadow-sm ${className}`}>
      {children}
    </div>
  );
};
