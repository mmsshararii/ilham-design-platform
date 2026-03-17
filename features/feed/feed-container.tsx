'use client';

import { FeedTab } from '@/types/feed';
import { FeedItem as FeedItemType } from '@/types/feed';

import { MainHeader } from '@/components/layout/main-header';
import { RightSidebar } from '@/components/layout/right-sidebar';
import { CategoryTabs } from '@/components/layout/category-tabs';
import { FeedItem } from '@/components/shared/feed-item';
import { Loader as Loader2 } from 'lucide-react';

interface FeedContainerProps {
  userId: string;
  items: FeedItemType[];
  loading: boolean;
  loadingMore?: boolean;
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
  onLoadMore: () => void;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onAdClick: (adId: string) => void;
}

export function FeedContainer({
  userId,
  items,
  loading,
  loadingMore,
  activeTab,
  onTabChange,
  onLoadMore,
  onLike,
  onComment,
  onAdClick,
}: FeedContainerProps) {

  return (
    <div className="min-h-screen bg-background">
      <MainHeader />

      <div className="pt-16 flex">
        <RightSidebar />

        <main className="flex-1 mr-80">

          {/* Tabs */}
          <CategoryTabs
            activeTab={activeTab}
            onTabChange={onTabChange}
          />

          {/* Feed */}
          <div className="max-w-2xl mx-auto">

            {loading && items.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 px-4">
                <p className="text-muted-foreground">لا توجد منشورات</p>
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <FeedItem
                    key={item.id}
                    item={item}
                    onLike={onLike}
                    onComment={onComment}
                    onAdClick={onAdClick}
                  />
                ))}

                {/* Load More Button */}
                <div className="flex justify-center py-6">
                  <button
                    onClick={onLoadMore}
                    disabled={loadingMore}
                    className="px-4 py-2 rounded-md bg-primary text-white"
                  >
                    {loadingMore ? 'جاري التحميل...' : 'تحميل المزيد'}
                  </button>
                </div>
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}