'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const tabs = ['مخصص', 'منشورات عامة', 'تصاميم', 'طلبات', 'عروض', 'ملحقات'];

export function HomeCategories() {
  const [active, setActive] = useState('مخصص');

  return (
    <div className="sticky top-[96px] z-30 border-b border-border/40 bg-background/80 backdrop-blur">

      <div className="max-w-2xl mx-auto px-4 flex gap-2 overflow-x-auto">

        {tabs.map((tab) => {
          const isActive = active === tab;

          return (
<button
  key={tab}
  onClick={() => setActive(tab)}
  className={cn(
    "relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200",

    // الوضع الطبيعي
    "text-muted-foreground",

    // 👇 Hover (تأثير على النص فقط)
    "hover:text-foreground",

    // 👇 Active
    active === tab && "text-foreground font-semibold"
  )}
>
  {tab}

  {/* 👇 الخط السفلي (يظهر فقط عند التفعيل) */}
  {active === tab && (
    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-purple-500 rounded-full" />
  )}
</button>
          );
        })}

      </div>
    </div>
  );
}