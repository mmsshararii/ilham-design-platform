'use client';

import { HomeHeader } from './components/home-header';
import { HomeCategories } from './components/home-categories';
import { HomeFeed } from './components/home-feed';
import { RightSidebar } from '@/components/layout/right-sidebar';

export function HomePage() {
  return (
    <div className="min-h-screen bg-[#06070a] text-white">

      {/* HEADER */}
      <HomeHeader />

      {/* MAIN LAYOUT */}
      <div className="flex justify-center gap-6 px-4 pt-6">

        {/* FEED */}
        <main className="w-full max-w-[640px]">

          {/* Tabs */}
          <div className="mb-4">
            <HomeCategories />
          </div>

          {/* Posts */}
          <div className="space-y-4">
            <HomeFeed />
          </div>

        </main>

        {/* SIDEBAR */}
        <aside className="block w-[300px] shrink-0">
          <RightSidebar />
        </aside>

      </div>

    </div>
  );
}