'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { supabase, Post } from '@/lib/supabase';
import { Navbar } from '@/components/navbar';
import { PostCard } from '@/components/post-card';
import { Loader as Loader2 } from 'lucide-react';

interface TrendingPost extends Post {
  engagement_score?: number;
}

export default function TrendingPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<TrendingPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchTrendingPosts();
    }
  }, [user]);

  const fetchTrendingPosts = async () => {
    // Get posts from last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: postsData } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (*),
        likes: post_likes(count),
        comments: comments(count),
        reposts: post_reposts(count),
        views: post_views(count)
      `)
      .gte('created_at', sevenDaysAgo)
      .eq('is_hidden', false);

    if (postsData) {
      // Calculate engagement score and sort
      const trendingPosts = (postsData as any[])
        .map((post) => ({
          ...post,
          engagement_score:
            (post.likes?.[0]?.count || 0) * 3 +
            (post.comments?.[0]?.count || 0) * 5 +
            (post.reposts?.[0]?.count || 0) * 4 +
            (post.views?.[0]?.count || 0) * 0.1,
        }))
        .sort((a, b) => (b.engagement_score || 0) - (a.engagement_score || 0))
        .slice(0, 50);

      setPosts(trendingPosts);
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
      <main className="max-w-2xl mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">الترند</h1>
          <p className="text-muted-foreground">
            أكثر المنشورات تفاعلاً في آخر 7 أيام
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">لا توجد منشورات رائجة حالياً</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
