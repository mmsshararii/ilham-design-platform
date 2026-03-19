'use client';

import { useAuth } from '@/lib/auth-context';
import { useFeed } from '@/features/feed/hooks/use-feed';
import { FeedContainer } from '@/features/feed/feed-container';
import { Loader as Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // ✅ لازم يكون فوق أي return
  const feed = useFeed({ userId: user?.id || '' });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <FeedContainer
      userId={user.id}
      items={feed.items}
      loading={feed.loading}
      loadingMore={feed.loadingMore}
      activeTab={feed.activeTab}
      onTabChange={feed.handleTabChange}
      onLoadMore={feed.loadMore}
      onLike={feed.handleLike}
      onComment={feed.handleComment}
      onAdClick={feed.handleAdClick}
    />
  );
}