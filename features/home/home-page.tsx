'use client';

import { HomeHeader } from './components/home-header';
import { HomeSubtitle } from './components/home-subtitle';
import { HomeSidebar } from './components/home-sidebar';
import { HomeCategories } from './components/home-categories';
import { HomeFeed } from './components/home-feed';

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">

      {/* الهيدر */}
      <HomeHeader />

      {/* النص تحت اللوقو */}
      <HomeSubtitle />

      <div className="flex pt-4">

        {/* القائمة الجانبية */}
        <HomeSidebar />

        {/* المحتوى */}
        <main className="flex-1 mr-80">

          {/* الأقسام */}
          <HomeCategories />

          {/* المنشورات */}
          <HomeFeed />

        </main>

      </div>

    </div>
  );
}