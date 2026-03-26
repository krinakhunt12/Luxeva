import React, { createContext, useContext, useEffect, useState } from 'react';
import { setToastHandlers } from '../../utils/toastService';

type Toast = { id: string; message: string; type: 'success' | 'error' };

const ToastContext = createContext<{ showSuccess: (m: string) => void; showError: (m: string) => void } | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    setToastHandlers({
      showSuccess: (m: string) => enqueue('success', m),
      showError: (m: string) => enqueue('error', m),
    });
  }, []);

  const enqueue = (type: Toast['type'], message: string) => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((s) => [...s, { id, message, type }]);
    setTimeout(() => {
      setToasts((s) => s.filter((t) => t.id !== id));
    }, 4000);
  };

  const value = {
    showSuccess: (m: string) => enqueue('success', m),
    showError: (m: string) => enqueue('error', m),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
        {toasts.map((t) => (
          <div key={t.id} style={{ marginBottom: 8, minWidth: 220 }}>
            <div
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                color: t.type === 'success' ? 'white' : 'white',
                background: t.type === 'success' ? '#16a34a' : '#dc2626',
                boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700 }}>{t.type === 'success' ? 'Success' : 'Error'}</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>{t.message}</div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
