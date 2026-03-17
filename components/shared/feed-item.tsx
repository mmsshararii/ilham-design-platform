'use client';

import { FeedItem as FeedItemType } from '@/types/feed';
import { PostCard } from './post-card';
import { AdCard } from './ad-card';

interface FeedItemProps {
  item: FeedItemType;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onAdClick?: (adId: string) => void;
}

export function FeedItem({ item, onLike, onComment, onAdClick }: FeedItemProps) {
  if (item.type === 'post') {
    return <PostCard post={item.data} onLike={onLike} onComment={onComment} />;
  }

  if (item.type === 'ad') {
    return <AdCard ad={item.data} onAdClick={onAdClick} />;
  }

  return null;
}
