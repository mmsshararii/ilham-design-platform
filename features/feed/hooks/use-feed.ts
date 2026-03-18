'use client';

import { useEffect, useState } from 'react';
import { FeedTab, FeedItem } from '@/types/feed';
import { getFeed } from '@/services/feed.service';
import { likePost, unlikePost } from '@/services/post.service';
import { trackAdClick } from '@/services/ads.service';

interface UseFeedParams {
  userId: string;
}

export function useFeed({ userId }: UseFeedParams) {
  const [activeTab, setActiveTab] = useState<FeedTab>('custom');
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // تحميل أولي
  useEffect(() => {
    loadFeed();
  }, [activeTab]);

  async function loadFeed() {
    setLoading(true);

    try {
      const response = await getFeed({
        tab: activeTab,
        userId,
        page: 1,
        limit: 20,
      });

      setItems(response.items);
      setHasMore(response.meta.hasMore);
      setPage(1);
    } catch (error) {
      console.error('Feed load error:', error);
    }

    setLoading(false);
  }

  async function loadMore() {
    if (!hasMore || loadingMore) return;

    setLoadingMore(true);

    try {
      const response = await getFeed({
        tab: activeTab,
        userId,
        page: page + 1,
        limit: 20,
      });

      setItems((prev) => [...prev, ...response.items]);
      setHasMore(response.meta.hasMore);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error('Load more error:', error);
    }

    setLoadingMore(false);
  }

  // ❤️ Like (Optimistic UI)
  async function handleLike(postId: string) {
    const item = items.find(i => i.id === postId);

    if (!item || item.type !== 'post') return;

    const isLiked = item.data.is_liked;

    // تحديث فوري
    setItems(prev =>
      prev.map(i =>
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
      console.error('Like error:', error);

      // rollback
      setItems(prev =>
        prev.map(i =>
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

  // 💬 تعليق (placeholder)
  function handleComment(postId: string) {
    console.log('Comment on:', postId);
  }

  // 📢 إعلان
  async function handleAdClick(adId: string) {
    try {
      await trackAdClick(adId, userId);
    } catch (error) {
      console.error('Ad click error:', error);
    }
  }

  // 🔁 تغيير التبويب
  function handleTabChange(tab: FeedTab) {
    setActiveTab(tab);
  }

  return {
    // data
    items,
    activeTab,

    // state
    loading,
    loadingMore,
    hasMore,

    // actions
    loadMore,
    handleLike,
    handleComment,
    handleAdClick,
    handleTabChange,
  };
}