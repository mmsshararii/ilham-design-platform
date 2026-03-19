'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const tabs = ['مخصص', 'منشورات عامة', 'تصاميم', 'طلبات', 'عروض', 'ملحقات'];

export function HomeCategories() {
  const [active, setActive] = useState('مخصص');

  return (
    <div className="sticky top-[96px] z-30 border-b border-border/40 bg-background/80 backdrop-blur">
      
      <div className="max-w-[600px] w-full px-4 flex gap-4 overflow-x-auto overflow-y-visible">
        
        {tabs.map((tab) => {
          const isActive = active === tab;

          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className="relative px-4 py-3 text-sm font-medium whitespace-nowrap"
            >
              
              {/* =======================
                  🎨 TEXT STATE
              ======================= */}
              <span
                className={cn(
                  "transition-colors duration-200",

                  // الوضع الطبيعي
                  "text-muted-foreground",

                  // Hover
                  "hover:text-purple-400",

                  // Active
                  isActive && "text-purple-500 font-semibold"
                )}
              >
                {tab}
              </span>

              {/* =======================
                  📍 UNDERLINE
              ======================= */}
              <span
                className={cn(
                  "absolute -bottom-[3px] left-2 right-2 h-[2px] rounded-full transition-all duration-300",
                  isActive ? "bg-purple-500 opacity-100" : "opacity-0"
                )}
              />

            </button>
          );
        })}

      </div>
    </div>
  );
}