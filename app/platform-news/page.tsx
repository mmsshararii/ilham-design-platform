'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader as Loader2, Newspaper } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

interface PlatformNews {
  id: string;
  title: string;
  content: string;
  category: 'update' | 'feature' | 'maintenance' | 'announcement';
  created_at: string;
}

const categoryLabels = {
  update: 'تحديث',
  feature: 'ميزة جديدة',
  maintenance: 'صيانة',
  announcement: 'إعلان',
};

const categoryColors = {
  update: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  feature: 'bg-green-500/20 text-green-300 border-green-500/30',
  maintenance: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  announcement: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

export default function PlatformNewsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [news, setNews] = useState<PlatformNews[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchNews();
    }
  }, [user]);

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from('platform_news')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) {
      setNews(data);
    }
    setLoading(false);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-3xl mx-auto p-4">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-purple rounded-lg">
              <Newspaper className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gradient">أخبار المنصة</h1>
          </div>
          <p className="text-muted-foreground">
            آخر التحديثات والإعلانات حول منصة استلهم
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : news.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Newspaper className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">لا توجد أخبار حالياً</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {news.map((item) => (
              <Card key={item.id} className="hover:border-purple-500/30 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={categoryColors[item.category]}>
                          {categoryLabels[item.category]}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(item.created_at), {
                            addSuffix: true,
                            locale: ar,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {item.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
