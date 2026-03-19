'use client';

import { HomeHeader } from './components/home-header';
import { HomeSubtitle } from './components/home-subtitle';
import { HomeCategories } from './components/home-categories';
import { HomeFeed } from './components/home-feed';
import { RightSidebar } from '@/components/layout/right-sidebar';

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">

      {/* الهيدر */}
      <HomeHeader />

      {/* النص تحت اللوقو */}
      <HomeSubtitle />

      {/* المحتوى */}
      <div className="flex pt-4">

        {/* المحتوى الرئيسي */}
        <main className="flex-1 pr-[550px]">

          {/* الأقسام */}
          <HomeCategories />

          {/* المنشورات */}
          <HomeFeed />

        </main>

        {/* نرجع السايدبار القديم بدل الجديد */}
        <RightSidebar />

      </div>

    </div>
  );
}