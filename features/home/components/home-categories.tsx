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
  className="relative px-4 py-3 text-sm font-medium whitespace-nowrap"
>
  <span
    className={cn(
      "transition-colors duration-200",

      // الوضع الطبيعي
      "text-muted-foreground",

      // 👇 Hover (لون بنفسجي فقط)
      "hover:text-purple-400",

      // 👇 Active
      active === tab && "text-purple-500 font-semibold"
    )}
  >
    {tab}
  </span>

  {/* الخط السفلي */}
  <span
    className={cn(
      "absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-300",
      active === tab
        ? "bg-purple-500 opacity-100"
        : "opacity-0"
    )}
  />
</button>
          );
        })}

      </div>
    </div>
  );
}