'use client';

import { cn } from '@/lib/utils';
import { FeedTab } from '@/types/feed';

interface CategoryTabsProps {
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
}

const tabs = [
  { id: 'custom' as FeedTab, label: 'مخصص' },
  { id: 'general' as FeedTab, label: 'منشورات عامة' },
  { id: 'design' as FeedTab, label: 'تصاميم' },
  { id: 'request' as FeedTab, label: 'طلبات' },
  { id: 'offer' as FeedTab, label: 'عروض' },
];

export function CategoryTabs({ activeTab, onTabChange }: CategoryTabsProps) {
  return (
    <div className="sticky top-16 z-40 border-b border-border bg-background">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide px-2">

          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative px-5 py-3 text-sm font-medium whitespace-nowrap transition-all",
                "hover:text-foreground",
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {tab.label}

              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-600 to-blue-500" />
              )}
            </button>
          ))}

        </div>
      </div>
    </div>
  );
}