import React from 'react';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<Props> = ({ label, className = '', ...props }) => {
  return (
    <div className="space-y-2">
      {label && <label className="text-[10px] uppercase tracking-widest font-bold">{label}</label>}
      <input {...props} className={`w-full bg-bg border border-accent px-4 py-3 text-xs focus:outline-none focus:border-primary transition-colors ${className}`} />
    </div>
  );
};
