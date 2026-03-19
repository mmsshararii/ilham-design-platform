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

      {/* MAIN */}
      <div className="flex justify-center gap-6 px-4 pt-6">

        {/* FEED */}
        <main className="w-full max-w-[620px] space-y-4">
          <HomeCategories />
          <HomeFeed />
        </main>

        {/* SIDEBAR */}
        <aside className="w-[300px] shrink-0">
          <RightSidebar />
        </aside>

      </div>

    </div>
  );
}