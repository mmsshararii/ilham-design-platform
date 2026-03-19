'use client';

import { HomeHeader } from './components/home-header';
import { HomeTagline } from './components/home-tagline';
import { HomeTabs } from './components/home-tabs';
import { HomeFeed } from './components/home-feed';
import { HomeSidebar } from './components/home-sidebar';

import { useFeed } from '@/features/feed/hooks/use-feed';

interface Props {
  userId: string;
}

export function HomePage({ userId }: Props) {
  const feed = useFeed({ userId });

  return (
    <div className="min-h-screen bg-background">

      <HomeHeader />

      <HomeTagline />

      <div className="flex max-w-6xl mx-auto">

        <HomeSidebar />

        <main className="flex-1">
          <HomeTabs
            activeTab={feed.activeTab}
            onTabChange={feed.handleTabChange}
          />

          <HomeFeed
            items={feed.items}
            loading={feed.loading}
            loadingMore={feed.loadingMore}
            onLike={feed.handleLike}
            onComment={feed.handleComment}
            onAdClick={feed.handleAdClick}
          />
        </main>

      </div>
    </div>
  );
}