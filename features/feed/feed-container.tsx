'use client';

import { useState, useEffect } from 'react';
import { FeedTab } from '@/types/feed';
import { FeedItem as FeedItemType } from '@/types/feed';
import { getFeed } from '@/services/feed.service';
import { likePost, unlikePost } from '@/services/post.service';
import { trackAdClick } from '@/services/ads.service';
import { MainHeader } from '@/components/layout/main-header';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { CategoryTabs } from '@/components/layout/category-tabs';
import { FeedItem } from '@/components/shared/feed-item';
import { Loader as Loader2 } from 'lucide-react';

interface FeedContainerProps {
  userId: string;
}

export function FeedContainer({ userId }: FeedContainerProps) {
  const [activeTab, setActiveTab] = useState<FeedTab>('custom');
  const [feedItems, setFeedItems] = useState<FeedItemType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    loadFeed();
  }, [activeTab]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 500 &&
        hasMore &&
        !isLoading
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading, page]);

  async function loadFeed() {
    setIsLoading(true);
    try {
      const response = await getFeed({
        tab: activeTab,
        userId,
        page: 1,
        limit: 20,
      });
      setFeedItems(response.items);
      setHasMore(response.meta.hasMore);
      setPage(1);
    } catch (error) {
      console.error('Failed to load feed:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadMore() {
    if (!hasMore || isLoading) return;

    setIsLoading(true);
    try {
      const response = await getFeed({
        tab: activeTab,
        userId,
        page: page + 1,
        limit: 20,
      });
      setFeedItems([...feedItems, ...response.items]);
      setHasMore(response.meta.hasMore);
      setPage(page + 1);
    } catch (error) {
      console.error('Failed to load more:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLike(postId: string) {
    const item = feedItems.find(i => i.id === postId);
    if (!item || item.type !== 'post') return;

    const isLiked = item.data.is_liked;

    setFeedItems(
      feedItems.map(i =>
        i.id === postId && i.type === 'post'
          ? {
              ...i,
              data: {
                ...i.data,
                is_liked: !isLiked,
                likes_count: i.data.likes_count + (isLiked ? -1 : 1),
              },
            }
          : i
      )
    );

    try {
      if (isLiked) {
        await unlikePost(postId, userId);
      } else {
        await likePost(postId, userId);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
      setFeedItems(
        feedItems.map(i =>
          i.id === postId && i.type === 'post'
            ? {
                ...i,
                data: {
                  ...i.data,
                  is_liked: isLiked,
                  likes_count: i.data.likes_count + (isLiked ? 1 : -1),
                },
              }
            : i
        )
      );
    }
  }

  async function handleComment(postId: string) {
    console.log('Open comment modal for post:', postId);
  }

  async function handleAdClick(adId: string) {
    try {
      await trackAdClick(adId, userId);
    } catch (error) {
      console.error('Failed to track ad click:', error);
    }
  }

  function handleTabChange(tab: FeedTab) {
    setActiveTab(tab);
  }

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <RightSidebar />

      <main className="mr-80 pt-16">
        <CategoryTabs activeTab={activeTab} onTabChange={handleTabChange} />

        <div className="max-w-2xl mx-auto">
          {isLoading && feedItems.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
          ) : feedItems.length === 0 ? (
            <div className="text-center py-12 px-4">
              <p className="text-muted-foreground">لا توجد منشورات</p>
            </div>
          ) : (
            <>
              {feedItems.map((item) => (
                <FeedItem
                  key={item.id}
                  item={item}
                  onLike={handleLike}
                  onComment={handleComment}
                  onAdClick={handleAdClick}
                />
              ))}

              {isLoading && (
                <div className="flex items-center justify-center py-8 border-b border-border/40">
                  <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
