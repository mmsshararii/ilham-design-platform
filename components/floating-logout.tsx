'use client';

import { useAuth } from '@/lib/auth-context';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

export function FloatingLogout() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <Button
      onClick={signOut}
      variant="outline"
      size="sm"
      className="fixed bottom-6 left-6 z-50 gap-2 bg-card/90 backdrop-blur-sm border-border hover:bg-destructive hover:text-destructive-foreground hover:border-destructive shadow-lg"
    >
      <LogOut className="h-4 w-4" />
      <span className="text-sm">تسجيل خروج</span>
    </Button>
  );
}
