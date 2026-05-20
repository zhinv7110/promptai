'use client';

import { useEffect, useState, useCallback, createContext, useContext } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastCtx = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  let nextId = 0;

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-4), { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  return (
    <ToastCtx.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t, i) => (
          <div
            key={t.id}
            className="pointer-events-auto animate-slide-up flex items-center gap-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-3 shadow-lg backdrop-blur-xl text-sm font-medium"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {t.type === 'success' && <Check className="h-4 w-4 text-green-500 shrink-0" />}
            {t.type === 'error' && <X className="h-4 w-4 text-red-500 shrink-0" />}
            {t.type === 'info' && <AlertCircle className="h-4 w-4 text-blue-500 shrink-0" />}
            <span className="text-zinc-800 dark:text-zinc-200">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

// Standalone copy-to-clipboard with toast
export async function copyWithToast(text: string, label: string = 'Copied!') {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
