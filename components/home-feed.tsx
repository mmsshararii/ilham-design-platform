'use client';

import { FeedItem } from '@/components/shared/feed-item';
import { Loader as Loader2 } from 'lucide-react';

export function HomeFeed({
  items,
  loading,
  loadingMore,
  onLike,
  onComment,
  onAdClick,
}: any) {
  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">

      {items.map((item: any) => (
        <FeedItem
          key={item.id}
          item={item}
          onLike={onLike}
          onComment={onComment}
          onAdClick={onAdClick}
        />
      ))}

      {loadingMore && (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin" />
        </div>
      )}
    </div>
  );
}