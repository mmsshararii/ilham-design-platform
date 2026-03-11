'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase, Profile } from '@/lib/supabase';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader as Loader2, Search as SearchIcon, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ExploreDesignersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [designers, setDesigners] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('popular');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchDesigners();
    }
  }, [user, activeTab]);

  const fetchDesigners = async () => {
    setLoading(true);

    if (activeTab === 'popular') {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('account_type', 'designer')
        .order('is_verified', { ascending: false })
        .order('follower_count', { ascending: false })
        .limit(50);

      if (data) {
        setDesigners(data);
      }
    } else if (activeTab === 'new') {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('account_type', 'designer')
        .order('created_at', { ascending: false })
        .limit(50);

      if (data) {
        setDesigners(data);
      }
    }

    setLoading(false);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('account_type', 'designer')
      .ilike('username', `%${searchQuery}%`)
      .limit(50);

    if (data) {
      setDesigners(data);
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
      <main className="max-w-4xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">اكتشاف المصممين</h1>
          <p className="text-muted-foreground">
            تعرف على أفضل المصممين في المنصة
          </p>
        </div>

        <div className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="flex-1 relative">
              <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن مصمم..."
                className="pl-4 pr-9 text-right"
              />
            </div>
            <Button className="gradient-purple">بحث</Button>
          </form>
        </div>

        {!searchQuery && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="popular">الأكثر متابعة</TabsTrigger>
              <TabsTrigger value="new">الجدد</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : designers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">لم نجد مصممين مطابقين</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {designers.map((designer) => (
              <Card key={designer.id} className="hover:border-purple-500/30 transition-colors">
                <CardContent className="pt-6">
                  <Link
                    href={`/profile/${designer.username}`}
                    className="flex flex-col items-center text-center space-y-3 hover:opacity-80 transition-opacity"
                  >
                    <Avatar className="h-20 w-20 border-2 border-purple-500/30">
                      <AvatarImage src={designer.avatar_url} />
                      <AvatarFallback className="bg-gradient-purple text-white text-lg">
                        {designer.username[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-2">
                        <h3 className="font-bold text-lg">{designer.username}</h3>
                        {designer.is_verified && (
                          <ShieldCheck className="h-4 w-4 text-blue-500" />
                        )}
                      </div>
                      {designer.bio && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {designer.bio}
                        </p>
                      )}
                    </div>
                    <Badge variant="secondary">{designer.account_type === 'designer' ? 'مصمم' : ''}</Badge>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
