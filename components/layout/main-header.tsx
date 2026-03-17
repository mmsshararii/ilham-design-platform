'use client';

import { Bell, Users, Chrome as Home } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function MainHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="h-16 px-6 flex items-center justify-between gap-8">
        <div className="flex items-center gap-4 order-3">
          <Link href="/trending" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <span>الترند</span>
            <span className="text-lg">↗</span>
          </Link>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Users className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Home className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 max-w-xl mx-auto order-2">
          <Input
            type="search"
            placeholder="ابحث عن أي شيء..."
            className="w-full bg-muted/50 border-border/40 text-right"
          />
        </div>

        <Link href="/" className="flex flex-col items-end gap-0.5 order-1">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent leading-none">
            استلهم
          </span>
          <span className="text-[10px] text-muted-foreground/60 leading-tight text-right max-w-[200px]">
            استكشف التصاميم والإبداعات من المصممين حول العالم
          </span>
        </Link>
      </div>
    </header>
  );
}
