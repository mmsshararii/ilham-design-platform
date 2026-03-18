'use client';

type ToastOptions = {
  title?: string;
  description?: string;
};

export function useToast() {
  function toast({ title, description }: ToastOptions) {
    console.log('Toast:', title, description);
  }

  return {
    toast,
  };
}