'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { FeedContainer } from '@/features/feed/feed-container';
import { Loader as Loader2 } from 'lucide-react';

// 🔥 أضف هذا الاستيراد (تأكد من المسار الصحيح)
import { CategoryTabs } from '@/components/category-tabs';

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-4">

      {/* 🔥 الأقسام هنا (ثابتة فوق المنشورات) */}
      <CategoryTabs />

      {/* 🔥 المنشورات */}
      <FeedContainer userId={user.id} />

    </main>
  );
}
