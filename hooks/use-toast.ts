'use client';

import { useState, ReactNode } from 'react';

type Toast = {
  id: string;
  title?: string;
  description?: string;
  action?: ReactNode;
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function toast({
    title,
    description,
    action,
  }: Omit<Toast, 'id'>) {
    const id = Math.random().toString();

    setToasts((prev) => [
      ...prev,
      { id, title, description, action },
    ]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }

  return {
    toast,
    toasts,
  };
}