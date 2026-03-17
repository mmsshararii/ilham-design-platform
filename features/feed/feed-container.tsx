'use client';

import { useState, useEffect } from 'react';
import { FeedTab } from '@/types/feed';
import { FeedItem as FeedItemType } from '@/types/feed';
import { getFeed } from '@/services/feed.service';
import { likePost, unlikePost } from '@/services/post.service';
import { trackAdClick } from '@/services/ads.service';
import { FeedTabs } from '@/components/layout/feed-tabs';
import { FeedItem } from '@/components/shared/feed-item';
import { Button } from '@/components/ui/button';

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
    <div className="min-h-screen bg-gray-50">
      <FeedTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {isLoading && feedItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">جاري التحميل...</p>
          </div>
        ) : feedItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">لا توجد منشورات</p>
          </div>
        ) : (
          <div className="space-y-4">
            {feedItems.map((item) => (
              <FeedItem
                key={item.id}
                item={item}
                onLike={handleLike}
                onComment={handleComment}
                onAdClick={handleAdClick}
              />
            ))}

            {hasMore && (
              <div className="text-center py-6">
                <Button
                  onClick={loadMore}
                  disabled={isLoading}
                  variant="outline"
                >
                  {isLoading ? 'جاري التحميل...' : 'تحميل المزيد'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
