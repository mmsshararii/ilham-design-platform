'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const tabs = ['مخصص', 'منشورات عامة', 'تصاميم', 'طلبات', 'عروض', 'ملحقات'];

export function HomeCategories() {
  const [active, setActive] = useState('مخصص');

  return (
    <div className="sticky top-[96px] z-30 border-b border-border/40 bg-background/80 backdrop-blur">

      <div className="max-w-2xl mr-8 ml-auto flex gap-2 overflow-x-auto px-4">

        {tabs.map((tab) => {
          const isActive = active === tab;

          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={cn(
                "relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200",

                // الحالة العادية
                "text-muted-foreground hover:text-foreground",

                // تأثير hover
                "hover:bg-white/10 rounded-md",

                // الحالة النشطة
                isActive && "text-foreground"
              )}
            >
              {tab}

              {/* الخط السفلي */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-600 to-blue-500 rounded-full" />
              )}
            </button>
          );
        })}

      </div>
    </div>
  );
}