'use client';
import { Username } from "@/components/username";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase, Post, Profile } from '@/lib/supabase';
import { Navbar } from '@/components/navbar';
import { PostCard } from '@/components/post-card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Loader as Loader2, Search as SearchIcon } from 'lucide-react';
import Link from 'next/link';

export default function SearchPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (query.trim()) {
      performSearch();
    } else {
      setPosts([]);
      setProfiles([]);
      setHashtags([]);
    }
  }, [query]);

  const performSearch = async () => {
    setLoading(true);

    const searchTerm = query.toLowerCase();

    // Search posts by description
    const { data: postsData } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (*)
      `)
      .ilike('description', `%${searchTerm}%`)
      .limit(20);

    // Search profiles by username or bio
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%`)
      .limit(20);

    // Search hashtags (from posts with matching hashtags)
    const { data: hashtagPosts } = await supabase
      .from('posts')
      .select('hashtags')
      .not('hashtags', 'is', null);

    const foundHashtags = new Set<string>();
    hashtagPosts?.forEach((post) => {
      if (post.hashtags) {
        post.hashtags.forEach((tag: string) => {
          if (tag.toLowerCase().includes(searchTerm)) {
            foundHashtags.add(tag);
          }
        });
      }
    });

    setPosts(postsData || []);
    setProfiles(profilesData || []);
    setHashtags(Array.from(foundHashtags).slice(0, 10));
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
      <main className="max-w-2xl mx-auto p-4">
        <div className="mb-6 relative">
          <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث عن منشورات أو مصممين أو وسوم..."
            className="pl-4 pr-10 text-right"
          />
        </div>

        {query.trim() ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="posts">
                المنشورات ({posts.length})
              </TabsTrigger>
              <TabsTrigger value="designers">
                المصممون ({profiles.length})
              </TabsTrigger>
              <TabsTrigger value="hashtags">
                الوسوم ({hashtags.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                </div>
              ) : posts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  لا توجد منشورات مطابقة
                </p>
              ) : (
                posts.map((post) => <PostCard key={post.id} post={post} />)
              )}
            </TabsContent>

            <TabsContent value="designers" className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                </div>
              ) : profiles.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  لا توجد مصممين مطابقين
                </p>
              ) : (
                profiles.map((profile) => (
                  <Link
                    key={profile.id}
                    href={`/profile/${profile.username}`}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border hover:border-purple-500/30 transition-colors"
                  >
                    <Avatar>
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback className="bg-gradient-purple text-white">
                        {profile.username[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Username username={profile.username} />
                      {profile.bio && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {profile.bio}
                        </p>
                      )}
                    </div>
                  </Link>
                ))
              )}
            </TabsContent>

            <TabsContent value="hashtags" className="space-y-2">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
                </div>
              ) : hashtags.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  لا توجد وسوم مطابقة
                </p>
              ) : (
                <div className="space-y-2">
                  {hashtags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/hashtag/${encodeURIComponent('#' + tag)}`}
                      className="flex items-center p-4 rounded-lg border border-border hover:border-purple-500/30 transition-colors"
                    >
                      <span className="text-purple-400 font-semibold">#{tag}</span>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">ابدأ البحث للعثور على منشورات أو مصممين</p>
          </div>
        )}
      </main>
    </div>
  );
}
