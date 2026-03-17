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
    <div className="border-b border-border/40 bg-background">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "relative px-6 py-4 text-sm font-medium transition-colors whitespace-nowrap",
                "hover:text-foreground",
                activeTab === tab.id
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-500" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
