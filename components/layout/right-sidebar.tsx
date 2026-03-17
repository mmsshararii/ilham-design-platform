'use client';

import { Chrome as Home, User, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

const trendingHashtags = [
  { tag: 'تصميم_شعارات', count: '2.5k' },
  { tag: 'هوية_بصرية', count: '1.8k' },
  { tag: 'تصميم_واجهات', count: '1.5k' },
  { tag: 'موشن_جرافيك', count: '1.2k' },
  { tag: 'تصميم_داخلي', count: '980' },
];

export function RightSidebar() {
  return (
    <aside className="fixed top-16 right-0 w-80 h-[calc(100vh-4rem)] overflow-y-auto border-l border-border/40 bg-background p-4 space-y-4">
      <Button className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
        إنشاء منشور
      </Button>

      <Card className="border-border/40 shadow-sm">
        <CardContent className="p-4 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">الرئيسية</span>
          </Link>

          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <User className="h-5 w-5" />
            <span className="font-medium">ملفي الشخصي</span>
          </Link>
        </CardContent>
      </Card>

      <Card className="border-border/40 shadow-sm">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Hash className="h-4 w-4" />
            <span>الهاشتاقات الأكثر تداول</span>
          </div>

          <div className="space-y-1">
            {trendingHashtags.map((item) => (
              <Link
                key={item.tag}
                href={`/hashtag/${item.tag}`}
                className="block px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-purple-600">#{item.tag}</span>
                  <span className="text-xs text-muted-foreground">{item.count}</span>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
