'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Search as SearchIcon, Chrome as Home, User, CirclePlus as PlusCircle, Users, Bell } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    if (!user) return;

    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    setUnreadCount(count || 0);
  };

  if (!user) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-4xl mx-auto px-6 py-3 space-y-3">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-0.5 flex-shrink-0">
            <span className="font-bold text-xl text-gradient leading-none">
              استلهم
            </span>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-xs hidden sm:flex">
            <div className="relative w-full">
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer z-10"
              >
                <SearchIcon className="h-4 w-4 text-muted-foreground hover:text-purple-500 transition-colors" />
              </button>
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="بحث..."
                className="pl-4 pr-9 text-right h-8 text-sm"
              />
            </div>
          </form>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => router.push('/')}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">الرئيسية</span>
            </Button>
            <Button
              onClick={() => router.push('/explore/trending')}
              variant="ghost"
              size="sm"
            >
              <span className="text-sm">الترند ↗</span>
            </Button>
            <Button
              onClick={() => router.push('/explore/designers')}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">مصممون</span>
            </Button>
            <Button
              onClick={() => router.push('/notifications')}
              variant="ghost"
              size="sm"
              className="gap-2 relative"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
              <span className="hidden sm:inline text-sm">الإشعارات</span>
            </Button>
            <Button
              onClick={() => router.push(`/profile/${profile?.username}`)}
              variant="ghost"
              size="sm"
              className="gap-2"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">ملفي</span>
            </Button>
            <Button
              onClick={() => router.push('/post/create')}
              size="sm"
              className="gradient-purple gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">إنشاء منشور</span>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex sm:hidden">
          <div className="relative w-full">
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer z-10"
            >
              <SearchIcon className="h-4 w-4 text-muted-foreground hover:text-purple-500 transition-colors" />
            </button>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث..."
              className="pl-4 pr-9 text-right h-8 text-sm w-full"
            />
          </div>
        </form>
      </div>

      <div className="border-t border-border/50 bg-card/60">
        <div className="max-w-4xl mx-auto px-6 py-2">
          <p className="text-xs text-muted-foreground/70 text-center">
            استكشف التصاميم والإبداعات من المصممين حول العالم
          </p>
        </div>
      </div>
    </nav>
  );
}
