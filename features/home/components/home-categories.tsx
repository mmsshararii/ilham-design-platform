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
    "relative px-4 pt-3 pb-4 text-sm font-medium whitespace-nowrap transition-all duration-200",

    // الوضع الطبيعي
    "text-muted-foreground",

    // 👇 Hover (خلّه واضح)
    "hover:text-white",

    // 👇 Active
    active === tab && "text-white font-semibold"
  )}
>
  {tab}

  {/* 👇 الخط السفلي */}
  <span
className={cn(
  "relative px-4 pt-3 pb-4 text-sm font-medium whitespace-nowrap transition-all duration-200",

  // الوضع الطبيعي
  "text-muted-foreground",

  // 🔥 Hover (هذا المهم)
  "hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-500 hover:to-blue-500",

  // Active
  active === tab &&
    "text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 font-semibold"
)}
  />
</button>
          );
        })}

      </div>
    </div>
  );
}